export default function DireccionForm({
  direccion,
  handleDireccionChange
}) {
  return (
    <div className="animate__animated animate__fadeIn">
      <h4 className="mb-4 text-center">Dirección de Entrega</h4>
      <div className="mb-3">
        <label className="small text-muted">Calle y número</label>
        <input 
          type="text" 
          name="calle" 
          className="form-control rounded-pill" 
          value={direccion.calle} 
          onChange={handleDireccionChange} 
          placeholder="Ej: Calle Mayor 12, 2B" 
        />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="small text-muted">Ciudad</label>
          <input 
            type="text" 
            name="ciudad" 
            className="form-control rounded-pill" 
            value={direccion.ciudad} 
            onChange={handleDireccionChange} 
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="small text-muted">Código Postal</label>
          <input 
            type="text" 
            name="codigo_postal" 
            className="form-control rounded-pill" 
            value={direccion.codigo_postal} 
            onChange={handleDireccionChange} 
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="small text-muted">País</label>
        <input 
          type="text" 
          name="pais" 
          className="form-control rounded-pill" 
          value={direccion.pais} 
          onChange={handleDireccionChange} 
        />
      </div>
      <div className="mb-3">
        <label className="small text-muted">Teléfono de contacto</label>
        <input 
          type="text" 
          name="telefono" 
          className="form-control rounded-pill" 
          value={direccion.telefono} 
          onChange={handleDireccionChange} 
        />
      </div>
    </div>
  );
}
