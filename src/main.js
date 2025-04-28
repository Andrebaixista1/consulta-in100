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

function formatNumberWithCommas(value) {
  if (value === null || value === undefined) return '-';
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2, maximumFractionDigits: 2});
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
const consultaSwitch = document.getElementById('consultaSwitch');
const consultaStatus = document.getElementById('consultaStatus');

// Atualiza o texto do status do switch ao carregar a página e ao mudar
if (consultaSwitch && consultaStatus) {
  // Estado inicial
  consultaStatus.textContent = consultaSwitch.checked ? 'ON' : 'OFF';
  // Ao mudar
  consultaSwitch.addEventListener('change', function() {
    consultaStatus.textContent = this.checked ? 'ON' : 'OFF';
  });
}

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

// --- Elementos do Dropdown Usuário ---
const userDropdownContainer = document.getElementById('userDropdownContainer');
const userDropdownMenu = document.getElementById('userDropdownMenu');

const loadCreditBtn = document.getElementById('loadCreditBtn');

// --- Elementos do Modal de Carregar Crédito ---
const loadCreditModal = document.getElementById('loadCreditModal');
const loadCreditOverlay = document.getElementById('loadCreditOverlay');
const loadCreditForm = document.getElementById('loadCreditForm');
const userSelect = document.getElementById('userSelect');
const creditAmount = document.getElementById('creditAmount');
const cancelLoadCreditBtn = document.getElementById('cancelLoadCreditBtn');
const saveLoadCreditBtn = document.getElementById('saveLoadCreditBtn');
const loadCreditError = document.getElementById('loadCreditError');
const loadCreditLoading = document.getElementById('loadCreditLoading');
const registerUserBtn = document.getElementById('registerUserBtn');

// --- Elementos do Modal de Cadastro ---
const registerUserModal = document.getElementById('registerUserModal');
const modalOverlay = document.getElementById('modalOverlay');
const registerUserForm = document.getElementById('registerUserForm');
const registerNameInput = document.getElementById('registerName');
const registerLoginInput = document.getElementById('registerLogin');

const cancelRegisterBtn = document.getElementById('cancelRegisterBtn');
const saveRegisterBtn = document.getElementById('saveRegisterBtn');
const registerUserError = document.getElementById('registerUserError');

// --- Elementos do Modal de Alterar Senha ---
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordModal = document.getElementById('changePasswordModal');
const changePasswordOverlay = document.getElementById('changePasswordOverlay');
const cancelChangePasswordBtn = document.getElementById('cancelChangePasswordBtn');
const changePasswordForm = document.getElementById('changePasswordForm');
const changePasswordLogin = document.getElementById('changePasswordLogin');
const changePasswordNewPassword = document.getElementById('newPassword');
const confirmNewPassword = document.getElementById('confirmNewPassword');
const changePasswordSubmitBtn = document.getElementById('changePasswordSubmitBtn');
const changePasswordError = document.getElementById('changePasswordError');
const changePasswordLoading = document.getElementById('changePasswordLoading');

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

// --- Funções Auxiliares Modal Alterar Senha ---
function openChangePasswordModal() {
  changePasswordForm.reset();
  changePasswordError.classList.add('hidden');
  changePasswordLoading.classList.add('hidden');
  if (typeof saveChangePasswordBtn !== 'undefined' && saveChangePasswordBtn) {
  saveChangePasswordBtn.disabled = false;
} else if (typeof changePasswordSubmitBtn !== 'undefined' && changePasswordSubmitBtn) {
  changePasswordSubmitBtn.disabled = false;
}
  changePasswordModal.classList.remove('hidden');
}

function closeChangePasswordModal() {
  changePasswordModal.classList.add('hidden');
}

// --- Usuários e Recargas Modal Dinâmico ---
const usuariosBtn = document.getElementById('usuariosBtn');
const recargasBtn = document.getElementById('recargasBtn');
const usuariosModal = document.getElementById('usuariosModal');
const usuariosOverlay = document.getElementById('usuariosOverlay');
const recargasOverlay = document.getElementById('recargasOverlay');
const fecharUsuariosModal = document.getElementById('fecharUsuariosModal');
const fecharRecargasModal = document.getElementById('fecharRecargasModal');

