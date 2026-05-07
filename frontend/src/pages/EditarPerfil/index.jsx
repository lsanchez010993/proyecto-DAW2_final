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
        <div className={`card shadow-sm border-0 ${styles.tarjetaPerfil}`}>
          <div className="card-header bg-white border-0 pt-4 pb-0">
            <h2 className="display-6 text-center mb-4 fw-bold">
              {APP_MESSAGES.EDITAR_PERFIL.VISTA.TITULO}
            </h2>

            <div className={styles.contenedorPestanas}>
              <ul className="nav nav-pills nav-fill border-0">
                <li className="nav-item">
                  <button
                    className={`nav-link ${styles.botonPestana} ${
                      pestañaActiva === "datos" ? styles.pestanaActiva : styles.pestanaInactiva
                    }`}
                    onClick={() => setPestañaActiva("datos")}
                  >
                    {APP_MESSAGES.EDITAR_PERFIL.VISTA.TAB_DATOS}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${styles.botonPestana} ${
                      pestañaActiva === "envio" ? styles.pestanaActiva : styles.pestanaInactiva
                    }`}
                    onClick={() => setPestañaActiva("envio")}
                  >
                    {APP_MESSAGES.EDITAR_PERFIL.VISTA.TAB_ENVIO}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
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
        </div>
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
