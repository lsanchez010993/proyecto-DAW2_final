import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdminLibros } from "./useAdminLibros";
import PestanasAdmin from "./PestanasAdmin";
import TablaLibros from "./TablaLibros.jsx";
import CuadriculaLibros from "./CuadriculaLibros.jsx";
import Paginacion from "../../components/Paginacion";
import LibrosGratuitosTab from "./LibrosGratuitosTab";

function AdminLibros() {
  const { usuario } = useAuth();
  
  // Toda la lógica viene del Hook
  const {
    libros, pestañaActiva, setPestañaActiva, vistaListado, setVistaListado,
    pagina, setPagina, totalPaginas, librosGratuitos, cargandoGratuitos, 
    sincronizando, handleDelete, handleSincronizarGutendex
  } = useAdminLibros(usuario);

  return (
    <div className="container mt-5">
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          {usuario?.rol === "editorial" ? "Mi catálogo" : "Administrar libros"}
        </h2>
        <Link to="/crear-libro" className="btn btn-success fw-bold">+ Nuevo Libro</Link>
      </div>

      {/* Pestañas (solo si no es editorial) */}
      {usuario?.rol !== "editorial" && (
        <PestanasAdmin pestañaActiva={pestañaActiva} onCambiarPestaña={setPestañaActiva} />
      )}

      {/* Contenido según la pestaña */}
      {pestañaActiva === "catalogo" || usuario?.rol === "editorial" ? (
        <>
          <div className="text-end mb-2">
            <button className="btn btn-link text-primary p-0" onClick={() => setVistaListado(!vistaListado)}>
              {vistaListado ? "Ver cuadrícula" : "Ver listado"}
            </button>
          </div>

          <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#e0e0e0", minHeight: "400px" }}>
            {vistaListado ? (
              <TablaLibros libros={libros} onDelete={handleDelete} />
            ) : (
              <CuadriculaLibros libros={libros} onDelete={handleDelete} />
            )}
          </div>

          <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiarPagina={setPagina} />
        </>
      ) : (
        <div className="animate__animated animate__fadeIn">
          <LibrosGratuitosTab
            librosGratuitos={librosGratuitos}
            cargando={cargandoGratuitos}
            sincronizando={sincronizando}
            onSincronizar={handleSincronizarGutendex}
          />
        </div>
      )}
    </div>
  );
}

export default AdminLibros;