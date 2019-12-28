from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView

from django.conf.urls import ( handler400, handler500)

urlpatterns = [
    path('', TemplateView.as_view(template_name='home.html'), name='home'),
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('senales/', include('ecg.urls')),
    path('users/', include('django.contrib.auth.urls')),
]

handler404 = 'ecg.views.handler_404'