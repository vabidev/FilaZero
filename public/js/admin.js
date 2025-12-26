// Verificar autenticação
async function checkAuth() {
  try {
    const response = await fetch('/api/check-auth');
    const result = await response.json();
    
    if (!result.authenticated) {
      window.location.href = '/admin/login';
      return false;
    }
    
    // Atualizar nome do usuário se houver elemento
    const usernameElement = document.getElementById('admin-username');
    if (usernameElement && result.username) {
      usernameElement.textContent = result.username;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    window.location.href = '/admin/login';
    return false;
  }
}

// Logout
async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
}

// Toggle sidebar mobile
function toggleSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  sidebar.classList.toggle('active');
  
  // Criar overlay se não existir
  if (!overlay && sidebar.classList.contains('active')) {
    const newOverlay = document.createElement('div');
    newOverlay.className = 'sidebar-overlay';
    newOverlay.onclick = toggleSidebar;
    document.body.appendChild(newOverlay);
  } else if (overlay) {
    overlay.remove();
  }
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Confirmar exclusão
function confirmDelete(message) {
  return confirm(message || 'Tem certeza que deseja excluir este item?');
}

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initTheme();
});
