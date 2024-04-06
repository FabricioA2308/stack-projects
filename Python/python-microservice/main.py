from fastapi import FastAPI
from routes import router

app = FastAPI()
app.include_router(router=router)

@app.get('/hello-world')
def hello_world():
    return "Hello world!"