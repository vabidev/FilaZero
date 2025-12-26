function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const curr = document.documentElement.getAttribute('data-theme');
  const next = curr === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (btn) btn.innerHTML = theme === 'light' ? '<i class="icon-moon"></i>' : '<i class="icon-sun"></i>';
}

function toggleMobileMenu() {
  document.querySelector('.navbar-menu')?.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.navbar-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelector('.navbar-menu')?.classList.remove('active');
    });
  });
});

async function loadBusinessSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    
    if (data.business_name) {
      document.title = data.business_name;
      document.querySelectorAll('.navbar-logo, .business-name').forEach(el => {
        el.textContent = data.business_name;
      });
    }

    if (data.business_description) {
      document.querySelectorAll('.business-description').forEach(el => {
        el.textContent = data.business_description;
      });
    }

    return data;
  } catch (err) {
    console.error('Erro ao carregar configurações:', err);
    return null;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(str) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(str + 'T00:00:00'));
}

function formatTime(str) {
  return str.substring(0, 5);
}

function showNotification(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = 'toast-notification';
  el.textContent = msg;
  
  const colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--accent-primary)' };
  el.style.cssText = `
    position: fixed; top: 16px; right: 16px;
    padding: 12px 20px; background: ${colors[type] || colors.info};
    color: #fff; border-radius: 6px; z-index: 999;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transform: translateX(100%); opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  `;

  document.body.appendChild(el);
  
  requestAnimationFrame(() => {
    el.style.transform = 'translateX(0)';
    el.style.opacity = '1';
  });
  
  setTimeout(() => {
    el.style.transform = 'translateX(100%)';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

initTheme();
