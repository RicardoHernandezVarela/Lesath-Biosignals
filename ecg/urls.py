from django.urls import path, include
from django.views.generic.base import TemplateView
from . import views
from ecg.viewsFolder import experimentos, senales, colaboraciones

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('', include(([

        #Ver los experimentos del usuario y crear nuevos.
        path('experimentos/<username>/', experimentos.experimentos.as_view(), name='experimentos'),
       
        #Borrar experimento.
        path('borrar-experimento/<int:pk>/', experimentos.borrarExperimento.as_view(), name='exp-delete'),

        #Editar experimento.
        path('editar-experimento/<int:pk>/', experimentos.editarExperimento.as_view(), name='exp-edit'),

        

        #Ver las colaboraciones del usuario y crear nuevas.
        path('colaboraciones/<username>/', colaboraciones.colaboracion.as_view(), name='colaboracion'),

        #Autocomplete para buscar usuarios y compartir un experimento.
        path('user-autocomplete/', colaboraciones.UserAutocomplete.as_view(), name='user-autocomplete'),

        #Crear nueva colaboración. BORRAR
        path('colaboracionNueva/<username>/', colaboraciones.nueva_colaboracion.as_view(), name='nueva_colaboracion'),



        #Ver las señales existentes dentro del experimento.
        path('experimento/<int:pk>/', senales.senales_exp.as_view(), name='senalesExp'),

        #Tomar una nueva señal / Retomar la señal.
        path('nuevoregistro/<int:pk>/', senales.nueva_senal, name='nueva'),

        #Eliminar una señal.
        path('experimento/<int:pk>/eliminar/', senales.SignalDelete.as_view(), name='eliminar'),

        #Guardar en la base de datos las muestras de la señal.
        path('info/<int:pk>/', views.senal_info, name='info'),




        path('registros/<username>/', views.ver_registros.as_view(), name='señales'),
        
        path('editar/<int:pk>/', views.SignalUpdate.as_view(), name='editar'),

        
        
        path('rt/<int:pk>/', views.rt_info, name='rt'),

        path('descargarData/<int:pk>/', views.descargar_datos, name='descargar'),

        path('ecg/<int:pk>/', views.ecg_dash, name='ecg'),
        path('edm/<int:pk>/', views.edm_dash, name='edm'),

        path('emg/<int:pk>/', views.emg_dash, name='emg'),
        path('fcg/<int:pk>/', views.fcg_dash, name='fcg'),

    ], 'registros'), namespace='registros')),


]
