import { Link } from 'react-router-dom'; 

function Filtros() {
  return (
    <div className="container-fluid mb-4">
      <div className="d-flex flex-wrap align-items-center gap-2">
        
        <h5 className="mb-0 me-3">Explorar</h5>

       
        <Link to="/categorias" className="btn btn-outline-dark">Categorías</Link>
        <Link to="/autores" className="btn btn-outline-dark">Autores</Link>
        <Link to="/editoriales" className="btn btn-outline-dark">Editoriales</Link>
        
        <Link to="/recomendados" className="btn btn-outline-dark">Recomendados</Link>
        
      </div>
    </div>
  );
}

export default Filtros;