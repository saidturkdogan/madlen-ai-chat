from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..repositories.chat_repository import ChatRepository
from ..services import openrouter
from .. import schemas, models
import json

class ChatService:
    def __init__(self, db: Session):
        self.repository = ChatRepository(db)

    def get_rate_limit(self):
        return openrouter.get_rate_limit_info()

    async def list_models(self):
        return await openrouter.get_models()

    def get_user_sessions(self, user_id: str, email: str = None):
        user = self.repository.get_user(user_id)
        if not user:
            self.repository.create_user(user_id, email)
        
        return self.repository.get_user_sessions(user_id)

    def create_session(self, user_id: str):
        # Verify user ensures user exists
        if not self.repository.get_user(user_id):
            self.repository.create_user(user_id)
        return self.repository.create_session(user_id)

    def get_session_messages(self, session_id: str, user_id: str):
        session = self.repository.get_session(session_id, user_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return self.repository.get_messages(session_id)

    def delete_session(self, session_id: str, user_id: str):
        session = self.repository.get_session(session_id, user_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        self.repository.delete_session(session)

    async def send_message(self, session_id: str, user_id: str, request: schemas.ChatRequest):
        session = self.repository.get_session(session_id, user_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        # 1. Save User Message
        self.repository.add_message(
            session_id=session_id,
            role="user",
            content=request.message,
            image_url=request.image
        )

        # 2. Get Context
        past_messages = self.repository.get_messages(session_id)
        
        # Prepare for OpenRouter
        or_messages = self._prepare_openrouter_messages(past_messages, request)

        # 3. Call OpenRouter
        # Note: request.image is already in past_messages if we just saved it and queried it?
        # A bit tricky: add_message commits it. So `past_messages` includes the new one.
        # But `_prepare_openrouter_messages` logic in original code appended the new one manually.
        # If I queried it, I shouldn't append it again?
        # Original code: 
        #   Query `past_messages` (excludes new one because new one wasn't committed yet? No, original had `db.add` but maybe not commit yet?)
        #   Original logic: `db.add(user_msg)` (no commit)
        #   `past_messages = db.query...` (might invoke flush, seeing the new msg? depends on isolation level)
        #   Original logic explicitly appended `request.message` separate from `past_messages` loop.
        #   Wait, original logic:
        #      user_msg = ... db.add(user_msg)
        #      past_messages = ...
        #      OR loop past_messages
        #      APPEND request.message (manual)
        # This suggests `past_messages` query did NOT return the uncommitted user_msg.
        
        # My repository `add_message` does `commit()`. So `get_messages` WILL return it.
        # So I should separate logic:
        # `get_messages` returns ALL messages including the newest user message.
        # So I just need to convert all `past_messages` to OR format.
        
        or_messages = []
        for m in past_messages:
            if m.image_url and m.role == "user":
                or_messages.append({
                    "role": m.role,
                    "content": [
                        {"type": "text", "text": m.content},
                        {"type": "image_url", "image_url": {"url": m.image_url}}
                    ]
                })
            else:
                or_messages.append({"role": m.role, "content": m.content})

        # 4. Call Service
        ai_response = await openrouter.chat_completion(
            model=request.model,
            messages=or_messages
        )
        
        # Extract content
        ai_content = "Error: No response from AI."
        if "choices" in ai_response and len(ai_response["choices"]) > 0:
            ai_content = ai_response["choices"][0]["message"]["content"]

        # 5. Save AI Message
        ai_msg = self.repository.add_message(
            session_id=session_id,
            role="assistant",
            content=ai_content,
            model=request.model
        )

        # Update Session
        self.repository.update_session_timestamp(session)
        if len(past_messages) <= 1: # Only user message is there (the one we just added)
             # Wait, past_messages has 1 item now. 
             # Original logic: `len(past_messages) == 0` (before adding new one).
             # Now `past_messages` has 1.
             if len(past_messages) == 1:
                session.title = request.message[:30]
                self.repository.update_session(session)

        return ai_msg

    def _prepare_openrouter_messages(self, messages, current_request):
        # Helper not strictly needed if we query all.
        pass

    async def stream_chat_message(self, session_id: str, user_id: str, request: schemas.ChatRequest):
        session = self.repository.get_session(session_id, user_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        # 1. Save User Message
        self.repository.add_message(
            session_id=session_id,
            role="user",
            content=request.message,
            image_url=request.image
        )

        # 2. Context
        past_messages = self.repository.get_messages(session_id)
        or_messages = []
        for m in past_messages:
            if m.image_url and m.role == "user":
                or_messages.append({
                    "role": m.role,
                    "content": [
                        {"type": "text", "text": m.content},
                        {"type": "image_url", "image_url": {"url": m.image_url}}
                    ]
                })
            else:
                or_messages.append({"role": m.role, "content": m.content})
        
        # 3. Stream Generator
        async def generate():
            full_content = ""
            async for chunk in openrouter.chat_completion_stream(
                model=request.model,
                messages=or_messages
            ):
                data = json.loads(chunk)
                if "content" in data:
                    full_content += data["content"]
                yield f"data: {chunk}\n\n"
            
            # Save AI Msg
            if full_content:
                self.repository.add_message(
                    session_id=session_id,
                    role="assistant",
                    content=full_content,
                    model=request.model
                )
                self.repository.update_session_timestamp(session)
                if len(past_messages) == 1:
                    session.title = request.message[:30]
                    self.repository.update_session(session)
        
        return generate
