import { useLibros } from "./useLibros";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
import Paginacion from "../../components/Paginacion";
function ListarLibros() {
   
    const { libros, cargando, pagina, setPagina, totalPaginas } = useLibros();

    if (cargando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }
    return (
        <div className="container mt-4">
            <h2 className="mb-4 fw-bold">Todos los libros</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {libros.map((libro) => (
                    <div className="col" key={libro._id}>
                        
                        <TarjetaLibro libro={libro} />
                    </div>
                ))}      
            </div>
            {libros.length === 0 && (
                <div className="text-center mt-5 text-muted">
                    <h4>No se encontraron libros.</h4>
                </div>
            )}
         
            <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiarPagina={setPagina} />
        </div>
    );
}
export default ListarLibros;