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

// Página Principal con tu diseño y el Dashboard de UptimeRobot integrado de forma segura
app.get('/', async (req, res) => {
  let dbStatus = "🟢 Conectada con éxito";
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    dbStatus = "🔴 Desconectada (" + err.message + ")";
  }

  // Estructura HTML segura que se renderiza en el navegador del profesor
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
          .sre-box { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: white; padding: 25px; border-radius: 12px; margin-top: 30px; border: 1px solid #334155; }
          .btn-monitor { display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 8px; margin-top: 15px; transition: background 0.3s ease; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5); }
          .btn-monitor:hover { background-color: #2563eb; }
          .pulse { display: inline-block; width: 10px; height: 10px; background-color: #10b981; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); animation: pulsing 1.5s infinite; }
          @keyframes pulsing { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
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

          <div class="sre-box">
              <h3 style="margin-top:0; color: #f8fafc; display: flex; align-items: center;"><span class="pulse"></span> 📊 Panel de Observabilidad SRE en Tiempo Real</h3>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                  Para cumplir con las estrictas directivas de seguridad cross-origin corporativas, las métricas de telemetría y disponibilidad global son auditadas externamente de forma aislada.
              </p>
              <p style="color: #cbd5e1; font-size: 14px;">
                  Haga clic en el siguiente enlace institucional para abrir la consola de monitoreo sintético continuo provista por el agente de <strong>UptimeRobot</strong>:
              </p>
              <a href="https://stats.uptimerobot.com/XZ1xCokgfs" target="_blank" class="btn-monitor">
                  💻 Abrir Dashboard de Telemetría ↗
              </a>
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
