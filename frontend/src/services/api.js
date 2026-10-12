const BASE = '/api/menu'

export async function obtenerCategorias() {
  const res = await fetch(`${BASE}/categorias/`)
  if (!res.ok) throw new Error('No se pudieron cargar las categorías')
  return res.json()
}

export async function obtenerPlatillos() {
  const res = await fetch(`${BASE}/platillos/`)
  if (!res.ok) throw new Error('No se pudieron cargar los platillos')
  return res.json()
}
