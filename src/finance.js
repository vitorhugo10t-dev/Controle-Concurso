export const BILL_STATUS = ['pendente', 'paga', 'vencida'];
export const STORAGE_KEY = 'controleConcurso.finance.v1';

export function emptyFinanceState() {
  return { banks: [], accounts: [], monthlyFinances: [], bills: [] };
}

export function money(value, field = 'valor') {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`${field} deve ser um valor monetário positivo.`);
  }
  return Math.round(amount * 100) / 100;
}

export function validateDueDate(date, field = 'vencimento') {
  if (!date || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
    throw new Error(`${field} deve ser uma data válida.`);
  }
  return date;
}

export function monthKey(month, year) {
  const monthNumber = Number(month);
  const yearNumber = Number(year);
  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) throw new Error('Mês deve estar entre 1 e 12.');
  if (!Number.isInteger(yearNumber) || yearNumber < 2000 || yearNumber > 2100) throw new Error('Ano deve estar entre 2000 e 2100.');
  return `${yearNumber}-${String(monthNumber).padStart(2, '0')}`;
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadState(storage = globalThis.localStorage) {
  if (!storage) return emptyFinanceState();
  const raw = storage.getItem(STORAGE_KEY);
  return raw ? { ...emptyFinanceState(), ...JSON.parse(raw) } : emptyFinanceState();
}

export function saveState(state, storage = globalThis.localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function upsertMonthlyFinance(state, input) {
  const key = monthKey(input.month, input.year);
  const existing = state.monthlyFinances.find((item) => item.key === key);
  const record = {
    id: existing?.id ?? createId('monthly'),
    key,
    month: Number(input.month),
    year: Number(input.year),
    initialBalance: money(input.initialBalance, 'Saldo inicial'),
    finalBalance: input.finalBalance === '' || input.finalBalance == null ? null : money(input.finalBalance, 'Saldo final'),
  };
  if (existing) Object.assign(existing, record);
  else state.monthlyFinances.push(record);
  return record;
}

export function addBank(state, input) {
  const name = input.name?.trim();
  if (!name) throw new Error('Nome do banco é obrigatório.');
  const bank = { id: createId('bank'), name, code: input.code?.trim() || '', active: Boolean(input.active) };
  state.banks.push(bank);
  return bank;
}

export function addAccount(state, input) {
  if (!state.banks.some((bank) => bank.id === input.bankId)) throw new Error('Selecione um banco válido.');
  const name = input.name?.trim();
  if (!name) throw new Error('Nome da conta é obrigatório.');
  const account = { id: createId('account'), bankId: input.bankId, name, type: input.type, currentBalance: money(input.currentBalance, 'Saldo atual') };
  state.accounts.push(account);
  return account;
}

export function addBill(state, input) {
  if (!state.accounts.some((account) => account.id === input.accountId)) throw new Error('Selecione uma conta válida.');
  if (!BILL_STATUS.includes(input.status)) throw new Error('Status da conta a pagar é inválido.');
  const description = input.description?.trim();
  if (!description) throw new Error('Descrição da conta a pagar é obrigatória.');
  const key = monthKey(input.month, input.year);
  const bill = {
    id: createId('bill'), key, month: Number(input.month), year: Number(input.year), description,
    amount: money(input.amount, 'Valor da conta'), dueDate: validateDueDate(input.dueDate),
    status: input.status, paidDate: input.paidDate ? validateDueDate(input.paidDate, 'Data de pagamento') : '', accountId: input.accountId,
  };
  state.bills.push(bill);
  return bill;
}

export function summarizeMonth(state, month, year) {
  const key = monthKey(month, year);
  const monthly = state.monthlyFinances.find((item) => item.key === key);
  const bills = state.bills.filter((bill) => bill.key === key);
  const availableByAccount = state.accounts.map((account) => {
    const bank = state.banks.find((item) => item.id === account.bankId);
    return { ...account, bankName: bank?.name ?? 'Sem banco' };
  });
  const available = availableByAccount.reduce((sum, account) => sum + account.currentBalance, 0);
  const totalPayable = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = bills.filter((bill) => bill.status === 'paga').reduce((sum, bill) => sum + bill.amount, 0);
  const openPayable = bills.filter((bill) => bill.status !== 'paga').reduce((sum, bill) => sum + bill.amount, 0);
  const projectedBalance = available - openPayable;
  return {
    key, monthly, bills, availableByAccount,
    initialBalance: monthly?.initialBalance ?? 0,
    finalBalance: monthly?.finalBalance ?? projectedBalance,
    available, totalPayable, totalPaid, projectedBalance,
  };
}
