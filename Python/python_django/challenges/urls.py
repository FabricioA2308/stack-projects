from django.urls import path
from . import views

# all sub-routes registered prefixed w /challenges

urlpatterns = [
    path("", views.index, name="index"), # challenges/
    path("<int:month>", views.monthly_challenge_by_number), # challenges/number_of_the_month
    path("<str:month>", views.monthly_challenge, name="month-challenge") # challenges/name_of_the_month
]
