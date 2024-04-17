from app.schemas.base import CustomBaseModel
from pydantic import validator
import re

class CategorySchema(CustomBaseModel):
    name: str
    slug: str
    
    @validator('slug')
    def validate_slug(cls, value):
        if not re.match('^([a-z]|-|_)+$', value):
            raise ValueError('Invalid slug, please try again.')
        return value
    
    
class CategorySchemaOutput(CategorySchema):
    id: int