import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./css/Categorias.module.css";

function Categorias() {
  const listaCategorias = [
    "Ciencia Ficción",
    "Fantasía",
    "Misterio y Thriller",
    "Romance",
    "Terror",
    "Novela Histórica",
    "Biografía",
    "Desarrollo Personal",
    "Poesía",
    "Cómic y Manga",
    "Clásicos",
    "Aventura",
  ];

  // Estados para la columna derecha (Filtro por Categorías)
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Estados para la columna izquierda (Buscador AJAX de libros)
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);

  // Escaparate principal por categorías
  useEffect(() => {
    const cargarLibros = async () => {
      setCargando(true);
      try {
        const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const categoriasQuery =
          seleccionadas.length > 0
            ? `?categorias=${seleccionadas.join(",")}`
            : "";

        const res = await axios.get(`${URL}/api/libros${categoriasQuery}`);
        setLibros(res.data.data || []);
      } catch (error) {
        toast.error("Error al cargar la estantería");
      } finally {
        setCargando(false);
      }
    };
    cargarLibros();
  }, [seleccionadas]);

  // EFECTO 2: Buscador AJAX en tiempo real para el panel izquierdo
  useEffect(() => {
    const fetchBusqueda = async () => {
      if (busqueda.trim().length > 0) {
        setBuscando(true);
        try {
          const URL =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
          
          const res = await axios.get(
            `${URL}/api/libros?titulo=${encodeURIComponent(busqueda)}`,
          );
          setResultadosBusqueda(res.data.data || []);
        } catch (error) {
          console.error("Error en la búsqueda rápida");
        } finally {
          setBuscando(false);
        }
      } else {
        setResultadosBusqueda([]);
      }
    };

    const temporizador = setTimeout(() => {
      fetchBusqueda();
    }, 300);

    return () => clearTimeout(temporizador);
  }, [busqueda]);

  const toggleCategoria = (categoria) => {
    if (seleccionadas.includes(categoria)) {
      setSeleccionadas(seleccionadas.filter((c) => c !== categoria));
    } else {
      setSeleccionadas([...seleccionadas, categoria]);
    }
  };

  return (
    <div className="container-fluid px-4 mt-4 animate__animated animate__fadeIn">
      <div className="row">
        {/* =========================================
            COLUMNA IZQUIERDA: Buscador de Libros
            ========================================= */}
        <div className="col-md-3 mb-4">
          <div className={`shadow-sm ${styles.panelLateral}`}>
            <h5 className="fw-bold mb-3">Buscar Libro</h5>

            <div className="mb-3">
              <input
                type="text"
                className="form-control rounded-pill bg-white"
                placeholder="🔍 Título del libro..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className={styles.listaResultados}>
              {buscando ? (
                <p className="text-center text-muted small mt-4">Buscando...</p>
              ) : busqueda === "" ? (
                <p className="text-center text-muted small mt-4">
                  Encuentra un libro específico rápidamente por su título.
                </p>
              ) : resultadosBusqueda.length === 0 ? (
                <p className="text-center text-muted small mt-4">
                  No hay libros que coincidan con "{busqueda}".
                </p>
              ) : (
                resultadosBusqueda.map((libro) => (
                  <Link
                    key={libro._id}
                    to={`/libro/${libro._id}`}
                    className={styles.itemResultado}
                  >
                    <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                      {libro.titulo}
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {libro.autor}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            COLUMNA DERECHA: Escaparate y Píldoras
            ========================================= */}
        <div className="col-md-9">
          <div className={`shadow-sm p-4 mb-4 ${styles.tarjetaNube}`}>
            <p className="text-muted text-center mb-4">
              Busca por categorias
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-2">
              {listaCategorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategoria(cat)}
                  className={`btn rounded-pill px-4 py-2 shadow-sm ${styles.botonPildora} ${
                    seleccionadas.includes(cat)
                      ? "btn-dark fw-bold animate__animated animate__pulse"
                      : "btn-outline-secondary bg-white"
                  }`}
                >
                  {seleccionadas.includes(cat) && "✓ "} {cat}
                </button>
              ))}
            </div>
          </div>

          <h4 className="mb-4 border-bottom pb-2">
            {seleccionadas.length === 0
              ? `Catálogo General:`
              : `Resultados Encontrados: (${libros.length} libros)`}
          </h4>

          <div className="row g-4">
            {cargando ? (
              <p className="text-center w-100 mt-4">
                Organizando estantería...
              </p>
            ) : libros.length === 0 ? (
              <div className={`text-center text-muted w-100 mt-5`}>
                <h1 style={{ fontSize: "4rem" }}>🧭</h1>
                <p className="mt-3">
                  No tenemos libros que coincidan con esta selección exacta.
                </p>
              </div>
            ) : (
              libros.map((libro) => (
                <div
                  key={libro._id}
                  className="col-md-4 col-lg-3 animate__animated animate__zoomIn"
                >
                  <div
                    className={`card h-100 shadow-sm border-0 rounded-4 overflow-hidden`}
                    style={{ transition: "transform 0.2s ease" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.02)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <img
                      src={libro.portada_url}
                      className="card-img-top p-3"
                      style={{ height: "220px", objectFit: "contain" }}
                      alt={libro.titulo}
                    />
                    <div className="card-body text-center d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="fw-bold mb-1">{libro.titulo}</h6>
                        <p className="text-muted small mb-2">{libro.autor}</p>

                        <div className="mb-2">
                          {libro.categorias &&
                            libro.categorias.slice(0, 2).map((c, i) => (
                              <span
                                key={i}
                                className="badge bg-light text-dark border me-1 mb-1"
                              >
                                {c}
                              </span>
                            ))}
                        </div>
                      </div>

                      <Link
                        to={`/libro/${libro._id}`}
                        className="btn btn-outline-dark btn-sm rounded-pill mt-2 w-100"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categorias;
