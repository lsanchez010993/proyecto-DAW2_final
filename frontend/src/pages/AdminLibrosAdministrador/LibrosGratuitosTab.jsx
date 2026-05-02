import React, { useMemo, useState } from "react";

const SORT_KEYS = {
  titulo: "titulo",
  autor: "autor",
  categoria: "categoria_tienda",
  idioma: "idioma",
};

function LibrosGratuitosTab({
  librosGratuitos,
  cargando,
  sincronizando,
  onSincronizar,
}) {
  const [sort, setSort] = useState({ key: SORT_KEYS.titulo, dir: "asc" });

  const sortedLibros = useMemo(() => {
    const key = sort.key;
    const dir = sort.dir === "desc" ? -1 : 1;

    return [...librosGratuitos].sort((a, b) => {
      const aVal = (a?.[key] ?? "").toString().toLowerCase();
      const bVal = (b?.[key] ?? "").toString().toLowerCase();
      return aVal.localeCompare(bVal, "es", { sensitivity: "base" }) * dir;
    });
  }, [librosGratuitos, sort]);

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const sortIndicator = (key) => {
    if (sort.key !== key) return null;
    return sort.dir === "asc" ? "▲" : "▼";
  };

  const thBaseStyle = {
    backgroundColor: "#1f2430",
    color: "#ffffff",
    borderRight: "1px solid #5c5c5c",
    borderBottom: "2px solid #d0d3dc",
    paddingTop: 12,
    paddingBottom: 12,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  };

  const SortableTh = ({ sortKey, children, className }) => (
    <th className={className} style={thBaseStyle}>
      <button
        type="button"
        onClick={() => toggleSort(sortKey)}
        title="Clicar para ordenar"
        style={{
          all: "unset",
          cursor: "pointer",
          color: "inherit",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 700 }}>{children}</span>
        <span style={{ opacity: 0.9, fontSize: 12 }}>
          {sortIndicator(sortKey)}
        </span>
      </button>
    </th>
  );

  return (
    <div className="rounded-4 shadow-sm border overflow-hidden bg-white">
      <div
        className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3"
        style={{
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
          color: "#212529",
        }}
      >
        <div className="d-flex align-items-start gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: 44,
              height: 44,
              background: "#ffffff",
              border: "1px solid #e9ecef",
            }}
            aria-hidden="true"
          >
            <span style={{ fontSize: 20 }}>📚</span>
          </div>
          <div>
            <div className="fw-bold" style={{ fontSize: 18 }}>
              Libros gratuitos
            </div>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span
                className="badge rounded-pill"
                style={{
                  background: "#212529",
                  border: "1px solid #212529",
                }}
              >
                Total: {librosGratuitos.length}
              </span>
              <span className="small text-muted">
                Ordena por autor, categoría o idioma
              </span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-dark fw-bold shadow-sm"
          onClick={onSincronizar}
          disabled={sincronizando}
          style={{ borderRadius: 14, padding: "10px 12px" }}
        >
          {sincronizando ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
              ></span>
              Sincronizando...
            </>
          ) : (
            <>
              <span className="me-2" aria-hidden="true">
                🔄
              </span>
              Actualizar base de datos
            </>
          )}
        </button>
      </div>

      <div style={{ backgroundColor: "#f6f7fb" }}>
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-secondary" role="status"></div>
            <p className="text-muted mt-2 mb-0">Cargando listado...</p>
          </div>
        ) : librosGratuitos.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="lead mb-2">La base de datos espejo está vacía.</p>
            <p className="mb-0">
              Pulsa “Actualizar base de datos” para descargar el catálogo
              inicial.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 text-sm align-middle">
              <thead className="position-sticky top-0" style={{ zIndex: 2 }}>
                <tr>
                  <SortableTh className="ps-4" sortKey={SORT_KEYS.titulo}>
                    Título
                  </SortableTh>
                  <SortableTh sortKey={SORT_KEYS.autor}>Autor</SortableTh>
                  <SortableTh sortKey={SORT_KEYS.categoria}>
                    Categoría
                  </SortableTh>
                  <SortableTh sortKey={SORT_KEYS.idioma}>Idioma</SortableTh>
                  <th style={{ ...thBaseStyle, borderRight: "0" }}>ID Origen</th>
                </tr>
              </thead>
              <tbody>
                {sortedLibros.map((libroG) => (
                  <tr key={libroG._id}>
                    <td
                      className="ps-4 fw-medium text-truncate"
                      style={{ maxWidth: 360 }}
                      title={libroG.titulo}
                    >
                      {libroG.titulo}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: 240 }}>
                      {libroG.autor}
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {libroG.categoria_tienda}
                      </span>
                    </td>
                    <td>{libroG.idioma === "es" ? "🇪🇸 Español" : "🇬🇧 Inglés"}</td>
                    <td className="text-muted small">#{libroG.gutendex_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LibrosGratuitosTab;

