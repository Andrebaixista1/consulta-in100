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

// --- Elementos Globais ---
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

// --- Elementos do Dropdown Admin ---
const adminDropdownContainer = document.getElementById('adminDropdownContainer');
const adminDropdownToggle = document.getElementById('adminDropdownToggle');
const adminDropdownMenu = document.getElementById('adminDropdownMenu');
const loadCreditBtn = document.getElementById('loadCreditBtn');
const registerUserBtn = document.getElementById('registerUserBtn');

// --- Elementos do Modal de Cadastro ---
const registerUserModal = document.getElementById('registerUserModal');
const modalOverlay = document.getElementById('modalOverlay');
const registerUserForm = document.getElementById('registerUserForm');
const registerNameInput = document.getElementById('registerName');
const registerLoginInput = document.getElementById('registerLogin');
const registerPasswordInput = document.getElementById('registerPassword');
const cancelRegisterBtn = document.getElementById('cancelRegisterBtn');
const saveRegisterBtn = document.getElementById('saveRegisterBtn');
const registerUserError = document.getElementById('registerUserError');
const registerLoading = document.getElementById('registerLoading');

// --- Funções Auxiliares Modal ---
function openRegisterModal() {
    registerUserForm.reset(); // Limpa o formulário
    registerUserError.classList.add('hidden'); // Esconde erros anteriores
    registerLoading.classList.add('hidden'); // Esconde loading
    saveRegisterBtn.disabled = false; // Habilita botão salvar
    registerUserModal.classList.remove('hidden');
}

function closeRegisterModal() {
    registerUserModal.classList.add('hidden');
}

// --- Event Listeners ---

// --- Funções auxiliares para criptografia ---
function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function tryDecrypt(password) {
  try {
    // Assume que a senha criptografada é base64
    const decrypted = b64DecodeUnicode(password);
    // Se decifrou sem erros, retorna a senha decifrada
    return decrypted;
  } catch (e) {
    // Se falhar a decifrar (não é base64), retorna null
    return null;
  }
}


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
          body: JSON.stringify({ login: username, senha: password }),
      });

      let data = await res.json();

      if (data.senha_criptografada) {
          const decryptedPassword = tryDecrypt(data.senha_criptografada);
          data.senha = decryptedPassword || password;
      }
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

      // Lógica para mostrar/esconder o dropdown do admin
      if (data.login === 'andrefelipe') {
        adminDropdownContainer.classList.remove('hidden');
      } else {
        adminDropdownContainer.classList.add('hidden');
      }
      // Garante que o menu esteja escondido ao logar
      adminDropdownMenu.classList.add('hidden');
  
      if (data.creditos) {
        totalCarregadoEl.textContent = parseInt(data.creditos.total_carregado) || 0;
        availableLimitEl.textContent = parseInt(data.creditos.limite_disponivel) || 0;
        queriesCount.textContent = parseInt(data.creditos.consultas_realizada) || 0;
        amountSpent.textContent = 'R$ 0'; // Ajuste se necessário
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
  // Esconder o dropdown do admin no logout
  adminDropdownContainer.classList.add('hidden');
  adminDropdownMenu.classList.add('hidden');
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
       // Tenta ler o corpo do erro, se houver
       let errorMsg = 'Erro na consulta';
       try {
         const errorData = await res.json();
         if (errorData && errorData.error) {
           errorMsg = errorData.error;
         } else if (res.statusText) {
            errorMsg = `Erro ${res.status}: ${res.statusText}`;
         }
       } catch (parseError) {
         // Se não conseguir parsear o JSON, usa o statusText
         errorMsg = `Erro ${res.status}: ${res.statusText}`;
       }
       throw new Error(errorMsg);
    }
    const response = await res.json();

    if (response.error) {
      resultsError.textContent = response.error;
      resultsError.classList.remove('hidden');
      showToast(response.error, 'error');
      return; // Retorna aqui para não tentar processar dados inexistentes
    }

    // Atualizar contadores/limites do dashboard com base na resposta da consulta
    availableLimitEl.textContent = parseInt(response.limite_disponivel) ?? parseInt(availableLimitEl.textContent) ?? 0;
    queriesCount.textContent = parseInt(response.consultas_realizada) ?? parseInt(queriesCount.textContent) ?? 0;
    // Preserva o total carregado, pois a consulta não o retorna diretamente
    const currentTotalCarregado = parseInt(totalCarregadoEl.textContent) || 0;
    totalCarregadoEl.textContent = currentTotalCarregado;

    let usedPerc = 0;
    if (currentTotalCarregado > 0) {
        usedPerc = (parseInt(queriesCount.textContent) / currentTotalCarregado) * 100;
    }
    usedPercentageEl.textContent = usedPerc.toFixed(2).replace('.', ',') + '%';
    // TODO: Calcular amountSpent se necessário

    // Verifica se a API retornou os detalhes da consulta
    if (!response.consultas_api || Object.keys(response.consultas_api).length === 0) {
      showToast('Consulta realizada, mas dados do benefício não encontrados.', 'warning'); // Usar warning se a consulta foi ok mas sem dados
      resultsError.textContent = 'Dados do benefício não encontrados para esta consulta.';
      resultsError.classList.remove('hidden');
      resultsSection.classList.add('hidden'); // Esconde a seção de resultados se não houver dados
    } else {
      const dataApi = response.consultas_api;
      // Preenche os campos com os dados da API
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

      resultsSection.classList.remove('hidden'); // Mostra a seção de resultados
      resultsError.classList.add('hidden'); // Esconde qualquer erro anterior
      showToast('Consulta realizada com sucesso!', 'success');
    }
  } catch (error) {
    resultsError.textContent = error.message || 'Erro ao consultar os dados. Tente novamente.';
    resultsError.classList.remove('hidden');
    resultsSection.classList.add('hidden'); // Esconde a seção de resultados em caso de erro
    showToast(error.message || 'Erro na consulta. Verifique os dados e tente novamente.', 'error');
    console.error(error);
  } finally {
    searchBtnText.textContent = 'Pesquisar';
  }
});

