const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const db = require('./database');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true'
  } // 24 horas
}));

// Importar rotas
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const apiRoutes = require('./routes/api');

// Usar rotas
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`
╔═══════════════════════════════════════╗
║        FilaZero - Sistema de          ║
║      Agendamento Online v2.2          ║
╠═══════════════════════════════════════╣
║  Servidor rodando em:                 ║
║  http://localhost:${config.port}                ║
╠═══════════════════════════════════════╣
║  Acesso Admin:                        ║
║  http://localhost:${config.port}/admin        ║
║  Credenciais definidas por ambiente   ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app;
