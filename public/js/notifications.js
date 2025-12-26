// Sistema de Notificações usando LocalStorage

// Obter telefone do usuário atual do LocalStorage
function getCurrentUserPhone() {
  return localStorage.getItem('userPhone') || null;
}

// Salvar telefone do usuário
function setCurrentUserPhone(phone) {
  localStorage.setItem('userPhone', phone);
}

// Obter notificações do usuário
function getUserNotifications(phone) {
  if (!phone) return [];
  const key = `notifications_${phone}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Salvar notificações do usuário
function saveUserNotifications(phone, notifications) {
  if (!phone) return;
  const key = `notifications_${phone}`;
  localStorage.setItem(key, JSON.stringify(notifications));
}

// Adicionar nova notificação
function addNotification(phone, type, appointmentData) {
  if (!phone) return;
  
  const notifications = getUserNotifications(phone);
  
  let title = '';
  let message = '';
  let icon = '';
  
  switch(type) {
    case 'pending':
      title = 'Pedido Aguardando Confirmação';
      message = `Seu agendamento para ${appointmentData.serviceName} em ${formatDate(appointmentData.date)} às ${appointmentData.time} está aguardando confirmação.`;
      icon = '⏳';
      break;
    case 'confirmed':
      title = 'Pedido Confirmado';
      message = `Seu agendamento para ${appointmentData.serviceName} em ${formatDate(appointmentData.date)} às ${appointmentData.time} foi confirmado!`;
      icon = '✅';
      break;
    case 'cancelled':
      title = 'Pedido Cancelado';
      message = `Seu agendamento para ${appointmentData.serviceName} em ${formatDate(appointmentData.date)} às ${appointmentData.time} foi cancelado.`;
      icon = '❌';
      break;
    case 'completed':
      title = 'Pedido Concluído';
      message = `Seu agendamento para ${appointmentData.serviceName} foi concluído. Obrigado!`;
      icon = '🎉';
      break;
  }
  
  const notification = {
    id: Date.now(),
    type,
    title,
    message,
    icon,
    appointmentId: appointmentData.id,
    read: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.unshift(notification); // Adiciona no início
  
  // Limitar a 50 notificações
  if (notifications.length > 50) {
    notifications.splice(50);
  }
  
  saveUserNotifications(phone, notifications);
  updateNotificationBadge();
}

// Marcar notificação como lida
function markAsRead(phone, notificationId) {
  const notifications = getUserNotifications(phone);
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    saveUserNotifications(phone, notifications);
    updateNotificationBadge();
  }
}

// Marcar todas como lidas
function markAllAsRead(phone) {
  const notifications = getUserNotifications(phone);
  notifications.forEach(n => n.read = true);
  saveUserNotifications(phone, notifications);
  updateNotificationBadge();
}

// Obter contagem de não lidas
function getUnreadCount(phone) {
  if (!phone) return 0;
  const notifications = getUserNotifications(phone);
  return notifications.filter(n => !n.read).length;
}

// Atualizar badge do sino
function updateNotificationBadge() {
  const phone = getCurrentUserPhone();
  const count = getUnreadCount(phone);
  const badge = document.getElementById('notification-badge');
  const badgeMobile = document.getElementById('notification-badge-mobile');
  
  const updateBadge = (el) => {
    if (el) {
      if (count > 0) {
        el.textContent = count > 99 ? '99+' : count;
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  };
  
  updateBadge(badge);
  updateBadge(badgeMobile);
}

// Renderizar notificações
function renderNotifications() {
  const phone = getCurrentUserPhone();
  const notifications = getUserNotifications(phone);
  const container = document.getElementById('notifications-list');
  
  if (!container) return;
  
  if (notifications.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 2rem; text-align: center;">
        <p style="color: var(--text-secondary); font-size: 0.95rem;">Nenhuma notificação</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = notifications.map(n => `
    <div class="notification-item ${n.read ? 'read' : 'unread'}" onclick="markNotificationAsRead(${n.id})">
      <div class="notification-icon">${n.icon}</div>
      <div class="notification-content">
        <div class="notification-title">${n.title}</div>
        <div class="notification-message">${n.message}</div>
        <div class="notification-time">${formatNotificationTime(n.createdAt)}</div>
      </div>
    </div>
  `).join('');
}

// Marcar notificação como lida (handler)
function markNotificationAsRead(notificationId) {
  const phone = getCurrentUserPhone();
  markAsRead(phone, notificationId);
  renderNotifications();
}

// Abrir/Fechar dropdown de notificações
function openNotifications(event) {
  event.stopPropagation();
  const phone = getCurrentUserPhone();
  
  if (!phone) {
    showNotification('Faça um agendamento primeiro para ver suas notificações', 'info');
    return;
  }
  
  let dropdown = document.getElementById('notifications-dropdown');
  let overlay = document.getElementById('notifications-overlay');
  
  // No mobile, mover o dropdown para o body para escapar do contexto de stacking da navbar
  if (window.innerWidth <= 768 && dropdown.parentElement !== document.body) {
    document.body.appendChild(dropdown);
  }
  
  // Criar overlay se não existir (para mobile)
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'notifications-overlay';
    overlay.className = 'notifications-overlay';
    overlay.onclick = closeNotificationsDropdown;
    document.body.appendChild(overlay);
  }
  
  if (dropdown.classList.contains('show')) {
    dropdown.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  } else {
    renderNotifications();
    dropdown.classList.add('show');
    
    // Ativar overlay apenas em mobile
    if (window.innerWidth <= 768) {
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }
}

// Fechar dropdown ao clicar fora
function closeNotificationsDropdown() {
  const dropdown = document.getElementById('notifications-dropdown');
  const overlay = document.getElementById('notifications-overlay');
  
  if (dropdown) {
    dropdown.classList.remove('show');
  }
  if (overlay) {
    overlay.classList.remove('show');
  }
  document.body.style.overflow = '';
}

// Adicionar listener para fechar ao clicar fora
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('notifications-dropdown');
      const bell = document.querySelector('.notification-bell');
      
      if (dropdown && !dropdown.contains(e.target) && !bell.contains(e.target)) {
        closeNotificationsDropdown();
      }
    });
  });
} else {
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notifications-dropdown');
    const bell = document.querySelector('.notification-bell');
    
    if (dropdown && !dropdown.contains(e.target) && !bell.contains(e.target)) {
      closeNotificationsDropdown();
    }
  });
}

// Formatar tempo da notificação
function formatNotificationTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Agora';
  if (minutes < 60) return `${minutes} min atrás`;
  if (hours < 24) return `${hours}h atrás`;
  if (days < 7) return `${days}d atrás`;
  
  return formatDate(date.toISOString().split('T')[0]);
}

// Verificar atualizações de status (polling)
let lastCheckTime = null;

async function checkForStatusUpdates() {
  const phone = getCurrentUserPhone();
  if (!phone) return;
  
  try {
    // Buscar agendamentos do usuário
    const response = await fetch(`/api/appointments?phone=${encodeURIComponent(phone)}`);
    const appointments = await response.json();
    
    const notifications = getUserNotifications(phone);
    
    appointments.forEach(apt => {
      // Verificar se já existe notificação para este agendamento
      const existingNotification = notifications.find(n => 
        n.appointmentId === apt.id && n.type === apt.status
      );
      
      // Se não existe ou o status mudou, criar nova notificação
      if (!existingNotification) {
        const previousNotification = notifications.find(n => n.appointmentId === apt.id);
        
        // Só adiciona se for uma mudança de status ou novo agendamento
        if (!previousNotification || previousNotification.type !== apt.status) {
          addNotification(phone, apt.status, {
            id: apt.id,
            serviceName: apt.service_name,
            date: apt.appointment_date,
            time: apt.appointment_time
          });
        }
      }
    });
    
  } catch (error) {
    console.error('Erro ao verificar atualizações:', error);
  }
}

// Inicializar sistema de notificações
function initNotifications() {
  updateNotificationBadge();
  
  // Verificar atualizações a cada 30 segundos se houver telefone
  if (getCurrentUserPhone()) {
    checkForStatusUpdates();
    setInterval(checkForStatusUpdates, 30000);
  }
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotifications);
} else {
  initNotifications();
}
