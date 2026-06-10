import { APP_MESSAGES } from "../../constants/messages";

export default function DireccionForm({
  direccion,
  handleDireccionChange
}) {
  return (
    <section className="animate__animated animate__fadeIn" aria-labelledby="direccion-titulo">
      <h2 id="direccion-titulo" className="h4 mb-4 text-center">
        {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.TITULO}
      </h2>
      <div className="mb-3">
        <label htmlFor="direccion-calle" className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CALLE_LABEL}
        </label>
        <input 
          id="direccion-calle"
          type="text" 
          name="calle" 
          className="form-control rounded-pill" 
          value={direccion.calle} 
          onChange={handleDireccionChange} 
          placeholder={APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CALLE_PLACEHOLDER}
          autoComplete="street-address"
        />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="direccion-ciudad" className="small text-muted">
            {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CIUDAD_LABEL}
          </label>
          <input 
            id="direccion-ciudad"
            type="text" 
            name="ciudad" 
            className="form-control rounded-pill" 
            value={direccion.ciudad} 
            onChange={handleDireccionChange} 
            autoComplete="address-level2"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="direccion-cp" className="small text-muted">
            {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CP_LABEL}
          </label>
          <input 
            id="direccion-cp"
            type="text" 
            name="codigo_postal" 
            className="form-control rounded-pill" 
            value={direccion.codigo_postal} 
            onChange={handleDireccionChange} 
            autoComplete="postal-code"
          />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="direccion-pais" className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.PAIS_LABEL}
        </label>
        <input 
          id="direccion-pais"
          type="text" 
          name="pais" 
          className="form-control rounded-pill" 
          value={direccion.pais} 
          onChange={handleDireccionChange} 
          autoComplete="country-name"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="direccion-telefono" className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.TELEFONO_LABEL}
        </label>
        <input 
          id="direccion-telefono"
          type="tel" 
          name="telefono" 
          className="form-control rounded-pill" 
          value={direccion.telefono} 
          onChange={handleDireccionChange} 
          autoComplete="tel"
        />
      </div>
    </section>
  );
}