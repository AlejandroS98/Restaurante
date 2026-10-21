import { useEffect, useState } from 'react'
import { RECURSOS } from '../../config/recursos'
import { listar, crear, actualizar, eliminar } from '../../services/api'
import TablaDatos from './TablaDatos'
import FormularioDatos from './FormularioDatos'

const pestana = 'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition'
const activa = 'bg-orange-700 text-white'
const inactiva = 'bg-white text-stone-700 hover:bg-orange-100'

function PanelAdmin() {
  const [clave, setClave] = useState(RECURSOS[0].clave)
  const [filas, setFilas] = useState([])
  const [relaciones, setRelaciones] = useState({})
  const [formulario, setFormulario] = useState(null) // null = oculto, { fila } = abierto
  const [version, setVersion] = useState(0) // sirve para volver a cargar la tabla
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const recurso = RECURSOS.find((r) => r.clave === clave)

  useEffect(() => {
    let vigente = true
    const actual = RECURSOS.find((r) => r.clave === clave)
    const clavesRel = [...new Set(actual.campos.filter((c) => c.relacion).map((c) => c.relacion))]

    setCargando(true)
    Promise.all([
      listar(actual.url),
      ...clavesRel.map((k) => listar(RECURSOS.find((r) => r.clave === k).url)),
    ])
      .then((resultados) => {
        if (!vigente) return
        const rel = {}
        clavesRel.forEach((k, i) => {
          rel[k] = resultados[i + 1]
        })
        setFilas(resultados[0])
        setRelaciones(rel)
      })
      .catch((e) => vigente && setError(e.message))
      .finally(() => vigente && setCargando(false))

    return () => {
      vigente = false
    }
  }, [clave, version])

  function cambiarPestana(nueva) {
    setClave(nueva)
    setFormulario(null)
    setError('')
    setMensaje('')
  }

  function abrirFormulario(fila) {
    setFormulario({ fila })
    setError('')
    setMensaje('')
  }

  async function guardar(datos) {
    setGuardando(true)
    setError('')
    try {
      if (formulario.fila) {
        await actualizar(recurso.url, formulario.fila[recurso.id], datos)
        setMensaje('Cambios guardados')
      } else {
        await crear(recurso.url, datos)
        setMensaje('Registro creado')
      }
      setFormulario(null)
      setVersion((v) => v + 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(fila) {
    const seguro = window.confirm(
      '¿Seguro que quieres eliminar este registro? Si tiene datos relacionados, también se eliminarán.',
    )
    if (!seguro) return
    setError('')
    try {
      await eliminar(recurso.url, fila[recurso.id])
      setMensaje('Registro eliminado')
      setVersion((v) => v + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main className="panel">
      <h2>Administración</h2>

      <div className="pestanas">
        {RECURSOS.map((r) => (
          <button
            key={r.clave}
            className={`${pestana} ${r.clave === clave ? activa : inactiva}`}
            onClick={() => cambiarPestana(r.clave)}
          >
            {r.titulo}
          </button>
        ))}
      </div>

      <div className="panel-encabezado">
        <h3>{recurso.titulo}</h3>
        <button className="boton-primario" onClick={() => abrirFormulario(null)}>
          + Agregar
        </button>
      </div>

      {mensaje && <p className="aviso-ok">{mensaje}</p>}
      {error && <p className="aviso-error">{error}</p>}

      {formulario && (
        <FormularioDatos
          key={`${clave}-${formulario.fila ? formulario.fila[recurso.id] : 'nuevo'}`}
          recurso={recurso}
          fila={formulario.fila}
          relaciones={relaciones}
          guardando={guardando}
          onGuardar={guardar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <TablaDatos
          recurso={recurso}
          filas={filas}
          relaciones={relaciones}
          onEditar={abrirFormulario}
          onEliminar={borrar}
        />
      )}
    </main>
  )
}

export default PanelAdmin