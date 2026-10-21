from django.urls import path
from core_restaurante.crud import crear_vistas
from . import views
from .models import Mesa, Reservacion

mesas, mesa_detalle = crear_vistas(Mesa)
reservaciones, reservacion_detalle = crear_vistas(Reservacion)

urlpatterns = [
    path('mesas/', mesas, name='mesas'),
    path('mesas/<int:pk>/', mesa_detalle, name='mesa_detalle'),
    path('reservaciones/', reservaciones, name='reservaciones'),
    path('reservaciones/<int:pk>/', reservacion_detalle, name='reservacion_detalle'),
    path('reservar/', views.reservar, name='reservar'),
]
