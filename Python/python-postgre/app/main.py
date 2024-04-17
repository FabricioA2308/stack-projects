from fastapi import FastAPI
from app.routes.category_routes import router as category_routes
from app.routes.product_routes import router as product_routes

app = FastAPI()

@app.get('/')
def home_page():
    return "Hello World!"        

app.include_router(category_routes)
app.include_router(product_routes)