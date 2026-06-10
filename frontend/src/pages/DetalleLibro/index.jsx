import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDetalleLibro } from "./useDetalleLibro";
import OpcionesCompra from "./OpcionesCompra";
import SeccionRelacionados from "./SeccionRelacionados";
import ContenidoGratuito from "./ContenidoGratuito";
import SeccionResenas from "./SeccionResenas";
import { APP_MESSAGES } from "../../constants/messages";

function DetalleLibro() {
  const M = APP_MESSAGES.PAGES.DETALLE_LIBRO;
  const { id } = useParams();
  const {
    libro,
    cargando,
    enDeseos,
    toggleDeseos,
    registrarInteraccion,
    registrarDescarga,
    librosRelacionados,
    tituloSeccion,
    resenas,
    resumenResenas,
    permisoResena,
    guardandoResena,
    guardarResena,
  } = useDetalleLibro(id);
  const [mostrarModal, setMostrarModal] = useState(false);

  if (cargando || !libro) return <div className="text-center mt-5">{M.CARGANDO}</div>;

  return (
      <article className="container mt-5 mb-5">
      <Link to="/" className="btn btn-outline-secondary mb-3">{M.VOLVER_CATALOGO}</Link>  
      <header className="row">
        <div className="col-md-4 mb-4 mb-md-0">
          <img 
            src={libro.portada_url} 
            alt={`Portada del libro: ${libro.titulo}`} 
            className="img-fluid rounded shadow" 
          />
        </div>
        <div className="col-md-8">
      
          <h1 className="fw-bold">{libro.titulo}</h1>
          
       
          <h2 className="h3 text-muted fw-normal">{libro.autor}</h2>
          <hr />
          
          <p className="lead">{libro.sinopsis}</p>
          <p className="mb-3 text-secondary">
            <span className="fw-bold">{M.EDITORIAL_LABEL}</span> {libro.editorial}
          </p>

          {/* Etiquetas de categorías */}
          <div className="mb-4 d-flex flex-wrap gap-2" aria-label="Categorías del libro">
            {libro.categorias?.map(cat => (
              <span key={cat} className="badge bg-dark rounded-pill px-3 py-2">
                {cat}
              </span>
            ))}
          </div>

          <OpcionesCompra 
            libro={libro} 
            enDeseos={enDeseos} 
            onToggleDeseos={toggleDeseos} 
            onInteraccion={registrarInteraccion} 
          />
        </div>
      </header>

      {/* =========================================================
          SECCIÓN: Libros Relacionados 
          ========================================================= */}
      <section className="mt-5" aria-label="Libros relacionados">
        <SeccionRelacionados 
          tituloSeccion={tituloSeccion} 
          libros={librosRelacionados} 
          onAbrirModal={() => setMostrarModal(true)} 
        />
      </section>

      {/* Modal interactivo de descargas (Se abre en un portal o condicional) */}
      {mostrarModal && (
        <div role="dialog" aria-modal="true">
          <ContenidoGratuito 
            categoria={libro.categorias?.[0]} 
            onClose={() => setMostrarModal(false)} 
            onDescarga={(libroGuten) => {
              registrarInteraccion("descarga_gratuita");
              registrarDescarga(libroGuten?.titulo, libro.categorias?.[0]);
            }}
          />
        </div>
      )}

      {/* =========================================================
          SECCIÓN: Reseñas y Comentarios del producto
          ========================================================= */}
      <section className="mt-5" aria-label="Opiniones de los lectores">
        <SeccionResenas
          key={`${id}-${permisoResena?.review?._id || "sin-resena"}-${permisoResena?.review?.updatedAt || ""}`}
          resenas={resenas}
          resumenResenas={resumenResenas}
          permisoResena={permisoResena}
          guardandoResena={guardandoResena}
          onGuardarResena={guardarResena}
        />
      </section>
    </article>
  );
}

export default DetalleLibro;