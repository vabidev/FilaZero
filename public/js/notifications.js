function getCurrentUserPhone() {
  return localStorage.getItem('userPhone') || null;
}

function setCurrentUserPhone(phone) {
  localStorage.setItem('userPhone', phone);
}

function getUserNotifications(phone) {
  if (!phone) return [];
  const data = localStorage.getItem(`notifications_${phone}`);
  return data ? JSON.parse(data) : [];
}

function saveUserNotifications(phone, notifications) {
  if (!phone) return;
  localStorage.setItem(`notifications_${phone}`, JSON.stringify(notifications));
}

function addNotification(phone, type, data) {
  if (!phone) return;
  
  const notifications = getUserNotifications(phone);
  const templates = {
    pending: { title: 'Aguardando Confirmação', icon: '<i class="icon-clock"></i>', msg: `${data.serviceName} - ${formatDate(data.date)} às ${data.time}` },
    confirmed: { title: 'Confirmado', icon: '<i class="icon-check"></i>', msg: `${data.serviceName} - ${formatDate(data.date)} às ${data.time}` },
    cancelled: { title: 'Cancelado', icon: '<i class="icon-x"></i>', msg: `${data.serviceName} - ${formatDate(data.date)} às ${data.time}` },
    completed: { title: 'Concluído', icon: '<i class="icon-party"></i>', msg: `${data.serviceName} finalizado. Obrigado!` }
  };
  
  const t = templates[type] || templates.pending;
  
  notifications.unshift({
    id: Date.now(),
    type,
    title: t.title,
    message: t.msg,
    icon: t.icon,
    appointmentId: data.id,
    read: false,
    createdAt: new Date().toISOString()
  });
  
  if (notifications.length > 50) notifications.splice(50);
  saveUserNotifications(phone, notifications);
  updateNotificationBadge();
}

function markAsRead(phone, id) {
  const notifications = getUserNotifications(phone);
  const n = notifications.find(x => x.id === id);
  if (n) {
    n.read = true;
    saveUserNotifications(phone, notifications);
    updateNotificationBadge();
  }
}

function markAllAsRead(phone) {
  const notifications = getUserNotifications(phone);
  notifications.forEach(n => n.read = true);
  saveUserNotifications(phone, notifications);
  updateNotificationBadge();
}

function getUnreadCount(phone) {
  if (!phone) return 0;
  return getUserNotifications(phone).filter(n => !n.read).length;
}

function updateNotificationBadge() {
  const count = getUnreadCount(getCurrentUserPhone());
  ['notification-badge', 'notification-badge-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = count > 99 ? '99+' : count;
      el.style.display = count > 0 ? 'block' : 'none';
    }
  });
}

function renderNotifications() {
  const phone = getCurrentUserPhone();
  const notifications = getUserNotifications(phone);
  const container = document.getElementById('notifications-list');
  
  if (!container) return;
  
  if (!notifications.length) {
    container.innerHTML = '<div class="empty-state"><p>Nenhuma notificação</p></div>';
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

function markNotificationAsRead(id) {
  markAsRead(getCurrentUserPhone(), id);
  renderNotifications();
}

function openNotifications(e) {
  e.stopPropagation();
  const phone = getCurrentUserPhone();
  
  if (!phone) {
    showNotification('Faça um agendamento para ver notificações', 'info');
    return;
  }
  
  const dropdown = document.getElementById('notifications-dropdown');
  let overlay = document.getElementById('notifications-overlay');
  
  if (window.innerWidth <= 768 && dropdown.parentElement !== document.body) {
    document.body.appendChild(dropdown);
  }
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'notifications-overlay';
    overlay.className = 'notifications-overlay';
    overlay.onclick = closeNotificationsDropdown;
    document.body.appendChild(overlay);
  }
  
  const isOpen = dropdown.classList.toggle('show');
  
  if (isOpen) {
    renderNotifications();
    if (window.innerWidth <= 768) {
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  } else {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function closeNotificationsDropdown() {
  document.getElementById('notifications-dropdown')?.classList.remove('show');
  document.getElementById('notifications-overlay')?.classList.remove('show');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('notifications-dropdown');
  const bell = document.querySelector('.notification-bell');
  if (dropdown && bell && !dropdown.contains(e.target) && !bell.contains(e.target)) {
    closeNotificationsDropdown();
  }
});

function formatNotificationTime(iso) {
  const diff = Date.now() - new Date(iso);
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (mins < 1) return 'Agora';
  if (mins < 60) return `${mins}min`;
  if (hrs < 24) return `${hrs}h`;
  if (days < 7) return `${days}d`;
  return formatDate(new Date(iso).toISOString().split('T')[0]);
}

async function checkForStatusUpdates() {
  const phone = getCurrentUserPhone();
  if (!phone) return;
  
  try {
    const res = await fetch(`/api/appointments?phone=${encodeURIComponent(phone)}`);
    const appointments = await res.json();
    const notifications = getUserNotifications(phone);
    
    appointments.forEach(apt => {
      const exists = notifications.find(n => n.appointmentId === apt.id && n.type === apt.status);
      if (!exists) {
        const prev = notifications.find(n => n.appointmentId === apt.id);
        if (!prev || prev.type !== apt.status) {
          addNotification(phone, apt.status, {
            id: apt.id, serviceName: apt.service_name,
            date: apt.appointment_date, time: apt.appointment_time
          });
        }
      }
    });
  } catch (e) {}
}

function initNotifications() {
  updateNotificationBadge();
  if (getCurrentUserPhone()) {
    checkForStatusUpdates();
    setInterval(checkForStatusUpdates, 30000);
  }
}

document.addEventListener('DOMContentLoaded', initNotifications);
