import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAdminLibrosEditorial } from "./useAdminLibrosEditorial";
import Paginacion from "../../components/Paginacion";
import TablaLibros from "../../features/libros/components/TablaLibros.jsx";
import CuadriculaLibros from "../../features/libros/components/CuadriculaLibros.jsx";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import { APP_MESSAGES } from "../../constants/messages";

function AdminLibrosEditorial() {
  const M = APP_MESSAGES.PAGES.ADMIN_LIBROS;
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
          <h2 className="fw-bold mb-1">{M.TITULO_EDITORIAL}</h2>
          <div className="text-muted small">
            {nombreEditorial ? `${M.EDITORIAL_LABEL} ${nombreEditorial}` : M.EDITORIAL_NO_CONFIGURADA}
          </div>
        </div>
        <Link to="/afegirLibro" className="btn btn-success fw-bold">
          {M.NUEVO_LIBRO}
        </Link>
      </div>

      <div className="text-end mb-2">
        <button
          className="btn btn-link text-primary p-0"
          onClick={() => setVistaListado(!vistaListado)}
        >
          {vistaListado ? M.VER_CUADRICULA : M.VER_LISTADO}
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
        titulo={modalConfig.tipo === "ELIMINAR" ? M.MODAL_ELIMINAR_TITULO : M.MODAL_CONFIRMACION_TITULO}
        mensaje={
          modalConfig.tipo === "ELIMINAR" ? (
            <>
              {`${M.MODAL_ELIMINAR_PREFIJO} `}
              <strong className="text-dark">{modalConfig.datos?.titulo}</strong>
              {M.MODAL_ELIMINAR_SUFIX}
            </>
          ) : (
            M.MODAL_CONFIRMACION_MENSAJE
          )
        }
        textoConfirmar={modalConfig.tipo === "ELIMINAR" ? M.MODAL_CONFIRMAR_ELIMINAR : M.MODAL_CONFIRMAR_DEFAULT}
        isDanger={modalConfig.tipo === "ELIMINAR"}
        onConfirm={confirmarModal}
        onCancel={cerrarModal}
      />
     
    </div>
  );
}

export default AdminLibrosEditorial;

