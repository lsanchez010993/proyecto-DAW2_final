function BuscadorLibrosHome({ valor, onChange }) {
  return (
    <div className="mb-2" style={{ width: "30%" }}>
      <label htmlFor="busqueda-home" className="form-label fw-semibold">
        Buscar libros
      </label>
      <input
        id="busqueda-home"
        type="search"
        className="form-control"
        value={valor}
        onChange={onChange}
        placeholder="Busca por título, autor, editorial o ISBN"
        aria-label="Buscar libros por título, autor, editorial o ISBN"
      />
    </div>
  );
}

export default BuscadorLibrosHome;
