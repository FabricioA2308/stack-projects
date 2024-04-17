from app.schemas.base import CustomBaseModel
from pydantic import validator
from app.schemas.category import CategorySchema
import re

class ProductSchema(CustomBaseModel):
    name: str
    slug: str
    price: float
    stock: int
    
    @validator('slug')
    def validate_slug(cls, value):
        if not re.match('^([a-z]|-|_)+$', value):
            raise ValueError('Invalid slug, please try again.')
        return value
    
    @validator('price')
    def validate_price(cls, value):
        if value <= 0:
            raise ValueError('Invalid price, please try again.')
        return value
    
class ProductInput(CustomBaseModel):
    category_slug: str
    product: ProductSchema
    
class ProductOutput(ProductSchema):
    id: int
    category: CategorySchema
    