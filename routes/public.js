const express = require('express');
const router = express.Router();
const path = require('path');

// Página inicial
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Página de agendamento
router.get('/agendar', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/booking.html'));
});

// Página sobre
router.get('/sobre', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'));
});

// Página de contato
router.get('/contato', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/contact.html'));
});

module.exports = router;
