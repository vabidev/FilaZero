const crypto = require('crypto');

const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || (
  isProduction ? null : crypto.randomBytes(32).toString('hex')
);
const adminPassword = process.env.ADMIN_PASSWORD || (
  isProduction ? null : 'admin123'
);

if (isProduction && !sessionSecret) {
  throw new Error('SESSION_SECRET é obrigatória em produção.');
}

if (isProduction && !adminPassword) {
  throw new Error('ADMIN_PASSWORD é obrigatória em produção.');
}

module.exports = {
  port: process.env.PORT || 3000,
  isProduction,
  sessionSecret,
  database: {
    filename: process.env.DATABASE_PATH || './database.sqlite'
  },
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: adminPassword
  },
  business: {
    name: 'FilaZero',
    description: 'Sistema de Agendamento Online',
    defaultWorkingHours: {
      monday: { start: '09:00', end: '18:00' },
      tuesday: { start: '09:00', end: '18:00' },
      wednesday: { start: '09:00', end: '18:00' },
      thursday: { start: '09:00', end: '18:00' },
      friday: { start: '09:00', end: '18:00' },
      saturday: { start: '09:00', end: '13:00' },
      sunday: { start: null, end: null }
    }
  }
};
