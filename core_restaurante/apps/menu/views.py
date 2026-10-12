import json

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Categoria, Platillo


# ---------- Funciones auxiliares ----------

def categoria_a_dict(c):
    return {
        'id_categoria': c.id_categoria,
        'nombre': c.nombre,
        'descripcion': c.descripcion,
    }


def platillo_a_dict(p):
    principal = p.imagenes.filter(principal=True).first() or p.imagenes.first()
    return {
        'id_platillo': p.id_platillo,
        'nombre': p.nombre,
        'descripcion': p.descripcion,
        'precio': float(p.precio),
        'id_categoria': p.categoria_id,
        'categoria': p.categoria.nombre,
        'imagen': principal.url_imagen if principal else None,
    }


ERRORES_DATOS = (json.JSONDecodeError, KeyError, ValueError, TypeError,
                 IntegrityError, ValidationError)


# ---------- CATEGORIAS ----------

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def categorias(request):
    # LEER todas
    if request.method == 'GET':
        data = [categoria_a_dict(c) for c in Categoria.objects.all().order_by('id_categoria')]
        return JsonResponse(data, safe=False)

    # CREAR
    try:
        body = json.loads(request.body)
        c = Categoria.objects.create(
            nombre=body['nombre'],
            descripcion=body.get('descripcion', ''),
        )
    except ERRORES_DATOS:
        return JsonResponse({'error': 'Datos inválidos'}, status=400)
    return JsonResponse(categoria_a_dict(c), status=201)


@csrf_exempt
@require_http_methods(['GET', 'PUT', 'DELETE'])
def categoria_detalle(request, id_categoria):
    c = get_object_or_404(Categoria, pk=id_categoria)

    # LEER una
    if request.method == 'GET':
        return JsonResponse(categoria_a_dict(c))

    # ELIMINAR
    if request.method == 'DELETE':
        c.delete()
        return JsonResponse({'mensaje': 'Categoría eliminada'})

    # ACTUALIZAR
    try:
        body = json.loads(request.body)
        c.nombre = body.get('nombre', c.nombre)
        c.descripcion = body.get('descripcion', c.descripcion)
        c.save()
    except ERRORES_DATOS:
        return JsonResponse({'error': 'Datos inválidos'}, status=400)
    return JsonResponse(categoria_a_dict(c))


# ---------- PLATILLOS ----------

@csrf_exempt
@require_http_methods(['GET', 'POST'])
def platillos(request):
    # LEER todos
    if request.method == 'GET':
        lista = Platillo.objects.select_related('categoria').order_by('id_platillo')
        return JsonResponse([platillo_a_dict(p) for p in lista], safe=False)

    # CREAR
    try:
        body = json.loads(request.body)
        p = Platillo.objects.create(
            nombre=body['nombre'],
            descripcion=body.get('descripcion', ''),
            precio=body['precio'],
            categoria_id=body['id_categoria'],
        )
    except ERRORES_DATOS:
        return JsonResponse({'error': 'Datos inválidos'}, status=400)
    return JsonResponse(platillo_a_dict(p), status=201)


@csrf_exempt
@require_http_methods(['GET', 'PUT', 'DELETE'])
def platillo_detalle(request, id_platillo):
    p = get_object_or_404(Platillo, pk=id_platillo)

    # LEER uno
    if request.method == 'GET':
        return JsonResponse(platillo_a_dict(p))

    # ELIMINAR
    if request.method == 'DELETE':
        p.delete()
        return JsonResponse({'mensaje': 'Platillo eliminado'})

    # ACTUALIZAR
    try:
        body = json.loads(request.body)
        p.nombre = body.get('nombre', p.nombre)
        p.descripcion = body.get('descripcion', p.descripcion)
        p.precio = body.get('precio', p.precio)
        p.categoria_id = body.get('id_categoria', p.categoria_id)
        p.save()
    except ERRORES_DATOS:
        return JsonResponse({'error': 'Datos inválidos'}, status=400)
    return JsonResponse(platillo_a_dict(p))