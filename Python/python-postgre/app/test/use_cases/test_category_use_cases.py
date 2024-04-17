from app.use_cases.category import CategoryActions
from app.db.models import Category as CategoryTableModel
from app.schemas.category import CategorySchema, CategorySchemaOutput
from fastapi.exceptions import HTTPException
import pytest

def test_add_category(db_session):
    use_case = CategoryActions(db_session)
    category = CategorySchema(name='Roupa', slug='roupa')
    
    use_case.add_category(category=category)
    
    categories_on_db = db_session.query(CategoryTableModel).all()
    
    assert len(categories_on_db) == 1
    assert categories_on_db[0].name == 'Roupa'
    assert categories_on_db[0].slug == 'roupa'
    
    db_session.delete(categories_on_db[0])
    db_session.commit()
    
def test_list_categories(db_session, categories_on_db):
    use_case = CategoryActions(db_session)
    
    categories = use_case.list_categories()
    
    assert len(categories) == 4
    assert type(categories[0]) == CategorySchemaOutput
    assert categories[0].id == categories_on_db[0].id
    assert categories[0].name == categories_on_db[0].name
    assert categories[0].slug == categories_on_db[0].slug
    
def test_delete_category(db_session):
    category_model = CategoryTableModel(name='Roupa', slug='roupa')
    db_session.add(category_model)
    db_session.commit()
    
    use_case = CategoryActions(db_session)
    use_case.delete_category(id=category_model.id) 
    
    category_model = db_session.query(CategoryTableModel).first()
    assert category_model is None
    
def test_delete_inexistent_category(db_session):
    use_case = CategoryActions(db_session)
    
    with pytest.raises(HTTPException):
        use_case.delete_category(id=1) 
    
