import { useAdminUsuarios } from "./useAdminUsuarios";
import SelectorRol from "./SelectorRol";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";
import { APP_MESSAGES } from "../../constants/messages";

function AdminUsuarios() {
  const M = APP_MESSAGES.PAGES.ADMIN_USUARIOS;
  const {
    usuarios,
    editandoEditorialId, setEditandoEditorialId,
    nombreEditorialTemp, setNombreEditorialTemp,
    handleSeleccionRol,
    guardarEditorial,
    confirmarEliminacionUsuario,
    verHistorial,
    modalConfig,
    confirmarModal,
    cerrarModal
  } = useAdminUsuarios();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{M.TITULO}</h2>
      
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>{M.COLUMNA_USUARIO}</th>
              <th>{M.COLUMNA_EMAIL}</th>
              <th>{M.COLUMNA_ROL}</th>
              <th>{M.COLUMNA_HISTORIAL}</th>
              <th>{M.COLUMNA_ACCIONES}</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user._id}>
                {/* Columna Usuario */}
                <td>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3" 
                         style={{width: '40px', height: '40px', fontSize: '1.2rem'}}>
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="fw-bold mb-1">{user.nombre}</p>
                      <p className="text-muted mb-0 small">{M.ID_PREFIX} {user._id.slice(-4)}</p>
                    </div>
                  </div>
                </td>
                
                {/* Columna Email */}
                <td>{user.email}</td>

                {/* --- COLUMNA ROL --- */}
                <td style={{ minWidth: "220px" }}>
                  <SelectorRol 
                    user={user}
                    editandoEditorialId={editandoEditorialId}
                    setEditandoEditorialId={setEditandoEditorialId}
                    nombreEditorialTemp={nombreEditorialTemp}
                    setNombreEditorialTemp={setNombreEditorialTemp}
                    handleSeleccionRol={handleSeleccionRol}
                    guardarEditorial={guardarEditorial}
                  />
                </td>

                {/* Columna Historial */}
                <td>
                    <button className="btn btn-sm btn-outline-info" onClick={() => verHistorial(user)}>
                        {M.BOTON_VER}
                    </button>
                </td>

              {/* Columna Eliminar */}
                <td>
                  {user.rol !== 'admin' && (
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => confirmarEliminacionUsuario(user)}
                      title={M.ELIMINAR_TITLE}
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalConfirmacion 
        isOpen={modalConfig.isOpen}
        titulo={modalConfig.tipo === 'ELIMINAR' ? M.MODAL_ELIMINAR_TITULO : M.MODAL_CAMBIO_ROL_TITULO}
        mensaje={
          modalConfig.tipo === 'ELIMINAR' 
            ? <>{`${M.MODAL_ELIMINAR_PREFIJO} `}<strong className="text-dark">{modalConfig.datos?.user?.nombre}</strong>{M.MODAL_ELIMINAR_SUFIX}</>
            : <>{`${M.MODAL_ROL_PREFIJO} `}<strong className="text-dark">{modalConfig.datos?.user?.nombre}</strong>{M.MODAL_ROL_SUFIX}<br/><span className="text-muted fs-6 mt-2 d-inline-block">{`${M.MODAL_ROL_MEDIO} `}<span className="badge bg-info text-dark">{modalConfig.datos?.nuevoRol}</span></span></>
        }
        textoConfirmar={modalConfig.tipo === 'ELIMINAR' ? M.MODAL_CONFIRMAR_ELIMINAR : M.MODAL_CONFIRMAR_ROL}
        isDanger={modalConfig.tipo === 'ELIMINAR'}
        onConfirm={confirmarModal}
        onCancel={cerrarModal}
      />

    </div>
  );
}

export default AdminUsuarios;