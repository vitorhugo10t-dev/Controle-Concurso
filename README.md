# Controle Concurso - Finanças pessoais

Módulo web simples para controle de finanças pessoais com cadastro de saldo inicial, bancos, contas/carteiras, receitas e contas a pagar.

## Como iniciar

```bash
npm start
```

A aplicação ficará disponível em:

- Dashboard financeiro: <http://localhost:3000/dashboard/financas>
- Raiz alternativa: <http://localhost:3000/>

Se necessário, altere a porta com a variável `PORT`:

```bash
PORT=8080 npm start
```

## Como testar

```bash
npm test
```

## Funcionalidades

- Cadastro e exibição do saldo inicial mensal.
- Cálculo automático do saldo final previsto: saldo inicial + receitas - contas a pagar em aberto.
- Cadastro e listagem de bancos.
- Cadastro e listagem de contas bancárias/carteiras.
- Cadastro e listagem de entradas/receitas.
- Cadastro e listagem de contas a pagar.
- Dashboard consolidado com saldo inicial, receitas, contas a pagar, saldo final previsto e resumo por conta bancária.

Os dados são armazenados no `localStorage` do navegador.
