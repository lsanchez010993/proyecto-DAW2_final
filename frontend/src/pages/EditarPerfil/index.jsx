import { useEditarPerfil } from "./useEditarPerfil";
import { APP_MESSAGES } from "../../constants/messages";
import styles from "./EditarPerfil.module.css";
import DatosPersonalesForm from "./DatosPersonalesForm";
import DireccionForm from "./DireccionForm";
import PasswordModal from "./PasswordModal";

export default function EditarPerfil() {
  const {
    fotoPerfil,
    setFotoPerfil,
    esEditorial,
    editorial,
    pestañaActiva,
    setPestañaActiva,
    nombre,
    setNombre,
    apellidos,
    setApellidos,
    email,
    setEmail,
    preferencias,
    direccion,
    showModal,
    setShowModal,
    passData,
    opcionesPreferencias,
    togglePreferencia,
    handleDireccionChange,
    handlePassChange,
    handleSubmit,
    submitPassword
  } = useEditarPerfil();

  return (
    <>
      <div className="container mt-5 mb-5 d-flex justify-content-center">
        <section className={`card shadow-sm border-0 ${styles.tarjetaPerfil}`} aria-labelledby="titulo-perfil">
          <header className="card-header bg-white border-0 pt-4 pb-0">
            <h1 id="titulo-perfil" className="display-6 text-center mb-4 fw-bold">
              {APP_MESSAGES.EDITAR_PERFIL.VISTA.TITULO}
            </h1>

            <nav
              className={styles.contenedorPestanas}
              aria-label="Secciones del perfil"
            >
              <ul className="nav nav-pills nav-fill border-0">
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${styles.botonPestana} ${
                      pestañaActiva === "datos" ? styles.pestanaActiva : styles.pestanaInactiva
                    }`}
                    onClick={() => setPestañaActiva("datos")}
                    aria-current={pestañaActiva === "datos" ? "page" : undefined}
                  >
                    {APP_MESSAGES.EDITAR_PERFIL.VISTA.TAB_DATOS}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className={`nav-link ${styles.botonPestana} ${
                      pestañaActiva === "envio" ? styles.pestanaActiva : styles.pestanaInactiva
                    }`}
                    onClick={() => setPestañaActiva("envio")}
                    aria-current={pestañaActiva === "envio" ? "page" : undefined}
                  >
                    {APP_MESSAGES.EDITAR_PERFIL.VISTA.TAB_ENVIO}
                  </button>
                </li>
              </ul>
            </nav>
          </header>

          <div className="card-body p-4" aria-live="polite">
            <form onSubmit={handleSubmit} noValidate>
              {pestañaActiva === "datos" && (
                <DatosPersonalesForm 
                  esEditorial={esEditorial}
                  editorial={editorial}
                  fotoPerfil={fotoPerfil}
                  setFotoPerfil={setFotoPerfil}
                  nombre={nombre}
                  setNombre={setNombre}
                  apellidos={apellidos}
                  setApellidos={setApellidos}
                  email={email}
                  setEmail={setEmail}
                  setShowModal={setShowModal}
                  opcionesPreferencias={opcionesPreferencias}
                  preferencias={preferencias}
                  togglePreferencia={togglePreferencia}
                />
              )}

              {pestañaActiva === "envio" && (
                <DireccionForm 
                  direccion={direccion}
                  handleDireccionChange={handleDireccionChange}
                />
              )}

              <div className="d-grid mt-5">
                <button type="submit" className="btn btn-dark rounded-pill py-2 fw-bold shadow">
                  {APP_MESSAGES.EDITAR_PERFIL.VISTA.GUARDAR_CAMBIOS}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <PasswordModal 
        showModal={showModal}
        setShowModal={setShowModal}
        submitPassword={submitPassword}
        passData={passData}
        handlePassChange={handlePassChange}
      />
    </>
  );
}