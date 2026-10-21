function formatearError(error) {
  if (!error) return ''
  if (typeof error === 'string') return error
  if (Array.isArray(error)) return error.join(' ')
  return Object.entries(error)
    .map(([campo, msgs]) => `${campo}: ${[].concat(msgs).join(' ')}`)
    .join(' | ')
}

async function pedir(url, opciones) {
  const res = await fetch(url, opciones)
  const datos = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(formatearError(datos.error) || 'Ocurrió un error')
  }
  return datos
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export const listar = (url) => pedir(url)

export const crear = (url, datos) =>
  pedir(url, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(datos) })

export const actualizar = (url, id, datos) =>
  pedir(`${url}${id}/`, { method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(datos) })

export const eliminar = (url, id) => pedir(`${url}${id}/`, { method: 'DELETE' })

// Estas dos las sigue usando la página del menú
export const obtenerCategorias = () => listar('/api/menu/categorias/')
export const obtenerPlatillos = () => listar('/api/menu/platillos/')
