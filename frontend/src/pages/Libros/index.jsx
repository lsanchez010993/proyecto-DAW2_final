import { useLibros } from "./useLibros";
import TarjetaLibro from "../../features/libros/components/TarjetaLibro";
import Paginacion from "../../components/Paginacion";
import { APP_MESSAGES } from "../../constants/messages";

function ListarLibros() {
    const M = APP_MESSAGES.PAGES.LIBROS;
   
    const { libros, cargando, pagina, setPagina, totalPaginas } = useLibros();

    if (cargando) {
        return (
            <div 
                className="d-flex justify-content-center align-items-center" 
                style={{ height: "50vh" }}
                aria-busy="true"
                aria-live="polite"
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{M.CARGANDO}</span>
                </div>
            </div>
        );
    }

    return (
        <section className="container mt-4" aria-labelledby="titulo-catalogo-libros">
            
            <header>
                <h1 id="titulo-catalogo-libros" className="h2 mb-4 fw-bold">{M.TITULO}</h1>
            </header>

            <div 
                className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-4"
                aria-live="polite"
            >
                {libros.map((libro) => (
                    <div className="col" key={libro._id}>
                        <TarjetaLibro libro={libro} />
                    </div>
                ))}      
            </div>

            {libros.length === 0 && (
                <div className="text-center mt-5 text-muted">
                    <h2 className="h4">{M.SIN_RESULTADOS}</h2>
                </div>
            )}
         
            {libros.length > 0 && (
                <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiarPagina={setPagina} />
            )}
            
        </section>
    );
}

export default ListarLibros;