document.addEventListener('DOMContentLoaded', function() {
  // Listeners universais para menus do usuário e admin
  document.querySelectorAll('#higienizarLoteMenuBtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const abrirBtn = document.getElementById('abrirHigienizarLoteModalBtn');
      if (abrirBtn) abrirBtn.click();
    });
  });
  document.querySelectorAll('#downloadLotesMenuBtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = document.getElementById('downloadLotesModal');
      if (modal) modal.style.display = 'flex';
      // Limpa tabela e mensagem se necessário
      const tbody = document.getElementById('statusLoteTableBody');
      if (tbody) tbody.innerHTML = '';
      const msg = document.getElementById('statusLoteMsg');
      if (msg) msg.textContent = '';
    });
  });

  // Faz o menu disparar o botão invisível
  const higienizarMenuBtn = document.getElementById('higienizarLoteMenuBtn');
  const abrirHigienizarBtn = document.getElementById('abrirHigienizarLoteModalBtn');
  if (higienizarMenuBtn && abrirHigienizarBtn) {
    higienizarMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      abrirHigienizarBtn.click();
    });
  }

  // Download Lotes Modal - lógica simplificada para modal já incluso no HTML
  const downloadLotesMenuBtn = document.getElementById('downloadLotesMenuBtn2');
  const downloadLotesModal = document.getElementById('downloadLotesModal');
  const closeDownloadLotesModal = document.getElementById('closeDownloadLotesModal');

  if (downloadLotesMenuBtn && downloadLotesModal) {
    downloadLotesMenuBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      console.log('Clicou em Download Lotes');
      downloadLotesModal.style.display = 'flex';
      // Limpa tabela e mensagem
      document.getElementById('statusLoteTableBody').innerHTML = '';
      document.getElementById('statusLoteMsg').textContent = '';
      // Busca login do usuário logado
      const loggedUserName = document.getElementById('loggedUserName');
      const login = loggedUserName ? loggedUserName.textContent.trim() : '';
      console.log('Login enviado para API /api/status-lote:', login);
      if (!login) {
        document.getElementById('statusLoteMsg').textContent = 'Não foi possível identificar o usuário logado.';
        return;
      }
      let lotesDataOriginal = [];
      try {
        const res = await fetch(`https://api-consulta-in-100.vercel.app/api/status-lote?login=${encodeURIComponent(login)}`);
        if (!res.ok) throw new Error('Erro ao buscar status dos lotes');
        const data = await res.json();
        console.log('Dados recebidos da API /api/status-lote:', data);
        if (!Array.isArray(data) || data.length === 0) {
          document.getElementById('statusLoteMsg').textContent = 'Nenhum lote encontrado.';
          atualizarTotaisDownloadLotes([]);
          return;
        }
        lotesDataOriginal = data;
        renderizarTabelaDownloadLotes(lotesDataOriginal);
        configurarFiltrosDownloadLotes(lotesDataOriginal);
      } catch (err) {
        document.getElementById('statusLoteMsg').textContent = 'Erro ao buscar status dos lotes.';
        atualizarTotaisDownloadLotes([]);
        console.error(err);
      }

      // Função para renderizar a tabela filtrada
      function renderizarTabelaDownloadLotes(data) {
        const tbody = document.getElementById('statusLoteTableBody');
        tbody.innerHTML = '';
        // Buscar login do usuário logado
        const loggedUserName = document.getElementById('loggedUserName');
        const login = loggedUserName ? loggedUserName.textContent.trim() : '';
        data.forEach(async item => {
          const tr = document.createElement('tr');
          let dataFormatada = '';
          if (item.data_higienizacao) {
            const d = new Date(item.data_higienizacao);
            dataFormatada = d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
          }
          // Status: buscar via /api/higienizar-status
          let status = '...';
          let statusClass = 'bg-gray-100 text-gray-800';
          try {
            if (login && item.nome_arquivo) {
              const resStatus = await fetch(`https://api-consulta-in-100.vercel.app/api/higienizar-status?nomeArquivoCsv=${encodeURIComponent(item.nome_arquivo)}&login=${encodeURIComponent(login)}`);
              if (resStatus.ok) {
                const statusData = await resStatus.json();
                if (statusData.status === 'Concluído') {
                  status = 'Concluído';
                  statusClass = 'bg-green-100 text-green-800';
                } else if (statusData.status === 'Processando') {
                  status = 'Processando';
                  statusClass = 'bg-yellow-100 text-yellow-800';
                } else {
                  status = 'Carregando';
                  statusClass = 'bg-gray-100 text-gray-800';
                }
              }
            }
          } catch {}
          tr.innerHTML = `
            <td class="px-2 py-1">${item.nome_arquivo}</td>
            <td class="px-2 py-1 text-center">${dataFormatada}</td>
            <td class="px-2 py-1 text-center">${item.quantidade}</td>
            <td class="px-2 py-1 text-center">${item.higienizado}</td>
            <td class="px-2 py-1 text-center">${item.erros}</td>
            <td class="px-2 py-1 text-center">${item.perc_higienizado}%</td>
            <td class="px-2 py-1 text-center"><span class="rounded px-2 py-1 ${statusClass}">${status}</span></td>
            <td class="px-2 py-1 text-center"><button class="download-lote-btn bg-blue-600 hover:bg-blue-700 text-white rounded px-2 py-1 text-xs" data-nome="${encodeURIComponent(item.nome_arquivo)}"><i class="fas fa-download"></i></button></td>
          `;
          // Adicionar evento de download
          tr.querySelector('.download-lote-btn').onclick = async function(e) {
            e.preventDefault();
            const loggedUserName = document.getElementById('loggedUserName');
            const login = loggedUserName ? loggedUserName.textContent.trim() : '';
            const nome_arquivo = decodeURIComponent(this.getAttribute('data-nome'));
            if (!login || !nome_arquivo) return;
            try {
              const res = await fetch(`https://api-consulta-in-100.vercel.app/api/download?nome_arquivo=${encodeURIComponent(nome_arquivo)}&login=${encodeURIComponent(login)}`);
              if (!res.ok) throw new Error('Erro ao baixar arquivo');
              const contentType = res.headers.get('Content-Type');
              if (contentType && contentType.includes('application/json')) {
                const errMsg = await res.json();
                alert(errMsg.error || 'Erro ao baixar arquivo!');
                return;
              }
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = nome_arquivo;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              alert('Erro ao baixar arquivo!');
            }
          };
          tbody.appendChild(tr);
        });
        atualizarTotaisDownloadLotes(data);
      }

      // Função para atualizar totais
      function atualizarTotaisDownloadLotes(data) {
        document.getElementById('totalArquivos').textContent = `Arquivos: ${data.length}`;
        document.getElementById('totalLinhas').textContent = `Linhas: ${data.reduce((acc, x) => acc + (x.quantidade || 0), 0)}`;
        const hig = data.reduce((acc, x) => acc + (x.higienizado || 0), 0);
        const err = data.reduce((acc, x) => acc + (x.erros || 0), 0);
        document.getElementById('totalHigienizado').textContent = `Higienizado: ${hig}`;
        document.getElementById('totalErros').textContent = `Erros: ${err}`;
      }

      // Função para aplicar filtros
      function aplicarFiltrosDownloadLotes() {
        let filtrado = [...lotesDataOriginal];
        // Filtro de datas
        const dataIni = document.getElementById('filtroDataInicio').value;
        const dataFim = document.getElementById('filtroDataFim').value;
        if (dataIni) {
          const ini = new Date(dataIni + 'T00:00:00');
          filtrado = filtrado.filter(item => item.data_higienizacao && new Date(item.data_higienizacao) >= ini);
        }
        if (dataFim) {
          const fim = new Date(dataFim + 'T23:59:59');
          filtrado = filtrado.filter(item => item.data_higienizacao && new Date(item.data_higienizacao) <= fim);
        }
        // Filtro de busca por nome
        const buscaNome = document.getElementById('filtroNomeArquivo').value.trim().toLowerCase();
        if (buscaNome) {
          filtrado = filtrado.filter(item => (item.nome_arquivo || '').toLowerCase().includes(buscaNome));
        }
        renderizarTabelaDownloadLotes(filtrado);
      }

      // Configurar listeners dos filtros
      function configurarFiltrosDownloadLotes() {
        document.getElementById('filtroDataInicio').onchange = aplicarFiltrosDownloadLotes;
        document.getElementById('filtroDataFim').onchange = aplicarFiltrosDownloadLotes;
        document.getElementById('filtroNomeArquivo').oninput = aplicarFiltrosDownloadLotes;
      }
    });
  }

  if (closeDownloadLotesModal && downloadLotesModal) {
    closeDownloadLotesModal.onclick = () => {
      downloadLotesModal.style.display = 'none';
    };
    // Fechar ao clicar fora do conteúdo do modal
    downloadLotesModal.onclick = (e) => {
      if (e.target === downloadLotesModal) downloadLotesModal.style.display = 'none';
    };
  }


  const abrirHigienizarLoteBtn = document.getElementById('abrirHigienizarLoteModalBtn');
  
  if (abrirHigienizarLoteBtn) {
    abrirHigienizarLoteBtn.addEventListener('click', () => {
      const modal = document.getElementById('higienizarLoteModal');
      const btnFechar = document.getElementById('fecharHigienizarLoteModal');
      if (modal) {
        modal.classList.remove('hidden');
        if (btnFechar && !btnFechar.dataset.listener) {
          btnFechar.addEventListener('click', () => {
            modal.classList.add('hidden');
          });
          btnFechar.dataset.listener = 'true';
        }
        inicializarHigienizarLoteModalFeatures();
      } else {
        alert('Erro: Modal não encontrado no HTML.');
      }
    });

    // Função para inicializar recursos do modal Higienizar em Lote
    function inicializarHigienizarLoteModalFeatures() {
      const tabelaBody = document.getElementById('tabelaHigienizarLoteBody');
      const btnAdicionar = document.getElementById('adicionarArquivoBtn');
      const limiteMsg = document.getElementById('limiteLotesMsg');
      if (!tabelaBody || !btnAdicionar) return;
      if (btnAdicionar.dataset.listener) return; // evita múltiplos listeners
      btnAdicionar.addEventListener('click', function () {
        const linhas = tabelaBody.querySelectorAll('tr').length;
        if (linhas >= 5) {
          limiteMsg.classList.remove('hidden');
          return;
        } else {
          limiteMsg.classList.add('hidden');
        }
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="px-2 py-2 text-center">
            <input type="file" accept=".csv" class="arquivo-input" style="width: 120px;" />
          </td>
          <td class="px-2 py-2 nome-arquivo"></td>
          <td class="px-2 py-2 text-center total-linhas">-</td>
          <td class="px-2 py-2 text-center tempo-estimado">-</td>
          <td class="px-2 py-2 text-center status-cell">
            <span class="status-label status-aguardando">Aguardando</span>
          </td>
          <td class="px-2 py-2 text-center">
            <button class="carregar-btn text-blue-600" title="Carregar"><i class="fas fa-upload"></i></button>
            <button class="excluir-btn text-red-600 ml-2" title="Excluir"><i class="fas fa-trash"></i></button>
          </td>
        `;
        tabelaBody.appendChild(row);

        const input = row.querySelector('.arquivo-input');
        input.addEventListener('change', function (e) {
          const file = e.target.files[0];
          if (!file) return;
          row.querySelector('.nome-arquivo').textContent = file.name;
          const reader = new FileReader();
          reader.onload = function (ev) {
            const text = ev.target.result;
            const linhas = text.split(/\r?\n/).filter(l => l.trim().length > 0);
            const totalLinhas = linhas.length - 1; // Desconta header
            row.querySelector('.total-linhas').textContent = totalLinhas;
            // Tempo estimado: 5 segundos por linha
            if (totalLinhas > 0) {
              const tempoTotal = totalLinhas * 5;
              let tempoStr = '';
              if (tempoTotal < 60) {
                tempoStr = tempoTotal + 's';
              } else {
                const min = Math.floor(tempoTotal / 60);
                const seg = tempoTotal % 60;
                tempoStr = `${min}m${seg > 0 ? ' ' + seg + 's' : ''}`;
              }
              row.querySelector('.tempo-estimado').textContent = tempoStr;
            } else {
              row.querySelector('.tempo-estimado').textContent = '-';
            }
          };
          reader.readAsText(file);
        });

        row.querySelector('.excluir-btn').onclick = function () {
          row.remove();
        };

        // Estado do carregamento
        let carregando = false;
        const btnCarregar = row.querySelector('.carregar-btn');
        const statusCell = row.querySelector('.status-label');

        function setStatusAguardando() {
          statusCell.textContent = 'Aguardando';
          statusCell.className = 'status-label status-aguardando bg-gray-100 text-gray-800 rounded px-2 py-1';
        }
        function setStatusProcessando() {
          statusCell.textContent = 'Processando...';
          statusCell.className = 'status-label status-processando bg-yellow-100 text-yellow-900 rounded px-2 py-1 animate-pulse';
        }
        function setStatusConcluido() {
          statusCell.textContent = 'Concluído';
          statusCell.className = 'status-label status-concluido bg-green-100 text-green-800 rounded px-2 py-1';
        }
        function setStatusErro() {
          statusCell.textContent = 'Verifique o Arquivo';
          statusCell.className = 'status-label status-erro bg-red-100 text-red-800 rounded px-2 py-1';
        }

        // Função para monitorar o status da higienização
        function monitorarStatusHigienizacao(nomeArquivoCsv, statusCell, login) {
          // Função para sanitizar o nome do arquivo igual ao backend
          function sanitizeFileName(filename) {
            return filename ? filename.normalize('NFD').replace(/[^\w.]/g, '_') : '';
          }
          const nomeArquivoSanitizado = sanitizeFileName(nomeArquivoCsv);
          let intervalId;
          async function checarStatus() {
            try {
              const res = await fetch(`https://api-consulta-in-100.vercel.app/api/higienizar-status?nomeArquivoCsv=${encodeURIComponent(nomeArquivoSanitizado)}&login=${encodeURIComponent(login)}`);
              if (!res.ok) throw new Error('Erro ao consultar status');
              const data = await res.json();
              if (data.status === 'Carregando') {
                statusCell.textContent = 'Carregando';
                statusCell.className = 'status-label status-aguardando bg-gray-100 text-gray-800 rounded px-2 py-1';
              } else if (data.status === 'Processando') {
                statusCell.textContent = 'Processando...';
                statusCell.className = 'status-label status-processando bg-yellow-100 text-yellow-900 rounded px-2 py-1 animate-pulse';
              } else if (data.status === 'Concluído') {
                statusCell.textContent = 'Concluído';
                statusCell.className = 'status-label status-concluido bg-green-100 text-green-800 rounded px-2 py-1';
                clearInterval(intervalId);
              }
            } catch (e) {
              statusCell.textContent = 'Erro ao obter status';
              statusCell.className = 'status-label status-erro bg-red-100 text-red-800 rounded px-2 py-1';
              clearInterval(intervalId);
            }
          }
          checarStatus();
          intervalId = setInterval(checarStatus, 3000); // Consulta a cada 3 segundos
        }
        setStatusAguardando();

        btnCarregar.onclick = async function () {
  if (!carregando) {
    // Iniciar carregamento
    const fileInput = row.querySelector('.arquivo-input');
    const file = fileInput.files[0];
    if (!file) {
      showToast('Selecione um arquivo antes de iniciar.', 'error');
      return;
    }
    // Verificar quantidade de linhas do arquivo
    let totalLinhas = 0;
    try {
      const text = await file.text();
      const linhas = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      totalLinhas = linhas.length - 1; // Desconta header
      if (totalLinhas <= 0) {
        alert('O arquivo precisa conter pelo menos uma linha de dados além do cabeçalho.');
        return;
      }
    } catch (err) {
      alert('Erro ao ler o arquivo para contar as linhas.');
      return;
    }
    // Consultar saldo antes de tudo
    const login = (document.getElementById('loggedUserName') && document.getElementById('loggedUserName').textContent) ? document.getElementById('loggedUserName').textContent.trim() : '';
    if (!login) {
      alert('Usuário não identificado. Faça login novamente.');
      return;
    }
    setStatusProcessando();
    carregando = true;
    btnCarregar.innerHTML = '<i class="fas fa-pause"></i>';
    btnCarregar.title = 'Pausar';
    try {
      // Buscar créditos do usuário
      const resCred = await fetch(`https://api-consulta-in-100.vercel.app/api/creditos?login=${encodeURIComponent(login)}`);
      if (!resCred.ok) {
        alert('Erro ao consultar créditos do usuário.');
        setStatusErro();
        carregando = false;
        btnCarregar.innerHTML = '<i class="fas fa-upload"></i>';
        btnCarregar.title = 'Carregar';
        return;
      }
      const dataCred = await resCred.json();
      // Ajuste: aceita resposta como array ou objeto
      const saldoObj = Array.isArray(dataCred) ? dataCred[0] : dataCred;
      const saldoDisponivel = saldoObj && typeof saldoObj.limite_disponivel !== 'undefined' ? Number(saldoObj.limite_disponivel) : null;
      if (saldoDisponivel === null || isNaN(saldoDisponivel)) {
        alert('Não foi possível obter o saldo disponível do usuário.');
        setStatusErro();
        carregando = false;
        btnCarregar.innerHTML = '<i class="fas fa-upload"></i>';
        btnCarregar.title = 'Carregar';
        return;
      }
      if (totalLinhas > saldoDisponivel) {
        alert(`Saldo insuficiente. Você possui ${saldoDisponivel} créditos e o arquivo possui ${totalLinhas} linhas.`);
        setStatusErro();
        carregando = false;
        btnCarregar.innerHTML = '<i class="fas fa-upload"></i>';
        btnCarregar.title = 'Carregar';
        return;
      }
      // Enviar arquivo para higienização
      const formData = new FormData();
      formData.append('file', file);
      formData.append('nomeArquivoCsv', file.name);
      formData.append('login', login);
      const res = await fetch('https://api-consulta-in-100.vercel.app/api/higienizar', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        let msg = 'Erro ao processar o arquivo.';
        try {
          const err = await res.json();
          if (err && err.error) msg = err.error;
        } catch (e) {}
        alert(msg);
        setStatusErro();
        carregando = false;
        btnCarregar.innerHTML = '<i class="fas fa-upload"></i>';
        btnCarregar.title = 'Carregar';
        return;
      }
      await res.json();
      // Inicia monitoramento do status após envio do arquivo
      monitorarStatusHigienizacao(file.name, statusCell, login);
      // Não chama setStatusConcluido() diretamente; status será atualizado pela função de monitoramento
    } catch (err) {
      showToast('Erro ao enviar arquivo ou consultar créditos.', 'error');
      setStatusErro();
    }
    carregando = false;
    btnCarregar.innerHTML = '<i class="fas fa-upload"></i>';
    btnCarregar.title = 'Carregar';
  } else {
    // Pausar (apenas visual, não pausa real)
    carregando = false;
    btnCarregar.innerHTML = '<i class="fas fa-upload"></i>';
    btnCarregar.title = 'Carregar';
    setStatusAguardando();
    showToast('Carregamento pausado (apenas visual)', 'info');
  }
};
      });
      btnAdicionar.dataset.listener = 'true';
    }
  }
});

