import { useEffect, useState } from 'react'
import { listar } from '../services/api'

const ORDEN_DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const NOMBRE_DIA = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

function Ubicaciones() {
  const [sucursales, setSucursales] = useState([])
  const [horarios, setHorarios] = useState([])

  useEffect(() => {
    Promise.all([
      listar('/api/sucursales/sucursales/'),
      listar('/api/sucursales/horarios/'),
    ])
      .then(([s, h]) => {
        setSucursales(s)
        setHorarios(h)
      })
      .catch(() => {})
  }, [])

  const horariosOrdenados = [...horarios].sort(
    (a, b) => ORDEN_DIAS.indexOf(a.dia_semana) - ORDEN_DIAS.indexOf(b.dia_semana),
  )

  return (
    <section id="ubicaciones" className="seccion-menu">
      <h2>Sucursales y horarios</h2>

      <div className="ubicaciones">
        <div>
          <h3>Nuestras sucursales</h3>
          {sucursales.length === 0 ? (
            <p>Próximamente.</p>
          ) : (
            <div className="lista-sucursales">
              {sucursales.map((s) => (
                <article key={s.id_sucursal} className="tarjeta p-4">
                  <h4>{s.nombre}</h4>
                  <p> {s.direccion}, {s.ciudad}</p>
                  <p> {s.telefono}</p>
                </article>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3>Horarios</h3>
          {horariosOrdenados.length === 0 ? (
            <p>Próximamente.</p>
          ) : (
            <ul className="lista-horarios">
              {horariosOrdenados.map((h) => (
                <li key={h.id_horario}>
                  <span>{NOMBRE_DIA[h.dia_semana]}</span>
                  <span>
                    {h.hora_apertura.slice(0, 5)} - {h.hora_cierre.slice(0, 5)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default Ubicaciones