import { useState } from 'react'
import { crear } from '../services/api'

const entrada =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-orange-600 focus:outline-none'

const CAMPOS = [
  { nombre: 'nombre', etiqueta: 'Nombre', tipo: 'text' },
  { nombre: 'apellido', etiqueta: 'Apellido', tipo: 'text' },
  { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'tel' },
  { nombre: 'correo', etiqueta: 'Correo', tipo: 'email' },
  { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date' },
  { nombre: 'hora', etiqueta: 'Hora', tipo: 'time' },
  { nombre: 'cantidad_personas', etiqueta: 'Número de personas', tipo: 'number' },
]

const VACIO = {
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  fecha: '',
  hora: '',
  cantidad_personas: 2,
}

// Fecha de hoy con la hora local de la computadora (formato AAAA-MM-DD)
function hoy() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

function fechaBonita(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function Reservar() {
  const [valores, setValores] = useState(VACIO)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)

  function cambiar(nombre, valor) {
    setValores((v) => ({ ...v, [nombre]: valor }))
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setError('')
    try {
      const datos = await crear('/api/reservaciones/reservar/', {
        ...valores,
        cantidad_personas: Number(valores.cantidad_personas),
      })
      setConfirmacion(datos)
      setValores(VACIO)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="seccion-menu">
      <div className="reserva-caja">
        <h2>Reserva tu mesa</h2>

        {confirmacion ? (
          <div className="confirmacion">
            <h3>¡Reservación recibida!</h3>
            <p>
              Gracias, {confirmacion.nombre}. Estos son los datos de tu reservación, que por ahora
              está <strong>pendiente de confirmación</strong>:
            </p>
            <ul>
              <li>Fecha: {fechaBonita(confirmacion.fecha)}</li>
              <li>Hora: {confirmacion.hora}</li>
              <li>Personas: {confirmacion.cantidad_personas}</li>
              <li>Mesa: {confirmacion.mesa}</li>
            </ul>
            <button className="boton-primario" onClick={() => setConfirmacion(null)}>
              Hacer otra reservación
            </button>
          </div>
        ) : (
          <>
            <p className="reserva-intro">
              Llena tus datos y elige fecha y hora. Nosotros te asignamos una mesa disponible.
            </p>

            {error && <p className="aviso-error">{error}</p>}

            <form className="formulario formulario-reserva" onSubmit={enviar}>
              {CAMPOS.map((c) => (
                <div key={c.nombre} className="campo">
                  <label htmlFor={`reserva-${c.nombre}`} className="text-sm font-semibold text-stone-700">
                    {c.etiqueta}
                  </label>
                  <input
                    id={`reserva-${c.nombre}`}
                    type={c.tipo}
                    required
                    className={entrada}
                    value={valores[c.nombre]}
                    min={c.tipo === 'date' ? hoy() : c.tipo === 'number' ? '1' : undefined}
                    max={c.tipo === 'number' ? '20' : undefined}
                    onChange={(e) => cambiar(c.nombre, e.target.value)}
                  />
                </div>
              ))}

              <div className="formulario-botones">
                <button type="submit" className="boton-primario" disabled={enviando}>
                  {enviando ? 'Enviando...' : 'Reservar mesa'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  )
}

export default Reservar