// Utilitário para montar tabela dinâmica
function renderUsuariosTable(data, tableHeadEl, tableBodyEl, sortState) {
  // Colunas fixas e nomes amigáveis
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nome', label: 'Nome' },
    { key: 'login', label: 'Login' },
    { key: 'data_criacao', label: 'Data Criação' },
    { key: 'ultimo_log', label: 'Ultimo Login' }
  ];
  if (!Array.isArray(data) || data.length === 0) {
    tableHeadEl.innerHTML = '';
    tableBodyEl.innerHTML = '<tr><td colspan="100%">Nenhum dado encontrado.</td></tr>';
    return;
  }
  // Cabeçalho com ordenação
  tableHeadEl.innerHTML = columns.map(col => `
    <th class="px-4 py-2 cursor-pointer whitespace-nowrap" data-col="${col.key}">
      ${col.label} ${sortState.col === col.key ? (sortState.dir === 'asc' ? '▲' : '▼') : ''}
    </th>`).join('');
  // Corpo
  let sorted = [...data];
  if (sortState.col) {
    sorted.sort((a, b) => {
      let valA = a[sortState.col];
      let valB = b[sortState.col];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortState.dir === 'asc' ? -1 : 1;
      if (valA > valB) return sortState.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  tableBodyEl.innerHTML = sorted.map(row =>
    `<tr>${columns.map(col => {
      let value = row[col.key];
      if (col.key === 'data_criacao' || col.key === 'ultimo_log') {
        value = value ? new Date(value).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
      }
      return `<td class='px-4 py-2 border-b whitespace-nowrap' style='vertical-align: middle;'>${value ?? '-'}</td>`;
    }).join('')}</tr>`
  ).join('');
  // Eventos de ordenação
  tableHeadEl.querySelectorAll('th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      if (sortState.col === col) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.col = col;
        sortState.dir = 'asc';
      }
      renderUsuariosTable(data, tableHeadEl, tableBodyEl, sortState);
    });
  });
}

