from app.schemas.product import ProductSchema, ProductInput, ProductOutput
from app.schemas.category import CategorySchema
import pytest

def test_product_schema():
    product = ProductSchema(
        name='Camisa',
        slug='camisa',
        price=25.99,
        stock=25,
    )
    
    assert product.dict() == {
        'name': 'Camisa',
        'slug': 'camisa',
        'price': 25.99,
        'stock': 25
    }
    
def test_product_schema_invalid_slug():
    with pytest.raises(ValueError):
        product = ProductSchema(
        name='Camisa',
        slug='Camisa',
        price=25.99,
        stock=25,
    )
    with pytest.raises(ValueError):    
        product = ProductSchema(
        name='Camisa',
        slug='cão',
        price=25.99,
        stock=25,
    )

def test_product_schema_invalid_price():
    with pytest.raises(ValueError):
        product = ProductSchema(
        name='Camisa',
        slug='camisa',
        price=0,
        stock=25,
    )
        
def test_product_input_schema():
    product = ProductSchema(
        name='Camisa',
        slug='camisa',
        price=25.99,
        stock=25,
    )
    product_input = ProductInput(
        category_slug = 'roupa',
        product=product
    )
    
    assert product_input.dict() == {
        "category_slug": "roupa",
        "product": {
            "name": "Camisa",
            "slug": "camisa",
            "price": 25.99,
            "stock": 25
        }
    }
    
def test_product_output_schema():
    category = CategorySchema(name='Roupa', slug='roupa')
    product_output = ProductOutput(
        id = 1,
        name='Camisa',
        slug='camisa',
        price=14.99,
        stock=35,
        category=category
    )
    
    assert product_output.dict() == {
        "id": 1,
        "name": "Camisa",
        "slug": "camisa",
        "price": 14.99,
        "stock": 35,
        "category": {
            "name": "Roupa",
            "slug": "roupa"
        }
    }