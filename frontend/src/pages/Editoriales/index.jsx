import { useCallback } from "react";
import { useEditoriales } from "./useEditoriales";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import BuscadorEditoriales from "./BuscadorEditoriales";
import ListaEditoriales from "./ListaEditoriales";

export default function Editoriales() {
  const {
    listaEditoriales,
    seleccionadas,
    setSeleccionadas,
    busqueda,
    setBusqueda,
    editorialesExpandidas,
    librosPorEditorial,
    cargandoFilas,
    finDelCatalogo,
    editorialesFiltradas,
    toggleEditorial,
    toggleExpandir,
    cargarMas
  } = useEditoriales();


  const handleCargarMas = useCallback(() => {
    cargarMas();
  }, [cargarMas]);

  // EVENTO: Detector de Scroll para cargar más datos
  useInfiniteScroll(
    handleCargarMas,
    cargandoFilas,
    !finDelCatalogo
  );

  return (
    <div className="container-fluid px-4 mt-4">
      <div className="row">
        
        {/* =========================================================
            COLUMNA IZQUIERDA: 
            ========================================================= */}
        <aside className="col-md-3 mb-4 h-100" aria-label="Buscador y filtros de editoriales">
          <BuscadorEditoriales 
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            editorialesFiltradas={editorialesFiltradas}
            seleccionadas={seleccionadas}
            setSeleccionadas={setSeleccionadas}
          />
        </aside>

        {/* =========================================================
            COLUMNA DERECHA:             ========================================================= */}
          <section 
            className="col-md-9" 
            aria-live="polite" 
            aria-label="Catálogo de libros organizado por editoriales"
          >
          <ListaEditoriales 
            listaEditoriales={listaEditoriales}
            seleccionadas={seleccionadas}
            toggleEditorial={toggleEditorial}
            librosPorEditorial={librosPorEditorial}
            cargandoFilas={cargandoFilas}
            editorialesExpandidas={editorialesExpandidas}
            toggleExpandir={toggleExpandir}
          />
        </section>
        
      </div>
    </div>
  );
}