// Substitua o renderDynamicTable por renderUsuariosTable no carregamento dos usuários

// Usuários
let usuariosSort = { col: '', dir: 'asc' };
const API_URL = 'https://api-consulta-in-100.vercel.app/';

usuariosBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  adminDropdownMenu.classList.add('hidden');
  usuariosModal.classList.remove('hidden');
  const tableHead = document.getElementById('usuariosTableHead');
  const tableBody = document.getElementById('usuariosTableBody');
  tableBody.innerHTML = '<tr><td colspan="100%">Carregando...</td></tr>';
  try {
    const res = await fetch(`${API_URL}/api/usuarios`);
    let data = [];
    // Só tenta ler JSON se houver body e status OK
    if (res.ok) {
      const text = await res.text();
      if (text) {
        data = JSON.parse(text);
      }
    }
    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="100%">Nenhum usuário encontrado.</td></tr>';
      tableHead.innerHTML = '';
      return;
    }
    usuariosSort = { col: 'id', dir: 'asc' };
    // Atualiza o título do modal com o contador
    const usuariosTitulo = document.querySelector('#usuariosModal h3');
    if (usuariosTitulo) usuariosTitulo.textContent = `Usuários - ${data.length}`;
    renderUsuariosTable(data, tableHead, tableBody, usuariosSort);
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan='100%'>Erro ao buscar usuários: ${err.message}</td></tr>`;
    tableHead.innerHTML = '';
  }
});
if (fecharUsuariosModal) fecharUsuariosModal.addEventListener('click', () => usuariosModal.classList.add('hidden'));
if (usuariosOverlay) usuariosOverlay.addEventListener('click', () => usuariosModal.classList.add('hidden'));

// Recargas
let recargasSort = { col: '', dir: 'asc' };
function renderRecargasTable(data, tableHeadEl, tableBodyEl, sortState) {
  // Colunas fixas e nomes amigáveis
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'id_user', label: 'ID Usuario' },
    { key: 'login', label: 'Login' },
    { key: 'total_carregado', label: 'Total Carregado' },
    { key: 'limite_disponivel', label: 'Limite Disponivel' },
    { key: 'consultas_realizada', label: 'Consultas Realizadas' },
    { key: 'data_saldo_carregado', label: 'Ultima Recarga' }
  ];
  if (!Array.isArray(data) || data.length === 0) {
    tableHeadEl.innerHTML = '';
    tableBodyEl.innerHTML = '<tr><td colspan="100%" style="vertical-align: middle;">Nenhuma recarga encontrada.</td></tr>';
    return;
  }
  // Cabeçalho com ordenação
  tableHeadEl.innerHTML = columns.map(col => `
    <th class="px-4 py-2 cursor-pointer whitespace-nowrap align-middle" data-col="${col.key}" style="vertical-align: middle;">
      ${col.label} ${sortState.col === col.key ? (sortState.dir === 'asc' ? '▲' : '▼') : ''}
    </th>`).join('');
  // Corpo
  let sorted = [...data];
  if (sortState.col) {
    sorted.sort((a, b) => {
      let valA = a[sortState.col];
      let valB = b[sortState.col];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortState.dir === 'asc' ? -1 : 1;
      if (valA > valB) return sortState.dir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  tableBodyEl.innerHTML = sorted.map(row =>
    `<tr>${columns.map(col => {
      let value = row[col.key];
      if (col.key === 'data_saldo_carregado') {
        value = value ? new Date(value).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
      }
      return `<td class='px-4 py-2 border-b whitespace-nowrap' style='vertical-align: middle;'>${value ?? '-'}</td>`;
    }).join('')}</tr>`
  ).join('');
  // Eventos de ordenação
  tableHeadEl.querySelectorAll('th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      if (sortState.col === col) {
        sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.col = col;
        sortState.dir = 'asc';
      }
      renderRecargasTable(data, tableHeadEl, tableBodyEl, sortState);
    });
  });
}

let recargasRawData = [];
let recargasFilteredData = [];

recargasBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  adminDropdownMenu.classList.add('hidden');
  recargasModal.classList.remove('hidden');
  const tableHead = document.getElementById('recargasTableHead');
  const tableBody = document.getElementById('recargasTableBody');
  tableBody.innerHTML = '<tr><td colspan="100%">Carregando...</td></tr>';
  try {
    const res = await fetch(`${API_URL}/api/creditos`);
    let data = [];
    if (res.ok) {
      const text = await res.text();
      if (text) {
        data = JSON.parse(text);
      }
    }
    recargasRawData = Array.isArray(data) ? data : [];
    recargasFilteredData = [...recargasRawData];
    applyRecargasFiltersAndRender();
  } catch (err) {
    tableBody.innerHTML = `<tr><td colspan='100%'>Erro ao buscar recargas: ${err.message}</td></tr>`;
    tableHead.innerHTML = '';
  }
});

function applyRecargasFiltersAndRender() {
  const searchInput = document.getElementById('recargasSearchInput');
  const dateStart = document.getElementById('recargasDateStart');
  const dateEnd = document.getElementById('recargasDateEnd');
  const tableHead = document.getElementById('recargasTableHead');
  const tableBody = document.getElementById('recargasTableBody');
  let filtered = [...recargasRawData];
  // Filtro login
  if (searchInput && searchInput.value) {
    filtered = filtered.filter(item => (item.login || '').toLowerCase().includes(searchInput.value.toLowerCase()));
  }
  // Filtro data
  if (dateStart && dateStart.value) {
    const start = new Date(dateStart.value + 'T00:00:00');
    filtered = filtered.filter(item => item.data_saldo_carregado && new Date(item.data_saldo_carregado) >= start);
  }
  if (dateEnd && dateEnd.value) {
    const end = new Date(dateEnd.value + 'T23:59:59');
    filtered = filtered.filter(item => item.data_saldo_carregado && new Date(item.data_saldo_carregado) <= end);
  }
  recargasFilteredData = filtered;
  // Atualiza o título do modal
  const recargasTitulo = document.querySelector('#recargasModal h3');
  if (recargasTitulo) recargasTitulo.textContent = `Recargas - ${filtered.length}`;

  // Atualiza as somas
  const totalCarregado = filtered.reduce((acc, cur) => acc + (Number(cur.total_carregado) || 0), 0);
  const limiteDisponivel = filtered.reduce((acc, cur) => acc + (Number(cur.limite_disponivel) || 0), 0);
  const totalConsumido = filtered.reduce((acc, cur) => acc + (Number(cur.consultas_realizada) || 0), 0);
  const totalEl = document.getElementById('recargasTotalCarregadoSum');
  const limiteEl = document.getElementById('recargasLimiteDisponivelSum');
  const consumidoEl = document.getElementById('recargasTotalConsumidoSum');
  if (totalEl) totalEl.textContent = `Total Carregado: ${totalCarregado.toLocaleString('pt-BR')}`;
  if (limiteEl) limiteEl.textContent = `Limite Disponível: ${limiteDisponivel.toLocaleString('pt-BR')}`;
  if (consumidoEl) consumidoEl.textContent = `Total Consumido: ${totalConsumido.toLocaleString('pt-BR')}`;

  renderRecargasTable(filtered, tableHead, tableBody, recargasSort);
}


// Eventos de filtro
setTimeout(() => {
  const searchInput = document.getElementById('recargasSearchInput');
  const dateStart = document.getElementById('recargasDateStart');
  const dateEnd = document.getElementById('recargasDateEnd');
  if (searchInput) searchInput.addEventListener('input', applyRecargasFiltersAndRender);
  if (dateStart) dateStart.addEventListener('change', applyRecargasFiltersAndRender);
  if (dateEnd) dateEnd.addEventListener('change', applyRecargasFiltersAndRender);
  // Botão download CSV
  const downloadBtn = document.getElementById('recargasDownloadCsv');
  if (downloadBtn) downloadBtn.addEventListener('click', () => {
    downloadRecargasCsv(recargasFilteredData);
  });
}, 500);

function downloadRecargasCsv(data) {
  if (!data || !data.length) return;
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'id_user', label: 'ID Usuario' },
    { key: 'login', label: 'Login' },
    { key: 'total_carregado', label: 'Total Carregado' },
    { key: 'limite_disponivel', label: 'Limite Disponivel' },
    { key: 'consultas_realizada', label: 'Consultas Realizadas' },
    { key: 'data_saldo_carregado', label: 'Ultima Recarga' }
  ];
  let csv = columns.map(col => col.label).join(';') + '\n';
  csv += data.map(row => columns.map(col => {
    let value = row[col.key];
    if (col.key === 'data_saldo_carregado') {
      value = value ? new Date(value).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    }
    return (value ?? '').toString().replace(/;/g, ',');
  }).join(';')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'recargas.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

if (fecharRecargasModal) fecharRecargasModal.addEventListener('click', () => recargasModal.classList.add('hidden'));
if (recargasOverlay) recargasOverlay.addEventListener('click', () => recargasModal.classList.add('hidden'));

// --- Event Listeners ---

// Switch Consulta: Atualiza label ON/OFF
if (consultaSwitch && consultaStatus) {
  consultaSwitch.addEventListener('change', function() {
    consultaStatus.textContent = this.checked ? 'ON' : 'OFF';
  });
}

// Substitua a lógica do submit do searchForm para usar a URL correta

// --- Traduções de campos da API ---
function translateTipoBloqueio(value) {
  const map = {
    'blocked_by_benefitiary': 'Bloqueado pelo Beneficiário',
    'not_blocked': 'Não Bloqueado',
    'blocked_in_concession': 'Bloqueado na Concessão',
    'blocked_by_tbm': 'Bloqueado por TBM',
    '': 'NÃO INFORMADO',
    null: 'NÃO INFORMADO',
    undefined: 'NÃO INFORMADO'
  };
  return map.hasOwnProperty(value) ? map[value] : 'NÃO INFORMADO';
}

function translateTipoCredito(value) {
  const map = {
    'magnetic_card': 'Cartão Magnético',
    'checking_account': 'Conta Corrente',
    '': 'NÃO INFORMADO',
    null: 'NÃO INFORMADO',
    undefined: 'NÃO INFORMADO'
  };
  return map.hasOwnProperty(value) ? map[value] : 'NÃO INFORMADO';
}

function translateSituacaoBeneficio(value) {
  const map = {
    'blocked': 'Bloqueado',
    'elegible': 'Elegível',
    'inelegible': 'Inelegível',
    '': 'NÃO INFORMADO',
    null: 'NÃO INFORMADO',
    undefined: 'NÃO INFORMADO'
  };
  return map.hasOwnProperty(value) ? map[value] : 'NÃO INFORMADO';
}


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

      // Lógica para mostrar/esconder os dropdowns de admin e usuário
      if (data.login === 'andrefelipe' || data.login === 'lauany.plan') {
        adminDropdownContainer.classList.remove('hidden');
        userDropdownContainer.classList.add('hidden');
      } else {
        adminDropdownContainer.classList.add('hidden');
        userDropdownContainer.classList.remove('hidden');
      }
      // Sempre esconder os menus dropdown ao logar
      adminDropdownMenu.classList.add('hidden');
      userDropdownMenu.classList.add('hidden');

      // Lógica para mostrar/esconder o dropdown do admin
      if (data.login === 'andrefelipe' || data.login === 'lauany.plan') {
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
  // Esconder ambos os dropdowns no logout
  adminDropdownContainer.classList.add('hidden');
  adminDropdownMenu.classList.add('hidden');
  userDropdownContainer.classList.add('hidden');
  userDropdownMenu.classList.add('hidden');
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
    // Sempre usa a API online
    const API_BASE_URL = 'https://api-consulta-in-100.vercel.app';
    // Determina o endpoint com base no estado do switch
    const endpoint = consultaSwitch && !consultaSwitch.checked
      ? `${API_BASE_URL}/api/consulta2`
      : `${API_BASE_URL}/api/consulta`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, nb, login: userLogin })
    });
    if (res.status === 500 || res.status === 504) {
      throw new Error('Erro no servidor, espere um tempo e tente novamente');
    }
    const data = await res.json();
    console.log('DADOS DA API', data);
    // Exibe a última atualização
    const ultimaAtualizacao = data.consultas_api?.data_hora_registro;
    const ultimaAtualizacaoEl = document.getElementById('ultimaAtualizacao');
    if (ultimaAtualizacaoEl) {
      if (ultimaAtualizacao) {
        const dataAtualizacao = new Date(ultimaAtualizacao);
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        const dataRef = new Date(dataAtualizacao);
        dataRef.setHours(0,0,0,0);
        const diffDias = Math.floor((hoje - dataRef) / (1000*60*60*24));
        let corClasse = '';
        if (diffDias === 0) {
          corClasse = 'text-green-600';
        } else if (diffDias === 1) {
          corClasse = 'text-yellow-500';
        } else if (diffDias >= 2) {
          corClasse = 'text-red-600';
        } else {
          corClasse = '';
        }
        ultimaAtualizacaoEl.textContent = dataAtualizacao.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        ultimaAtualizacaoEl.className = corClasse;
      } else {
        ultimaAtualizacaoEl.textContent = '-';
        ultimaAtualizacaoEl.className = '';
      }
    }
    if (!res.ok) {
      let errorMsg = 'Erro na consulta';
      if (data && data.error) {
        errorMsg = data.error;
      } else if (res.statusText) {
        errorMsg = `Erro ${res.status}: ${res.statusText}`;
      }
      resultsError.textContent = errorMsg;
      resultsError.classList.remove('hidden');
      showToast(errorMsg, 'error');
      return; // Interrompe o fluxo!
    }
    // Atualizar contadores/limites do dashboard com base na resposta da consulta
    availableLimitEl.textContent = parseInt(data.limite_disponivel) ?? parseInt(availableLimitEl.textContent) ?? 0;
    queriesCount.textContent = parseInt(data.consultas_realizada) ?? parseInt(queriesCount.textContent) ?? 0;
    const currentTotalCarregado = parseInt(totalCarregadoEl.textContent) || 0;
    totalCarregadoEl.textContent = currentTotalCarregado;
    let usedPerc = 0;
    if (currentTotalCarregado > 0) {
        usedPerc = (parseInt(queriesCount.textContent) / currentTotalCarregado) * 100;
    }
    usedPercentageEl.textContent = usedPerc.toFixed(2).replace('.', ',') + '%';
    // Verifica se a API retornou os detalhes da consulta
    if (!data.consultas_api || Object.keys(data.consultas_api).length === 0) {
      showToast('Consulta realizada, mas dados do benefício não encontrados.', 'warning');
      resultsError.textContent = 'Dados do benefício não encontrados para esta consulta.';
      resultsError.classList.remove('hidden');
      resultsSection.classList.add('hidden');
      return;
    }
    // Preenche os campos com os dados da API
    const dataApi = data.consultas_api;
    const elMap = [
      ['benefitNumber', dataApi.numero_beneficio],
      ['documentNumber', dataApi.numero_documento],
      ['name', dataApi.nome],
      ['state', dataApi.estado],
      ['alimony', formatBoolean(dataApi.pensao)],
      ['birthDate', formatDate(dataApi.data_nascimento)],
      ['age', calculateAge(dataApi.data_nascimento)],
      ['blockType', translateTipoBloqueio(dataApi.tipo_bloqueio)],
      ['grantDate', formatDate(dataApi.data_concessao)],
      ['benefitEndDate', formatDate(dataApi.data_final_beneficio)],
      ['creditType', translateTipoCredito(dataApi.tipo_credito)],
      ['benefitCardBalance', formatNumberWithCommas(dataApi.saldo_cartao_beneficio)],
      ['consignedCardBalance', formatNumberWithCommas(dataApi.saldo_cartao_consignado)],
      ['consignedCreditBalance', formatNumberWithCommas(dataApi.saldo_credito_consignado)],
      ['maxTotalBalance', formatNumberWithCommas(dataApi.saldo_total_maximo)],
      ['usedTotalBalance', formatNumberWithCommas(dataApi.saldo_total_utilizado)],
      ['availableTotalBalance', formatNumberWithCommas(dataApi.saldo_total_disponivel)],
      ['queryDate', formatDate(dataApi.data_consulta)],
      ['queryReturnDate', formatDate(dataApi.data_retorno_consulta)],
      ['queryReturnTime', dataApi.hora_retorno_consulta || '-'],
      ['legalRepresentativeName', dataApi.nome_representante_legal || '-'],
      ['disbursementBank', dataApi.banco_desembolso || '-'],
      ['disbursementBranch', dataApi.agencia_desembolso || '-'],
      ['disbursementAccount', dataApi.conta_desembolso || '-'],
      ['disbursementDigit', dataApi.digito_desembolso || '-'],
      ['portabilitiesCount', dataApi.numero_portabilidades || '-'],
    ];
    elMap.forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value ?? '-';
    });
    const benefitStatusEl = document.getElementById('benefitStatus');
    const statusText = translateSituacaoBeneficio(dataApi.situacao_beneficio);
    if (benefitStatusEl) {
      benefitStatusEl.textContent = statusText;
      benefitStatusEl.className = statusText === 'Bloqueado' ? 'text-red-700 font-bold' : '';
    }
    resultsSection.classList.remove('hidden');
    resultsError.classList.add('hidden');
    showToast('Consulta realizada com sucesso!', 'success');
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
    // Fecha o menu admin se clicar fora
    if (adminDropdownContainer && !adminDropdownContainer.contains(event.target) && adminDropdownMenu && !adminDropdownMenu.classList.contains('hidden')) {
        adminDropdownMenu.classList.add('hidden');
    }
    // Fecha o menu usuário se clicar fora
    if (userDropdownContainer && !userDropdownContainer.contains(event.target) && userDropdownMenu && !userDropdownMenu.classList.contains('hidden')) {
        userDropdownMenu.classList.add('hidden');
    }
});

loadCreditBtn.addEventListener('click', (e) => {
  e.preventDefault();
  adminDropdownMenu.classList.add('hidden');
  openLoadCreditModal();
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
    const senha = document.getElementById('registerPassword').value; // Corrigido para evitar ReferenceError

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

        if (res.status === 500) {
            throw new Error('Erro no servidor, espere um tempo e tente novamente');
        }
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

// --- Event Listeners Modal Alterar Senha ---
changePasswordBtn.addEventListener('click', () => {
  openChangePasswordModal();
});

cancelChangePasswordBtn.addEventListener('click', () => {
  closeChangePasswordModal();
});

changePasswordOverlay.addEventListener('click', () => {
  closeChangePasswordModal();
});

changePasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const login = changePasswordLogin.value.trim();
  const newPassword = changePasswordNewPassword.value;

  // Log para depuração
  // console.log('Alterar Senha - login:', login, 'novaSenha:', newPassword);

  if (!login || !newPassword) {
    changePasswordError.textContent = 'Por favor, preencha todos os campos.';
    changePasswordError.classList.remove('hidden');
    showToast('Preencha todos os campos.', 'error');
    return;
  }

  changePasswordError.classList.add('hidden');
  document.getElementById('changePasswordBtnText').classList.add('hidden');
  document.getElementById('changePasswordLoading').classList.remove('hidden');
  changePasswordSubmitBtn.disabled = true;

  try {
    const res = await fetch('https://api-consulta-in-100.vercel.app/api/alterar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, novaSenha: newPassword }),
    });
    const data = await res.json();
    if (res.status === 500 || res.status === 504) throw new Error('Erro no servidor, espere um tempo e tente novamente');
    if (!res.ok) throw new Error(data.error || 'Erro ao alterar senha');
    showToast(data.message || 'Senha alterada com sucesso!', 'success');
    closeChangePasswordModal();
  } catch (error) {
    changePasswordError.textContent = error.message || 'Erro ao alterar senha.';
    changePasswordError.classList.remove('hidden');
    showToast(error.message || 'Erro ao alterar senha.', 'error');
  } finally {
    document.getElementById('changePasswordBtnText').classList.remove('hidden');
    document.getElementById('changePasswordLoading').classList.add('hidden');
    changePasswordSubmitBtn.disabled = false;
  }
});

// --- Mostrar/Ocultar Senha no Cadastro de Usuário ---
document.addEventListener('DOMContentLoaded', function () {
  // Cadastro usuário
  const registerPasswordInput = document.getElementById('registerPassword');
  const toggleRegisterPasswordBtn = document.getElementById('toggleRegisterPassword');
  const registerPasswordEye = document.getElementById('registerPasswordEye');
  if (toggleRegisterPasswordBtn && registerPasswordInput && registerPasswordEye) {
    toggleRegisterPasswordBtn.addEventListener('click', () => {
      const isPassword = registerPasswordInput.type === 'password';
      registerPasswordInput.type = isPassword ? 'text' : 'password';
      registerPasswordEye.classList.toggle('fa-eye', !isPassword);
      registerPasswordEye.classList.toggle('fa-eye-slash', isPassword);
    });
  }

  // Alterar senha
  const changePasswordInput = document.getElementById('newPassword');
  const toggleChangePasswordBtn = document.getElementById('toggleChangePassword');
  const changePasswordEye = document.getElementById('changePasswordEye');
  if (toggleChangePasswordBtn && changePasswordInput && changePasswordEye) {
    toggleChangePasswordBtn.addEventListener('click', () => {
      const isPassword = changePasswordInput.type === 'password';
      changePasswordInput.type = isPassword ? 'text' : 'password';
      changePasswordEye.classList.toggle('fa-eye', !isPassword);
      changePasswordEye.classList.toggle('fa-eye-slash', isPassword);
    });
  }
});

// --- Submit do formulário de alteração de senha ---
changePasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const login = changePasswordLogin.value.trim();
  const novaSenha = document.getElementById('newPassword').value;

  if (!login || !novaSenha) {
    if (changePasswordError) {
      changePasswordError.textContent = 'Preencha todos os campos!';
      changePasswordError.classList.remove('hidden');
    }
    return;
  }

  if (changePasswordError) changePasswordError.classList.add('hidden');
  if (changePasswordLoading) changePasswordLoading.classList.remove('hidden');
  if (changePasswordSubmitBtn) changePasswordSubmitBtn.disabled = true;

  try {
    const res = await fetch('https://api-consulta-in-100.vercel.app/api/alterar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, novaSenha })
    });
    const data = await res.json();
    if (res.status === 500 || res.status === 504) throw new Error('Erro no servidor, espere um tempo e tente novamente');
    if (!res.ok) throw new Error(data.error || 'Erro ao alterar senha');
    showToast(data.message || 'Senha alterada com sucesso!', 'success');
    closeChangePasswordModal();
  } catch (error) {
    if (changePasswordError) {
      changePasswordError.textContent = error.message || 'Erro ao alterar senha.';
      changePasswordError.classList.remove('hidden');
    }
    showToast(error.message || 'Erro ao alterar senha.', 'error');
  } finally {
    if (changePasswordLoading) changePasswordLoading.classList.add('hidden');
    if (changePasswordSubmitBtn) changePasswordSubmitBtn.disabled = false;
  }
});

// --- Funções Auxiliares Modal Carregar Crédito ---
let usuariosData = [];

async function openLoadCreditModal() {
  loadCreditModal.classList.remove('hidden');
  loadCreditError.classList.add('hidden');
  loadCreditForm.reset();
  document.getElementById('userInfoFields').classList.add('hidden');
  document.getElementById('userIdLabel').textContent = '';
  document.getElementById('userNameLabel').textContent = '';

  // Carregar lista de usuários
  try {
    const response = await fetch('https://api-consulta-in-100.vercel.app/api/userlogins');
    if (!response.ok) throw new Error('Erro ao carregar usuários');
    
    const data = await response.json();
    usuariosData = data; // Salva todos os dados para lookup posterior
    // Preencher o select com os logins únicos
    userSelect.innerHTML = '<option value="">Selecione um usuário</option>' +
      data.map(user => `<option value="${user.login}">${user.login}</option>`).join('');
  } catch (error) {
    console.error('Erro ao carregar usuários:', error);
    showToast('Erro ao carregar lista de usuários', 'error');
  }
}

function closeLoadCreditModal() {
  loadCreditModal.classList.add('hidden');
  loadCreditError.classList.add('hidden');
  loadCreditForm.reset();
  document.getElementById('userInfoFields').classList.add('hidden');
  document.getElementById('userIdLabel').textContent = '';
  document.getElementById('userNameLabel').textContent = '';
}

// Mostrar ID e Nome ao selecionar usuário
userSelect.addEventListener('change', () => {
  const login = userSelect.value;
  const user = usuariosData.find(u => u.login === login);
  if (user) {
    document.getElementById('userIdLabel').textContent = user.id;
    document.getElementById('userNameLabel').textContent = user.nome || '-';
    document.getElementById('userInfoFields').classList.remove('hidden');
  } else {
    document.getElementById('userInfoFields').classList.add('hidden');
    document.getElementById('userIdLabel').textContent = '';
    document.getElementById('userNameLabel').textContent = '';
  }
});

// --- Event Listeners Modal Carregar Crédito ---
loadCreditBtn.addEventListener('click', () => {
  openLoadCreditModal();
});

cancelLoadCreditBtn.addEventListener('click', () => {
  closeLoadCreditModal();
});

loadCreditOverlay.addEventListener('click', () => {
  closeLoadCreditModal();
});

loadCreditForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const login = userSelect.value.trim();
  const user = usuariosData.find(u => u.login === login);
  const amount = parseInt(creditAmount.value);

  if (!user || !user.id || !login || !amount) {
    loadCreditError.textContent = 'Por favor, selecione um usuário e informe o valor.';
    loadCreditError.classList.remove('hidden');
    showToast('Preencha todos os campos.', 'error');
    return;
  }

  loadCreditError.classList.add('hidden');
  loadCreditLoading.classList.remove('hidden');
  saveLoadCreditBtn.disabled = true;

  try {
    const res = await fetch('https://api-consulta-in-100.vercel.app/api/carregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_user: user.id, login, total_carregado: amount }),
    });

    if (res.status === 500 || res.status === 504) {
      throw new Error('Erro no servidor, espere um tempo e tente novamente');
    }
    const data = await res.json();

    if (!res.ok) {
      let errorMsg = 'Erro ao carregar crédito';
      if (data && data.error) {
        errorMsg = data.error;
      } else if (res.statusText) {
        errorMsg = `Erro ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMsg);
    }

    showToast(data.message || 'Crédito carregado com sucesso!', 'success');
    closeLoadCreditModal();
  } catch (error) {
    loadCreditError.textContent = error.message || 'Erro ao carregar crédito. Tente novamente.';
    loadCreditError.classList.remove('hidden');
    showToast(error.message || 'Erro ao carregar crédito.', 'error');
  } finally {
    loadCreditLoading.classList.add('hidden');
    saveLoadCreditBtn.disabled = false;
  }
});
