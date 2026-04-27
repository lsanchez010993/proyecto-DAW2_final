import styles from "./Editoriales.module.css";

export default function BuscadorEditoriales({busqueda,setBusqueda,editorialesFiltradas,seleccionadas,setSeleccionadas}) {
  return (
    <div className={`shadow-sm ${styles.panelLateral}`}>
      <h5 className="fw-bold mb-3">Buscar Editorial</h5>
      
      <div className="mb-3">
        <input
          type="text"
          className="form-control rounded-pill bg-white"
          placeholder="🔍 Nombre de la editorial..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className={styles.listaResultados}>
        {busqueda === "" ? (
          <p className="text-center text-muted small mt-4">
            Encuentra una editorial específica rápidamente.
          </p>
        ) : editorialesFiltradas.length === 0 ? (
          <p className="text-center text-muted small mt-4">
            No hay editoriales que coincidan con "{busqueda}".
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
