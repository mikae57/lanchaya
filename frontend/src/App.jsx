import { useEffect, useState } from 'react';
import {
  getSalidas, getDestinos, crearSalida, actualizarSalida, eliminarSalida,
} from './services/api';
import SalidaCard from './components/SalidaCard';
import Filtros from './components/Filtros';
import SalidaForm from './components/SalidaForm';

const FILTROS_VACIOS = { destino: '', fecha: '', tipo: '' };

export default function App() {
  const [salidas, setSalidas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);   // sirve para "recargar la lista"
  const [editando, setEditando] = useState(null); // null = formulario cerrado

  useEffect(() => {
    getDestinos().then(setDestinos).catch(() => {});
  }, [version]);

  useEffect(() => {
    getSalidas(filtros)
      .then((datos) => {
        setSalidas(datos);
        setError(null);
      })
      .catch(() => setError('No se pudo conectar con el servidor'))
      .finally(() => setCargando(false));
  }, [filtros, version]);

  const cambiarFiltros = (nuevos) => {
    setCargando(true);
    setFiltros(nuevos);
  };

  const recargar = () => {
    setCargando(true);
    setVersion((v) => v + 1);
  };

  // Crea si no tiene id, actualiza si ya lo tiene
  const guardar = async (datos) => {
    if (editando.id) await actualizarSalida(editando.id, datos);
    else await crearSalida(datos);
    setEditando(null);
    recargar();
  };

  const eliminar = async (salida) => {
    if (!window.confirm(`¿Eliminar la salida a ${salida.destino}?`)) return;
    try {
      await eliminarSalida(salida.id);
      recargar();
    } catch {
      alert('No se pudo eliminar la salida');
    }
  };

  return (
    <main>
      <h1>LanchaYa Iquitos</h1>

      <button className="nueva" onClick={() => setEditando({})}>
        + Registrar salida
      </button>

      {editando && (
        <SalidaForm
          key={editando.id ?? 'nueva'}
          inicial={editando.id ? editando : null}
          onGuardar={guardar}
          onCancelar={() => setEditando(null)}
        />
      )}

      <Filtros
        destinos={destinos}
        filtros={filtros}
        onChange={cambiarFiltros}
        onLimpiar={() => cambiarFiltros(FILTROS_VACIOS)}
      />

      {cargando && <p>Cargando salidas...</p>}
      {error && <p className="error">{error}</p>}
      {!cargando && !error && salidas.length === 0 && (
        <p>No hay salidas disponibles.</p>
      )}

      <section className="lista">
        {salidas.map((s) => (
          <SalidaCard
            key={s.id}
            salida={s}
            onEditar={setEditando}
            onEliminar={eliminar}
          />
        ))}
      </section>
    </main>
  );
}