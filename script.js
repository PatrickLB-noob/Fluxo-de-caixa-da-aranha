const CASH_STORAGE_KEY = 'teiaDoCaixaLancamentos';
const PRODUCT_STORAGE_KEY = 'teiaDoCaixaProdutos';
const SERVICE_STORAGE_KEY = 'teiaDoCaixaServicos';
const APPOINTMENT_STORAGE_KEY = 'teiaDoCaixaAtendimentos';

const toast = document.getElementById('toast');
const sideMenu = document.getElementById('sideMenu');
const sideMenuOverlay = document.getElementById('sideMenuOverlay');
const closeSideMenuBtn = document.getElementById('closeSideMenu');
const screens = document.querySelectorAll('.screen');
const homeScreens = ['homeScreen', 'cardsScreen', 'preview'];

const cashForm = document.getElementById('cashForm');
const descricaoInput = document.getElementById('descricao');
const valorInput = document.getElementById('valor');
const categoriaInput = document.getElementById('categoria');
const pagamentoInput = document.getElementById('pagamento');
const dataInput = document.getElementById('data');
const filtroInput = document.getElementById('filtro');
const transactionsBox = document.getElementById('transactions');
const emptyState = document.getElementById('emptyState');
const limparTudoBtn = document.getElementById('limparTudo');

const productForm = document.getElementById('productForm');
const produtoNomeInput = document.getElementById('produtoNome');
const produtoValorInput = document.getElementById('produtoValor');
const productsBox = document.getElementById('products');
const emptyProducts = document.getElementById('emptyProducts');
const limparEstoqueBtn = document.getElementById('limparEstoque');
const abrirFormProdutoBtn = document.getElementById('abrirFormProduto');
const cancelarProdutoBtn = document.getElementById('cancelarProduto');

const stockModal = document.getElementById('stockModal');
const modalProdutoNome = document.getElementById('modalProdutoNome');
const modalValorIndividual = document.getElementById('modalValorIndividual');
const modalValorTotal = document.getElementById('modalValorTotal');
const modalValorProdutoInput = document.getElementById('modalValorProdutoInput');
const modalQuantidade = document.getElementById('modalQuantidade');
const modalDiminuir = document.getElementById('modalDiminuir');
const modalAumentar = document.getElementById('modalAumentar');
const salvarModalProduto = document.getElementById('salvarModalProduto');
const apagarModalProduto = document.getElementById('apagarModalProduto');
const fecharModalProduto = document.getElementById('fecharModalProduto');
const fecharModalEstoque = document.getElementById('fecharModalEstoque');

const serviceForm = document.getElementById('serviceForm');
const servicoNomeInput = document.getElementById('servicoNome');
const servicoProdutosInput = document.getElementById('servicoProdutos');
const servicesList = document.getElementById('servicesList');
const emptyServices = document.getElementById('emptyServices');
const limparServicosBtn = document.getElementById('limparServicos');

const appointmentForm = document.getElementById('appointmentForm');
const clienteNomeInput = document.getElementById('clienteNome');
const atendimentoServicoInput = document.getElementById('atendimentoServico');
const atendimentoServicoManualInput = document.getElementById('atendimentoServicoManual');
const atendimentoValorInput = document.getElementById('atendimentoValor');
const atendimentoDataHoraInput = document.getElementById('atendimentoDataHora');
const atendimentoStatusPagamentoInput = document.getElementById('atendimentoStatusPagamento'); // mantido só para compatibilidade com versões antigas
const appointmentsList = document.getElementById('appointmentsList');
const emptyAppointments = document.getElementById('emptyAppointments');
const limparAtendimentosBtn = document.getElementById('limparAtendimentos');
const appointmentEditModal = document.getElementById('appointmentEditModal');
const appointmentEditForm = document.getElementById('appointmentEditForm');
const editClienteNomeInput = document.getElementById('editClienteNome');
const editAtendimentoServicoInput = document.getElementById('editAtendimentoServico');
const editAtendimentoValorInput = document.getElementById('editAtendimentoValor');
const editAtendimentoDataHoraInput = document.getElementById('editAtendimentoDataHora');
const fecharModalAtendimento = document.getElementById('fecharModalAtendimento');
const fecharModalAtendimentoBtn = document.getElementById('fecharModalAtendimentoBtn');
const cancelarEdicaoAtendimentoBtn = document.getElementById('cancelarEdicaoAtendimento');
const scheduleList = document.getElementById('scheduleList');
const emptySchedule = document.getElementById('emptySchedule');
const agendaDataAtual = document.getElementById('agendaDataAtual');
const agendaDatePicker = document.getElementById('agendaDatePicker');
const agendaDiaLista = document.getElementById('agendaDiaLista');
const agendaPrevDay = document.getElementById('agendaPrevDay');
const agendaNextDay = document.getElementById('agendaNextDay');
const agendaToday = document.getElementById('agendaToday');
const reportMonthSelect = document.getElementById('reportMonthSelect');
const reportList = document.getElementById('reportList');
const emptyReports = document.getElementById('emptyReports');
const reportGanhos = document.getElementById('reportGanhos');
const reportGastos = document.getElementById('reportGastos');
const reportLucro = document.getElementById('reportLucro');
const reportClientes = document.getElementById('reportClientes');
const reportPagos = document.getElementById('reportPagos');
const reportAbertos = document.getElementById('reportAbertos');
const fiadosList = document.getElementById('fiadosList');
const emptyFiados = document.getElementById('emptyFiados');
const fiadoTotalValor = document.getElementById('fiadoTotalValor');
const fiadoTotalClientes = document.getElementById('fiadoTotalClientes');
const fiadoTotalAtendimentos = document.getElementById('fiadoTotalAtendimentos');

