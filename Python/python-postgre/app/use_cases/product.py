from app.db.models import Product as ProductTableModel
from app.db.models import Category as CategoryTableModel
from app.schemas.product import ProductSchema as ProductSchema, ProductOutput
from sqlalchemy.orm import Session
from fastapi.exceptions import HTTPException
from fastapi import status
from sqlalchemy import or_

class ProductActions:
    def __init__(self, db_session: Session):
        self.db_session = db_session
        
    def add_product(self, product: ProductSchema, category_slug: str):
        category = self.db_session.query(CategoryTableModel).filter_by(slug=category_slug).first()
        
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Could not found a category for the slug provided.")
        
        product_entry = ProductTableModel(**product.dict())
        product_entry.category_id = category.id
        
        self.db_session.add(product_entry)
        self.db_session.commit()
        
    def update_product(self, product: ProductSchema, id: int):
        product_on_db = self.db_session.query(ProductTableModel).filter_by(id=id).first()
        
        if product_on_db is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product does not exist.")
        
        product_on_db.name = product.name
        product_on_db.slug = product.slug
        product_on_db.price = product.price
        product_on_db.stock = product.stock
        
        self.db_session.add(product_on_db)
        self.db_session.commit()
        
    def delete_product(self, id: int):
        product_on_db = self.db_session.query(ProductTableModel).filter_by(id=id).first()
        
        if product_on_db is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product does not exist.")
        
        self.db_session.delete(product_on_db)
        self.db_session.commit()
        
    def list_products(self, search: str = ''):
        products_on_db = self.db_session.query(ProductTableModel).filter(
            or_(
                ProductTableModel.name.ilike(f'%{search}%'),
                ProductTableModel.slug.ilike(f'%{search}%')
            )
        ).all()
        
        products = [
            self._serialize_product(product_on_db)
            for product_on_db in products_on_db
        ]
        
        return products
        
    def _serialize_product(self, product_on_db: ProductTableModel):
        product_dict = product_on_db.__dict__
        product_dict['category'] = product_on_db.category.__dict__
        
        return ProductOutput(**product_dict)