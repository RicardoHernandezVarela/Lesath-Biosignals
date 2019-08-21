import django_filters
from ecg.models import *
from users.models import *

class ColaboracionFilter(django_filters.FilterSet):

    class Meta:
        model = Colaboracion
        fields = ('experimento',)
