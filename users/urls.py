from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.SignUp.as_view(), name='signup'),
    path('useredit/<int:pk>/', views.UserUpdate.as_view(), name='useredit'),
]