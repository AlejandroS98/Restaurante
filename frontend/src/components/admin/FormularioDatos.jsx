import { useState } from 'react'
import { etiqueta, idDe } from '../../config/recursos'

const entrada =
  'w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-orange-600 focus:outline-none'

function valoresIniciales(recurso, fila) {
  const valores = {}
  recurso.campos.forEach((c) => {
    if (fila) {
      let v = fila[c.nombre]
      if (c.tipo === 'time' && v) v = String(v).slice(0, 5)
      valores[c.nombre] = v ?? ''
    } else {
      valores[c.nombre] = c.tipo === 'checkbox' ? false : ''
    }
  })
  return valores
}

function FormularioDatos({ recurso, fila, relaciones, guardando, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() => valoresIniciales(recurso, fila))

  function cambiar(nombre, valor) {
    setValores((v) => ({ ...v, [nombre]: valor }))
  }

  function enviar(e) {
    e.preventDefault()
    const datos = {}
    recurso.campos.forEach((c) => {
      const v = valores[c.nombre]
      datos[c.nombre] = c.tipo === 'number' || c.relacion ? Number(v) : v
    })
    onGuardar(datos)
  }

  function renderEntrada(c) {
    const id = `campo-${c.nombre}`
    const valor = valores[c.nombre]

    if (c.tipo === 'textarea') {
      return (
        <textarea
          id={id}
          rows="3"
          className={entrada}
          value={valor}
          onChange={(e) => cambiar(c.nombre, e.target.value)}
        />
      )
    }

    if (c.tipo === 'select') {
      const opciones = c.relacion
        ? (relaciones[c.relacion] || []).map((i) => ({
            valor: i[idDe(c.relacion)],
            texto: etiqueta(i),
          }))
        : c.opciones
      return (
        <select
          id={id}
          required={c.requerido}
          className={entrada}
          value={valor}
          onChange={(e) => cambiar(c.nombre, e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.texto}
            </option>
          ))}
        </select>
      )
    }

    if (c.tipo === 'checkbox') {
      return (
        <input
          id={id}
          type="checkbox"
          className="h-5 w-5 accent-orange-600"
          checked={valor}
          onChange={(e) => cambiar(c.nombre, e.target.checked)}
        />
      )
    }

    return (
      <input
        id={id}
        type={c.tipo}
        step={c.paso}
        min={c.tipo === 'number' ? '0' : undefined}
        required={c.requerido}
        className={entrada}
        value={valor}
        onChange={(e) => cambiar(c.nombre, e.target.value)}
      />
    )
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h4 className="campo-ancho m-0 text-lg font-bold text-stone-800">
        {fila ? 'Editar' : 'Agregar'} {recurso.singular}
      </h4>

      {recurso.campos.map((c) => {
        let clase = 'campo'
        if (c.tipo === 'textarea') clase += ' campo-ancho'
        if (c.tipo === 'checkbox') clase += ' campo-check'
        return (
          <div key={c.nombre} className={clase}>
            <label htmlFor={`campo-${c.nombre}`} className="text-sm font-semibold text-stone-700">
              {c.etiqueta}
            </label>
            {renderEntrada(c)}
          </div>
        )
      })}

      <div className="formulario-botones">
        <button type="button" className="boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="boton-primario" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}

export default FormularioDatos