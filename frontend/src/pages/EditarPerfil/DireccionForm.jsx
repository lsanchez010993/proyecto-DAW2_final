import { APP_MESSAGES } from "../../constants/messages";

export default function DireccionForm({
  direccion,
  handleDireccionChange
}) {
  return (
    <div className="animate__animated animate__fadeIn">
      <h4 className="mb-4 text-center">
        {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.TITULO}
      </h4>
      <div className="mb-3">
        <label className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CALLE_LABEL}
        </label>
        <input 
          type="text" 
          name="calle" 
          className="form-control rounded-pill" 
          value={direccion.calle} 
          onChange={handleDireccionChange} 
          placeholder={APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CALLE_PLACEHOLDER}
        />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="small text-muted">
            {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CIUDAD_LABEL}
          </label>
          <input 
            type="text" 
            name="ciudad" 
            className="form-control rounded-pill" 
            value={direccion.ciudad} 
            onChange={handleDireccionChange} 
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="small text-muted">
            {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.CP_LABEL}
          </label>
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
        <label className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.PAIS_LABEL}
        </label>
        <input 
          type="text" 
          name="pais" 
          className="form-control rounded-pill" 
          value={direccion.pais} 
          onChange={handleDireccionChange} 
        />
      </div>
      <div className="mb-3">
        <label className="small text-muted">
          {APP_MESSAGES.EDITAR_PERFIL.DIRECCION.TELEFONO_LABEL}
        </label>
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
