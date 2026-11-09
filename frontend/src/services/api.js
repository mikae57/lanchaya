import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export const getSalidas = (filtros = {}) =>
  api.get('/salidas', { params: filtros }).then((r) => r.data);

export const getDestinos = () => api.get('/destinos').then((r) => r.data);

export const crearSalida = (data) =>
  api.post('/salidas', data).then((r) => r.data);

export const actualizarSalida = (id, data) =>
  api.put(`/salidas/${id}`, data).then((r) => r.data);

export const eliminarSalida = (id) => api.delete(`/salidas/${id}`);