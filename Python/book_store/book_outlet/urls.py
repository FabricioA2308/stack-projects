from django.urls import path
from . import views

urlpatterns = [
    path("", views.index),
    path("book/<slug:slug>", views.detail_page, name="book-detail")
]