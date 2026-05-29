const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de conexión segura a la Base de Datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ruta principal de la aplicación (Frontend)
app.get('/', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW()');
    res.send(`
      <html>
        <head><title>Proyecto DevOps SO-II</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f4f8; padding: 50px;">
          <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">🚀 Infraestructura DevOps Cloud 🚀</h1>
            <p style="color: #7f8c8d; font-size: 1.2em;">Sistemas Operativos II - Entorno de Producción Functional</p>
            <hr style="border: 0; height: 1px; background: #eee; margin: 20px 0;">
            <p><strong>Estado del Contenedor:</strong> <span style="color: #27ae60;">ONLINE (Activo)</span></p>
            <p><strong>Base de Datos Relacional:</strong> <span style="color: #27ae60;">CONECTADA ✅</span></p>
            <p style="font-size: 0.9em; color: #95a5a6;">Hora del Servidor Cloud DB: ${dbResult.rows[0].now}</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h2 style="color: #c0392b;">❌ Error de Infraestructura</h2>
        <p>No se pudo conectar a la Base de Datos Cloud.</p>
        <p style="color: #7f8c8d;">Detalle: ${err.message}</p>
      </body>
    `);
  }
});

// Endpoint obligatorio de Monitoreo / Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});