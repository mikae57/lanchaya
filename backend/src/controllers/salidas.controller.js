const fs = require('fs');
const path = require('path');

const archivo = path.join(__dirname, '../data/salidas.json');

// Leer y guardar el archivo JSON (nuestra "base de datos")
const leer = () => JSON.parse(fs.readFileSync(archivo, 'utf-8'));
const guardar = (datos) =>
  fs.writeFileSync(archivo, JSON.stringify(datos, null, 2));

const TIPOS = ['lancha', 'rapido', 'deslizador'];

// Devuelve un texto con el error, o null si todo está bien
function validar(data, esNuevo) {
  const obligatorios = ['empresa', 'destino', 'puerto', 'fechaHora'];
  for (const campo of obligatorios) {
    if (!data[campo] || String(data[campo]).trim() === '') {
      return `El campo "${campo}" es obligatorio`;
    }
  }
  if (typeof data.precio !== 'number' || !(data.precio > 0)) {
    return 'El precio debe ser un número mayor que 0';
  }
  if (!TIPOS.includes(data.tipo)) {
    return `El tipo debe ser uno de: ${TIPOS.join(', ')}`;
  }
  const fecha = new Date(data.fechaHora);
  if (isNaN(fecha.getTime())) {
    return 'fechaHora no tiene un formato válido (ej: 2026-11-09T06:30)';
  }
  if (esNuevo && fecha < new Date()) {
    return 'La fecha y hora no puede estar en el pasado';
  }
  return null;
}

// GET /api/salidas
exports.listar = (req, res) => {
  const { destino, fecha, tipo } = req.query;
  let salidas = leer();

  if (destino) salidas = salidas.filter((s) => s.destino === destino);
  if (tipo) salidas = salidas.filter((s) => s.tipo === tipo);
  if (fecha) salidas = salidas.filter((s) => s.fechaHora.startsWith(fecha));

  salidas.sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));
  res.json(salidas);
};

// GET /api/salidas/:id
exports.obtener = (req, res) => {
  const salida = leer().find((s) => s.id === Number(req.params.id));
  if (!salida) return res.status(404).json({ error: 'Salida no encontrada' });
  res.json(salida);
};

// POST /api/salidas
exports.crear = (req, res) => {
  const error = validar(req.body, true);
  if (error) return res.status(400).json({ error });

  const salidas = leer();
  const nuevoId = salidas.length ? Math.max(...salidas.map((s) => s.id)) + 1 : 1;
  const nueva = { ...req.body, id: nuevoId };

  salidas.push(nueva);
  guardar(salidas);
  res.status(201).json(nueva);
};

// PUT /api/salidas/:id
exports.actualizar = (req, res) => {
  const salidas = leer();
  const i = salidas.findIndex((s) => s.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Salida no encontrada' });

  const error = validar(req.body, false);
  if (error) return res.status(400).json({ error });

  salidas[i] = { ...req.body, id: salidas[i].id };
  guardar(salidas);
  res.json(salidas[i]);
};

// DELETE /api/salidas/:id
exports.eliminar = (req, res) => {
  const salidas = leer();
  const i = salidas.findIndex((s) => s.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Salida no encontrada' });

  salidas.splice(i, 1);
  guardar(salidas);
  res.status(204).send();
};

// GET /api/destinos
exports.listarDestinos = (req, res) => {
  const destinos = [...new Set(leer().map((s) => s.destino))];
  res.json(destinos);
};