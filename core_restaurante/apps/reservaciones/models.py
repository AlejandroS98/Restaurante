from django.db import models


class Mesa(models.Model):
    ESTADOS = [
        ('disponible', 'Disponible'),
        ('ocupada', 'Ocupada'),
        ('reservada', 'Reservada'),
    ]

    id_mesa = models.AutoField(primary_key=True)
    numero = models.PositiveIntegerField(unique=True)
    capacidad = models.PositiveIntegerField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='disponible')

    class Meta:
        db_table = 'mesas'

    def __str__(self):
        return f'Mesa {self.numero}'


class Reservacion(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
    ]

    id_reservacion = models.AutoField(primary_key=True)
    fecha = models.DateField()
    hora = models.TimeField()
    cantidad_personas = models.PositiveIntegerField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    cliente = models.ForeignKey(
        'clientes.Cliente',
        on_delete=models.CASCADE,
        db_column='id_cliente',
        related_name='reservaciones',
    )
    mesa = models.ForeignKey(
        Mesa,
        on_delete=models.CASCADE,
        db_column='id_mesa',
        related_name='reservaciones',
    )

    class Meta:
        db_table = 'reservaciones'

    def __str__(self):
        return f'Reservación {self.id_reservacion} - {self.cliente}'