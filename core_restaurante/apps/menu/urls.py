from django.urls import path
from core_restaurante.crud import crear_vistas
from . import views
from .models import ImagenPlatillo, Ingrediente, PlatilloIngrediente

imagenes, imagen_detalle = crear_vistas(ImagenPlatillo)
ingredientes, ingrediente_detalle = crear_vistas(Ingrediente)
platillo_ingredientes, platillo_ingrediente_detalle = crear_vistas(PlatilloIngrediente)

urlpatterns = [
    path('categorias/', views.categorias, name='categorias'),
    path('categorias/<int:id_categoria>/', views.categoria_detalle, name='categoria_detalle'),
    path('platillos/', views.platillos, name='platillos'),
    path('platillos/<int:id_platillo>/', views.platillo_detalle, name='platillo_detalle'),

    path('imagenes/', imagenes, name='imagenes'),
    path('imagenes/<int:pk>/', imagen_detalle, name='imagen_detalle'),
    path('ingredientes/', ingredientes, name='ingredientes'),
    path('ingredientes/<int:pk>/', ingrediente_detalle, name='ingrediente_detalle'),
    path('platillo-ingredientes/', platillo_ingredientes, name='platillo_ingredientes'),
    path('platillo-ingredientes/<int:pk>/', platillo_ingrediente_detalle, name='platillo_ingrediente_detalle'),
]
