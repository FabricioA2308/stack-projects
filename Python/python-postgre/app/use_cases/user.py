from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from passlib.context import CryptContext
from app.schemas.user import User
from app.db.models import User as UserTableModel
from fastapi.exceptions import HTTPException
from fastapi import status
from jose import jwt, JWTError

crypt_context = CryptContext(schemes=['sha256_crypt'])

class UserActions:
    def __init__(self, db_session: Session):
        self.db_session = db_session
        
    def register_user(self, user: User):
        user_on_db = UserTableModel(username=user.username, password=crypt_context.hash(user.password))
        self.db_session.add(user_on_db)
        try:
            self.db_session.commit()
        except IntegrityError:
            self.db_session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Username already exists.')