let lancamentos = JSON.parse(localStorage.getItem(CASH_STORAGE_KEY)) || [];
let produtos = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY)) || [];
let servicos = JSON.parse(localStorage.getItem(SERVICE_STORAGE_KEY)) || [];
let atendimentos = JSON.parse(localStorage.getItem(APPOINTMENT_STORAGE_KEY)) || [];

produtos = produtos.map(normalizeProductShape);
servicos = servicos.map(normalizeServiceShape);
atendimentos = atendimentos.map(normalizeAppointmentShape);
let produtoAbertoId = null;
let selectedAgendaDate = todayISO();
let currentScreenId = 'homeScreen';
let atendimentoEditandoId = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function nowDateTimeLocal() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function dateTimeFromSelectedAgendaDate() {
  const currentValue = atendimentoDataHoraInput?.value || nowDateTimeLocal();
  const currentTime = currentValue.includes('T') ? currentValue.split('T')[1] : '09:00';
  return `${selectedAgendaDate}T${currentTime || '09:00'}`;
}

function prepareAppointmentFromAgendaDate() {
  if (!atendimentoDataHoraInput) return;
  atendimentoDataHoraInput.value = dateTimeFromSelectedAgendaDate();
}

function monthKey(dateString) {
  return dateString.slice(0, 7);
}

function normalizeText(text) {
  return String(text || '').trim().toLowerCase();
}

function normalizeProductShape(produto) {
  const quantidade = Number(produto.quantidade) || 0;
  const valorIndividual = Number(produto.valorIndividual ?? produto.custoMedio ?? produto.valor ?? 0) || 0;
  return {
    id: Number(produto.id) || Date.now(),
    nome: produto.nome || 'Produto sem nome',
    valorIndividual,
    quantidade,
    criadoEm: produto.criadoEm || produto.ultimaCompra || todayISO()
  };
}

function normalizeServiceShape(servico) {
  return {
    id: Number(servico.id) || Date.now(),
    nome: servico.nome || 'Serviço sem nome',
    produtoIds: Array.isArray(servico.produtoIds) ? servico.produtoIds.map(Number) : [],
    criadoEm: servico.criadoEm || todayISO()
  };
}

function normalizeAppointmentShape(item) {
  return {
    id: Number(item.id) || Date.now(),
    cliente: item.cliente ?? '',
    servicoId: item.servicoId ? Number(item.servicoId) : null,
    servicoNome: item.servicoNome ?? item.servico ?? '',
    valor: Number(item.valor) || 0,
    dataHora: item.dataHora || `${item.data || todayISO()}T${item.hora || item.inicio || '09:00'}`,
    statusPagamento: item.statusPagamento || (item.lancamentoId ? 'pago' : 'pendente'),
    lancamentoId: item.lancamentoId || null
  };
}

function saveCash() { localStorage.setItem(CASH_STORAGE_KEY, JSON.stringify(lancamentos)); }
function saveProducts() { localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(produtos)); }
function saveServices() { localStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(servicos)); }
function saveAppointments() { localStorage.setItem(APPOINTMENT_STORAGE_KEY, JSON.stringify(atendimentos)); }

function getAppointmentStatusInfo(status) {
  if (status === 'pago') return { className: 'entrada', label: 'Pago' };
  if (status === 'fiado') return { className: 'saida', label: 'Fiado' };
  return { className: 'pendente', label: 'Pendente' };
}

function getActiveAppointments() {
  return atendimentos.filter(item => item.statusPagamento !== 'pago');
}

function createCashEntryFromAppointment(item) {
  if (!item || item.lancamentoId) return;
  const { date } = dateTimeParts(item.dataHora);
  const lancamentoId = Date.now() + Math.floor(Math.random() * 1000);
  item.lancamentoId = lancamentoId;
  lancamentos.push({
    id: lancamentoId,
    tipo: 'entrada',
    descricao: `${displayServiceName(item)} - ${displayClientName(item)}`,
    valor: item.valor,
    categoria: 'Serviço',
    pagamento: 'Pix',
    data: date
  });
}

function displayClientName(item) {
  return (item?.cliente || '').trim() || 'Cliente';
}

function displayServiceName(item) {
  return (item?.servicoNome || '').trim() || 'Serviço';
}

function openSideMenu() {
  sideMenu?.classList.add('active');
  sideMenuOverlay?.classList.add('active');
  sideMenu?.setAttribute('aria-hidden', 'false');
}

function closeSideMenu() {
  sideMenu?.classList.remove('active');
  sideMenuOverlay?.classList.remove('active');
  sideMenu?.setAttribute('aria-hidden', 'true');
}

