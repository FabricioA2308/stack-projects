from app.db.connection import Session
from app.db.models import Category as CategoryTableModel
from app.db.models import Product as ProductTableModel
import pytest

@pytest.fixture()
def db_session():
    try:
        session = Session()
        yield session
    finally:
        session.close()
        
@pytest.fixture() # Create defaults categories on the database for testing purposes
def categories_on_db(db_session):
    categories = [
        CategoryTableModel(name='Roupa', slug='roupa'),
        CategoryTableModel(name='Carro', slug='carro'),
        CategoryTableModel(name='Items de cozinha', slug='items-de-cozinha'),
        CategoryTableModel(name='Decoracao', slug='decoracao'),
    ]
    
    for category in categories:
        db_session.add(category)
        
    db_session.commit()
        
    for category in categories:
        db_session.refresh(category)
        
    yield categories
    
    for category in categories:
        db_session.delete(category)
    
    db_session.commit()
    
@pytest.fixture() # Create default products on database for testing purposes
def product_on_db(db_session):
    category = CategoryTableModel(
        name='Carro',
        slug="carro"
    )

    db_session.add(category)
    db_session.commit()
    
    product = ProductTableModel(
        name='Camisa',
        slug='camisa',
        price=24.99,
        stock=25,
        category_id=category.id
    )
    
    db_session.add(product)
    db_session.commit()
    
    yield product
    
    db_session.delete(product)
    db_session.delete(category)
    db_session.commit()
    
@pytest.fixture() # Create a default category with items linked to it
def products_on_db(db_session):
    category = CategoryTableModel(name='Roupa', slug='roupa')
    db_session.add(category)
    db_session.commit()
    db_session.refresh(category)
    
    products = [
        ProductTableModel(name="Camisa", slug='camisa', price=100, stock=25, category_id = category.id),
        ProductTableModel(name="Moletom", slug='moletom', price=100, stock=25, category_id = category.id),
        ProductTableModel(name="Regata", slug='regata', price=100, stock=25, category_id = category.id),
        ProductTableModel(name="Tênis", slug='tenis', price=100, stock=25, category_id = category.id)
    ]
    
    for product in products:
        db_session.add(product)
        
    db_session.commit()
        
    for product in products:
        db_session.refresh(product)
        
    yield products
    
    for product in products:
        db_session.delete(product)
    
    db_session.delete(category)
    db_session.commit()