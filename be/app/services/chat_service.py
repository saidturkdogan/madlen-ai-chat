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

        self.repository.add_message(
            session_id=session_id,
            role="user",
            content=request.message,
            image_url=request.image
        )

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

        ai_response = await openrouter.chat_completion(
            model=request.model,
            messages=or_messages
        )
        
        ai_content = "Error: No response from AI."
        if "choices" in ai_response and len(ai_response["choices"]) > 0:
            ai_content = ai_response["choices"][0]["message"]["content"]

        ai_msg = self.repository.add_message(
            session_id=session_id,
            role="assistant",
            content=ai_content,
            model=request.model
        )

        self.repository.update_session_timestamp(session)
        if len(past_messages) == 1:
            session.title = request.message[:30]
            self.repository.update_session(session)

        return ai_msg

    def _prepare_openrouter_messages(self, messages, current_request):
        pass

    async def stream_chat_message(self, session_id: str, user_id: str, request: schemas.ChatRequest):
        session = self.repository.get_session(session_id, user_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        self.repository.add_message(
            session_id=session_id,
            role="user",
            content=request.message,
            image_url=request.image
        )

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
