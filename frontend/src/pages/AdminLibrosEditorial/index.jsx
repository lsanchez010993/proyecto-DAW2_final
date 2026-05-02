import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdminLibrosEditorial } from "./useAdminLibrosEditorial";
import Paginacion from "../../components/Paginacion";
import TablaLibros from "../../features/libros/components/TablaLibros.jsx";
import CuadriculaLibros from "../../features/libros/components/CuadriculaLibros.jsx";
import ModalConfirmacion from "../../components/ModalConfirmacion";

function AdminLibrosEditorial() {
  const { usuario } = useAuth();
  const {
    modalConfig,
    confirmarModal,
    cerrarModal,
    nombreEditorial,
    libros,
    vistaListado,
    setVistaListado,
    pagina,
    setPagina,
    totalPaginas,
    handleDelete,
  } = useAdminLibrosEditorial(usuario);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Mi catálogo</h2>
          <div className="text-muted small">
            {nombreEditorial ? `Editorial: ${nombreEditorial}` : "Editorial no configurada"}
          </div>
        </div>
        <Link to="/afegirLibro" className="btn btn-success fw-bold">
          + Nuevo Libro
        </Link>
      </div>

      <div className="text-end mb-2">
        <button
          className="btn btn-link text-primary p-0"
          onClick={() => setVistaListado(!vistaListado)}
        >
          {vistaListado ? "Ver cuadrícula" : "Ver listado"}
        </button>
      </div>

      <div
        className="p-4 rounded shadow-sm"
        style={{ backgroundColor: "#e0e0e0", minHeight: "400px" }}
      >
        {vistaListado ? (
          <TablaLibros libros={libros} onDelete={handleDelete} />
        ) : (
          <CuadriculaLibros libros={libros} onDelete={handleDelete} />
        )}
      </div>

      <Paginacion
        pagina={pagina}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPagina}
      />
      <ModalConfirmacion
        isOpen={modalConfig.isOpen}
        titulo={modalConfig.tipo === "ELIMINAR" ? "Eliminar libro" : "Confirmación"}
        mensaje={
          modalConfig.tipo === "ELIMINAR" ? (
            <>
              ¿Estás seguro de que quieres eliminar el libro{" "}
              <strong className="text-dark">{modalConfig.datos?.titulo}</strong>? Esta acción no se puede deshacer.
            </>
          ) : (
            "Confirmar eliminación"
          )
        }
        textoConfirmar={modalConfig.tipo === "ELIMINAR" ? "Eliminar" : "Confirmar"}
        isDanger={modalConfig.tipo === "ELIMINAR"}
        onConfirm={confirmarModal}
        onCancel={cerrarModal}
      />
     
    </div>
  );
}

export default AdminLibrosEditorial;

