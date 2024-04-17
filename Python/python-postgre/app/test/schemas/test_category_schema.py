from app.schemas.category import CategorySchema
import pytest

def test_category_schema():
    category = CategorySchema(name="Roupa", slug="roupa")
    assert category.dict() == {
        'name': 'Roupa',
        'slug': 'roupa'
    }
    
def test_category_schema_invalid_slug():
    with pytest.raises(ValueError):
        category = CategorySchema(name="Roupa", slug="roupa de cama")
        
    with pytest.raises(ValueError):
        category = CategorySchema(name="Roupa", slug="cão")
        
    with pytest.raises(ValueError):
        category = CategorySchema(name="Roupa", slug="Roupa")