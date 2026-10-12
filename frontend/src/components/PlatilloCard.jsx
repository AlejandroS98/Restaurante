function PlatilloCard({ platillo }) {
  return (
    <article className="tarjeta">
      {platillo.imagen ? (
        <img
          src={platillo.imagen}
          alt={platillo.nombre}
          className="tarjeta-img"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="tarjeta-img tarjeta-sin-img">🍽️</div>
      )}
      <div className="p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
          {platillo.categoria}
        </span>
        <h3 className="mt-1 text-lg font-bold text-stone-800">{platillo.nombre}</h3>
        <p className="mt-1 text-sm text-stone-600">{platillo.descripcion}</p>
        <p className="mt-3 text-xl font-bold text-stone-900">
          ${platillo.precio.toFixed(2)}
        </p>
      </div>
    </article>
  )
}

export default PlatilloCard