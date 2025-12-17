from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from ..core.auth import get_current_user
from ..core.database import get_db
from .. import schemas
from ..services.chat_service import ChatService
import json

router = APIRouter(
    prefix="/api", 
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

@router.get("/rate-limit")
async def get_rate_limit(db: Session = Depends(get_db)):
    service = ChatService(db)
    return service.get_rate_limit()

@router.get("/models", response_model=List[schemas.AIModelDTO])
async def list_models(db: Session = Depends(get_db)):
    service = ChatService(db)
    raw_models = await service.list_models()
    return [
        schemas.AIModelDTO(
            id=m["id"],
            name=m["name"],
            provider=m["provider"],
            isFree=m["is_free"],
            contextWindow=m["context_length"]
        ) for m in raw_models
    ]

@router.get("/sessions", response_model=List[schemas.SessionResponse])
def get_sessions(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    sessions = service.get_user_sessions(current_user.get("sub"), current_user.get("email"))
    
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
    service = ChatService(db)
    new_session = service.create_session(current_user.get("sub"))
    return new_session

@router.get("/sessions/{session_id}/messages", response_model=List[schemas.MessageResponse])
def get_messages(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    user_id = current_user.get("sub")
    return service.get_session_messages(session_id, user_id)

@router.post("/sessions/{session_id}/chat/stream")
async def stream_chat_message(
    session_id: str,
    request: schemas.ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    user_id = current_user.get("sub")
    
    generate_func = await service.stream_chat_message(session_id, user_id, request)
    
    return StreamingResponse(
        generate_func(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    user_id = current_user.get("sub")
    service.delete_session(session_id, user_id)
    return {"message": "Session deleted successfully"}

@router.get("/sessions/{session_id}/export")
def export_session(
    session_id: str,
    format: str = "json",
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ChatService(db)
    user_id = current_user.get("sub")
    messages = service.get_session_messages(session_id, user_id)
    session = service.repository.get_session(session_id, user_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if format == "txt":
        lines = [f"Chat Export: {session.title}", f"Date: {session.created_at}", "=" * 50, ""]
        for msg in messages:
            role = "You" if msg.role == "user" else "AI"
            timestamp = msg.timestamp.strftime("%Y-%m-%d %H:%M:%S") if msg.timestamp else ""
            lines.append(f"[{timestamp}] {role}:")
            lines.append(msg.content)
            lines.append("")
        
        content = "\n".join(lines)
        return StreamingResponse(
            iter([content]),
            media_type="text/plain",
            headers={
                "Content-Disposition": f"attachment; filename=chat-{session_id[:8]}.txt"
            }
        )
    else:
        export_data = {
            "session_id": session_id,
            "title": session.title,
            "created_at": session.created_at.isoformat() if session.created_at else None,
            "updated_at": session.updated_at.isoformat() if session.updated_at else None,
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat() if msg.timestamp else None,
                    "model": msg.model,
                    "image_url": msg.image_url
                }
                for msg in messages
            ]
        }
        
        return StreamingResponse(
            iter([json.dumps(export_data, indent=2, ensure_ascii=False)]),
            media_type="application/json",
            headers={
                "Content-Disposition": f"attachment; filename=chat-{session_id[:8]}.json"
            }
        )
