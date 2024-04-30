import pytest
from app.schemas.user import User

def test_user_schema():
    user = User(
        username='Fabricio',
        password="password"
    )
    
    assert user.dict() == {
        "username": "Fabricio",
        "password": "password"
    }
    
def test_user_schema_invalid_username():
    with pytest.raises(ValueError):
        user = User(
        username='Fabricio$%¨$',
        password="password"
    )