function openScreen(id) {
  currentScreenId = id;
  closeSideMenu();
  if (id === 'relatoriosScreen') renderReports();
  if (id === 'fiadosScreen') renderFiados();
  screens.forEach(screen => screen.classList.remove('active'));
  if (id === 'homeScreen') homeScreens.forEach(screenId => document.getElementById(screenId).classList.add('active'));
  else document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getTotals(filterFn) {
  const selected = lancamentos.filter(filterFn);
  const ganhos = selected.filter(item => item.tipo === 'entrada').reduce((sum, item) => sum + Number(item.valor), 0);
  const gastos = selected.filter(item => item.tipo === 'saida').reduce((sum, item) => sum + Number(item.valor), 0);
  return { ganhos, gastos, lucro: ganhos - gastos };
}

function updateSummary() {
  const hoje = todayISO();
  const mesAtual = monthKey(hoje);
  const hojeTotals = getTotals(item => item.data === hoje);
  document.getElementById('homeEntradas').textContent = formatMoney(hojeTotals.ganhos);
  document.getElementById('homeSaidas').textContent = formatMoney(hojeTotals.gastos);
  document.getElementById('homeSaldo').textContent = formatMoney(hojeTotals.lucro);
  const mesTotals = getTotals(item => monthKey(item.data) === mesAtual);
  document.getElementById('mesEntradas').textContent = formatMoney(mesTotals.ganhos);
  document.getElementById('mesSaidas').textContent = formatMoney(mesTotals.gastos);
  document.getElementById('mesSaldo').textContent = formatMoney(mesTotals.lucro);
}

function getFilteredLancamentos() {
  const filtro = filtroInput.value;
  const hoje = todayISO();
  const mesAtual = monthKey(hoje);
  if (filtro === 'hoje') return lancamentos.filter(item => item.data === hoje);
  if (filtro === 'mes') return lancamentos.filter(item => monthKey(item.data) === mesAtual);
  if (filtro === 'entrada') return lancamentos.filter(item => item.tipo === 'entrada');
  if (filtro === 'saida') return lancamentos.filter(item => item.tipo === 'saida');
  return lancamentos;
}

function renderLancamentos() {
  const filtered = getFilteredLancamentos().sort((a, b) => b.id - a.id);
  transactionsBox.innerHTML = '';
  emptyState.style.display = filtered.length ? 'none' : 'block';
  filtered.forEach(item => {
    const div = document.createElement('div');
    div.className = `transaction ${item.tipo}`;
    const signal = item.tipo === 'entrada' ? '+' : '-';
    const label = item.tipo === 'entrada' ? 'Ganho' : 'Gasto';
    div.innerHTML = `
      <span class="badge">${label}</span>
      <div>
        <h4>${item.descricao}</h4>
        <p>${item.data.split('-').reverse().join('/')} • ${item.categoria} • ${item.pagamento}</p>
      </div>
      <strong class="${item.tipo}">${signal} ${formatMoney(item.valor)}</strong>
      <button class="icon-btn" data-delete="${item.id}" title="Apagar lançamento">🗑️</button>
    `;
    transactionsBox.appendChild(div);
  });
}

function renderFinanceiro() { updateSummary(); renderLancamentos(); renderReports(); }

function updateTypeVisual() {
  document.querySelectorAll('.type-option').forEach(label => label.classList.remove('active'));
  const selected = document.querySelector('input[name="tipo"]:checked');
  if (selected) selected.closest('.type-option').classList.add('active');
  updateCategoryOptions();
}

function updateCategoryOptions() {
  if (!categoriaInput) return;
  const tipo = document.querySelector('input[name="tipo"]:checked')?.value || 'entrada';
  const options = tipo === 'entrada'
    ? ['Produto vendido', 'Serviço', 'Outros']
    : ['Produto comprado', 'Conta fixa', 'Outros'];
  const current = categoriaInput.value;
  categoriaInput.innerHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
  if (options.includes(current)) categoriaInput.value = current;
}

function addProduct(nome, valorIndividual) {
  const nomeNormalizado = normalizeText(nome);
  const produtoExistente = produtos.find(produto => normalizeText(produto.nome) === nomeNormalizado);
  if (produtoExistente) {
    produtoExistente.valorIndividual = valorIndividual;
    return 'Produto já existia; valor individual atualizado.';
  }
  produtos.push({ id: Date.now(), nome: nome.trim(), valorIndividual, quantidade: 0, criadoEm: todayISO() });
  return 'Produto cadastrado. Agora ajuste a quantidade na lista.';
}

function updateProductQuantity(id, quantidade) {
  const produto = produtos.find(item => item.id === id);
  if (!produto) return;
  produto.quantidade = Math.max(0, Number(quantidade) || 0);
  saveProducts();
  renderEstoque();
}

function renderProductSummary() {
  const totalProdutos = produtos.length;
  const totalEstoque = produtos.reduce((sum, produto) => sum + (produto.valorIndividual * produto.quantidade), 0);
  const totalItens = produtos.reduce((sum, produto) => sum + produto.quantidade, 0);
  document.getElementById('totalProdutos').textContent = totalProdutos;
  document.getElementById('totalEstoqueValor').textContent = formatMoney(totalEstoque);
  document.getElementById('totalEstoqueItens').textContent = formatNumber(totalItens);
}

function renderProducts() {
  const sorted = [...produtos].sort((a, b) => a.nome.localeCompare(b.nome));
  productsBox.innerHTML = '';
  emptyProducts.style.display = sorted.length ? 'none' : 'block';
  sorted.forEach(produto => {
    const div = document.createElement('button');
    div.type = 'button';
    div.className = 'product-item compact-product-card';
    div.dataset.openProduct = produto.id;
    const valorTotal = produto.valorIndividual * produto.quantidade;
    div.innerHTML = `
      <div class="compact-product-main">
        <h4>${produto.nome}</h4>
        <p>Qtd: ${formatNumber(produto.quantidade)}</p>
      </div>
      <div class="compact-product-values">
        <strong>${formatMoney(valorTotal)}</strong>
        <span>${formatMoney(produto.valorIndividual)} un.</span>
      </div>
    `;
    productsBox.appendChild(div);
  });
}

function getProdutoAberto() { return produtos.find(produto => produto.id === produtoAbertoId); }

function renderModalProduto() {
  const produto = getProdutoAberto();
  if (!produto) return closeProductModal();
  modalProdutoNome.textContent = produto.nome;
  modalValorIndividual.textContent = formatMoney(produto.valorIndividual);
  modalValorTotal.textContent = formatMoney(produto.valorIndividual * produto.quantidade);
  modalValorProdutoInput.value = produto.valorIndividual;
  modalQuantidade.value = produto.quantidade;
}

function openProductModal(id) {
  produtoAbertoId = id;
  renderModalProduto();
  stockModal.classList.add('active');
  stockModal.setAttribute('aria-hidden', 'false');
  if (document.activeElement) document.activeElement.blur();
}

function closeProductModal() {
  produtoAbertoId = null;
  modalQuantidade.blur();
  modalValorProdutoInput.blur();
  stockModal.classList.remove('active');
  stockModal.setAttribute('aria-hidden', 'true');
}

function changeModalQuantity(step) {
  const atual = Number(modalQuantidade.value) || 0;
  modalQuantidade.value = Math.max(0, atual + step);
  const produto = getProdutoAberto();
  if (produto) modalValorTotal.textContent = formatMoney(produto.valorIndividual * (Number(modalQuantidade.value) || 0));
}

function saveModalQuantity() {
  if (!produtoAbertoId) return;

  const produto = getProdutoAberto();
  if (!produto) return;

  const novoValor = Number(modalValorProdutoInput.value);
  const novaQuantidade = Number(modalQuantidade.value);

  if (novoValor <= 0) {
    showToast('Digite um valor individual válido.');
    modalValorProdutoInput.focus();
    return;
  }

  produto.valorIndividual = novoValor;
  produto.quantidade = Math.max(0, novaQuantidade || 0);
  saveProducts();
  renderEstoque();
  renderModalProduto();
  showToast('Produto atualizado.');
}

function renderEstoque() { renderProductSummary(); renderProducts(); }

function getProductsByIds(ids) {
  return ids.map(id => produtos.find(produto => produto.id === Number(id))).filter(Boolean);
}

function renderServiceProductOptions() {
  if (!servicoProdutosInput) return;
  if (!produtos.length) {
    servicoProdutosInput.innerHTML = '<option disabled>Cadastre produtos no estoque primeiro</option>';
    return;
  }
  servicoProdutosInput.innerHTML = produtos
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(produto => `<option value="${produto.id}">${produto.nome}</option>`)
    .join('');
}

function renderServiceOptions() {
  if (!atendimentoServicoInput) return;
  const options = servicos
    .slice()
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .map(servico => `<option value="${servico.id}">${servico.nome}</option>`)
    .join('');
  atendimentoServicoInput.innerHTML = `<option value="">Usar nome manual</option>${options}`;
}

function renderServices() {
  if (!servicesList) return;
  const sorted = servicos.slice().sort((a, b) => a.nome.localeCompare(b.nome));
  servicesList.innerHTML = '';
  emptyServices.style.display = sorted.length ? 'none' : 'block';
  sorted.forEach(servico => {
    const produtosDoServico = getProductsByIds(servico.produtoIds);
    const nomesProdutos = produtosDoServico.length ? produtosDoServico.map(item => item.nome).join(', ') : 'Nenhum produto vinculado';
    const div = document.createElement('div');
    div.className = 'service-item';
    div.innerHTML = `
      <div>
        <h4>${servico.nome}</h4>
        <p>Produtos: ${nomesProdutos}</p>
      </div>
      <button class="icon-btn" data-delete-service="${servico.id}" title="Apagar serviço">🗑️</button>
    `;
    servicesList.appendChild(div);
  });
  renderServiceOptions();
}

function addService(nome, produtoIds) {
  const nomeNormalizado = normalizeText(nome);
  const existente = servicos.find(servico => normalizeText(servico.nome) === nomeNormalizado);
  if (existente) {
    existente.produtoIds = produtoIds;
    return 'Serviço já existia; produtos usados foram atualizados.';
  }
  servicos.push({ id: Date.now(), nome: nome.trim(), produtoIds, criadoEm: todayISO() });
  return 'Serviço salvo na teia.';
}

function getServiceById(id) { return servicos.find(servico => servico.id === Number(id)); }

function getServiceNameForAppointment() {
  const manual = atendimentoServicoManualInput.value.trim();
  return { servicoId: null, servicoNome: manual };
}


function dateTimeParts(dateTime) {
  const [date, time] = dateTime.split('T');
  return { date, time };
}

function dateFromISO(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDaysISO(dateString, amount) {
  const date = dateFromISO(dateString);
  date.setDate(date.getDate() + amount);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split('T')[0];
}

function formatAgendaTitle(dateString) {
  const today = todayISO();
  const tomorrow = addDaysISO(today, 1);
  const yesterday = addDaysISO(today, -1);
  if (dateString === today) return 'Hoje';
  if (dateString === tomorrow) return 'Amanhã';
  if (dateString === yesterday) return 'Ontem';
  return dateFromISO(dateString).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

function formatShortWeekDay(dateString) {
  return dateFromISO(dateString).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
}

function renderAppointments() {
  if (!appointmentsList) return;
  const sorted = getActiveAppointments().slice().sort((a, b) => b.dataHora.localeCompare(a.dataHora));
  appointmentsList.innerHTML = '';
  emptyAppointments.style.display = sorted.length ? 'none' : 'block';
  sorted.forEach(item => {
    const { date, time } = dateTimeParts(item.dataHora);
    const status = getAppointmentStatusInfo(item.statusPagamento);
    const div = document.createElement('div');
    div.className = 'service-item appointment-item';
    div.innerHTML = `
      <span class="badge ${status.className}">${status.label}</span>
      <div>
        <h4>${displayClientName(item)}</h4>
        <p>${displayServiceName(item)} • ${date.split('-').reverse().join('/')} às ${time}</p>
      </div>
      <div class="item-right appointment-actions">
        <strong>${formatMoney(item.valor)}</strong>
        <div class="action-row">
          <button class="secondary-btn tiny-btn" data-edit-appointment="${item.id}" type="button">Editar</button>
          <button class="secondary-btn tiny-btn" data-appointment-fiado="${item.id}" type="button">Fiado</button>
          <button class="primary-btn tiny-btn" data-appointment-paid="${item.id}" type="button">Pago</button>
          <button class="icon-btn" data-delete-appointment="${item.id}" title="Apagar atendimento">🗑️</button>
        </div>
      </div>
    `;
    appointmentsList.appendChild(div);
  });
}

function renderAgendaDayStrip() {
  if (!agendaDiaLista) return;
  agendaDiaLista.innerHTML = '';

  const datesWithAppointments = new Set(
    getActiveAppointments().map(item => dateTimeParts(item.dataHora).date)
  );

  for (let offset = -3; offset <= 3; offset += 1) {
    const date = addDaysISO(selectedAgendaDate, offset);
    const hasAppointment = datesWithAppointments.has(date);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `agenda-day ${date === selectedAgendaDate ? 'active' : ''} ${hasAppointment ? 'has-appointment' : ''}`;
    button.dataset.agendaDate = date;
    button.innerHTML = `
      <small class="agenda-spider" aria-label="Dia com atendimento">🕷️</small>
      <span>${formatShortWeekDay(date)}</span>
      <strong>${date.slice(8, 10)}</strong>
    `;
    agendaDiaLista.appendChild(button);
  }
}

function renderSchedule() {
  if (!scheduleList) return;
  if (agendaDataAtual) agendaDataAtual.textContent = formatAgendaTitle(selectedAgendaDate);
  if (agendaDatePicker) agendaDatePicker.value = selectedAgendaDate;
  renderAgendaDayStrip();

  const sorted = getActiveAppointments()
    .filter(item => dateTimeParts(item.dataHora).date === selectedAgendaDate)
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora));

  scheduleList.innerHTML = '';
  emptySchedule.style.display = sorted.length ? 'none' : 'block';

  sorted.forEach(item => {
    const { time } = dateTimeParts(item.dataHora);
    const status = getAppointmentStatusInfo(item.statusPagamento);
    const div = document.createElement('div');
    div.className = 'agenda-item';
    div.innerHTML = `
      <div class="agenda-time">${time}</div>
      <div class="agenda-card">
        <div>
          <h4>${displayClientName(item)}</h4>
          <p>${displayServiceName(item)}</p>
        </div>
        <div class="agenda-card-side">
          <span class="badge ${status.className}">${status.label}</span>
          <strong>${formatMoney(item.valor)}</strong>
          <div class="action-row">
            <button class="secondary-btn tiny-btn" data-appointment-fiado="${item.id}" type="button">Fiado</button>
            <button class="primary-btn tiny-btn" data-appointment-paid="${item.id}" type="button">Pago</button>
            <button class="icon-btn" data-delete-appointment="${item.id}" title="Apagar atendimento">🗑️</button>
          </div>
        </div>
      </div>
    `;
    scheduleList.appendChild(div);
  });
}


function getMonthLabel(key) {
  if (!key) return 'Mês inválido';
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function getReportMonths() {
  const months = new Set();
  lancamentos.forEach(item => { if (item.data) months.add(monthKey(item.data)); });
  atendimentos.forEach(item => { if (item.dataHora) months.add(monthKey(dateTimeParts(item.dataHora).date)); });
  months.add(monthKey(todayISO()));
  return Array.from(months).sort().reverse();
}

function calculateMonthReport(key) {
  const moneyItems = lancamentos.filter(item => item.data && monthKey(item.data) === key);
  const ganhos = moneyItems.filter(item => item.tipo === 'entrada').reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const gastos = moneyItems.filter(item => item.tipo === 'saida').reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const monthAppointments = atendimentos.filter(item => item.dataHora && monthKey(dateTimeParts(item.dataHora).date) === key);
  const clientesUnicos = new Set(monthAppointments.map(item => normalizeText(item.cliente)).filter(Boolean));
  const pagos = monthAppointments.filter(item => item.statusPagamento === 'pago').length;
  const fiados = monthAppointments.filter(item => item.statusPagamento === 'fiado').length;
  const pendentes = monthAppointments.filter(item => item.statusPagamento === 'pendente').length;
  return {
    key,
    ganhos,
    gastos,
    lucro: ganhos - gastos,
    clientes: clientesUnicos.size,
    atendimentos: monthAppointments.length,
    pagos,
    fiados,
    pendentes,
    abertos: fiados + pendentes
  };
}

function renderReportMonthOptions(months) {
  if (!reportMonthSelect) return;
  const currentValue = reportMonthSelect.value || monthKey(todayISO());
  reportMonthSelect.innerHTML = months.map(key => `<option value="${key}">${getMonthLabel(key)}</option>`).join('');
  reportMonthSelect.value = months.includes(currentValue) ? currentValue : months[0];
}

function renderReportSummary(report) {
  if (!reportGanhos) return;
  reportGanhos.textContent = formatMoney(report.ganhos);
  reportGastos.textContent = formatMoney(report.gastos);
  reportLucro.textContent = formatMoney(report.lucro);
  reportClientes.textContent = report.clientes;
  reportPagos.textContent = report.pagos;
  reportAbertos.textContent = report.abertos;
}

function renderReportList(months) {
  if (!reportList) return;
  const reports = months.map(calculateMonthReport);
  const hasData = reports.some(item => item.ganhos || item.gastos || item.atendimentos);
  emptyReports.style.display = hasData ? 'none' : 'block';
  reportList.innerHTML = '';

  const maxMoney = Math.max(...reports.map(item => Math.max(item.ganhos, item.gastos, Math.abs(item.lucro))), 1);

  reports.forEach(report => {
    if (!report.ganhos && !report.gastos && !report.atendimentos && report.key !== monthKey(todayISO())) return;
    const ganhoWidth = Math.max(4, (report.ganhos / maxMoney) * 100);
    const gastoWidth = Math.max(4, (report.gastos / maxMoney) * 100);
    const lucroClass = report.lucro >= 0 ? 'entrada' : 'saida';
    const div = document.createElement('div');
    div.className = 'report-card';
    div.innerHTML = `
      <div class="report-card-head">
        <div>
          <h4>${getMonthLabel(report.key)}</h4>
          <p>${report.atendimentos} atendimento(s) • ${report.clientes} cliente(s)</p>
        </div>
        <strong class="${lucroClass}">${formatMoney(report.lucro)}</strong>
      </div>

      <div class="report-bars">
        <div class="report-bar-row">
          <span>Ganhos</span>
          <div class="report-track"><div class="report-fill entrada" style="width: ${ganhoWidth}%"></div></div>
          <strong>${formatMoney(report.ganhos)}</strong>
        </div>
        <div class="report-bar-row">
          <span>Gastos</span>
          <div class="report-track"><div class="report-fill saida" style="width: ${gastoWidth}%"></div></div>
          <strong>${formatMoney(report.gastos)}</strong>
        </div>
      </div>

      <div class="report-mini-grid">
        <span>Pagos: <strong>${report.pagos}</strong></span>
        <span>Fiados: <strong>${report.fiados}</strong></span>
        <span>Pendentes: <strong>${report.pendentes}</strong></span>
      </div>
    `;
    reportList.appendChild(div);
  });
}

function renderFiados() {
  if (!fiadosList) return;
  const fiados = atendimentos
    .filter(item => item.statusPagamento === 'fiado')
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora));

  const totalValor = fiados.reduce((sum, item) => sum + Number(item.valor || 0), 0);
  const clientesUnicos = new Set(fiados.map(item => normalizeText(item.cliente)).filter(Boolean));

  fiadoTotalValor.textContent = formatMoney(totalValor);
  fiadoTotalClientes.textContent = clientesUnicos.size;
  fiadoTotalAtendimentos.textContent = fiados.length;

  fiadosList.innerHTML = '';
  emptyFiados.style.display = fiados.length ? 'none' : 'block';

  fiados.forEach(item => {
    const { date, time } = dateTimeParts(item.dataHora);
    const div = document.createElement('div');
    div.className = 'service-item appointment-item debt-item';
    div.innerHTML = `
      <span class="badge saida">Fiado</span>
      <div>
        <h4>${displayClientName(item)}</h4>
        <p>${displayServiceName(item)} • ${date.split('-').reverse().join('/')} às ${time}</p>
      </div>
      <div class="item-right appointment-actions">
        <strong>${formatMoney(item.valor)}</strong>
        <div class="action-row">
          <button class="primary-btn tiny-btn" data-appointment-paid="${item.id}" type="button">Marcar como pago</button>
          <button class="icon-btn" data-delete-appointment="${item.id}" title="Apagar atendimento">🗑️</button>
        </div>
      </div>
    `;
    fiadosList.appendChild(div);
  });
}

