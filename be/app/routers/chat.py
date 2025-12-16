from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..auth import get_current_user
from ..database import get_db
from .. import models, schemas
from ..services import openrouter
import uuid
from datetime import datetime

router = APIRouter(
    prefix="/api", # Consolidating under /api
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

# --- MODELS ---
@router.get("/models", response_model=List[schemas.AIModelDTO])
async def list_models():
    raw_models = await openrouter.get_models()
    return [
        schemas.AIModelDTO(
            id=m["id"],
            name=m["name"],
            provider=m["provider"],
            isFree=m["is_free"],
            contextWindow=m["context_length"]
        ) for m in raw_models
    ]

# --- SESSIONS ---
@router.get("/sessions", response_model=List[schemas.SessionResponse])
def get_sessions(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Ensure user exists in DB
    user_id = current_user.get("sub")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = models.User(id=user_id, email=current_user.get("email")) # Clerk sends email often
        db.add(user)
        db.commit()

    sessions = db.query(models.ChatSession)\
        .filter(models.ChatSession.user_id == user_id)\
        .order_by(models.ChatSession.updated_at.desc())\
        .all()
        
    # Populate preview from last message if possible
    results = []
    for s in sessions:
        preview = "New Chat"
        if s.messages:
             last_msg = s.messages[-1]
             preview = (last_msg.content[:50] + '...') if len(last_msg.content) > 50 else last_msg.content
        
        results.append(schemas.SessionResponse(
            id=s.id,
            title=s.title,
            created_at=s.created_at,
            updated_at=s.updated_at,
            preview=preview
        ))
    return results

@router.post("/sessions", response_model=schemas.SessionResponse)
def create_session(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("sub")
    # Verify user existence (idempotent check)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = models.User(id=user_id)
        db.add(user)
        db.commit()

    new_session = models.ChatSession(user_id=user_id)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

# --- MESSAGES ---
@router.get("/sessions/{session_id}/messages", response_model=List[schemas.MessageResponse])
def get_messages(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("sub")
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id, models.ChatSession.user_id == user_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session.messages

@router.post("/chat", response_model=schemas.MessageResponse)
async def chat(
    request: schemas.ChatRequest,
    session_id: str = None, # Optional if we want to support stateless, but for this app we usually pass session_id
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("sub")

    # If session_id is provided in query (it should actually be in body or path typically, 
    # but based on old code structure let's support query or assume a session must be created first).
    # For better REST design, let's assume the frontend passes `session_id` as a query param or part of DTO.
    # Updated: Frontend 'sendMessage' function sends it. Let's adjust schemas if needed.
    # Actually, let's strict it: Frontend MUST create a session first.
    
    # Wait, the schemas.ChatRequest doesn't have session_id. 
    # Let's read session_id from query param for simplicity matching existing frontend logic often used.
    pass

@router.post("/sessions/{session_id}/chat", response_model=schemas.MessageResponse)
async def send_chat_message(
    session_id: str,
    request: schemas.ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("sub")
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id, models.ChatSession.user_id == user_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 1. Save User Message
    user_msg_id = str(uuid.uuid4())
    user_msg = models.Message(
        id=user_msg_id,
        session_id=session_id,
        role="user",
        content=request.message,
        image_url=request.image
    )
    db.add(user_msg)
    
    # 2. Get Context (Past messages)
    # Limit context window? For now, fetch all sorted by time.
    past_messages = db.query(models.Message)\
        .filter(models.Message.session_id == session_id)\
        .order_by(models.Message.timestamp.asc())\
        .all()
    
    # Convert to OpenRouter format
    or_messages = []
    for m in past_messages:
        # Check if message has an image (multi-modal)
        if m.image_url and m.role == "user":
            # Multi-modal message format for OpenRouter
            or_messages.append({
                "role": m.role,
                "content": [
                    {"type": "text", "text": m.content},
                    {"type": "image_url", "image_url": {"url": m.image_url}}
                ]
            })
        else:
            or_messages.append({"role": m.role, "content": m.content})
    
    # Add current user message (it wasn't committed yet, so not in query result)
    if request.image:
        # Multi-modal message with image
        or_messages.append({
            "role": "user",
            "content": [
                {"type": "text", "text": request.message},
                {"type": "image_url", "image_url": {"url": request.image}}
            ]
        })
    else:
        or_messages.append({"role": "user", "content": request.message})

    # 3. Call OpenRouter
    ai_response = await openrouter.chat_completion(
        model=request.model,
        messages=or_messages
    )
    
    # 4. Extract Response
    if "choices" in ai_response and len(ai_response["choices"]) > 0:
        ai_content = ai_response["choices"][0]["message"]["content"]
    else:
        ai_content = "Error: No response from AI."

    # 5. Save AI Message
    ai_msg = models.Message(
        session_id=session_id,
        role="assistant",
        content=ai_content,
        model=request.model
    )
    db.add(ai_msg)
    
    # Update session timestamp and title if first message
    session.updated_at = datetime.utcnow()
    if len(past_messages) == 0:
        # Generate title capability could go here, for now use first few words
        session.title = request.message[:30]

    db.commit()
    
    # Return AI response to frontend
    return schemas.MessageResponse(
        id=ai_msg.id,
        role="assistant",
        content=ai_content,
        timestamp=ai_msg.timestamp,
        model=request.model,
        image_url=None
    )

@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("sub")
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id, models.ChatSession.user_id == user_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    db.delete(session)
    db.commit()
    
    return {"message": "Session deleted successfully"}
