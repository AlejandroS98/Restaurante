function Navbar({ vista, onCambiarVista }) {
  const boton = (clave, texto) => (
    <button
      className={`nav-boton ${vista === clave ? 'activo' : ''}`}
      onClick={() => onCambiarVista(clave)}
    >
      {texto}
    </button>
  )

  return (
    <header className="barra">
      <div className="barra-contenido">
        <button className="marca" onClick={() => onCambiarVista('menu')}>
           Cempoalli
        </button>
        <nav className="nav-links">
          {boton('menu', 'Menú')}
          {boton('reservar', 'Reservar')}
          {boton('admin', 'Administrar')}
        </nav>
      </div>
    </header>
  )
}

export default Navbar