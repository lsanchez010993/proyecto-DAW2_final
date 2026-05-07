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
    <div className="animate__animated animate__fadeIn">
      
      {esEditorial && (
        <div className="mb-3">
          <label className="big text-muted fw-bold">
            {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.EDITORIAL_LABEL} {editorial}
          </label>
        </div>
      )}

      <div className="mb-4">
        <div className="text-center">
          <label className="small fw-bold">
            {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.FOTO_PERFIL_LABEL}
          </label>
        </div>

        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          className="d-none"
          onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)}
        />

        {previewUrl ? (
          <>
            <div className="d-flex justify-content-center my-2">
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
              <div className="fw-semibold">
                {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.DROPZONE_TITULO}
              </div>
              <div className="small text-muted">
                {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.DROPZONE_SUBTITULO}
              </div>
            </label>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.NOMBRE_LABEL}
        </label>
        <input
          type="text"
          className="form-control rounded-pill"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.APELLIDOS_LABEL}
        </label>
        <input
          type="text"
          className="form-control rounded-pill"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.EMAIL_LABEL}
        </label>
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
          {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.CAMBIAR_CONTRASENA}
        </button>
      </div>

      <hr />
      <h5 className="text-center my-3">
        {APP_MESSAGES.EDITAR_PERFIL.DATOS_PERSONALES.PREFERENCIAS_TITULO}
      </h5>
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
