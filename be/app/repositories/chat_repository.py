from sqlalchemy.orm import Session
from .. import models
from datetime import datetime
import uuid

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user(self, user_id: str):
        return self.db.query(models.User).filter(models.User.id == user_id).first()

    def create_user(self, user_id: str, email: str = None):
        user = models.User(id=user_id, email=email)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user_sessions(self, user_id: str):
        return self.db.query(models.ChatSession)\
            .filter(models.ChatSession.user_id == user_id)\
            .order_by(models.ChatSession.updated_at.desc())\
            .all()

    def create_session(self, user_id: str):
        new_session = models.ChatSession(user_id=user_id)
        self.db.add(new_session)
        self.db.commit()
        self.db.refresh(new_session)
        return new_session

    def get_session(self, session_id: str, user_id: str):
        return self.db.query(models.ChatSession).filter(
            models.ChatSession.id == session_id,
            models.ChatSession.user_id == user_id
        ).first()

    def delete_session(self, session: models.ChatSession):
        self.db.delete(session)
        self.db.commit()

    def get_messages(self, session_id: str):
        return self.db.query(models.Message)\
            .filter(models.Message.session_id == session_id)\
            .order_by(models.Message.timestamp.asc())\
            .all()

    def add_message(self, session_id: str, role: str, content: str, model: str = None, image_url: str = None):
        msg_id = str(uuid.uuid4())
        msg = models.Message(
            id=msg_id,
            session_id=session_id,
            role=role,
            content=content,
            model=model,
            image_url=image_url
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg

    def update_session_timestamp(self, session: models.ChatSession):
        session.updated_at = datetime.utcnow()
        self.db.commit()

    def update_session_title(self, session_id: str, title: str):
        # We need to query again if session object is not attached or just use the object passed if we had `update_session(session)`
        # simplified to take session object often, but let's stick to object manipulation if we have it, or query if ID.
        pass
    
    def update_session(self, session: models.ChatSession):
        self.db.add(session) # Merges if detached
        self.db.commit()
        self.db.refresh(session)
