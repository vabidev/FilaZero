const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database');

// ==================== AUTENTICAÇÃO ====================

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await db.get('SELECT * FROM admins WHERE username = ?', [username]);
    
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Usuário ou senha inválidos' });
    }

    req.session.adminId = admin.id;
    req.session.username = admin.username;
    
    res.json({ success: true, message: 'Login realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao fazer login' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Verificar autenticação
router.get('/check-auth', (req, res) => {
  if (req.session && req.session.adminId) {
    res.json({ authenticated: true, username: req.session.username });
  } else {
    res.json({ authenticated: false });
  }
});

// ==================== CONFIGURAÇÕES ====================

// Obter configurações
router.get('/settings', async (req, res) => {
  try {
    const settings = await db.get('SELECT * FROM settings LIMIT 1');
    if (settings && settings.working_hours) {
      settings.working_hours = JSON.parse(settings.working_hours);
    }
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar configurações' });
  }
});

// Atualizar configurações
router.post('/settings', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const {
      business_name,
      business_description,
      business_phone,
      business_email,
      business_address,
      about_text,
      working_hours,
      theme_mode
    } = req.body;

    const workingHoursJson = typeof working_hours === 'string' 
      ? working_hours 
      : JSON.stringify(working_hours);

    await db.run(`
      UPDATE settings SET
        business_name = ?,
        business_description = ?,
        business_phone = ?,
        business_email = ?,
        business_address = ?,
        about_text = ?,
        working_hours = ?,
        theme_mode = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [
      business_name,
      business_description,
      business_phone,
      business_email,
      business_address,
      about_text,
      workingHoursJson,
      theme_mode
    ]);

    res.json({ success: true, message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar configurações' });
  }
});

// ==================== SERVIÇOS ====================

// Listar todos os serviços
router.get('/services', async (req, res) => {
  try {
    const services = await db.all('SELECT * FROM services ORDER BY name');
    res.json(services);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar serviços' });
  }
});

// Listar serviços ativos (para agendamento público)
router.get('/services/active', async (req, res) => {
  try {
    const services = await db.all('SELECT * FROM services WHERE active = 1 ORDER BY name');
    res.json(services);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar serviços' });
  }
});

// Criar serviço
router.post('/services', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { name, description, duration, price } = req.body;
    
    const result = await db.run(
      'INSERT INTO services (name, description, duration, price) VALUES (?, ?, ?, ?)',
      [name, description, duration, price]
    );

    res.json({ success: true, id: result.id, message: 'Serviço criado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao criar serviço' });
  }
});

// Atualizar serviço
router.put('/services/:id', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { id } = req.params;
    const { name, description, duration, price, active } = req.body;
    
    await db.run(
      'UPDATE services SET name = ?, description = ?, duration = ?, price = ?, active = ? WHERE id = ?',
      [name, description, duration, price, active, id]
    );

    res.json({ success: true, message: 'Serviço atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar serviço' });
  }
});

// Deletar serviço
router.delete('/services/:id', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { id } = req.params;
    await db.run('DELETE FROM services WHERE id = ?', [id]);
    res.json({ success: true, message: 'Serviço deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao deletar serviço' });
  }
});

// ==================== CLIENTES ====================

// Listar todos os clientes
router.get('/clients', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const clients = await db.all('SELECT * FROM clients ORDER BY name');
    res.json(clients);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar clientes' });
  }
});

// Obter histórico de um cliente
router.get('/clients/:id/history', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { id } = req.params;
    const appointments = await db.all(`
      SELECT a.*, s.name as service_name, s.price
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.client_id = ?
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `, [id]);
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar histórico' });
  }
});

// Deletar cliente
router.delete('/clients/:id', async (req, res) => {
  console.log('DELETE /api/clients/:id chamado');
  console.log('Session:', req.session);
  
  if (!req.session || !req.session.adminId) {
    console.log('Não autenticado');
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { id } = req.params;
    console.log('Deletando cliente ID:', id);
    
    // Deletar agendamentos do cliente primeiro
    const resultAppointments = await db.run('DELETE FROM appointments WHERE client_id = ?', [id]);
    console.log('Agendamentos deletados:', resultAppointments);
    
    // Deletar cliente
    const resultClient = await db.run('DELETE FROM clients WHERE id = ?', [id]);
    console.log('Cliente deletado:', resultClient);
    
    return res.status(200).json({ success: true, message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    return res.status(500).json({ success: false, message: 'Erro ao deletar cliente: ' + error.message });
  }
});

// ==================== AGENDAMENTOS ====================

// Listar todos os agendamentos
router.get('/appointments', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    // Auto-completar agendamentos antes de listar
    await autoCompleteAppointments();

    const { date, status } = req.query;
    let query = `
      SELECT a.*, c.name as client_name, c.phone as client_phone, 
             s.name as service_name, s.duration, s.price
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      JOIN services s ON a.service_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      query += ' AND a.appointment_date = ?';
      params.push(date);
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

    const appointments = await db.all(query, params);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos' });
  }
});

// Criar agendamento (público)
router.post('/appointments', async (req, res) => {
  try {
    console.log('Recebendo agendamento:', req.body);
    
    const { name, phone, email, service_id, appointment_date, appointment_time, notes } = req.body;

    // Validação básica
    if (!name || !phone || !service_id || !appointment_date || !appointment_time) {
      console.log('Dados incompletos');
      return res.status(400).json({ success: false, message: 'Dados incompletos' });
    }

    // Verificar se o horário está disponível
    const existing = await db.get(
      'SELECT * FROM appointments WHERE appointment_date = ? AND appointment_time = ? AND status != ?',
      [appointment_date, appointment_time, 'cancelled']
    );

    if (existing) {
      console.log('Horário indisponível');
      return res.status(400).json({ success: false, message: 'Horário indisponível' });
    }

    // Verificar se o cliente já existe
    let client = await db.get('SELECT * FROM clients WHERE phone = ?', [phone]);
    
    if (!client) {
      console.log('Criando novo cliente');
      // Criar novo cliente
      const clientResult = await db.run(
        'INSERT INTO clients (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email || null]
      );
      client = { id: clientResult.id };
    } else {
      console.log('Cliente existente:', client.id);
      // Atualizar informações do cliente se necessário
      if (client.name !== name || client.email !== email) {
        await db.run(
          'UPDATE clients SET name = ?, email = ? WHERE id = ?',
          [name, email || client.email, client.id]
        );
      }
    }

    console.log('Criando agendamento para cliente:', client.id);
    
    // Criar agendamento
    const result = await db.run(
      'INSERT INTO appointments (client_id, service_id, appointment_date, appointment_time, notes) VALUES (?, ?, ?, ?, ?)',
      [client.id, service_id, appointment_date, appointment_time, notes || null]
    );

    console.log('Agendamento criado com sucesso:', result.id);
    
    return res.status(200).json({ success: true, id: result.id, message: 'Agendamento criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(500).json({ success: false, message: 'Erro ao criar agendamento: ' + error.message });
  }
});

// Atualizar status do agendamento
router.put('/appointments/:id/status', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar status' });
  }
});

// Deletar agendamento
router.delete('/appointments/:id', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { id } = req.params;
    await db.run('DELETE FROM appointments WHERE id = ?', [id]);
    res.json({ success: true, message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao deletar agendamento' });
  }
});

// Obter horários disponíveis
router.get('/available-times', async (req, res) => {
  try {
    const { date, service_id } = req.query;

    if (!date || !service_id) {
      return res.status(400).json({ success: false, message: 'Data e serviço são obrigatórios' });
    }

    // Verificar se a data está excluída (feriado)
    const excludedDate = await db.get(
      'SELECT * FROM excluded_dates WHERE excluded_date = ?',
      [date]
    );

    if (excludedDate) {
      return res.json([]); // Não há horários disponíveis em dias excluídos
    }

    // Obter configurações de horário de trabalho
    const settings = await db.get('SELECT working_hours FROM settings LIMIT 1');
    const workingHours = settings ? JSON.parse(settings.working_hours) : {};

    // Obter serviço para saber a duração
    const service = await db.get('SELECT duration FROM services WHERE id = ?', [service_id]);
    
    if (!service) {
      return res.status(404).json({ success: false, message: 'Serviço não encontrado' });
    }

    // Determinar o dia da semana
    const dateObj = new Date(date + 'T00:00:00');
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[dateObj.getDay()];

    const dayHours = workingHours[dayName];

    if (!dayHours || !dayHours.start || !dayHours.end) {
      return res.json([]); // Fechado neste dia
    }

    // Obter agendamentos existentes
    const bookedTimes = await db.all(
      'SELECT appointment_time FROM appointments WHERE appointment_date = ? AND status != ?',
      [date, 'cancelled']
    );

    const bookedTimesSet = new Set(bookedTimes.map(b => b.appointment_time));

    // Determinar se é hoje para filtrar horários passados (usando horário do Brasil)
    const today = new Date();
    const brazilTime = new Date(today.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const todayString = brazilTime.toISOString().split('T')[0];
    const isToday = date === todayString;
    
    let currentHour24 = null;
    let currentMinuteNow = null;
    
    if (isToday) {
      currentHour24 = brazilTime.getHours();
      currentMinuteNow = brazilTime.getMinutes();
    }

    // Gerar horários disponíveis
    const availableTimes = [];
    const [startHour, startMinute] = dayHours.start.split(':').map(Number);
    const [endHour, endMinute] = dayHours.end.split(':').map(Number);

    let currentHour = startHour;
    let currentMinute = startMinute;

    // Usar a duração exata do serviço como intervalo
    const interval = service.duration;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      
      // Se for hoje, verificar se o horário é futuro
      let showTime = true;
      if (isToday) {
        if (currentHour < currentHour24) {
          showTime = false; // Hora já passou
        } else if (currentHour === currentHour24 && currentMinute <= currentMinuteNow) {
          showTime = false; // Mesma hora, mas minuto já passou
        }
      }
      
      if (showTime && !bookedTimesSet.has(timeString)) {
        availableTimes.push(timeString);
      }

      // Incrementar baseado na duração do serviço
      currentMinute += interval;
      while (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }

    res.json(availableTimes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao buscar horários disponíveis' });
  }
});

// ==================== DASHBOARD ====================

// Obter estatísticas do dashboard
router.get('/dashboard/stats', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    // Auto-completar agendamentos antes de buscar estatísticas
    await autoCompleteAppointments();

    const today = new Date();
    const brazilTime = new Date(today.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const todayString = brazilTime.toISOString().split('T')[0];

    // Agendamentos de hoje
    const todayAppointments = await db.all(
      `SELECT a.*, c.name as client_name, s.name as service_name, s.duration
       FROM appointments a
       JOIN clients c ON a.client_id = c.id
       JOIN services s ON a.service_id = s.id
       WHERE a.appointment_date = ?
       ORDER BY a.appointment_time`,
      [todayString]
    );

    // Total de clientes
    const clientsCount = await db.get('SELECT COUNT(*) as count FROM clients');

    // Total de serviços ativos
    const servicesCount = await db.get('SELECT COUNT(*) as count FROM services WHERE active = 1');

    // Agendamentos pendentes
    const pendingCount = await db.get(
      'SELECT COUNT(*) as count FROM appointments WHERE status = ? AND appointment_date >= ?',
      ['pending', todayString]
    );

    res.json({
      todayAppointments,
      totalClients: clientsCount.count,
      activeServices: servicesCount.count,
      pendingAppointments: pendingCount.count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas' });
  }
});

// ==================== DIAS EXCLUÍDOS (FERIADOS) ====================

// Listar todos os dias excluídos
router.get('/excluded-dates', async (req, res) => {
  try {
    const dates = await db.all('SELECT * FROM excluded_dates ORDER BY excluded_date');
    res.json(dates);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao buscar datas excluídas' });
  }
});

// Adicionar dia excluído
router.post('/excluded-dates', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { excluded_date, reason } = req.body;
    
    await db.run(
      'INSERT INTO excluded_dates (excluded_date, reason) VALUES (?, ?)',
      [excluded_date, reason]
    );

    res.json({ success: true, message: 'Data excluída adicionada com sucesso' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ success: false, message: 'Esta data já está excluída' });
    } else {
      res.status(500).json({ success: false, message: 'Erro ao adicionar data excluída' });
    }
  }
});

// Remover dia excluído
router.delete('/excluded-dates/:id', async (req, res) => {
  if (!req.session || !req.session.adminId) {
    return res.status(401).json({ success: false, message: 'Não autenticado' });
  }

  try {
    const { id } = req.params;
    await db.run('DELETE FROM excluded_dates WHERE id = ?', [id]);
    res.json({ success: true, message: 'Data excluída removida com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao remover data excluída' });
  }
});

// ==================== AUTO-COMPLETAR AGENDAMENTOS ====================

// Função auxiliar para auto-completar agendamentos
async function autoCompleteAppointments() {
  try {
    const now = new Date();
    const brazilTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const today = brazilTime.toISOString().split('T')[0];
    const currentTime = `${String(brazilTime.getHours()).padStart(2, '0')}:${String(brazilTime.getMinutes()).padStart(2, '0')}`;

    // Buscar agendamentos aprovados de hoje que já passaram
    const appointments = await db.all(`
      SELECT a.*, s.duration
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      WHERE a.status = 'approved' 
        AND (
          (a.appointment_date < ?)
          OR (a.appointment_date = ? AND a.appointment_time < ?)
        )
    `, [today, today, currentTime]);

    // Para cada agendamento, verificar se o horário + duração já passou
    for (const appointment of appointments) {
      const [hour, minute] = appointment.appointment_time.split(':').map(Number);
      const appointmentEnd = new Date(appointment.appointment_date + 'T00:00:00');
      appointmentEnd.setHours(hour);
      appointmentEnd.setMinutes(minute + appointment.duration);

      // Se o horário de fim já passou, marcar como concluído
      if (appointmentEnd < brazilTime) {
        await db.run(
          'UPDATE appointments SET status = ? WHERE id = ?',
          ['completed', appointment.id]
        );
      }
    }

    return appointments.length;
  } catch (error) {
    console.error('Erro ao auto-completar agendamentos:', error);
    return 0;
  }
}

// Endpoint para auto-completar agendamentos (pode ser chamado via cron ou manualmente)
router.post('/auto-complete-appointments', async (req, res) => {
  try {
    const count = await autoCompleteAppointments();
    res.json({ success: true, completed: count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao auto-completar agendamentos' });
  }
});

module.exports = router;
