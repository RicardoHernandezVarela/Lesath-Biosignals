from django.urls import path
from . import views

urlpatterns = [
    #Crear cuenta
    path('signup/', views.SignUp.as_view(), name='signup'),
    
    #Editar datos de usuario
    path('useredit/<int:pk>/', views.UserUpdate.as_view(), name='useredit'),
]