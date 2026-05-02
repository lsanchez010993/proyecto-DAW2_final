import { useEditarLibro } from "./useEditarLibro";
import ModalConfirmacion from "../../components/ModalConfirmacion.jsx";

function EditarLibroPage() {
    const { formData, imageToShow, handleChange, handleFileChange, handleSubmit, modalConfig, cerrarModal, confirmarModal } = useEditarLibro(); 
    
    return (
    <div className="container mt-5 mb-5">
    <form onSubmit={handleSubmit}>
      <div className="row">
        
       
           {/*  COLUMNA IZQUIERDA: PORTADA */}
     
        <div className="col-md-5 mb-4">
          <h4 className="mb-3 fw-bold">Portada libro</h4>
          
          {/* Contenedor gris de la imagen con position-relative para el botón */}
          <div 
            className="bg-light rounded-4 border position-relative d-flex align-items-center justify-content-center" 
            style={{ height: "450px", overflow: "hidden" }}
          >
            {imageToShow ? (
              <img 
                src={imageToShow} 
                alt="Portada" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
            ) : (
              <span className="text-muted">Sin imagen de portada</span>
            )}

            {/* Input de archivo oculto */}
            <input
              type="file"
              id="portadaInput"
              className="d-none"
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {/* Botón flotante */}
            <button
              type="button"
              className="btn btn-secondary rounded-pill position-absolute px-4 shadow-sm"
              style={{ bottom: "20px", right: "20px", backgroundColor: "#ced4da", color: "#333", border: "none" }}
              onClick={() => document.getElementById("portadaInput").click()}
            >
              Cargar imagen
            </button>
          </div>
        </div>

        {/* // COLUMNA DERECHA: DATOS DEL LIBRO */}
        <div className="col-md-7">
          {/* Cabecera derecha: Título y Dropdown */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold m-0 text-truncate" style={{ maxWidth: "70%" }}>
              {formData.titulo || "Título del libro"}
            </h2>
          </div>
          <h4 className="mb-3 fw-bold">Datos libro</h4>

          {/* Contenedor gris con los campos editables */}
          <div className="bg-light p-4 rounded-4 border">
            
            <div className="mb-3">
              <label className="form-label text-muted small">Título</label>
              <input type="text" name="titulo" className="form-control border-0 shadow-sm" value={formData.titulo} onChange={handleChange} required />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small">Autor</label>
                <input type="text" name="autor" className="form-control border-0 shadow-sm" value={formData.autor} onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label text-muted small">ISBN</label>
                <input type="text" name="isbn" className="form-control border-0 shadow-sm" value={formData.isbn} onChange={handleChange} required />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted small">Físico (€)</label>
                <input type="number" step="0.01" name="precio_fisico" className="form-control border-0 shadow-sm" value={formData.precio_fisico} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted small">Digital (€)</label>
                <input type="number" step="0.01" name="precio_digital" className="form-control border-0 shadow-sm" value={formData.precio_digital} onChange={handleChange} required />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label text-muted small">Stock</label>
                <input type="number" name="stock" className="form-control border-0 shadow-sm" value={formData.stock} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-muted small">Sinopsis</label>
              <textarea name="sinopsis" className="form-control border-0 shadow-sm" rows="4" value={formData.sinopsis} onChange={handleChange}></textarea>
            </div>

            {/* Botón de guardar */}
            <div className="d-flex justify-content-end">
              <button 
                type="submit" 
                className="btn rounded-pill px-4 shadow-sm" 
                style={{ backgroundColor: "#ced4da", color: "#333", fontWeight: "bold" }}
              >
                Guardar libro
              </button>
            </div>

          </div>
        </div>
        
      </div>
    </form>
    <ModalConfirmacion 
        isOpen={modalConfig.isOpen}
        titulo={'Confirmar edición de libro'}
        mensaje={
          <>¿Estás seguro de que quieres guardar los cambios <strong className="text-dark">{formData.titulo}</strong>? Esta acción no se puede deshacer.</>
        }
        textoConfirmar={'Sí, guardar cambios'}
        isDanger={false}
        onConfirm={confirmarModal}
        onCancel={cerrarModal}
      />
  </div>

);
}   
export default EditarLibroPage;