function renderReports() {
  const months = getReportMonths();
  renderReportMonthOptions(months);
  const selected = reportMonthSelect?.value || monthKey(todayISO());
  renderReportSummary(calculateMonthReport(selected));
  renderReportList(months);
}

function renderOperacional() { renderAppointments(); renderSchedule(); renderFiados(); renderReports(); }

cashForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const valor = Number(valorInput.value);
  if (valor <= 0) return showToast('Digite um valor maior que zero.');
  const novoLancamento = {
    id: Date.now(),
    tipo: document.querySelector('input[name="tipo"]:checked').value,
    descricao: descricaoInput.value.trim() || categoriaInput.value,
    valor,
    categoria: categoriaInput.value,
    pagamento: pagamentoInput.value,
    data: dataInput.value
  };
  lancamentos.push(novoLancamento);
  saveCash();
  renderFinanceiro();
  cashForm.reset();
  dataInput.value = todayISO();
  document.querySelector('input[value="entrada"]').checked = true;
  updateTypeVisual();
  descricaoInput.focus();
  showToast('Lançamento salvo na teia.');
});

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const nome = produtoNomeInput.value.trim();
  const valor = Number(produtoValorInput.value);
  if (!nome || valor <= 0) return showToast('Preencha o nome e o valor individual do produto.');
  const message = addProduct(nome, valor);
  saveProducts();
  renderEstoque();
  productForm.reset();
  productForm.classList.remove('active');
  showToast(message);
});

