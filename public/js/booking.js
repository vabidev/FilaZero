// Estado do agendamento
let bookingData = {
  service: null,
  date: null,
  time: null,
  client: {}
};

let currentStep = 1;
let services = [];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  setMinDate();
  loadBusinessSettings();
});

// Definir data mínima como hoje
function setMinDate() {
  const dateInput = document.getElementById('appointment-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
}

// Carregar serviços
async function loadServices() {
  try {
    const response = await fetch('/api/services/active');
    services = await response.json();
    
    const servicesList = document.getElementById('services-list');
    
    if (services.length === 0) {
      servicesList.innerHTML = '<p class="text-muted">Nenhum serviço disponível no momento.</p>';
      return;
    }

    servicesList.innerHTML = services.map(service => `
      <div class="service-card" onclick="selectService(${service.id})">
        <h3 class="card-title">${service.name}</h3>
        <p class="card-text">${service.description || ''}</p>
        <p class="card-text"><strong>Duração:</strong> ${service.duration} minutos</p>
        ${service.price ? `<p class="card-text"><strong>Valor:</strong> ${formatCurrency(service.price)}</p>` : ''}
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
    showNotification('Erro ao carregar serviços', 'error');
  }
}

// Selecionar serviço
function selectService(serviceId) {
  // Remover seleção anterior
  document.querySelectorAll('.service-card').forEach(card => {
    card.classList.remove('selected');
  });

  // Adicionar seleção
  event.currentTarget.classList.add('selected');

  bookingData.service = services.find(s => s.id === serviceId);
  document.getElementById('btn-step1').disabled = false;
}

// Carregar horários disponíveis
async function loadAvailableTimes() {
  const dateInput = document.getElementById('appointment-date');
  const date = dateInput.value;

  if (!date || !bookingData.service) {
    return;
  }

  bookingData.date = date;

  try {
    const response = await fetch(`/api/available-times?date=${date}&service_id=${bookingData.service.id}`);
    const times = await response.json();

    const timeSlotsContainer = document.getElementById('time-slots');

    if (times.length === 0) {
      timeSlotsContainer.innerHTML = '<p class="text-muted">Nenhum horário disponível nesta data.</p>';
      return;
    }

    timeSlotsContainer.innerHTML = times.map(time => `
      <div class="time-slot" onclick="selectTime('${time}')">
        ${time}
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar horários:', error);
    showNotification('Erro ao carregar horários disponíveis', 'error');
  }
}

// Selecionar horário
function selectTime(time) {
  // Remover seleção anterior
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.classList.remove('selected');
  });

  // Adicionar seleção
  event.currentTarget.classList.add('selected');

  bookingData.time = time;
  document.getElementById('btn-step2').disabled = false;
}

// Navegar entre passos
function nextStep() {
  if (currentStep === 3) {
    // Validar formulário
    const form = document.getElementById('client-form');
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();

    if (!name || !phone) {
      showNotification('Preencha os campos obrigatórios', 'error');
      return;
    }

    bookingData.client = {
      name: name,
      phone: phone,
      email: document.getElementById('client-email').value.trim(),
      notes: document.getElementById('client-notes').value.trim()
    };

    // Mostrar resumo
    showSummary();
  }

  if (currentStep < 5) {
    changeStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 1) {
    changeStep(currentStep - 1);
  }
}

function changeStep(step) {
  // Ocultar passo atual
  const currentStepElement = document.querySelector(`.booking-step[data-step="${currentStep}"]`);
  const currentStepIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
  
  if (currentStepElement) {
    currentStepElement.classList.remove('active');
  }
  if (currentStepIndicator) {
    currentStepIndicator.classList.remove('active');
  }

  // Mostrar novo passo
  currentStep = step;
  const newStepElement = document.querySelector(`.booking-step[data-step="${currentStep}"]`);
  const newStepIndicator = document.querySelector(`.step[data-step="${currentStep}"]`);
  
  if (newStepElement) {
    newStepElement.classList.add('active');
  }
  if (newStepIndicator) {
    newStepIndicator.classList.add('active');
  }

  // Marcar passos anteriores como completos
  for (let i = 1; i < currentStep; i++) {
    const stepIndicator = document.querySelector(`.step[data-step="${i}"]`);
    if (stepIndicator) {
      stepIndicator.classList.add('completed');
    }
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mostrar resumo
function showSummary() {
  const summary = document.getElementById('booking-summary');
  
  summary.innerHTML = `
    <div class="summary-item">
      <strong>Serviço:</strong>
      <span>${bookingData.service.name}</span>
    </div>
    <div class="summary-item">
      <strong>Data:</strong>
      <span>${formatDate(bookingData.date)}</span>
    </div>
    <div class="summary-item">
      <strong>Horário:</strong>
      <span>${bookingData.time}</span>
    </div>
    <div class="summary-item">
      <strong>Duração:</strong>
      <span>${bookingData.service.duration} minutos</span>
    </div>
    ${bookingData.service.price ? `
      <div class="summary-item">
        <strong>Valor:</strong>
        <span>${formatCurrency(bookingData.service.price)}</span>
      </div>
    ` : ''}
    <div class="summary-item">
      <strong>Nome:</strong>
      <span>${bookingData.client.name}</span>
    </div>
    <div class="summary-item">
      <strong>Telefone:</strong>
      <span>${bookingData.client.phone}</span>
    </div>
    ${bookingData.client.email ? `
      <div class="summary-item">
        <strong>E-mail:</strong>
        <span>${bookingData.client.email}</span>
      </div>
    ` : ''}
    ${bookingData.client.notes ? `
      <div class="summary-item">
        <strong>Observações:</strong>
        <span>${bookingData.client.notes}</span>
      </div>
    ` : ''}
  `;
}

// Confirmar agendamento
async function confirmBooking() {
  const requestData = {
    name: bookingData.client.name,
    phone: bookingData.client.phone,
    email: bookingData.client.email || '',
    service_id: bookingData.service.id,
    appointment_date: bookingData.date,
    appointment_time: bookingData.time,
    notes: bookingData.client.notes || ''
  };

  console.log('Enviando agendamento:', requestData);

  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    console.log('Status da resposta:', response.status);

    const result = await response.json();
    console.log('Resultado:', result);

    if (result.success) {
      changeStep(5);
    } else {
      showNotification(result.message || 'Erro ao criar agendamento', 'error');
    }
  } catch (error) {
    console.error('Erro completo:', error);
    showNotification('Erro ao confirmar agendamento', 'error');
  }
}
