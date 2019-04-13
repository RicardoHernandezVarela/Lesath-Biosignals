from django.urls import path, include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('', include(([
        path('registros/<username>/', views.ver_registros.as_view(), name='señales'),
        #path('registros/', views.registros, name='señales'),
        path('nuevoregistro/<int:pk>', views.nueva_senal, name='nueva'),
        
    ], 'registros'), namespace='registros')),

    path('', include(([
        path('bpm/', views.holis, name='callFunc'),
        path('conexion/', views.conectar, name='serial'),
        path('registro/', views.registrar, name='registro'),
    ], 'ecg'), namespace='ecg')),
    
]