if (serviceForm) {
  serviceForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nome = servicoNomeInput.value.trim();
    const produtoIds = Array.from(servicoProdutosInput.selectedOptions).map(option => Number(option.value)).filter(Boolean);
    if (!nome) return showToast('Preencha o nome do serviço.');
    const message = addService(nome, produtoIds);
    saveServices();
    renderServices();
    serviceForm.reset();
    servicoNomeInput.focus();
    showToast(message);
  });
}

if (atendimentoServicoInput) {
  atendimentoServicoInput.addEventListener('change', () => {
    const servico = getServiceById(atendimentoServicoInput.value);
    if (servico) atendimentoServicoManualInput.value = '';
  });
}


function openAppointmentEditModal(id) {
  const appointment = atendimentos.find(item => item.id === id);
  if (!appointment) return;

  atendimentoEditandoId = id;
  editClienteNomeInput.value = appointment.cliente || '';
  editAtendimentoServicoInput.value = appointment.servicoNome || '';
  editAtendimentoValorInput.value = appointment.valor || '';
  editAtendimentoDataHoraInput.value = appointment.dataHora || nowDateTimeLocal();

  appointmentEditModal.classList.add('active');
  appointmentEditModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => editClienteNomeInput.focus(), 60);
}

function closeAppointmentEditModal() {
  atendimentoEditandoId = null;
  appointmentEditForm.reset();
  appointmentEditModal.classList.remove('active');
  appointmentEditModal.setAttribute('aria-hidden', 'true');
}

