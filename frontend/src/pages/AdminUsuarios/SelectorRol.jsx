export default function SelectorRol({
  user,
  editandoEditorialId,
  setEditandoEditorialId,
  nombreEditorialTemp,
  setNombreEditorialTemp,
  handleSeleccionRol,
  guardarEditorial,
}) {
  if (user.rol === "admin") {
    return (
      <div
        className="form-control form-control-sm fw-bold border-warning text-warning bg-light shadow-sm d-flex align-items-center"
        style={{ cursor: "not-allowed", height: "31px" }}
      >
        Admin
      </div>
    );
  }

  return (
    <>
      <select
        className={`form-select form-select-sm fw-bold shadow-sm ${
          editandoEditorialId === user._id || user.rol === "editorial"
            ? "border-info text-info"
            : "border-secondary text-secondary"
        }`}
        value={editandoEditorialId === user._id ? "editorial" : user.rol}
        onChange={(e) => handleSeleccionRol(user, e.target.value)}
      >
        <option value="cliente">Usuario</option>
        <option value="editorial">Editor</option>
        <option value="admin">Admin</option>
      </select>

      {/* CAJÓN AUTOEDITABLE PARA LA EDITORIAL */}
      {editandoEditorialId === user._id && (
        <div className="mt-2 animate__animated animate__fadeIn">
          <div className="input-group input-group-sm shadow-sm rounded">
            <input
              type="text"
              className="form-control border-info"
              placeholder="Nombre de la editorial..."
              value={nombreEditorialTemp}
              onChange={(e) => setNombreEditorialTemp(e.target.value)}
              autoFocus
            />
            <button className="btn btn-info text-white fw-bold px-3" onClick={() => guardarEditorial(user._id)}>
              ✓
            </button>
            <button className="btn btn-outline-danger px-3 fw-bold" onClick={() => setEditandoEditorialId(null)}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Etiqueta visual de la editorial */}
      {user.rol === "editorial" && editandoEditorialId !== user._id && user.nombre_editorial && (
        <div className="mt-2 d-flex justify-content-end animate__animated animate__fadeIn">
          <span
            className="badge bg-info text-dark rounded-pill shadow-sm d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditandoEditorialId(user._id);
              setNombreEditorialTemp(user.nombre_editorial);
            }}
          >
            <span className="me-2">{user.nombre_editorial}</span>
            <span style={{ fontSize: "0.85rem" }}>✏️</span>
          </span>
        </div>
      )}
    </>
  );
}
