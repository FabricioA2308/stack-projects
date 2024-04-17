from app.db.models import Product as ProductTableModel
from app.schemas.product import ProductSchema as ProductSchema, ProductOutput
from app.use_cases.product import ProductActions
from fastapi.exceptions import HTTPException
import pytest

def test_add_product(db_session, categories_on_db):
    product_actions = ProductActions(db_session)
    
    product = ProductSchema(
        name='Camisa',
        slug='camisa',
        price=25.99,
        stock= 25
    )
    
    product_actions.add_product(product, category_slug=categories_on_db[0].slug)
    
    product_on_db = db_session.query(ProductTableModel).first()
    
    assert product_on_db is not None
    assert product_on_db.name == product.name
    assert product_on_db.slug == product.slug
    assert product_on_db.price == product.price
    assert product_on_db.stock == product.stock
    assert product_on_db.category.name == categories_on_db[0].name
    
    db_session.delete(product_on_db)
    db_session.commit()
    
def test_add_product_category_inexistent(db_session):
    product_actions = ProductActions(db_session)
    
    product = ProductSchema(
        name='Camisa',
        slug='camisa',
        price=25.99,
        stock= 25
    )
    
    with pytest.raises(HTTPException):
        product_actions.add_product(product, category_slug='invalid')
    
def test_update_product(db_session, product_on_db):
    product = ProductSchema(
        name='Camisa da Nike',
        slug='camisa-da-nike',
        price=88.99,
        stock= 15
    )
    
    use_case = ProductActions(db_session=db_session)
    use_case.update_product(id=product_on_db.id, product=product)
    
    product_updated_on_db = db_session.query(ProductTableModel).filter_by(id=product_on_db.id).first()
    
    assert product_updated_on_db is not None
    assert product_updated_on_db.name == product.name
    assert product_updated_on_db.slug == product.slug
    assert product_updated_on_db.price == product.price
    assert product_updated_on_db.stock == product.stock
    
def test_update_product_invalid_id(db_session):
    product = ProductSchema(
        name='Camisa da Nike',
        slug='camisa-da-nike',
        price=88.99,
        stock= 15
    )
    
    use_case = ProductActions(db_session=db_session)
    
    with pytest.raises(HTTPException):
        use_case.update_product(id=1, product=product)
    

def test_delete_product(db_session, product_on_db):
    use_case = ProductActions(db_session=db_session)
    use_case.delete_product(id=product_on_db.id)
    
    products_on_db = db_session.query(ProductTableModel).first()
    
    assert products_on_db is None
    
def test_delete_product_inexistent(db_session):
    use_case = ProductActions(db_session=db_session)
    
    with pytest.raises(HTTPException):
        use_case.delete_product(id=3)
    
def test_list_products(db_session, products_on_db):
    use_case = ProductActions(db_session=db_session)
    
    products = use_case.list_products()
    
    for product in products_on_db:
        db_session.refresh(product)
    
    assert len(products) == 4
    assert type(products[0]) == ProductOutput
    assert products[0].name == products_on_db[0].name
    assert products[0].category.name == products_on_db[0].category.name
    
def test_list_products_filtered(db_session, products_on_db):
    use_case = ProductActions(db_session=db_session)
    
    products = use_case.list_products(search='Camisa')
    
    for product in products_on_db:
        db_session.refresh(product)
    
    assert len(products) == 1
    assert type(products[0]) == ProductOutput
    assert products[0].name == products_on_db[0].name
    assert products[0].category.name == products_on_db[0].category.name