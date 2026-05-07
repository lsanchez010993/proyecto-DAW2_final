import { Link } from "react-router-dom";
import { useAdminLibrosAdministrador } from "./useAdminLibrosAdministrador";
import PestanasAdmin from "./PestanasAdmin";
import TablaLibros from "../../features/libros/components/TablaLibros.jsx";
import CuadriculaLibros from "../../features/libros/components/CuadriculaLibros.jsx";
import Paginacion from "../../components/Paginacion";
import LibrosGratuitosTab from "./LibrosGratuitosTab";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import { APP_MESSAGES } from "../../constants/messages";

function AdminLibrosAdministrador() {
  const M = APP_MESSAGES.PAGES.ADMIN_LIBROS;
  const {
    libros,
    pestañaActiva,
    setPestañaActiva,
    vistaListado,
    setVistaListado,
    pagina,
    setPagina,
    totalPaginas,
    librosGratuitos,
    cargandoGratuitos,
    sincronizando,
    handleDelete,
    modalConfig,
    confirmarModal,
    cerrarModal,
    handleSincronizarGutendex,
  } = useAdminLibrosAdministrador();

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">{M.TITULO_ADMIN}</h2>
        <Link to="/afegirLibro" className="btn btn-success fw-bold">
          {M.NUEVO_LIBRO}
        </Link>
      </div>

      <PestanasAdmin
        pestañaActiva={pestañaActiva}
        onCambiarPestaña={setPestañaActiva}
      />

      {pestañaActiva === "catalogo" ? (
        <>
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

export default AdminLibrosAdministrador;

