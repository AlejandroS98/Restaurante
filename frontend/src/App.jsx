import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoriaFiltro from './components/CategoriaFiltro'
import PlatilloCard from './components/PlatilloCard'
import Footer from './components/Footer'
import { obtenerCategorias, obtenerPlatillos } from './services/api'

function App() {
  const [categorias, setCategorias] = useState([])
  const [platillos, setPlatillos] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([obtenerCategorias(), obtenerPlatillos()])
      .then(([cats, plats]) => {
        setCategorias(cats)
        setPlatillos(plats)
      })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false))
  }, [])

  const visibles = categoriaActiva
    ? platillos.filter((p) => p.id_categoria === categoriaActiva)
    : platillos

  return (
    <>
      <Navbar />
      <Hero />

      <main id="menu" className="seccion-menu">
        <h2>Nuestro menú</h2>

        <CategoriaFiltro
          categorias={categorias}
          activa={categoriaActiva}
          onSeleccionar={setCategoriaActiva}
        />

        {cargando && <p>Cargando menú...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!cargando && !error && visibles.length === 0 && (
          <p>No hay platillos en esta categoría.</p>
        )}

        <div className="grid-menu">
          {visibles.map((p) => (
            <PlatilloCard key={p.id_platillo} platillo={p} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default App
