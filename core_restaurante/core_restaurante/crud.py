import json
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


def _clave(campo):
    # Nombre con el que viaja el campo en el JSON (igual al del diagrama)
    return campo.db_column or campo.name


def _campos(modelo):
    return [c for c in modelo._meta.concrete_fields if not c.primary_key]


def _mensaje(e):
    if isinstance(e, ValidationError):
        return e.message_dict if hasattr(e, 'error_dict') else e.messages
    return 'Datos inválidos'


def a_dict(obj):
    modelo = obj.__class__
    datos = {modelo._meta.pk.name: obj.pk}
    for campo in _campos(modelo):
        valor = getattr(obj, campo.attname)
        if isinstance(valor, Decimal):
            valor = float(valor)
        elif hasattr(valor, 'isoformat'):
            valor = valor.isoformat()
        datos[_clave(campo)] = valor
    datos['texto'] = str(obj)
    return datos


def _guardar(obj, body):
    campos = {_clave(c): c for c in _campos(obj.__class__)}
    for clave, valor in body.items():
        campo = campos.get(clave)
        if campo is not None:
            setattr(obj, campo.attname, valor)
    obj.full_clean()
    obj.save()


ERRORES = (json.JSONDecodeError, ValidationError, IntegrityError,
           AttributeError, ValueError, TypeError)


def crear_vistas(modelo):
    relaciones = [c.name for c in _campos(modelo) if c.is_relation]

    def consulta():
        qs = modelo.objects.all()
        if relaciones:
            qs = qs.select_related(*relaciones)
        return qs.order_by('pk')

    @csrf_exempt
    @require_http_methods(['GET', 'POST'])
    def lista(request):
        # LEER todos
        if request.method == 'GET':
            return JsonResponse([a_dict(o) for o in consulta()], safe=False)

        # CREAR
        try:
            obj = modelo()
            _guardar(obj, json.loads(request.body))
        except ERRORES as e:
            return JsonResponse({'error': _mensaje(e)}, status=400)
        return JsonResponse(a_dict(obj), status=201)

    @csrf_exempt
    @require_http_methods(['GET', 'PUT', 'DELETE'])
    def detalle(request, pk):
        obj = get_object_or_404(consulta(), pk=pk)

        # LEER uno
        if request.method == 'GET':
            return JsonResponse(a_dict(obj))

        # ELIMINAR
        if request.method == 'DELETE':
            obj.delete()
            return JsonResponse({'mensaje': 'Eliminado'})

        # ACTUALIZAR
        try:
            _guardar(obj, json.loads(request.body))
        except ERRORES as e:
            return JsonResponse({'error': _mensaje(e)}, status=400)
        return JsonResponse(a_dict(obj))

    return lista, detalle