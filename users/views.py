from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic
from .models import CustomUser

from django.views.generic.edit import CreateView, UpdateView, DeleteView

from .forms import CustomUserCreationForm

class SignUp(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'

class UserUpdate(UpdateView):
    model = CustomUser
    fields = ['username', 'email']
    template_name = 'users/customuser_form.html'