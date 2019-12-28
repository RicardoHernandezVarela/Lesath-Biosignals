from django.urls import path, include
from django.views.generic.base import TemplateView
from . import views
from ecg.viewsFolder import experimentos, senales, colaboraciones

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('', include(([

        ############################################################
        # EXPERIMENTOS.
        ############################################################

        #Ver los experimentos del usuario y crear nuevos.
        path('experimentos/<username>/', experimentos.experimentos.as_view(), name='experimentos'),
       
        #Borrar experimento.
        path('borrar-experimento/<int:pk>/', experimentos.borrarExperimento.as_view(), name='exp-delete'),

        #Editar experimento.
        path('editar-experimento/<int:pk>/', experimentos.editarExperimento.as_view(), name='exp-edit'),


        ############################################################
        # COLABORACIONES.
        ############################################################

        #Ver las colaboraciones del usuario y crear nuevas.
        path('colaboraciones/<username>/', colaboraciones.colaboracion.as_view(), name='colaboracion'),

        #Autocomplete para buscar usuarios y compartir un experimento.
        path('user-autocomplete/', colaboraciones.UserAutocomplete.as_view(), name='user-autocomplete'),

        #Crear nueva colaboración. BORRAR
        path('colaboracionNueva/<username>/', colaboraciones.nueva_colaboracion.as_view(), name='nueva_colaboracion'),


        ############################################################
        # SEÑALES.
        ############################################################

        #Ver las señales existentes dentro del experimento.
        path('experimento/<int:pk>/', senales.senales_exp.as_view(), name='senalesExp'),

        #Tomar una nueva señal / Retomar la señal.
        path('nuevoregistro/<int:pk>/', senales.nueva_senal, name='nueva'),

        #Eliminar una señal.
        path('experimento/<int:pk>/eliminar/', senales.SignalDelete.as_view(), name='eliminar'),

        #Editar una señal.
        path('editar/<int:pk>/', senales.SignalUpdate.as_view(), name='editar'),

        #Guardar en la base de datos las muestras de la señal.
        path('info/<int:pk>/', senales.senal_info, name='info'),

        #Obtener las muestras de una señal.
        path('descargarData/<int:pk>/', senales.descargar_datos, name='descargar'),

        #Obtener las muestras de una señal de ecg filtrada.
        path('filtrada/<int:pk>/', senales.ecg_filtrada, name='ecgfiltrada'),

        #Obtener las muestras de una señal de ecg hrv(variabilidad del ritmo cardiaco).
        path('hrv/<int:pk>/', senales.ecg_hrv, name='ecghrv'),


        ############################################################
        # DASHBOARDS.
        ############################################################

        #Dashboard para señales de ECG.
        path('ecg/<int:pk>/', senales.ecg_dash, name='ecg'),

        # Dashboard para señales de EMG.
        path('emg/<int:pk>/', senales.emg_dash, name='emg'),

        # Dashboard para señales de FCG.
        path('fcg/<int:pk>/', senales.fcg_dash, name='fcg'),

        # Dashboard para señales de EDM.
        path('edm/<int:pk>/', senales.edm_dash, name='edm'),

        # Dashboard para señales de OXI.
        path('oxi/<int:pk>/', senales.oxi_dash, name='oxi'),





        #path('registros/<username>/', views.ver_registros.as_view(), name='señales'),
        #path('rt/<int:pk>/', views.rt_info, name='rt'),


    ], 'registros'), namespace='registros')),

]


