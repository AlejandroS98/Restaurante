from django.db import models


class Sucursal(models.Model):
    id_sucursal = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    ciudad = models.CharField(max_length=100)

    class Meta:
        db_table = 'sucursales'
        verbose_name_plural = 'sucursales'

    def __str__(self):
        return self.nombre


class Horario(models.Model):
    DIAS = [
        ('lunes', 'Lunes'),
        ('martes', 'Martes'),
        ('miercoles', 'Miércoles'),
        ('jueves', 'Jueves'),
        ('viernes', 'Viernes'),
        ('sabado', 'Sábado'),
        ('domingo', 'Domingo'),
    ]

    id_horario = models.AutoField(primary_key=True)
    dia_semana = models.CharField(max_length=10, choices=DIAS)
    hora_apertura = models.TimeField()
    hora_cierre = models.TimeField()

    class Meta:
        db_table = 'horarios'

    def __str__(self):
        return f'{self.get_dia_semana_display()} {self.hora_apertura} - {self.hora_cierre}'