export default function SalidaCard({ salida, onEditar, onEliminar }) {
  const fecha = new Date(salida.fechaHora).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <article className="card">
      <span className={`tipo ${salida.tipo}`}>{salida.tipo}</span>
      <h2>{salida.destino}</h2>
      <p className="empresa">
        {salida.empresa} · {salida.embarcacion}
      </p>
      <p>{salida.puerto}</p>
      <p>{fecha}</p>
      <p className="precio">S/ {salida.precio}</p>

      <div className="acciones">
        <button onClick={() => onEditar(salida)}>Editar</button>
        <button className="peligro" onClick={() => onEliminar(salida)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}