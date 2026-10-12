function CategoriaFiltro({ categorias, activa, onSeleccionar }) {
  const base = 'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition'
  const on = 'bg-orange-700 text-white'
  const off = 'bg-white text-stone-700 hover:bg-orange-100'

  return (
    <div className="filtro">
      <button
        className={`${base} ${activa === null ? on : off}`}
        onClick={() => onSeleccionar(null)}
      >
        Todos
      </button>
      {categorias.map((c) => (
        <button
          key={c.id_categoria}
          className={`${base} ${activa === c.id_categoria ? on : off}`}
          onClick={() => onSeleccionar(c.id_categoria)}
        >
          {c.nombre}
        </button>
      ))}
    </div>
  )
}

export default CategoriaFiltro
