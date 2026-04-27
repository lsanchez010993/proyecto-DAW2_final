// frontend/src/components/TablaLibros.jsx
import { Link } from "react-router-dom";

export default function TablaLibros({ libros, onDelete }) {
  if (libros.length === 0) return <p className="text-center text-muted mt-5">No hay libros.</p>;

  return (
    <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover mb-0 align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>Editorial</th>
                      <th>Categorías</th>
                      <th style={{ width: 140 }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libros.map((libro) => (
                      <tr key={libro._id}>
                        <td className="fw-semibold">{libro.titulo}</td>
                        <td className="text-muted">{libro.autor}</td>
                        <td>{libro.editorial || "-"}</td>
                        <td className="text-muted small">
                          {(libro.categorias || []).join(", ")}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                onDelete(libro._id, libro.titulo)
                              }
                            >
                              Eliminar
                            </button>
                            <Link
                              to={`/editar-libro/${libro._id}`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Editar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
    </div>
  );
}