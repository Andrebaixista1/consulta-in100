// src/main.js
// Tente renomear para main.mjs, ou confira se o arquivo está como puro JavaScript sem caracteres especiais.

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
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function formatBoolean(value) {
  if (value === null || value === undefined) return '-';
  return value === true || value === 'true' ? 'SIM' : 'NÃO';
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
const loading = document.getElementById('loading');
const loadingOverlay = document.getElementById('loading-overlay');

const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const searchForm = document.getElementById('searchForm');
const resultsSection = document.getElementById('resultsSection');
const resultsError = document.getElementById('resultsError');
const searchBtnText = document.getElementById('searchBtnText');
const queriesCount = document.getElementById('queriesCount');
const amountSpent = document.getElementById('amountSpent');
const loggedUserName = document.getElementById('loggedUserName');
const availableLimitEl = document.getElementById('availableLimit');
const usedPercentageEl = document.getElementById('usedPercentage');
const totalCarregadoEl = document.getElementById('totalCarregado');

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  try {
    loadingOverlay.classList.remove('hidden');
    loading.classList.remove('hidden');
    const res = await fetch('https://api-consulta-in-100.vercel.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: username, senha: password })
    });
    const data = await res.json();
    if (data.error) {
      loginError.textContent = data.error;
      loginError.classList.remove('hidden');
      showToast(data.error, 'error');
    } else {
      loginError.classList.add('hidden');
      loginScreen.classList.add('hidden');
      dashboardScreen.classList.remove('hidden');
      loggedUserName.textContent = data.login;
      if (data.creditos) {
        totalCarregadoEl.textContent = parseInt(data.creditos.total_carregado) || 0;
        availableLimitEl.textContent = parseInt(data.creditos.limite_disponivel) || 0;
        queriesCount.textContent = parseInt(data.creditos.consultas_realizada) || 0;
        amountSpent.textContent = 'R$ 0';
        let usedPerc = 0;
        const totalC = parseInt(data.creditos.total_carregado) || 0;
        const totalR = parseInt(data.creditos.consultas_realizada) || 0;
        if (totalC > 0) {
          usedPerc = (totalR / totalC) * 100;
        }
        usedPercentageEl.textContent = usedPerc.toFixed(2).replace('.', ',') + '%';
      } else {
        totalCarregadoEl.textContent = 0;
        availableLimitEl.textContent = 0;
        queriesCount.textContent = 0;
        usedPercentageEl.textContent = '0,00%';
        amountSpent.textContent = 'R$ 0';
      }
      showToast('Login realizado com sucesso!', 'success');
    }
  } catch (err) {
    loginError.textContent = 'Erro no login.';
    loginError.classList.remove('hidden');
    showToast('Erro no login.', 'error');
    console.error(err);
  }
  finally{
    loadingOverlay.classList.add('hidden');
    loading.classList.add('hidden');
  }
});


// Logout
logoutBtn.addEventListener('click', () => {
  resultsSection.classList.add('hidden');
  searchForm.reset();
  dashboardScreen.classList.add('hidden');
  loginScreen.classList.remove('hidden');
});

// Consulta
searchForm.addEventListener('submit', async (e) => {
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

  searchBtnText.textContent = 'Consultando...';
  resultsSection.classList.add('hidden');
  resultsError.classList.add('hidden');

  try {
    const res = await fetch('https://api-consulta-in-100.vercel.app/api/consulta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, nb, login: userLogin })
    });
    if (!res.ok) {
      throw new Error('Erro na consulta');
    }
    const response = await res.json();

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
      availableLimitEl.textContent = parseInt(response.limite_disponivel) || 0;
      queriesCount.textContent = parseInt(response.consultas_realizada) || 0;
      totalCarregadoEl.textContent = totalCarregadoEl.textContent || 0; // Ajuste se quiser puxar do BD

      let usedPerc = 0;
      if (parseInt(totalCarregadoEl.textContent) > 0) {
        usedPerc = (parseInt(queriesCount.textContent) / parseInt(totalCarregadoEl.textContent)) * 100;
      }
      usedPercentageEl.textContent = usedPerc.toFixed(2).replace('.', ',') + '%';

      amountSpent.textContent = 'R$ 0.00';

      const dataApi = response.consultas_api || {};
      document.getElementById('benefitNumber').textContent = dataApi.numero_beneficio || '-';
      document.getElementById('documentNumber').textContent = dataApi.numero_documento || '-';
      document.getElementById('name').textContent = dataApi.nome || '-';
      document.getElementById('state').textContent = dataApi.estado || '-';
      document.getElementById('alimony').textContent = formatBoolean(dataApi.pensao);
      document.getElementById('birthDate').textContent = formatDate(dataApi.data_nascimento);
      document.getElementById('age').textContent = calculateAge(dataApi.data_nascimento);
      document.getElementById('blockType').textContent = dataApi.tipo_bloqueio || '-';
      document.getElementById('grantDate').textContent = formatDate(dataApi.data_concessao);
      document.getElementById('benefitEndDate').textContent = formatDate(dataApi.data_final_beneficio);
      document.getElementById('creditType').textContent = dataApi.tipo_credito || '-';
      document.getElementById('benefitCardBalance').textContent = formatCurrency(dataApi.saldo_cartao_beneficio);
      document.getElementById('consignedCardBalance').textContent = formatCurrency(dataApi.saldo_cartao_consignado);
      document.getElementById('consignedCreditBalance').textContent = formatCurrency(dataApi.saldo_credito_consignado);
      document.getElementById('benefitStatus').textContent = dataApi.situacao_beneficio || '-';
      document.getElementById('legalRepresentativeName').textContent = dataApi.nome_representante_legal || '-';
      document.getElementById('bankInfo').textContent = dataApi.banco_desembolso || '-';
      document.getElementById('agencyCode').textContent = dataApi.agencia_desembolso || '-';
      document.getElementById('accountNumber').textContent = dataApi.conta_desembolso || '-';
      document.getElementById('accountDigit').textContent = dataApi.digito_desembolso || '-';
      document.getElementById('numberOfActiveSuspendedReservations').textContent = dataApi.numero_portabilidades || '0';

      resultsSection.classList.remove('hidden');
      showToast('Consulta realizada com sucesso!', 'success');
    }
  } catch (error) {
    resultsError.textContent = 'Erro ao consultar os dados. Tente novamente.';
    resultsError.classList.remove('hidden');
    showToast('Erro na consulta. Verifique os dados e tente novamente.', 'error');
    console.error(error);
  } finally {
    searchBtnText.textContent = 'Pesquisar';
  }
});

// Máscara CPF
document.getElementById('cpf').addEventListener('input', (e) => {
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

// Máscara NB
document.getElementById('nb').addEventListener('input', (e) => {
  let numbers = e.target.value.replace(/\D/g, '');
  console.log("Numbers on input:", numbers);
  if (numbers.length > 10) {
    numbers = numbers.substring(0, 10);
  }
  if (numbers.length >= 10) {
    e.target.value =
      numbers.substring(0, 3) + '.' +
      numbers.substring(3, 6) + '.' +
      numbers.substring(6, 9) + '-' +
      numbers.substring(9, 10);
  } else {
    e.target.value = numbers;
  }
  console.log("NB value:", e.target.value);
});
