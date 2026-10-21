from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/menu/', include('apps.menu.urls')),
    path('api/clientes/', include('apps.clientes.urls')),
    path('api/reservaciones/', include('apps.reservaciones.urls')),
    path('api/sucursales/', include('apps.sucursales.urls')),
]