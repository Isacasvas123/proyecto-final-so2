res.send(`
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard DevOps</title>

<style>
body{
    margin:0;
    font-family:Segoe UI, sans-serif;
    background:#0f172a;
    color:white;
}

.header{
    background:#1e293b;
    padding:20px;
    text-align:center;
    border-bottom:2px solid #334155;
}

.header h1{
    margin:0;
    color:#38bdf8;
}

.container{
    max-width:1200px;
    margin:auto;
    padding:30px;
}

.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:20px;
}

.card{
    background:#1e293b;
    padding:25px;
    border-radius:15px;
    box-shadow:0 0 15px rgba(0,0,0,.3);
}

.card h2{
    margin-top:0;
    color:#38bdf8;
}

.online{
    color:#22c55e;
    font-weight:bold;
}

.footer{
    text-align:center;
    margin-top:30px;
    color:#94a3b8;
}
</style>
</head>

<body>

<div class="header">
    <h1>🚀 Infraestructura DevOps Cloud</h1>
    <p>Sistemas Operativos II - Proyecto Final</p>
</div>

<div class="container">

    <div class="grid">

        <div class="card">
            <h2>🐳 Contenedor Docker</h2>
            <p class="online">● ONLINE</p>
            <p>Aplicación Node.js funcionando correctamente.</p>
        </div>

        <div class="card">
            <h2>🗄️ PostgreSQL</h2>
            <p class="online">● CONECTADA</p>
            <p>Base de datos disponible.</p>
        </div>

        <div class="card">
            <h2>📈 Uptime</h2>
            <p class="online">● ACTIVO</p>
            <p id="uptime">Cargando...</p>
        </div>

        <div class="card">
            <h2>⏰ Hora Cloud</h2>
            <p>${dbResult.rows[0].now}</p>
        </div>

    </div>

    <div class="card" style="margin-top:20px;">
        <h2>📊 Estado General</h2>
        <p>Todos los servicios operando normalmente.</p>
        <p>Monitoreo continuo mediante Health Check.</p>
    </div>

</div>

<div class="footer">
    Proyecto DevOps - Docker + Node.js + PostgreSQL + Monitoreo
</div>

<script>
fetch('/health')
.then(r => r.json())
.then(data => {
    const horas = (data.uptime / 3600).toFixed(2);

    document.getElementById('uptime').innerHTML =
        horas + ' horas de actividad';
});
</script>

</body>
</html>
`);
