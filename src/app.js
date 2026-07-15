import { addAccount, addBank, addBill, loadState, saveState, summarizeMonth, upsertMonthlyFinance } from './finance.js';

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const state = loadState();
const $ = (id) => document.getElementById(id);
const current = { month: new Date().getMonth() + 1, year: new Date().getFullYear() };

function fillMonths(select) { select.innerHTML = monthNames.map((name, i) => `<option value="${i + 1}">${name}</option>`).join(''); }
['filter-month', 'monthly-month'].forEach((id) => fillMonths($(id)));
$('filter-month').value = current.month; $('monthly-month').value = current.month;
$('filter-year').value = current.year; $('monthly-year').value = current.year;

function toast(message, isError = false) { const el = $('toast'); el.textContent = message; el.className = isError ? 'error' : 'success'; setTimeout(() => { el.className = ''; }, 3500); }
function persistAndRender(message) { saveState(state); render(); toast(message); }
function selectedPeriod() { return { month: Number($('filter-month').value), year: Number($('filter-year').value) }; }

function syncSelects() {
  $('account-bank').innerHTML = state.banks.filter((b) => b.active).map((bank) => `<option value="${bank.id}">${bank.name}${bank.code ? ` (${bank.code})` : ''}</option>`).join('');
  $('bill-account').innerHTML = state.accounts.map((account) => {
    const bank = state.banks.find((item) => item.id === account.bankId);
    return `<option value="${account.id}">${bank?.name ?? 'Sem banco'} · ${account.name}</option>`;
  }).join('');
}

function render() {
  syncSelects();
  const { month, year } = selectedPeriod();
  const summary = summarizeMonth(state, month, year);
  $('summary-initial').textContent = brl.format(summary.initialBalance);
  $('summary-available').textContent = brl.format(summary.available);
  $('summary-payable').textContent = brl.format(summary.totalPayable);
  $('summary-paid').textContent = brl.format(summary.totalPaid);
  $('summary-projected').textContent = brl.format(summary.projectedBalance);
  $('summary-final').textContent = brl.format(summary.finalBalance);
  $('monthly-month').value = month; $('monthly-year').value = year;
  $('initial-balance').value = summary.monthly?.initialBalance ?? '';
  $('final-balance').value = summary.monthly?.finalBalance ?? '';

  $('account-list').innerHTML = summary.availableByAccount.length ? summary.availableByAccount.map((account) => `<div class="list-item"><div><strong>${account.bankName}</strong><span>${account.name} · ${account.type}</span></div><b>${brl.format(account.currentBalance)}</b></div>`).join('') : '<p class="empty">Nenhuma conta cadastrada.</p>';
  $('bill-list').innerHTML = summary.bills.length ? summary.bills.map((bill) => `<div class="list-item"><div><strong>${bill.description}</strong><span>Vence em ${new Date(`${bill.dueDate}T00:00:00`).toLocaleDateString('pt-BR')} · <em class="status ${bill.status}">${bill.status}</em></span></div><b>${brl.format(bill.amount)}</b></div>`).join('') : '<p class="empty">Nenhuma conta a pagar neste mês.</p>';
}

function safely(handler) { return (event) => { event.preventDefault(); try { handler(event); } catch (error) { toast(error.message, true); } }; }
$('filter-form').addEventListener('submit', safely(render));
$('monthly-form').addEventListener('submit', safely(() => persistAndRender('Controle mensal salvo.', upsertMonthlyFinance(state, { month: $('monthly-month').value, year: $('monthly-year').value, initialBalance: $('initial-balance').value, finalBalance: $('final-balance').value }))));
$('bank-form').addEventListener('submit', safely((event) => { addBank(state, { name: $('bank-name').value, code: $('bank-code').value, active: $('bank-active').checked }); event.target.reset(); $('bank-active').checked = true; persistAndRender('Banco adicionado.'); }));
$('account-form').addEventListener('submit', safely((event) => { addAccount(state, { bankId: $('account-bank').value, name: $('account-name').value, type: $('account-type').value, currentBalance: $('account-balance').value }); event.target.reset(); persistAndRender('Conta adicionada.'); }));
$('bill-form').addEventListener('submit', safely((event) => { const { month, year } = selectedPeriod(); addBill(state, { month, year, description: $('bill-description').value, amount: $('bill-amount').value, dueDate: $('bill-due-date').value, status: $('bill-status').value, paidDate: $('bill-paid-date').value, accountId: $('bill-account').value }); event.target.reset(); persistAndRender('Conta a pagar adicionada.'); }));
render();
