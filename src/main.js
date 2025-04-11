// src/main.js
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}
function calculateAge(birthDate) {
  if (!birthDate) return '-';
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
function formatCurrency(value) {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
function formatBoolean(value) {
  if (value === null || value === undefined) return '-';
  return value === 'true' || value === true ? 'SIM' : 'NÃO';
}
function formatBankInfo(bankAccount) {
  if (!bankAccount) return '-';
  return `${bankAccount.bankCode} - ${bankAccount.bankName}`;
}
function showToast(message, type = 'success') {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    style: {
      background: type === 'success' ? 'green' : 'red'
    }
  }).showToast();
}

const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const searchForm = document.getElementById('searchForm');
const resultsSection = document.getElementById('resultsSection');
const resultsError = document.getElementById('resultsError');
const searchSpinner = document.getElementById('searchSpinner');
const searchBtnText = document.getElementById('searchBtnText');
const queriesCount = document.getElementById('queriesCount');
const amountSpent = document.getElementById('amountSpent');
const loggedUserName = document.getElementById('loggedUserName');
const availableLimitEl = document.getElementById('availableLimit');
const usedPercentageEl = document.getElementById('usedPercentage');
const totalCarregadoEl = document.getElementById('totalCarregado');

let limitCount = 50;
let totalCarregado = 100;

availableLimitEl.textContent = limitCount;
totalCarregadoEl.textContent = totalCarregado;

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: username, senha: password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      loginError.textContent = data.error;
      loginError.classList.remove('hidden');
      showToast(data.error, 'error');
    } else {
      loginError.classList.add('hidden');
      loginScreen.classList.add('hidden');
      dashboardScreen.classList.remove('hidden');
      queriesCount.textContent = '0';
      amountSpent.textContent = 'R$ 0,00';
      loggedUserName.textContent = data.login;
    }
  })
  .catch(err => {
    loginError.textContent = 'Erro no login.';
    loginError.classList.remove('hidden');
    showToast('Erro no login.', 'error');
    console.error(err);
  });
});

logoutBtn.addEventListener('click', function() {
  resultsSection.classList.add('hidden');
  searchForm.reset();
  dashboardScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

async function consultarBeneficio(cpf, nb, userLogin) {
  try {
    const response = await fetch('/api/consulta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, nb, login: userLogin })
    });
    if (!response.ok) {
      throw new Error('Erro na consulta');
    }
    return await response.json();
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    throw error;
  }
}

searchForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const cpf = document.getElementById('cpf').value;
  const nb = document.getElementById('nb').value;
  const userLogin = loggedUserName.textContent;
  if (!cpf || !nb) {
    resultsError.textContent = 'Por favor, preencha ambos os campos (CPF e NB)';
    resultsError.classList.remove('hidden');
    showToast('Preencha os campos de CPF e NB', 'error');
    return;
  }
  searchSpinner.classList.remove('hidden');
  searchBtnText.textContent = 'Consultando...';
  resultsSection.classList.add('hidden');
  resultsError.classList.add('hidden');
  try {
    const response = await consultarBeneficio(cpf, nb, userLogin);
    if (response.error) {
      resultsError.textContent = response.error;
      resultsError.classList.remove('hidden');
      showToast(response.error, 'error');
      return;
    }
    if (!response || Object.keys(response).length === 0) {
      showToast('Nenhum dado retornado para esta consulta.', 'error');
      resultsError.textContent = 'Nenhum dado encontrado.';
      resultsError.classList.remove('hidden');
    } else {
      const newCount = parseInt(queriesCount.textContent) + 1;
      queriesCount.textContent = newCount;
      amountSpent.textContent = `R$ ${(newCount * 0.05).toFixed(2)}`;
      const usedPerc = (newCount / limitCount) * 100;
      usedPercentageEl.textContent = usedPerc.toFixed(2) + '%';
      document.getElementById('benefitNumber').textContent = response.benefitNumber || '-';
      document.getElementById('documentNumber').textContent = response.documentNumber || '-';
      document.getElementById('name').textContent = response.name || '-';
      document.getElementById('state').textContent = response.state || '-';
      document.getElementById('alimony').textContent = formatBoolean(response.alimony);
      document.getElementById('birthDate').textContent = formatDate(response.birthDate);
      document.getElementById('age').textContent = calculateAge(response.birthDate);
      document.getElementById('blockType').textContent = response.blockType || '-';
      document.getElementById('grantDate').textContent = formatDate(response.grantDate);
      document.getElementById('benefitEndDate').textContent = formatDate(response.benefitEndDate);
      document.getElementById('creditType').textContent = response.creditType || '-';
      document.getElementById('benefitCardLimit').textContent = formatCurrency(response.benefitCardLimit);
      document.getElementById('benefitCardBalance').textContent = formatCurrency(response.benefitCardBalance);
      document.getElementById('availableTotalBalance').textContent = formatCurrency(response.availableTotalBalance);
      document.getElementById('benefitStatus').textContent = response.benefitStatus || '-';
      document.getElementById('legalRepresentativeName').textContent = response.legalRepresentativeName || '-';
      document.getElementById('bankInfo').textContent = formatBankInfo({
        bankCode: response.bankCode,
        bankName: response.bankName
      });
      document.getElementById('agencyCode').textContent = response.agencyCode || '-';
      document.getElementById('accountNumber').textContent = response.accountNumber || '-';
      document.getElementById('accountDigit').textContent = response.accountDigit || '-';
      document.getElementById('numberOfActiveReservations').textContent = response.numberOfActiveReservations || '0';
      resultsSection.classList.remove('hidden');
      showToast('Consulta realizada com sucesso!');
    }
  } catch (error) {
    resultsError.textContent = 'Erro ao consultar os dados. Tente novamente.';
    resultsError.classList.remove('hidden');
    showToast('Erro na consulta. Verifique os dados e tente novamente.', 'error');
  } finally {
    searchSpinner.classList.add('hidden');
    searchBtnText.textContent = 'Pesquisar';
  }
});

document.getElementById('cpf').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 3) {
    value = value.substring(0, 3) + '.' + value.substring(3);
  }
  if (value.length > 7) {
    value = value.substring(0, 7) + '.' + value.substring(7);
  }
  if (value.length > 11) {
    value = value.substring(0, 11) + '-' + value.substring(11);
  }
  e.target.value = value.substring(0, 14);
});

document.getElementById('nb').addEventListener('input', function(e) {
  let numbers = e.target.value.replace(/\D/g, '');
  if (numbers.length > 10) {
    numbers = numbers.substring(0, 10);
  }
  if (numbers.length >= 9) {
    e.target.value = numbers.substring(0,3) + '.' + 
                     numbers.substring(3,6) + '.' + 
                     numbers.substring(6,9) + '-' +
                     numbers.substring(9,10);
  } else if (numbers.length >= 6) {
    e.target.value = numbers.substring(0,3) + '.' + 
                     numbers.substring(3,6) + '.' + 
                     numbers.substring(6);
  } else if (numbers.length >= 3) {
    e.target.value = numbers.substring(0,3) + '.' + 
                     numbers.substring(3);
  } else {
    e.target.value = numbers;
  }
});
