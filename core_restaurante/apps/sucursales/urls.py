from django.urls import path
from core_restaurante.crud import crear_vistas
from .models import Horario, Sucursal

sucursales, sucursal_detalle = crear_vistas(Sucursal)
horarios, horario_detalle = crear_vistas(Horario)

urlpatterns = [
    path('sucursales/', sucursales, name='sucursales'),
    path('sucursales/<int:pk>/', sucursal_detalle, name='sucursal_detalle'),
    path('horarios/', horarios, name='horarios'),
    path('horarios/<int:pk>/', horario_detalle, name='horario_detalle'),
]
