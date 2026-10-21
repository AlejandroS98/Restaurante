const ESTADOS_MESA = [
  { valor: 'disponible', texto: 'Disponible' },
  { valor: 'ocupada', texto: 'Ocupada' },
  { valor: 'reservada', texto: 'Reservada' },
]

const ESTADOS_RESERVACION = [
  { valor: 'pendiente', texto: 'Pendiente' },
  { valor: 'confirmada', texto: 'Confirmada' },
  { valor: 'cancelada', texto: 'Cancelada' },
]

const DIAS = [
  { valor: 'lunes', texto: 'Lunes' },
  { valor: 'martes', texto: 'Martes' },
  { valor: 'miercoles', texto: 'Miércoles' },
  { valor: 'jueves', texto: 'Jueves' },
  { valor: 'viernes', texto: 'Viernes' },
  { valor: 'sabado', texto: 'Sábado' },
  { valor: 'domingo', texto: 'Domingo' },
]

export const RECURSOS = [
  {
    clave: 'categorias',
    titulo: 'Categorías',
    singular: 'categoría',
    url: '/api/menu/categorias/',
    id: 'id_categoria',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
    ],
  },
  {
    clave: 'platillos',
    titulo: 'Platillos',
    singular: 'platillo',
    url: '/api/menu/platillos/',
    id: 'id_platillo',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
      { nombre: 'precio', etiqueta: 'Precio', tipo: 'number', paso: '0.01', moneda: true, requerido: true },
      { nombre: 'id_categoria', etiqueta: 'Categoría', tipo: 'select', relacion: 'categorias', requerido: true },
    ],
  },
  {
    clave: 'imagenes',
    titulo: 'Imágenes',
    singular: 'imagen',
    url: '/api/menu/imagenes/',
    id: 'id_imagen',
    campos: [
      { nombre: 'url_imagen', etiqueta: 'Dirección de la imagen (ej. /img/pizza.jpg)', tipo: 'text', requerido: true },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'text' },
      { nombre: 'principal', etiqueta: 'Imagen principal', tipo: 'checkbox' },
      { nombre: 'id_platillo', etiqueta: 'Platillo', tipo: 'select', relacion: 'platillos', requerido: true },
    ],
  },
  {
    clave: 'ingredientes',
    titulo: 'Ingredientes',
    singular: 'ingrediente',
    url: '/api/menu/ingredientes/',
    id: 'id_ingrediente',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
      { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea' },
      { nombre: 'cantidad', etiqueta: 'Cantidad en existencia', tipo: 'number', requerido: true },
    ],
  },
  {
    clave: 'platillo-ingredientes',
    titulo: 'Ingredientes por platillo',
    singular: 'ingrediente de platillo',
    url: '/api/menu/platillo-ingredientes/',
    id: 'platillo_ingrediente',
    campos: [
      { nombre: 'id_platillo', etiqueta: 'Platillo', tipo: 'select', relacion: 'platillos', requerido: true },
      { nombre: 'id_ingrediente', etiqueta: 'Ingrediente', tipo: 'select', relacion: 'ingredientes', requerido: true },
      { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', paso: '0.01', requerido: true },
    ],
  },
  {
    clave: 'clientes',
    titulo: 'Clientes',
    singular: 'cliente',
    url: '/api/clientes/clientes/',
    id: 'id_cliente',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
      { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text', requerido: true },
      { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'text', requerido: true },
      { nombre: 'correo', etiqueta: 'Correo', tipo: 'email', requerido: true },
    ],
  },
  {
    clave: 'mesas',
    titulo: 'Mesas',
    singular: 'mesa',
    url: '/api/reservaciones/mesas/',
    id: 'id_mesa',
    campos: [
      { nombre: 'numero', etiqueta: 'Número de mesa', tipo: 'number', requerido: true },
      { nombre: 'capacidad', etiqueta: 'Capacidad (personas)', tipo: 'number', requerido: true },
      { nombre: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ESTADOS_MESA, requerido: true },
    ],
  },
  {
    clave: 'reservaciones',
    titulo: 'Reservaciones',
    singular: 'reservación',
    url: '/api/reservaciones/reservaciones/',
    id: 'id_reservacion',
    campos: [
      { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date', requerido: true },
      { nombre: 'hora', etiqueta: 'Hora', tipo: 'time', requerido: true },
      { nombre: 'cantidad_personas', etiqueta: 'Personas', tipo: 'number', requerido: true },
      { nombre: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: ESTADOS_RESERVACION, requerido: true },
      { nombre: 'id_cliente', etiqueta: 'Cliente', tipo: 'select', relacion: 'clientes', requerido: true },
      { nombre: 'id_mesa', etiqueta: 'Mesa', tipo: 'select', relacion: 'mesas', requerido: true },
    ],
  },
  {
    clave: 'sucursales',
    titulo: 'Sucursales',
    singular: 'sucursal',
    url: '/api/sucursales/sucursales/',
    id: 'id_sucursal',
    campos: [
      { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text', requerido: true },
      { nombre: 'direccion', etiqueta: 'Dirección', tipo: 'text', requerido: true },
      { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'text', requerido: true },
      { nombre: 'ciudad', etiqueta: 'Ciudad', tipo: 'text', requerido: true },
    ],
  },
  {
    clave: 'horarios',
    titulo: 'Horarios',
    singular: 'horario',
    url: '/api/sucursales/horarios/',
    id: 'id_horario',
    campos: [
      { nombre: 'dia_semana', etiqueta: 'Día', tipo: 'select', opciones: DIAS, requerido: true },
      { nombre: 'hora_apertura', etiqueta: 'Hora de apertura', tipo: 'time', requerido: true },
      { nombre: 'hora_cierre', etiqueta: 'Hora de cierre', tipo: 'time', requerido: true },
    ],
  },
]

// Funciones de ayuda

export const idDe = (clave) => RECURSOS.find((r) => r.clave === clave).id

// Nombre que se muestra para un registro (en listas desplegables y tablas)
export const etiqueta = (item) => item.texto || item.nombre

// Para una columna de tipo relación, busca el nombre del registro relacionado
export function textoRelacion(campo, valor, relaciones) {
  const lista = relaciones[campo.relacion] || []
  const id = idDe(campo.relacion)
  const item = lista.find((i) => i[id] === valor)
  return item ? etiqueta(item) : valor
}
