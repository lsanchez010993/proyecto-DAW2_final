function BuscadorLibrosHome({ valor, onChange }) {
  return (
    <form
      role="search"
      className="mb-4 w-50 text-end"
      style={{ maxWidth: "420px" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <label htmlFor="busqueda-home" className="form-label fw-semibold">
        Buscar libros
      </label>
      <input
        id="busqueda-home"
        type="search"
        className="form-control text-end"
        value={valor}
        onChange={onChange}
        placeholder="Busca por título, autor, editorial o ISBN"
        aria-label="Buscar libros por título, autor, editorial o ISBN"
      />
    </form>
  );
}

export default BuscadorLibrosHome;
