const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware para verificar autenticação
function isAuthenticated(req, res, next) {
  if (req.session && req.session.adminId) {
    return next();
  }
  res.redirect('/admin/login');
}

// Página de login
router.get('/login', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  res.sendFile(path.join(__dirname, '../public/admin/login.html'));
});

// Páginas administrativas (protegidas)
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/dashboard.html'));
});

router.get('/services', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/services.html'));
});

router.get('/appointments', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/appointments.html'));
});

router.get('/clients', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/clients.html'));
});

router.get('/settings', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/settings.html'));
});

// Redirecionar /admin para /admin/dashboard
router.get('/', isAuthenticated, (req, res) => {
  res.redirect('/admin/dashboard');
});

module.exports = router;
