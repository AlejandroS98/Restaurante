from django.contrib import admin
from .models import Categoria, Platillo, ImagenPlatillo, Ingrediente, PlatilloIngrediente

admin.site.register(Categoria)
admin.site.register(Platillo)
admin.site.register(ImagenPlatillo)
admin.site.register(Ingrediente)
admin.site.register(PlatilloIngrediente)