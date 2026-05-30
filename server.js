const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la Base de Datos PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones seguras en Render
  }
});

// Endpoint de Salud (/health) para UptimeRobot
app.get('/health', async (req, res) => {
  try {
    // Validamos que la base de datos responda una consulta simple
    await pool.query('SELECT 1');
    res.status(200).json({
      status: "UP",
      database: "CONNECTED",
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({
      status: "DOWN",
      database: "DISCONNECTED",
      error: err.message
    });
  }
});

// Página Principal con tu diseño y el Dashboard de UptimeRobot integrado
app.get('/', async (req, res) => {
  let dbStatus = "🟢 Conectada con éxito";
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    dbStatus = "🔴 Desconectada (" + err.message + ")";
  }

  // Estructura HTML que se renderiza en el navegador del profesor
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Proyecto Final - Sistemas Operativos II</title>
      <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
          .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          h1 { color: #0f172a; margin-top: 0; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
          .badge { display: inline-block; padding: 6px 12px; font-weight: bold; border-radius: 6px; font-size: 14px; }
          .badge-success { background-color: #dcfce7; color: #16a34a; }
          .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0; }
          iframe { width: 100%; height: 500px; border: none; border-radius: 8px; margin-top: 15px; }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>🚀 Plataforma Cloud-Native Operacional</h1>
          <p><strong>Asignatura:</strong> Sistemas Operativos II - Proyecto Final</p>
          <p><strong>Estudiante:</strong> Ismael Castillo Vasquez (Isacasvas123)</p>
          
          <div class="info-box">
              <h3>⚡ Estado de los Subsistemas:</h3>
              <p>🌐 <strong>Servidor Web:</strong> <span class="badge badge-success">ONLINE (Render)</span></p>
              <p>🗄️ <strong>Base de Datos:</strong> <span style="font-weight: bold;">${dbStatus}</span></p>
          </div>

          <hr style="border: 0; height: 1px; background: #e2e8f0; margin: 30px 0;">

          <h3 style="color: #0f172a; display: flex; align-items: center; gap: 10px;">📊 Panel de Observabilidad SRE en Tiempo Real</h3>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 10px;">Métricas de disponibilidad global auditadas de forma sintética por agentes de monitoreo externos.</p>
          
          <div style="border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background-color: #fafafa;">
              <iframe src="https://stats.uptimerobot.com/XZ1xCokgfs"></iframe>
          </div>
      </div>
  </body>
  </html>
  `;
  
  res.send(htmlContent);
});

// Inicialización del Servidor Lógico
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