function saveAppointmentEdit(event) {
  event.preventDefault();
  const appointment = atendimentos.find(item => item.id === atendimentoEditandoId);
  if (!appointment) return;

  const valorEditado = Number(editAtendimentoValorInput.value);
  if (valorEditado <= 0 || !editAtendimentoDataHoraInput.value) {
    showToast('Valor ou data/hora inválidos.');
    return;
  }

  appointment.cliente = editClienteNomeInput.value.trim();
  appointment.servicoNome = editAtendimentoServicoInput.value.trim();
  appointment.valor = valorEditado;
  appointment.dataHora = editAtendimentoDataHoraInput.value;

  if (appointment.lancamentoId) {
    const lancamento = lancamentos.find(item => item.id === appointment.lancamentoId);
    if (lancamento) {
      const { date } = dateTimeParts(appointment.dataHora);
      lancamento.descricao = `${appointment.servicoNome || 'Serviço'} - ${appointment.cliente || 'Cliente'}`;
      lancamento.valor = appointment.valor;
      lancamento.data = date;
      saveCash();
    }
  }

  selectedAgendaDate = dateTimeParts(appointment.dataHora).date;
  saveAppointments();
  renderOperacional();
  renderFinanceiro();
  closeAppointmentEditModal();
  showToast('Atendimento editado.');
}

appointmentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const valor = Number(atendimentoValorInput.value);
  const { servicoId, servicoNome } = getServiceNameForAppointment();
  if (valor <= 0 || !atendimentoDataHoraInput.value) {
    return showToast('Preencha valor e data/hora. Cliente e serviço podem ficar em branco.');
  }
  const atendimento = {
    id: Date.now(),
    cliente: clienteNomeInput.value.trim(),
    servicoId,
    servicoNome,
    valor,
    dataHora: atendimentoDataHoraInput.value,
    statusPagamento: 'pendente',
    lancamentoId: null
  };

  atendimentos.push(atendimento);
  selectedAgendaDate = dateTimeParts(atendimento.dataHora).date;
  saveAppointments();
  renderOperacional();
  appointmentForm.reset();
  prepareAppointmentFromAgendaDate();
  clienteNomeInput.focus();
  showToast('Atendimento salvo na agenda. Depois marque se foi pago ou fiado.');
});

function handleDeleteTransaction(id) {
  lancamentos = lancamentos.filter(item => item.id !== id);
  atendimentos.forEach(item => { if (item.lancamentoId === id) item.lancamentoId = null; });
  saveCash();
  saveAppointments();
  renderFinanceiro();
  renderOperacional();
  showToast('Lançamento apagado.');
}

function handleDeleteProduct(id) {
  produtos = produtos.filter(produto => produto.id !== id);
  saveProducts();
  renderEstoque();
  showToast('Produto apagado do estoque.');
}

document.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-open]');
  const deleteButton = event.target.closest('[data-delete]');
  const openProductButton = event.target.closest('[data-open-product]');
  const disabledCard = event.target.closest('.card.disabled');
  const deleteService = event.target.closest('[data-delete-service]');
  const deleteAppointment = event.target.closest('[data-delete-appointment]');
  const editAppointment = event.target.closest('[data-edit-appointment]');
  const markAppointmentPaid = event.target.closest('[data-appointment-paid]');
  const markAppointmentFiado = event.target.closest('[data-appointment-fiado]');

  if (openButton) {
    if (openButton.dataset.open === 'atendimentoScreen' && openButton.dataset.fromAgenda === 'true') {
      prepareAppointmentFromAgendaDate();
    }
    openScreen(openButton.dataset.open);
  }
  if (deleteButton) handleDeleteTransaction(Number(deleteButton.dataset.delete));
  if (openProductButton) openProductModal(Number(openProductButton.dataset.openProduct));

  if (deleteService) {
    servicos = servicos.filter(item => item.id !== Number(deleteService.dataset.deleteService));
    saveServices();
    renderServices();
    showToast('Serviço apagado.');
  }

  if (editAppointment) {
    openAppointmentEditModal(Number(editAppointment.dataset.editAppointment));
  }

  if (markAppointmentPaid) {
    const id = Number(markAppointmentPaid.dataset.appointmentPaid);
    const appointment = atendimentos.find(item => item.id === id);
    if (!appointment) return;
    createCashEntryFromAppointment(appointment);
    appointment.statusPagamento = 'pago';
    saveCash();
    saveAppointments();
    renderOperacional();
    renderFinanceiro();
    showToast('Pagamento confirmado e enviado para o caixa.');
  }

  if (markAppointmentFiado) {
    const id = Number(markAppointmentFiado.dataset.appointmentFiado);
    const appointment = atendimentos.find(item => item.id === id);
    if (!appointment) return;
    appointment.statusPagamento = 'fiado';
    saveAppointments();
    renderOperacional();
    showToast('Atendimento marcado como fiado.');
  }

  if (deleteAppointment) {
    const id = Number(deleteAppointment.dataset.deleteAppointment);
    const appointment = atendimentos.find(item => item.id === id);
    atendimentos = atendimentos.filter(item => item.id !== id);
    if (appointment?.lancamentoId) {
      lancamentos = lancamentos.filter(item => item.id !== appointment.lancamentoId);
      saveCash();
    }
    saveAppointments();
    renderOperacional();
    renderFinanceiro();
    showToast('Atendimento apagado.');
  }

  if (disabledCard) showToast(`${disabledCard.querySelector('h3').textContent} ainda será criado em uma próxima versão.`);
});

abrirFormProdutoBtn.addEventListener('click', () => {
  productForm.classList.add('active');
  produtoNomeInput.focus();
});

cancelarProdutoBtn.addEventListener('click', () => {
  productForm.reset();
  productForm.classList.remove('active');
});

