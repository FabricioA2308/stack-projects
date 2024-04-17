from fastapi import APIRouter, Depends, Response, status
from app.schemas.category import CategorySchema, CategorySchemaOutput
from sqlalchemy.orm import Session
from app.routes.deps import get_db_session
from app.use_cases.category import CategoryActions
from typing import List

router = APIRouter(prefix='/category', tags=['Category'])

@router.post('/add', status_code=status.HTTP_201_CREATED, description='Add new category.')
def add_category(category: CategorySchema, db_session: Session = Depends(get_db_session)):
    use_case = CategoryActions(db_session)
    use_case.add_category(category)
    
    return Response(status_code=status.HTTP_201_CREATED)

@router.get('/list', response_model=List[CategorySchemaOutput], description='List all categories inside the database.')
def list_categories(db_session: Session = Depends(get_db_session)):
    use_case = CategoryActions(db_session)
    response = use_case.list_categories()
    print(response)
    
    return response

@router.delete('/delete/{id}', description="Delete category with the given ID.")
def delete_category(id: int, db_session: Session = Depends(get_db_session)):
    use_case = CategoryActions(db_session)
    use_case.delete_category(id)
    
    return Response(status_code=status.HTTP_200_OK)