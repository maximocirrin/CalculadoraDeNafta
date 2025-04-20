const express = require('express');
const fetch = require('node-fetch');
const csv = require('csvtojson');
const cors = require('cors');

const app = express();
app.use(cors());

// Para evitar errores de certificado expirado
const httpsAgent = new https.Agent({ rejectUnauthorized: false });


// URL del CSV de "Precios en Surtidor - Resolución 314/2016"
const CSV_URL = 'https://datos.energia.gob.ar/dataset/1c181390-5045-475e-94dc-410429be4b17/resource/80ac25de-a44a-4445-9215-090cf55cfda5/download/precios-en-surtidor-resolucin-3142016.csv';

// Cache (en ms)
const CACHE_TTL =  60 * 60 * 1000; // 1 hora
let cache = { timestamp: 0, data: null };

async function fetchPrecios() {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
    return cache.data;
  }
  const resp = await fetch(CSV_URL);
  const text = await resp.text();
  const json = await csv().fromString(text);

  // Filtrar solo el último registro por tipo de producto
  const tipos = ['Nafta Super', 'Nafta Premium', 'Gasoil', 'Gasoil Premium'];
  const precios = {};
  tipos.forEach(tipo => {
    const registro = json
      .filter(r => r.producto === tipo)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
    precios[tipo] = parseFloat(registro.precio);  
  });

  cache = { timestamp: now, data: precios };
  return precios;
}

app.get('/api/precios', async (req, res) => {
  try {
    const precios = await fetchPrecios();
    res.json(precios);
  } catch (error) {
    console.error('Error al obtener precios:', error);
    res.status(500).json({ error: 'No se pudieron obtener los precios' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));