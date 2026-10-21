from django.urls import path
from core_restaurante.crud import crear_vistas
from .models import Cliente

clientes, cliente_detalle = crear_vistas(Cliente)

urlpatterns = [
    path('clientes/', clientes, name='clientes'),
    path('clientes/<int:pk>/', cliente_detalle, name='cliente_detalle'),
]
