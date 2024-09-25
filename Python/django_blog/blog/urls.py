from django.urls import path
from . import views

urlpatterns = [
    path("", views.HomePageView.as_view(), name="home-page"),
    path("posts", views.AllPostsView.as_view(), name="all-posts"),
    path("post-detail/<int:pk>", views.PostDetailView.as_view(), name='post-detail'),
    path("read-later", views.ReadLaterView.as_view(), name="read-later")
]
