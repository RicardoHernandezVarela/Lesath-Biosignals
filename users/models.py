from django.db import models
from django.contrib.auth.models import AbstractUser

from django.urls import reverse

class CustomUser(AbstractUser):

    def get_absolute_url(self):
        return reverse('home')

    def __str__(self):
        return self.username
