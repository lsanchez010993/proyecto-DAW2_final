import styles from "./EditarPerfil.module.css";

export default function DatosPersonalesForm({
  nombre,
  setNombre,
  apellidos,
  setApellidos,
  email,
  setEmail,
  setShowModal,
  opcionesPreferencias,
  preferencias,
  togglePreferencia
}) {
  return (
    <div className="animate__animated animate__fadeIn">
      <h4 className="mb-4 text-center">Información Personal</h4>
      <div className="mb-3">
        <label className="small text-muted">Nombre</label>
        <input 
          type="text" 
          className="form-control rounded-pill" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
        />
      </div>
      <div className="mb-3">
        <label className="small text-muted">Apellidos</label>
        <input 
          type="text" 
          className="form-control rounded-pill" 
          value={apellidos} 
          onChange={(e) => setApellidos(e.target.value)} 
        />
      </div>
      <div className="mb-4">
        <label className="small text-muted">Email</label>
        <input 
          type="email" 
          className="form-control rounded-pill" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      <div className="text-end mb-3">
        <button 
          type="button" 
          className="btn btn-link text-decoration-none p-0 small fw-bold text-primary" 
          onClick={() => setShowModal(true)}
        >
          Cambiar contraseña
        </button>
      </div>

      <hr />
      <h5 className="text-center my-3">Preferencias literarias</h5>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        {opcionesPreferencias.map((g) => (
          <button
            key={g} 
            type="button" 
            onClick={() => togglePreferencia(g)}
            className={`btn btn-sm rounded-pill ${styles.preferenciaBtn} ${
              preferencias.includes(g) ? "btn-primary" : "btn-outline-secondary"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
}
