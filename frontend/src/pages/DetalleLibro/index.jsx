import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDetalleLibro } from "./useDetalleLibro";
import OpcionesCompra from "./OpcionesCompra";
import SeccionRelacionados from "./SeccionRelacionados";
import ContenidoGratuito from "./ContenidoGratuito";

function DetalleLibro() {
  const { id } = useParams();
  const { libro, cargando, enDeseos, toggleDeseos, registrarInteraccion, registrarDescarga, librosRelacionados, tituloSeccion } = useDetalleLibro(id);
  const [mostrarModal, setMostrarModal] = useState(false);

  if (cargando || !libro) return <div className="text-center mt-5">Cargando libro...</div>;

  return (
    <div className="container mt-5 mb-5">
      <Link to="/" className="btn btn-outline-secondary mb-3">← Volver al catálogo</Link>

      <div className="row">
        <div className="col-md-4">
          <img src={libro.portada_url} alt={libro.titulo} className="img-fluid rounded shadow" />
        </div>
        <div className="col-md-8">
          <h1>{libro.titulo}</h1>
          <h3 className="text-muted">{libro.autor}</h3>
          <hr />
          <p className="lead">{libro.sinopsis}</p>
          <p className="mb-3 text-secondary"><span className="fw-bold">Editorial:</span> {libro.editorial}</p>

          {/* Etiquetas de categorías */}
          <div className="mb-4 d-flex flex-wrap gap-2">
            {libro.categorias?.map(cat => <span key={cat} className="badge bg-dark rounded-pill px-3 py-2">{cat}</span>)}
          </div>

          <OpcionesCompra 
            libro={libro} 
            enDeseos={enDeseos} 
            onToggleDeseos={toggleDeseos} 
            onInteraccion={registrarInteraccion} 
          />
        </div>
      </div>

      <SeccionRelacionados 
        tituloSeccion={tituloSeccion} 
        libros={librosRelacionados} 
        onAbrirModal={() => setMostrarModal(true)} 
      />

      {mostrarModal && (
        <ContenidoGratuito 
          categoria={libro.categorias?.[0]} 
          onClose={() => setMostrarModal(false)} 
          onDescarga={(libroGuten) => {
            registrarInteraccion("descarga_gratuita");
            registrarDescarga(libroGuten?.titulo, libro.categorias?.[0]);
          }}
        />
      )}
    </div>
  );
}

export default DetalleLibro;