modalDiminuir.addEventListener('click', () => changeModalQuantity(-1));
modalAumentar.addEventListener('click', () => changeModalQuantity(1));
salvarModalProduto.addEventListener('click', saveModalQuantity);
fecharModalProduto.addEventListener('click', closeProductModal);
fecharModalEstoque.addEventListener('click', closeProductModal);
function updateModalProductTotalPreview() {
  const valor = Number(modalValorProdutoInput.value) || 0;
  const quantidade = Number(modalQuantidade.value) || 0;
  modalValorTotal.textContent = formatMoney(valor * quantidade);
}

modalQuantidade.addEventListener('input', updateModalProductTotalPreview);
modalValorProdutoInput.addEventListener('input', updateModalProductTotalPreview);

apagarModalProduto.addEventListener('click', () => {
  const produto = getProdutoAberto();
  if (!produto) return;
  if (!confirm(`Tem certeza que deseja apagar ${produto.nome} do estoque?`)) return;
  handleDeleteProduct(produto.id);
  closeProductModal();
});


appointmentEditForm.addEventListener('submit', saveAppointmentEdit);
fecharModalAtendimento.addEventListener('click', closeAppointmentEditModal);
fecharModalAtendimentoBtn.addEventListener('click', closeAppointmentEditModal);
cancelarEdicaoAtendimentoBtn.addEventListener('click', closeAppointmentEditModal);

document.getElementById('btnHome').addEventListener('click', () => {
  if (currentScreenId === 'homeScreen') {
    openScreen('homeScreen');
    return;
  }
  openSideMenu();
});

closeSideMenuBtn?.addEventListener('click', closeSideMenu);
sideMenuOverlay?.addEventListener('click', closeSideMenu);
document.querySelectorAll('input[name="tipo"]').forEach(input => input.addEventListener('change', updateTypeVisual));
filtroInput.addEventListener('change', renderLancamentos);

limparTudoBtn.addEventListener('click', () => {
  if (!lancamentos.length) return showToast('Não existe nada para apagar.');

  const hoje = new Date(`${todayISO()}T00:00`);
  const seteDiasAtras = new Date(hoje);
  seteDiasAtras.setDate(hoje.getDate() - 6);

  const idsUltimaSemana = lancamentos
    .filter(item => {
      if (!item.data) return false;
      const dataItem = new Date(`${item.data}T00:00`);
      return dataItem >= seteDiasAtras && dataItem <= hoje;
    })
    .map(item => item.id);

  if (!idsUltimaSemana.length) return showToast('Não há lançamentos da última semana para apagar.');
  if (!confirm('Apagar somente os lançamentos feitos nos últimos 7 dias? Lançamentos antigos deverão ser apagados manualmente.')) return;

  lancamentos = lancamentos.filter(item => !idsUltimaSemana.includes(item.id));
  atendimentos.forEach(item => {
    if (idsUltimaSemana.includes(item.lancamentoId)) item.lancamentoId = null;
  });

  saveCash();
  saveAppointments();
  renderFinanceiro();
  renderOperacional();
  showToast('Lançamentos da última semana apagados.');
});


limparEstoqueBtn.addEventListener('click', () => {
  if (!produtos.length) return showToast('Não existe produto para apagar.');
  if (!confirm('Tem certeza que deseja apagar todo o estoque?')) return;
  produtos = [];
  servicos.forEach(servico => servico.produtoIds = []);
  saveProducts();
  renderEstoque();
  showToast('Estoque apagado.');
});

if (limparServicosBtn) {
  limparServicosBtn.addEventListener('click', () => {
    if (!servicos.length) return showToast('Não existe serviço para apagar.');
    if (!confirm('Tem certeza que deseja apagar todos os serviços?')) return;
    servicos = [];
    saveServices();
    renderServices();
    showToast('Serviços apagados.');
  });
}

limparAtendimentosBtn.addEventListener('click', () => {
  const ativos = getActiveAppointments();
  if (!ativos.length) return showToast('Não existe atendimento em aberto para apagar.');
  if (!confirm('Tem certeza que deseja apagar os atendimentos em aberto? Os atendimentos pagos ficam guardados para os relatórios.')) return;
  const idsAtivos = ativos.map(item => item.id);
  atendimentos = atendimentos.filter(item => !idsAtivos.includes(item.id));
  saveCash();
  saveAppointments();
  renderFinanceiro();
  renderOperacional();
  showToast('Atendimentos em aberto apagados.');
});

if (agendaPrevDay) agendaPrevDay.addEventListener('click', () => {
  selectedAgendaDate = addDaysISO(selectedAgendaDate, -1);
  renderSchedule();
});

if (agendaNextDay) agendaNextDay.addEventListener('click', () => {
  selectedAgendaDate = addDaysISO(selectedAgendaDate, 1);
  renderSchedule();
});

if (agendaToday) agendaToday.addEventListener('click', () => {
  selectedAgendaDate = todayISO();
  renderSchedule();
});

if (agendaDatePicker) agendaDatePicker.addEventListener('change', () => {
  selectedAgendaDate = agendaDatePicker.value || todayISO();
  renderSchedule();
});

if (reportMonthSelect) reportMonthSelect.addEventListener('change', () => {
  renderReportSummary(calculateMonthReport(reportMonthSelect.value));
});

if (agendaDiaLista) agendaDiaLista.addEventListener('click', (event) => {
  const button = event.target.closest('[data-agenda-date]');
  if (!button) return;
  selectedAgendaDate = button.dataset.agendaDate;
  renderSchedule();
});

dataInput.value = todayISO();
atendimentoDataHoraInput.value = nowDateTimeLocal();
updateTypeVisual();
renderFinanceiro();
renderEstoque();
renderOperacional();