// Máscara CPF
document.getElementById('cpf').addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) {
    value = value.substring(0, 11);
  }
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  e.target.value = value;
});

// Máscara NB
document.getElementById('nb').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})$/, '$1.$2');
    }
    e.target.value = value;
});


// --- Dropdown Admin ---
adminDropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede que o clique se propague para o document
    adminDropdownMenu.classList.toggle('hidden');
});

// Fechar o dropdown se clicar fora dele
document.addEventListener('click', (event) => {
    // Verifica se o clique foi fora do container do dropdown E se o menu não está escondido
    if (adminDropdownContainer && !adminDropdownContainer.contains(event.target) && adminDropdownMenu && !adminDropdownMenu.classList.contains('hidden')) {
        adminDropdownMenu.classList.add('hidden');
    }
});

loadCreditBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('Clicou em Carregar Credito');
  showToast('Funcionalidade "Carregar Credito" ainda não implementada.');
  adminDropdownMenu.classList.add('hidden');
  // TODO: Implementar modal/lógica para carregar crédito
});

// --- Modal Cadastro Usuário ---
registerUserBtn.addEventListener('click', (e) => {
  e.preventDefault();
  adminDropdownMenu.classList.add('hidden'); // Esconde o dropdown
  openRegisterModal(); // Abre o modal de cadastro
});

cancelRegisterBtn.addEventListener('click', () => {
  closeRegisterModal();
});

modalOverlay.addEventListener('click', () => {
  closeRegisterModal();
});

registerUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = registerNameInput.value.trim();
    const login = registerLoginInput.value.trim();
    const senha = registerPasswordInput.value; // Não usar trim() em senha

    if (!nome || !login || !senha) {
        registerUserError.textContent = 'Por favor, preencha todos os campos.';
        registerUserError.classList.remove('hidden');
        showToast('Preencha todos os campos obrigatórios.', 'error');
        return;
    }

    registerUserError.classList.add('hidden'); // Esconde erro antes de tentar
    registerLoading.classList.remove('hidden'); // Mostra loading
    saveRegisterBtn.disabled = true; // Desabilita botão salvar

    try {
        // !!! Substitua pela URL da sua API de cadastro !!!
        const apiUrl = 'https://api-consulta-in-100.vercel.app/api/cadastro';

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Incluir token de autorização se necessário
                // 'Authorization': `Bearer ${your_token}`
            },
            body: JSON.stringify({ nome, login, senha }) // Ajuste os nomes dos campos se a API esperar diferente
        });

        const data = await res.json(); // Tenta ler a resposta mesmo se não for ok

        if (!res.ok) {
            // Tenta usar a mensagem de erro da API, senão uma genérica
            const errorMessage = data?.error || `Erro ${res.status}: ${res.statusText}`;
            throw new Error(errorMessage);
        }

        // Sucesso!
        showToast(data.message || 'Usuário cadastrado com sucesso!', 'success');
        closeRegisterModal();

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        registerUserError.textContent = error.message || 'Erro ao cadastrar usuário. Tente novamente.';
        registerUserError.classList.remove('hidden');
        showToast(error.message || 'Erro ao cadastrar usuário.', 'error');
    } finally {
        registerLoading.classList.add('hidden'); // Esconde loading
        saveRegisterBtn.disabled = false; // Reabilita botão salvar
    }
});
