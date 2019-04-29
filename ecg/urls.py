from django.urls import path, include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('', include(([
        path('registros/<username>/', views.ver_registros.as_view(), name='señales'),
        #path('registros/', views.registros, name='señales'),
        path('nuevoregistro/<int:pk>', views.nueva_senal, name='nueva'),
        path('info/<int:pk>/', views.senal_info, name='info'),
        path('rt/<int:pk>/', views.rt_info, name='rt'),
        path('ecg/<int:pk>/', views.ecg_dash, name='ecg'),
        path('edm/<int:pk>/', views.edm_dash, name='edm'),
        
        path('emg/<int:pk>/', views.emg_dash, name='emg'),
        
    ], 'registros'), namespace='registros')),

    path('', include(([
        path('bpm/', views.holis, name='callFunc'),
        path('conexion/', views.conectar, name='serial'),
        path('registro/', views.registrar, name='registro'),
    ], 'ecg'), namespace='ecg')),
    
]