from django.urls import path
from . import views

urlpatterns = [
    path("", views.home_page, name="home-page"),
    path("posts", views.posts, name="posts-page"),
    path("post-detail/<slug:slug>", views.get_specific_post, name='post-detail')
]
