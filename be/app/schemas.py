from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MessageBase(BaseModel):
    role: str
    content: str
    image_url: Optional[str] = None

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: str
    timestamp: datetime
    model: Optional[str] = None

    class Config:
        orm_mode = True

class SessionBase(BaseModel):
    title: str

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    id: str
    created_at: datetime
    updated_at: datetime
    preview: Optional[str] = None

    class Config:
        orm_mode = True

class ChatRequest(BaseModel):
    message: str
    model: str
    image: Optional[str] = None

class AIModelDTO(BaseModel):
    id: str
    name: str
    provider: str
    isFree: bool
    contextWindow: int
