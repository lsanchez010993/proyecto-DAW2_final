// frontend/src/components/Paginacion.jsx
export default function Paginacion({ pagina, totalPaginas, onCambiarPagina }) {
    return (
      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => onCambiarPagina(Math.max(1, pagina - 1))}
          disabled={pagina <= 1}
        >
          Anterior
        </button>
        <span className="small text-muted">Página {pagina} de {totalPaginas}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => onCambiarPagina(Math.min(totalPaginas, pagina + 1))}
          disabled={pagina >= totalPaginas}
        >
          Siguiente
        </button>
      </div>
    );
  }