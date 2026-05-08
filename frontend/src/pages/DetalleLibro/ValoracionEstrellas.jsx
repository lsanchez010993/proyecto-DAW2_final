function ValoracionEstrellas({
  valor = 0,
  editable = false,
  onChange,
  sizeClass = "fs-4",
}) {
  return (
    <div className="d-flex align-items-center gap-1">
      {[1, 2, 3, 4, 5].map((estrella) => {
        const activa = estrella <= valor;
        const clases = `btn p-0 border-0 ${sizeClass} ${activa ? "text-warning" : "text-secondary"}`;
        return (
          <button
            key={estrella}
            type="button"
            className={clases}
            onClick={() => editable && onChange?.(estrella)}
            disabled={!editable}
            aria-label={`Puntuar con ${estrella} estrellas`}
            title={`Puntuar con ${estrella} estrellas`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default ValoracionEstrellas;
