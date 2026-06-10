import { useEffect, useState } from "react";
import { APP_MESSAGES } from "../../constants/messages";
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
  togglePreferencia,
  esEditorial,
  editorial,
  setFotoPerfil,
  fotoPerfil,
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!fotoPerfil) {
      setPreviewUrl("");
      return;
    }

    if (typeof fotoPerfil === "string") {
      setPreviewUrl(fotoPerfil);
      return;
    }

    const isFile = typeof File !== "undefined" && fotoPerfil instanceof File;
    if (!isFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(fotoPerfil);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [fotoPerfil]);

  return (
    <section className="animate__animated animate__fadeIn" aria-label="Formulario de datos personales">
      
      {esEditorial && (
        <div className="mb-3">
          <span className="h6 text-muted fw-bold d-block">
            {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.EDITORIAL_LABEL} {editorial}
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className="text-center">
          <label htmlFor="avatarInput" className="small fw-bold">
            {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.FOTO_PERFIL_LABEL}
          </label>
        </div>

        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          className="visually-hidden"
          onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)}
        />

        {previewUrl ? (
          <>
            <div className="d-flex justify-content-center my-2" aria-hidden="true">
              <img
                src={previewUrl}
                alt={APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.FOTO_PERFIL_ALT}
                style={{
                  width: 210,
                  height: 210,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid rgba(0,0,0,0.15)",
                }}
              />
            </div>
            <div className="d-flex justify-content-center">
              <label
                htmlFor="avatarInput"
                className="btn btn-outline-secondary btn-sm rounded-pill"
                style={{ cursor: "pointer" }}
              >
                {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.CAMBIAR_FOTO}
              </label>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center my-2">
            <label
              htmlFor="avatarInput"
              className="w-50 text-center p-3 rounded-3 border border-1 border-secondary-subtle bg-light"
              style={{ maxWidth: 520, cursor: "pointer" }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) setFotoPerfil(file);
              }}
            >
              <span className="fw-semibold d-block">
                {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.DROPZONE_TITULO}
              </span>
              <span className="small text-muted d-block">
                {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.DROPZONE_SUBTITULO}
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="perfil-nombre" className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.NOMBRE_LABEL}
        </label>
        <input
          id="perfil-nombre"
          type="text"
          className="form-control rounded-pill"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="given-name"
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor="perfil-apellidos" className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.APELLIDOS_LABEL}
        </label>
        <input
          id="perfil-apellidos"
          type="text"
          className="form-control rounded-pill"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          autoComplete="family-name"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="perfil-email" className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.EMAIL_LABEL}
        </label>
        <input
          id="perfil-email"
          type="email"
          className="form-control rounded-pill"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="text-end mb-3">
        <button
          type="button"
          className="btn btn-link text-decoration-none p-0 small fw-bold text-primary"
          onClick={() => setShowModal(true)}
        >
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.CAMBIAR_CONTRASENA}
        </button>
      </div>

      <hr aria-hidden="true" />
      
      <fieldset className="mt-4">
        <legend className="h5 text-center my-3 w-100 float-none">
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.PREFERENCIAS_TITULO}
        </legend>
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {opcionesPreferencias.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => togglePreferencia(g)}
              aria-pressed={preferencias.includes(g)}
              className={`btn btn-sm rounded-pill ${styles.preferenciaBtn} ${
                preferencias.includes(g) ? "btn-primary" : "btn-outline-secondary"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}