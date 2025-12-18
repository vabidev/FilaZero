// Configurações do sistema FilaZero
module.exports = {
  port: process.env.PORT || 3000,
  sessionSecret: process.env.SESSION_SECRET || 'filazero-secret-key-change-in-production',
  database: {
    filename: './database.sqlite'
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
