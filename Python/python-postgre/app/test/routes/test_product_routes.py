from fastapi.testclient import TestClient
from fastapi import status
from app.main import app
from app.db.models import Product as ProductTableModel

client = TestClient(app)

def test_add_product_route(db_session, categories_on_db):
    body = {
        "category_slug": categories_on_db[0].slug,
        "product": {
            "name": "Camisa",
            "slug": "camisa",
            "price": 25.99,
            "stock": 25
        }
    }
    
    response = client.post('/product/add', json=body)
    
    assert response.status_code == status.HTTP_201_CREATED
    
    products_on_db = db_session.query(ProductTableModel).all()
    
    assert len(products_on_db) == 1
    
    db_session.delete(products_on_db[0])
    db_session.commit()
    
def test_add_product_route_invalid_category(db_session):
    body = {
        "category_slug": "invalid",
        "product": {
            "name": "Camisa",
            "slug": "camisa",
            "price": 25.99,
            "stock": 25
        }
    }
    
    response = client.post('/product/add', json=body)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    
    products_on_db = db_session.query(ProductTableModel).all()
    
    assert len(products_on_db) == 0
    
def test_update_product_route(db_session, product_on_db):
    body = {
        "name": "Updated name",
        "slug": "updated-name",
        "price": 23.88,
        "stock": 115
    }
    
    response = client.put(f'/product/update/{product_on_db.id}', json=body)
    
    assert response.status_code == status.HTTP_200_OK
    
    db_session.refresh(product_on_db)
    
    assert product_on_db.name == "Updated name"
    assert product_on_db.slug == "updated-name"
    assert product_on_db.price == 23.88
    assert product_on_db.stock == 115
    
def test_update_product_route_invalid_id():
    body = {
        "name": "Updated name",
        "slug": "updated-name",
        "price": 23.88,
        "stock": 115
    }
    
    response = client.put(f'/product/update/3', json=body)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND
    
def test_delete_product_route(db_session, product_on_db):
    response = client.delete(f'/product/delete/{product_on_db.id}')
    
    assert response.status_code == status.HTTP_200_OK
    
    products_on_db = db_session.query(ProductTableModel).all()
    
    assert len(products_on_db) == 0
    
def test_delete_product_route_invalid_id():
    response = client.delete('/product/delete/4')
    
    assert response.status_code == status.HTTP_404_NOT_FOUND

def test_list_products_route(products_on_db):
    response = client.get('/product/list')
    
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    
    assert len(data) == 4
    assert data[0] == {
        'id': products_on_db[0].id,
        'name': products_on_db[0].name,
        'slug': products_on_db[0].slug,
        'price': products_on_db[0].price,
        'stock': products_on_db[0].stock,
        'category': {
            'name': products_on_db[0].category.name,
            'slug': products_on_db[0].category.slug,
        }
    }
    
def test_list_products_filtered_route(products_on_db):
    response = client.get('/product/list?search=Camisa')
    
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    
    assert len(data) == 1
    assert data[0] == {
        'id': products_on_db[0].id,
        'name': products_on_db[0].name,
        'slug': products_on_db[0].slug,
        'price': products_on_db[0].price,
        'stock': products_on_db[0].stock,
        'category': {
            'name': products_on_db[0].category.name,
            'slug': products_on_db[0].category.slug,
        }
    }    