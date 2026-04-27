import { useAdminUsuarios } from "./useAdminUsuarios";
import SelectorRol from "./SelectorRol";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";

function AdminUsuarios() {
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
      <h2 className="mb-4">Gestión de Usuarios</h2>
      
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0 bg-white">
          <thead className="bg-light">
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol (Permisos)</th>
              <th>Historial</th>
              <th>Acciones</th>
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
                      <p className="text-muted mb-0 small">ID: {user._id.slice(-4)}</p>
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
                        Ver
                    </button>
                </td>

              {/* Columna Eliminar */}
                <td>
                  {user.rol !== 'admin' && (
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => confirmarEliminacionUsuario(user)}
                      title="Eliminar usuario"
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
        titulo={modalConfig.tipo === 'ELIMINAR' ? 'Confirmar eliminación' : 'Confirmar cambio de rol'}
        mensaje={
          modalConfig.tipo === 'ELIMINAR' 
            ? <>¿Estás seguro de que quieres eliminar al usuario <strong className="text-dark">{modalConfig.datos?.user?.nombre}</strong>? Esta acción no se puede deshacer.</>
            : <>¿Estás seguro de cambiar el rol de <strong className="text-dark">{modalConfig.datos?.user?.nombre}</strong>?<br/><span className="text-muted fs-6 mt-2 d-inline-block">El nuevo rol será: <span className="badge bg-info text-dark">{modalConfig.datos?.nuevoRol}</span></span></>
        }
        textoConfirmar={modalConfig.tipo === 'ELIMINAR' ? 'Sí, eliminar' : 'Sí, cambiar rol'}
        isDanger={modalConfig.tipo === 'ELIMINAR'}
        onConfirm={confirmarModal}
        onCancel={cerrarModal}
      />

    </div>
  );
}

export default AdminUsuarios;