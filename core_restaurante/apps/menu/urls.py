from django.urls import path
from . import views

urlpatterns = [
    path('categorias/', views.categorias, name='categorias'),
    path('categorias/<int:id_categoria>/', views.categoria_detalle, name='categoria_detalle'),
    path('platillos/', views.platillos, name='platillos'),
    path('platillos/<int:id_platillo>/', views.platillo_detalle, name='platillo_detalle'),
]