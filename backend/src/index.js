const express = require('express');
const cors = require('cors');
const salidasRoutes = require('./routes/salidas');
const { listarDestinos } = require('./controllers/salidas.controller');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API de LanchaYa funcionando'));

app.use('/api/salidas', salidasRoutes);
app.get('/api/destinos', listarDestinos);

// Manejo de errores (siempre al final)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () => console.log('API en http://localhost:3000'));