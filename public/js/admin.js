async function checkAuth() {
  try {
    const res = await fetch('/api/check-auth');
    const data = await res.json();
    
    if (!data.authenticated) {
      window.location.href = '/admin/login';
      return false;
    }
    
    const userEl = document.getElementById('admin-username');
    if (userEl && data.username) userEl.textContent = data.username;
    
    return true;
  } catch (e) {
    window.location.href = '/admin/login';
    return false;
  }
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' }).catch(() => {});
  window.location.href = '/admin/login';
}

function toggleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  sidebar.classList.toggle('active');
  
  if (!overlay && sidebar.classList.contains('active')) {
    const el = document.createElement('div');
    el.className = 'sidebar-overlay';
    el.onclick = toggleSidebar;
    document.body.appendChild(el);
  } else if (overlay) {
    overlay.remove();
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

function confirmDelete(msg) {
  return confirm(msg || 'Tem certeza que deseja excluir?');
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initTheme();
});
