from app.schemas.base import CustomBaseModel
from pydantic import validator
import re 

class User(CustomBaseModel):
    username: str
    password: str
     
    @validator('username')
    def validate_username(cls, value):
        if re.match('^([a-z]|[A-Z]|[0-9]|-|_|@)+$', value):
            return value
        else:
           raise ValueError('Invalid username.')