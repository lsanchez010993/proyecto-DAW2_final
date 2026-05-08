import { useState } from "react";
import { APP_MESSAGES } from "../../constants/messages";
import ValoracionEstrellas from "./ValoracionEstrellas";

function SeccionResenas({
  resenas,
  resumenResenas,
  permisoResena,
  guardandoResena,
  onGuardarResena,
}) {
  const M = APP_MESSAGES.PAGES.DETALLE_LIBRO;
  const [puntuacion, setPuntuacion] = useState(permisoResena?.review?.puntuacion || 0);
  const [resena, setResena] = useState(permisoResena?.review?.resena || "");
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  async function enviarResena(event) {
    event.preventDefault();
    const resultado = await onGuardarResena({
      puntuacion,
      resena,
    });

    if (resultado.ok) {
      setFeedback({ type: "success", message: resultado.message });
      return;
    }
    setFeedback({ type: "danger", message: resultado.message });
  }

  return (
    <section className="mt-5">
      <h4>{M.RESENAS_TITULO}</h4>
      <div className="d-flex align-items-center gap-2 mb-3">
        <ValoracionEstrellas valor={Math.round(resumenResenas.mediaPuntuacion)} />
        <span className="fw-semibold">
          {M.RESENAS_MEDIA}: {resumenResenas.mediaPuntuacion} / 5
        </span>
        <span className="text-secondary">
          ({resumenResenas.totalResenas} {M.RESENAS_TOTAL})
        </span>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          {resenas.length === 0 ? (
            <p className="text-secondary mb-0">{M.RESENAS_SIN_COMENTARIOS}</p>
          ) : (
            resenas.map((item) => (
              <article key={item._id} className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{item.usuario?.nombre || "Usuario"}</strong>
                  <small className="text-secondary">
                    {new Date(item.updatedAt || item.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <ValoracionEstrellas valor={item.puntuacion} />
                {item.resena ? <p className="mb-0 mt-2">{item.resena}</p> : null}
              </article>
            ))
          )}
        </div>
      </div>

      {permisoResena?.canReview ? (
        <div className="card">
          <div className="card-body">
            <h5>{M.RESENAS_FORM_TITULO}</h5>
            <form onSubmit={enviarResena}>
              <div className="mb-3">
                <label className="form-label">{M.RESENAS_LABEL_PUNTUACION}</label>
                <ValoracionEstrellas
                  valor={puntuacion}
                  editable
                  onChange={setPuntuacion}
                  sizeClass="fs-3"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="resena" className="form-label">
                  {M.RESENAS_LABEL_COMENTARIO}
                </label>
                <textarea
                  id="resena"
                  className="form-control"
                  rows="3"
                  placeholder={M.RESENAS_PLACEHOLDER}
                  value={resena}
                  onChange={(event) => setResena(event.target.value)}
                />
              </div>
              {feedback.message ? (
                <div className={`alert alert-${feedback.type} py-2`} role="alert">
                  {feedback.message}
                </div>
              ) : null}
              <button
                className="btn btn-success"
                type="submit"
                disabled={guardandoResena || puntuacion < 1}
              >
                {guardandoResena ? M.RESENAS_GUARDANDO : M.RESENAS_GUARDAR}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="text-secondary">{permisoResena?.message || M.RESENAS_COMPRA_REQUERIDA}</p>
      )}
    </section>
  );
}

export default SeccionResenas;
