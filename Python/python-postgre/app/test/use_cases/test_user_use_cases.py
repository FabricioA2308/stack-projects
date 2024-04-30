import pytest
from passlib.context import CryptContext
from datetime import datetime, timedelta
from fastapi.exceptions import HTTPException
from app.schemas.user import User
from app.db.models import User as UserTableModel
from app.use_cases.user import UserActions

crypt_context = CryptContext(schemes=['sha256_crypt'])

def test_register_user(db_session):
    user = User(
        username='Fabricio',
        password='pass'
    )
    
    actions = UserActions(db_session)
    actions.register_user(user)
    
    user_on_db = db_session.query(UserTableModel).first()
    
    assert user_on_db is not None
    assert user_on_db.username == user.username
    assert crypt_context.verify(user.password, user_on_db.password)
    
    db_session.delete(user_on_db)
    db_session.commit()
    
def test_register_user_username_exists(db_session):
    first_user = User(
        username='Fabricio',
        password=crypt_context.hash('password')
    )
    
    db_session.add(first_user)
    db_session.commit()
    
    actions = UserActions(db_session)
    
    second_user = User(
        username='Fabricio',
        password=crypt_context.hash('password')
    ) 
    
    with pytest.raises(HTTPException):
        actions.register_user(second_user)
        
    db_session.delete(first_user)
    db_session.commit()
    
    
def test_user_login(db_session, user_on_db):
    actions = UserActions(db_session=db_session)
    
    user = User(
        username = user_on_db.username,
        password = 'password'
    )
    
    token_data = actions.user_login(user=user, expires_in=30)
    
    assert token_data.expires_at < datetime.utcnow() + timedelta(31)
    
def test_user_login_invalid_username(db_session, user_on_db):
    actions = UserActions(db_session=db_session)
    
    user = User(
        username = 'invalid',
        password = 'password'
    )
    
    with pytest.raises(HTTPException):
        actions.user_login(user=user, expires_in=30)
        
def test_user_login_invalid_username(db_session, user_on_db):
    actions = UserActions(db_session=db_session)
    
    user = User(
        username = user_on_db.username,
        password = 'invalid'
    )
    
    with pytest.raises(HTTPException):
        actions.user_login(user=user, expires_in=30)