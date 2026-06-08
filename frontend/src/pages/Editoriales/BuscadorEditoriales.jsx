import styles from "./Editoriales.module.css";
import { APP_MESSAGES } from "../../constants/messages";

export default function BuscadorEditoriales({
  busqueda,
  setBusqueda,
  editorialesFiltradas,
  seleccionadas,
  setSeleccionadas,
}) {
  const M = APP_MESSAGES.PAGES.EDITORIALES;
  return (
    <div className={`shadow-sm ${styles.panelLateral}`}>
      <h5 className="fw-bold mb-3">{M.BUSCADOR_TITULO}</h5>
      <form role="search" className="mb-3" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="buscador-editoriales" className="visually-hidden">
          {M.BUSCADOR_PLACEHOLDER}
        </label>
        <input
          id="buscador-editoriales"
          type="search"
          className="form-control rounded-pill bg-white"
          placeholder={M.BUSCADOR_PLACEHOLDER}
          aria-label={M.BUSCADOR_PLACEHOLDER}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </form>
      <div className={styles.listaResultados}>
        {busqueda === "" ? (
          <p className="text-center text-muted small mt-4">{M.BUSCADOR_HINT}</p>
        ) : editorialesFiltradas.length === 0 ? (
          <p className="text-center text-muted small mt-4">
            {`${M.BUSCADOR_SIN_COINCIDENCIAS_PREFIJO}${busqueda}${M.BUSCADOR_SIN_COINCIDENCIAS_SUFIX}`}
          </p>
        ) : (
          editorialesFiltradas.map((editorial, index) => (
            <div
              key={index}
              onClick={() => {
                if (!seleccionadas.includes(editorial)) {
                  setSeleccionadas([...seleccionadas, editorial]);
                }
                setBusqueda("");
              }}
              className={styles.itemResultado}
              style={{ cursor: "pointer" }}
            >
              <div className="fw-bold" style={{ fontSize: "0.9rem" }}>
                {editorial}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
