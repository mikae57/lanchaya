export default function Filtros({ destinos, filtros, onChange, onLimpiar }) {
  const cambiar = (campo) => (e) =>
    onChange({ ...filtros, [campo]: e.target.value });

  return (
    <section className="filtros">
      <select value={filtros.destino} onChange={cambiar('destino')}>
        <option value="">Todos los destinos</option>
        {destinos.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <input type="date" value={filtros.fecha} onChange={cambiar('fecha')} />

      <select value={filtros.tipo} onChange={cambiar('tipo')}>
        <option value="">Todos los tipos</option>
        <option value="lancha">Lancha</option>
        <option value="rapido">Rápido</option>
        <option value="deslizador">Deslizador</option>
      </select>

      <button onClick={onLimpiar}>Limpiar filtros</button>
    </section>
  );
}