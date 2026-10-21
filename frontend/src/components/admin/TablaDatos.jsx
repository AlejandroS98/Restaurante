import { textoRelacion } from '../../config/recursos'

function formatear(campo, valor, relaciones) {
  if (campo.relacion) return textoRelacion(campo, valor, relaciones)
  if (campo.tipo === 'checkbox') return valor ? 'Sí' : 'No'
  if (campo.tipo === 'time') return valor ? String(valor).slice(0, 5) : ''
  if (campo.moneda) return `$${Number(valor).toFixed(2)}`
  if (campo.tipo === 'select') {
    const opcion = campo.opciones.find((o) => o.valor === valor)
    return opcion ? opcion.texto : valor
  }
  if (campo.tipo === 'url') {
    return valor ? (
      <a href={valor} target="_blank" rel="noreferrer" className="text-orange-700 underline">
        Ver imagen
      </a>
    ) : (
      ''
    )
  }
  return valor
}

function TablaDatos({ recurso, filas, relaciones, onEditar, onEliminar }) {
  if (filas.length === 0) {
    return <p className="py-6 text-stone-600">Todavía no hay registros.</p>
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th>ID</th>
            {recurso.campos.map((c) => (
              <th key={c.nombre}>{c.etiqueta}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila[recurso.id]}>
              <td>{fila[recurso.id]}</td>
              {recurso.campos.map((c) => (
                <td key={c.nombre}>{formatear(c, fila[c.nombre], relaciones)}</td>
              ))}
              <td>
                <div className="acciones">
                  <button className="btn-tabla" onClick={() => onEditar(fila)}>
                    Editar
                  </button>
                  <button className="btn-tabla peligro" onClick={() => onEliminar(fila)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaDatos