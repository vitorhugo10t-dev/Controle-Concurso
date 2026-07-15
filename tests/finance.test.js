import assert from 'node:assert/strict';
import { addAccount, addBank, addBill, addIncome, emptyFinanceState, money, summarizeMonth, upsertMonthlyFinance, validateDueDate } from '../src/finance.js';

const state = emptyFinanceState();
assert.throws(() => money(-1), /positivo/);
assert.throws(() => validateDueDate('data-invalida'), /data válida/);

upsertMonthlyFinance(state, { month: 7, year: 2026, initialBalance: 1000 });
const bank = addBank(state, { name: 'Banco Teste', code: '001', active: true });
const account = addAccount(state, { bankId: bank.id, name: 'Conta principal', type: 'Conta corrente', currentBalance: 1500 });
addIncome(state, { month: 7, year: 2026, description: 'Salário', amount: 2000, receivedDate: '2026-07-05', accountId: account.id });
addBill(state, { month: 7, year: 2026, description: 'Aluguel', amount: 500, dueDate: '2026-07-10', status: 'paga', paidDate: '2026-07-09', accountId: account.id });
addBill(state, { month: 7, year: 2026, description: 'Internet', amount: 120, dueDate: '2026-07-20', status: 'pendente', accountId: account.id });

const summary = summarizeMonth(state, 7, 2026);
assert.equal(summary.initialBalance, 1000);
assert.equal(summary.available, 1500);
assert.equal(summary.totalIncome, 2000);
assert.equal(summary.totalPayable, 620);
assert.equal(summary.totalPaid, 500);
assert.equal(summary.projectedBalance, 3380);
assert.equal(summary.finalBalance, 2880);
assert.equal(summary.availableByAccount[0].projectedBalance, 3380);
console.log('finance tests passed');
