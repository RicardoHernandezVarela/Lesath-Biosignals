from django.urls import path, include
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('', include(([
        path('experimentos/<username>/', views.experimentos.as_view(), name='experimentos'),
        path('experimento/<int:pk>/', views.senales_exp.as_view(), name='senalesExp'),

        path('colaboraciones/<username>/', views.colaboracion.as_view(), name='colaboracion'),
        path('user-autocomplete/', views.UserAutocomplete.as_view(), name='user-autocomplete'),
        path('colaboracionNueva/<username>/', views.nueva_colaboracion.as_view(), name='nueva_colaboracion'),

        path('registros/<username>/', views.ver_registros.as_view(), name='señales'),
        path('registros/<int:pk>/eliminar/', views.SignalDelete.as_view(), name='eliminar'),
        path('editar/<int:pk>/', views.SignalUpdate.as_view(), name='editar'),

        path('nuevoregistro/<int:pk>', views.nueva_senal, name='nueva'),
        path('info/<int:pk>/', views.senal_info, name='info'),
        path('rt/<int:pk>/', views.rt_info, name='rt'),
        path('ecg/<int:pk>/', views.ecg_dash, name='ecg'),
        path('edm/<int:pk>/', views.edm_dash, name='edm'),

        path('emg/<int:pk>/', views.emg_dash, name='emg'),
        path('fcg/<int:pk>/', views.fcg_dash, name='fcg'),

    ], 'registros'), namespace='registros')),


]
