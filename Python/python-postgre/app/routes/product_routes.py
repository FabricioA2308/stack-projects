from fastapi import APIRouter, Response, Depends, status
from sqlalchemy.orm import Session
from app.routes.deps import get_db_session
from app.use_cases.product import ProductActions
from app.schemas.product import ProductSchema, ProductInput, ProductOutput
from typing import List

router = APIRouter(prefix='/product', tags=['Product'])

@router.post('/add', status_code=status.HTTP_201_CREATED, description="Add new product.")
def add_product(
    product_input: ProductInput,
    db_session: Session = Depends(get_db_session)
):
    actions = ProductActions(db_session=db_session)
    actions.add_product(
        product=product_input.product,
        category_slug=product_input.category_slug
    )
    
    return Response(status_code=status.HTTP_201_CREATED)

@router.put('/update/{id}', description="Update the product with the given ID.")
def update_product(
    id: int,
    product: ProductSchema,
    db_session: Session = Depends(get_db_session)
):
    action = ProductActions(db_session=db_session)
    action.update_product(id=id, product=product)
    
    return Response(status_code=status.HTTP_200_OK)

@router.delete('/delete/{id}', description="Delete product with given ID.")
def delete_product(
    id: int,
    db_session: Session = Depends(get_db_session)
):
    action = ProductActions(db_session=db_session)
    action.delete_product(id)
    
    return Response(status_code=status.HTTP_200_OK)

@router.get('/list', response_model=List[ProductOutput], description="List all products or filter those with the substring provided by the search parameter.")
def list_products(
    search: str = '',
    db_session: Session = Depends(get_db_session)
):
    action = ProductActions(db_session=db_session)
    products = action.list_products(search=search)
    
    return products

