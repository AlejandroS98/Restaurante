import json
from datetime import date, datetime, time

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from apps.clientes.models import Cliente
from apps.sucursales.models import Horario
from .models import Mesa, Reservacion

DURACION_MINUTOS = 120
DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']


def _minutos(hora):
    return hora.hour * 60 + hora.minute


def _error(mensaje, estado=400):
    return JsonResponse({'error': mensaje}, status=estado)


@csrf_exempt
@require_POST
def reservar(request):
    # 1) Leer los datos que manda la página
    try:
        body = json.loads(request.body)
        nombre = str(body.get('nombre', '')).strip()
        apellido = str(body.get('apellido', '')).strip()
        telefono = str(body.get('telefono', '')).strip()
        correo = str(body.get('correo', '')).strip()
        personas = int(body.get('cantidad_personas', 0))
        fecha = date.fromisoformat(str(body.get('fecha', '')))
        hora = time.fromisoformat(str(body.get('hora', '')))
    except (json.JSONDecodeError, AttributeError, ValueError, TypeError):
        return _error('Revisa que todos los datos estén completos y correctos.')

    # 2) Revisar que los datos tengan sentido
    if not (nombre and apellido and telefono and correo):
        return _error('Completa todos los campos.')
    if personas < 1:
        return _error('Indica cuántas personas serán.')
    try:
        validate_email(correo)
    except ValidationError:
        return _error('El correo no es válido.')

    ahora = datetime.now()
    if fecha < ahora.date():
        return _error('La fecha no puede ser anterior a hoy.')
    if fecha == ahora.date() and _minutos(hora) < _minutos(ahora):
        return _error('Esa hora ya pasó. Elige otra.')

    # 3) Si ese día hay horario registrado, la hora debe estar dentro
    horarios = list(Horario.objects.filter(dia_semana=DIAS[fecha.weekday()]))
    if horarios and not any(h.hora_apertura <= hora < h.hora_cierre for h in horarios):
        rangos = ', '.join(f'{h.hora_apertura:%H:%M} a {h.hora_cierre:%H:%M}' for h in horarios)
        return _error(f'Ese día atendemos de {rangos}.')

    # 4) Buscar la mesa más pequeña que alcance y esté libre
    mesas = Mesa.objects.filter(capacidad__gte=personas).order_by('capacidad', 'numero')
    if not mesas.exists():
        return _error('No tenemos mesas para tantas personas. Llámanos para ayudarte.')

    del_dia = list(Reservacion.objects.filter(fecha=fecha).exclude(estado='cancelada'))
    mesa_libre = None
    for mesa in mesas:
        ocupada = any(
            r.mesa_id == mesa.pk and abs(_minutos(r.hora) - _minutos(hora)) < DURACION_MINUTOS
            for r in del_dia
        )
        if not ocupada:
            mesa_libre = mesa
            break

    if mesa_libre is None:
        return _error('No hay mesas disponibles en esa fecha y hora. Prueba con otro horario.', 409)

    # 5) Guardar cliente y reservación
    try:
        with transaction.atomic():
            cliente = Cliente.objects.filter(correo=correo).first()
            if cliente is None:
                cliente = Cliente(nombre=nombre, apellido=apellido, telefono=telefono, correo=correo)
                cliente.full_clean()
                cliente.save()

            reservacion = Reservacion(
                fecha=fecha,
                hora=hora,
                cantidad_personas=personas,
                estado='pendiente',
                cliente=cliente,
                mesa=mesa_libre,
            )
            reservacion.full_clean()
            reservacion.save()
    except ValidationError as e:
        return _error(e.messages)

    return JsonResponse({
        'id_reservacion': reservacion.pk,
        'nombre': f'{cliente.nombre} {cliente.apellido}',
        'fecha': fecha.isoformat(),
        'hora': hora.strftime('%H:%M'),
        'cantidad_personas': personas,
        'mesa': mesa_libre.numero,
        'estado': reservacion.estado,
    }, status=201)
