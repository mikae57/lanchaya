import { useState } from 'react';

const VACIO = {
  empresa: '', embarcacion: '', tipo: 'rapido', destino: '', puerto: '',
  fechaHora: '', duracionHoras: '', precio: '', cupos: '',
};

// Validación en el frontend, antes de enviar al servidor
function validar(d) {
  for (const campo of ['empresa', 'destino', 'puerto', 'fechaHora']) {
    if (!String(d[campo]).trim()) return `El campo "${campo}" es obligatorio`;
  }
  if (!(Number(d.precio) > 0)) return 'El precio debe ser un número mayor que 0';
  return null;
}

export default function SalidaForm({ inicial, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(inicial ?? VACIO);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (campo) => (e) =>
    setDatos({ ...datos, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    const problema = validar(datos);
    if (problema) return setError(problema);

    setEnviando(true);
    setError(null);
    try {
      await onGuardar({
        ...datos,
        precio: Number(datos.precio),
        duracionHoras: Number(datos.duracionHoras) || 0,
        cupos: Number(datos.cupos) || 0,
      });
    } catch (err) {
      // Si el backend responde 400, mostramos su mensaje
      setError(err.response?.data?.error || 'No se pudo guardar la salida');
      setEnviando(false);
    }
  };

  return (
    <form className="form" onSubmit={enviar}>
      <h2>{inicial ? 'Editar salida' : 'Registrar salida'}</h2>

      <label>Empresa
        <input value={datos.empresa} onChange={cambiar('empresa')} />
      </label>
      <label>Embarcación
        <input value={datos.embarcacion} onChange={cambiar('embarcacion')} />
      </label>
      <label>Tipo
        <select value={datos.tipo} onChange={cambiar('tipo')}>
          <option value="lancha">Lancha</option>
          <option value="rapido">Rápido</option>
          <option value="deslizador">Deslizador</option>
        </select>
      </label>
      <label>Destino
        <input value={datos.destino} onChange={cambiar('destino')} />
      </label>
      <label>Puerto
        <input value={datos.puerto} onChange={cambiar('puerto')} />
      </label>
      <label>Fecha y hora
        <input type="datetime-local" value={datos.fechaHora}
               onChange={cambiar('fechaHora')} />
      </label>
      <label>Duración (horas)
        <input type="number" min="0" value={datos.duracionHoras}
               onChange={cambiar('duracionHoras')} />
      </label>
      <label>Precio (S/)
        <input type="number" min="0" step="0.5" value={datos.precio}
               onChange={cambiar('precio')} />
      </label>
      <label>Cupos
        <input type="number" min="0" value={datos.cupos}
               onChange={cambiar('cupos')} />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="acciones">
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}