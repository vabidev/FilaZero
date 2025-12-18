// Gerenciamento de tema (claro/escuro)
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
  }
}

// Menu mobile
function toggleMobileMenu() {
  const menu = document.querySelector('.navbar-menu');
  menu.classList.toggle('active');
}

// Fechar menu ao clicar em link
document.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll('.navbar-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('.navbar-menu');
      if (menu.classList.contains('active')) {
        menu.classList.remove('active');
      }
    });
  });
});

// Carregar configurações do negócio
async function loadBusinessSettings() {
  try {
    const response = await fetch('/api/settings');
    const settings = await response.json();
    
    // Atualizar título da página
    if (settings.business_name) {
      document.title = settings.business_name;
      const logoElements = document.querySelectorAll('.navbar-logo, .business-name');
      logoElements.forEach(el => {
        if (el) el.textContent = settings.business_name;
      });
    }

    // Atualizar descrição
    if (settings.business_description) {
      const descElements = document.querySelectorAll('.business-description');
      descElements.forEach(el => {
        if (el) el.textContent = settings.business_description;
      });
    }

    return settings;
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    return null;
  }
}

// Formatar moeda
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Formatar data
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

// Formatar hora
function formatTime(timeString) {
  return timeString.substring(0, 5);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background-color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--accent-primary)'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--shadow);
    z-index: 9999;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Animações de entrada
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Inicializar tema ao carregar
initTheme();
