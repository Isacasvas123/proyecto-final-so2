const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la Base de Datos PostgreSQL Corporativa
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para conexiones cifradas de grado empresarial
  }
});

// Endpoint crítico de salud (/health) para auditorías de disponibilidad
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: "OPERATIONAL",
      database_cluster: "CONNECTED",
      region: "Render Cloud-East",
      environment: "Production",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: "DEGRADED",
      database_cluster: "DISCONNECTED",
      error: err.message
    });
  }
});

// Consola de Operaciones e Información de la Empresa
app.get('/', async (req, res) => {
  let dbStatus = "🟢 Conectado (Clúster Cloud)";
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    dbStatus = "🔴 Interrumpido (" + err.message + ")";
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ICV DevOps Solutions - Core Operations</title>
      <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #f1f5f9; margin: 0; padding: 0; }
          .navbar { background-color: #111827; padding: 15px 30px; border-bottom: 1px solid #1f2937; display: flex; justify-content: space-between; align-items: center; }
          .navbar h2 { margin: 0; font-size: 18px; color: #3b82f6; letter-spacing: 0.5px; }
          .badge-env { background-color: #1e3a8a; color: #60a5fa; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .main-content { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
          .hero-section { background: linear-gradient(135deg, #1e1b4b 0%, #111827 100%); padding: 35px; border-radius: 12px; border: 1px solid #312e81; margin-bottom: 25px; }
          .hero-section h1 { margin-top: 0; font-size: 28px; color: #ffffff; }
          .hero-section p { color: #94a3b8; line-height: 1.6; font-size: 15px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          .card { background-color: #111827; border: 1px solid #1f2937; padding: 20px; border-radius: 8px; }
          .card h3 { margin-top: 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          .status-indicator { font-size: 18px; font-weight: bold; color: #ffffff; margin-top: 10px; display: flex; align-items: center; gap: 10px; }
          .sre-section { background-color: #111827; border: 1px solid #1f2937; padding: 30px; border-radius: 12px; }
          .btn-telemetry { display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; margin-top: 15px; transition: background 0.2s; }
          .btn-telemetry:hover { background-color: #1d4ed8; }
          .pulse { display: inline-block; width: 10px; height: 10px; background-color: #10b981; border-radius: 50%; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); animation: pulsing 1.5s infinite; }
          @keyframes pulsing { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
      </style>
  </head>
  <body>

      <div class="navbar">
          <h2>🏢 ICV DEVOPS SOLUTIONS</h2>
          <span class="badge-env">PROD ENVIRONMENT</span>
      </div>

      <div class="main-content">
          <div class="hero-section">
              <h1>Consola Central de Infraestructura Cloud</h1>
              <p>
                  Bienvenido al centro de mando operativo de <strong>ICV DevOps Solutions</strong>. Esta plataforma gestiona, orquesta y audita de forma automatizada los recursos lógicos, contenedores e integraciones de bases de datos para arquitecturas microservicios corporativas de alta demanda.
              </p>
              <p style="font-size: 13px; color: #6366f1; margin-bottom: 0;">
                  <strong>Ingeniero de Infraestructura a Cargo:</strong> Ismael Castillo Vasquez | Dirección de Operaciones SRE
              </p>
          </div>

          <div class="grid">
              <div class="card">
                  <h3>Servicios de Cómputo Web</h3>
                  <div class="status-indicator">
                      <span class="pulse"></span> HTTP Engine (Render Cluster)
                  </div>
                  <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">Estado: Activo | Balanceador con 2 Réplicas</p>
              </div>
              <div class="card">
                  <h3>Capa de Datos Corporativa</h3>
                  <div class="status-indicator" style="color: #60a5fa;">
                      🗄️ PostgreSQL Cloud Managed
                  </div>
                  <p style="color: #64748b; font-size: 13px; margin: 10px 0 0 0;">Estado: ${dbStatus}</p>
              </div>
          </div>

          <div class="sre-section">
              <h3 style="margin-top: 0; color: #ffffff; font-size: 16px;">📊 Sistema de Auditoría y Acuerdos de Nivel de Servicio (SLA)</h3>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
                  Para cumplir con los estándares de transparencia operacional internacionales, el rendimiento del clúster es supervisado por un gateway externo redundante. Esto mitiga riesgos de falsos positivos y valida de forma limpia el 100% de la disponibilidad de cara al cliente final.
              </p>
              <a href="https://stats.uptimerobot.com/XZ1xCokgfs" target="_blank" class="btn-telemetry">
                  Ver Consola de Telemetría Externa ↗
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
