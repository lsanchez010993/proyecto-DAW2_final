import styles from "./AfegirLibro.module.css";
import { useAfegirLibro } from "./useAfegirLibro";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";
import { APP_MESSAGES } from "../../constants/messages";


function AfegirLibroPage() {
  const M = APP_MESSAGES.PAGES.AFEGIR_LIBRO;
  const { loading, formData, setFile, preview, setPreview, categoriasSeleccionadas, listaCategorias, handleChange, handleFileChange, toggleCategoria, handleSubmit, esEditor, esAdmin, editoriales, modalConfig, cerrarModal, confirmarModal } = useAfegirLibro();

  return (
    <div className="container mt-5">
      <div className={`card shadow p-4 ${styles.tarjetaCrear}`}>
        <h2 className="text-center mb-4 fw-bold">{M.TITULO}</h2>
        <form onSubmit={handleSubmit}>
          {preview && (
            <div className="text-center mb-4 animate__animated animate__zoomIn">
              <p className="small text-muted mb-2">
                {M.PREVIEW_LABEL}
              </p>
              <img
                src={preview}
                alt={M.PREVIEW_ALT}
                className={styles.imagenPreview}
              />
              <div className="mt-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-pill"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                >
                  {M.QUITAR_IMAGEN}
                </button>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="small text-muted mb-1">{M.LABEL_TITULO}</label>
            <input
              type="text"
              name="titulo"
              className={`form-control ${styles.inputRedondeado}`}
              required
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">{M.LABEL_ISBN}</label>
              <input
                type="text"
                name="isbn"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">{M.LABEL_AUTOR}</label>
              <input
                type="text"
                name="autor"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Si el usuario es editorial, se muestra el campo de editorial */}
          {esEditor && (
          <div className="mb-3">
            <label className="small text-muted mb-1">{M.LABEL_EDITORIAL}</label>
            <input
              type="text"
              name="editorial"
              className={`form-control ${styles.inputRedondeado} bg-light`}
              value={formData.editorial}
              readOnly // Evita que lo modifiquen
              placeholder={M.PLACEHOLDER_EDITORIAL}
            />
            <small className="text-muted ms-2" style={{ fontSize: "0.75rem" }}>
              {M.AYUDA_EDITORIAL}
            </small>
          </div>
          )}
          {/* Si el usuario es admin, se muestra el campo de editorial */}
          {esAdmin && (
            <div className="mb-3">
              <label className="small text-muted mb-1">{M.LABEL_EDITORIAL}</label>
              <select
                name="editorial"
                className={`form-control ${styles.inputRedondeado}`}
                value={formData.editorial}
                onChange={handleChange}
                required
              >
                {editoriales.map((editorial) => (
                  <option key={editorial} value={editorial}>{editorial}</option>
                ))}
              </select>
            </div>
          )}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">{M.LABEL_PRECIO_FISICO}</label>
              <input
                type="number"
                step="0.01"
                name="precio_fisico"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="small text-muted mb-1">
                {M.LABEL_PRECIO_DIGITAL}
              </label>
              <input
                type="number"
                step="0.01"
                name="precio_digital"
                className={`form-control ${styles.inputRedondeado}`}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/*Interfaz visual de categorías */}
          <div className="mb-4">
            <label className="small text-muted mb-2 d-block">
              {M.LABEL_CATEGORIAS}
            </label>
            <div className="d-flex flex-wrap gap-2">
              {listaCategorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategoria(cat)}
                  className={`btn btn-sm rounded-pill ${styles.categoriaBtn} ${
                    categoriasSeleccionadas.includes(cat)
                      ? "btn-dark"
                      : "btn-outline-secondary"
                  }`}
                >
                  {categoriasSeleccionadas.includes(cat) && "✓ "} {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="small text-muted mb-1">{M.LABEL_PORTADA}</label>
            <input
              type="file"
              className={`form-control ${styles.inputRedondeado}`}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-4">
            <label className="small text-muted mb-1">{M.LABEL_SINOPSIS}</label>
            <textarea
              name="sinopsis"
              className={`form-control ${styles.areaTexto}`}
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 rounded-pill fw-bold py-2 shadow"
            disabled={loading}
          >
            {loading ? M.GUARDANDO : M.GUARDAR_LIBRO}
          </button>
        </form>
        <ModalConfirmacion 
        isOpen={modalConfig.isOpen}
        titulo={M.MODAL_TITULO}
        mensaje={
          <>{`${M.MODAL_MENSAJE_PREFIJO} `}<strong className="text-dark">{formData.titulo}</strong>{M.MODAL_MENSAJE_SUFIX}</>
        }
        textoConfirmar={M.MODAL_CONFIRMAR}
        isDanger={false}
        onConfirm={confirmarModal}
        onCancel={cerrarModal}
      />
      </div>
    </div>
  );
}


export default AfegirLibroPage;