from django.db import models


class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    class Meta:
        db_table = 'categorias'

    def __str__(self):
        return self.nombre


class Platillo(models.Model):
    id_platillo = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.CASCADE,
        db_column='id_categoria',
        related_name='platillos',
    )

    class Meta:
        db_table = 'platillos'

    def __str__(self):
        return self.nombre


class ImagenPlatillo(models.Model):
    id_imagen = models.AutoField(primary_key=True)
    url_imagen = models.CharField(max_length=500)
    descripcion = models.CharField(max_length=200, blank=True)
    principal = models.BooleanField(default=False)
    platillo = models.ForeignKey(
        Platillo,
        on_delete=models.CASCADE,
        db_column='id_platillo',
        related_name='imagenes',
    )

    class Meta:
        db_table = 'imagenes_platillo'

    def __str__(self):
        return f'Imagen de {self.platillo.nombre}'


class Ingrediente(models.Model):
    id_ingrediente = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    cantidad = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'ingredientes'

    def __str__(self):
        return self.nombre


class PlatilloIngrediente(models.Model):
    platillo_ingrediente = models.AutoField(primary_key=True)
    platillo = models.ForeignKey(
        Platillo,
        on_delete=models.CASCADE,
        db_column='id_platillo',
        related_name='ingredientes_platillo',
    )
    ingrediente = models.ForeignKey(
        Ingrediente,
        on_delete=models.CASCADE,
        db_column='id_ingrediente',
        related_name='platillos_ingrediente',
    )
    cantidad = models.DecimalField(max_digits=8, decimal_places=2)

    class Meta:
        db_table = 'platillo_ingrediente'

    def __str__(self):
        return f'{self.platillo.nombre} - {self.ingrediente.nombre}'