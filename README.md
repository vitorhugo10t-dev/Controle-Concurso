# Controle Concurso | Dashboard Financeiro

Dashboard online simples para registrar saldos de contas bancárias, bancos, carteiras e contas a pagar por mês de referência.

## Funcionalidades

- Registro de saldo inicial e saldo final mensal.
- Cálculo automático da variação entre saldo final e saldo inicial.
- Cadastro de bancos e contas/carteiras.
- Registro de contas a pagar com status de pagamento.
- Resumo mensal com total disponível, contas a pagar, valores pagos, saldo projetado, saldo final e variação.
- Persistência local no navegador usando `localStorage`.

## Executar localmente

```bash
npm start
```

Depois acesse:

```text
http://localhost:4173
```

## Testes

```bash
npm test
```

## Publicação online

Este projeto é estático e pode ser publicado em qualquer hospedagem de arquivos estáticos, como GitHub Pages, Netlify ou Vercel.

### GitHub Pages

1. Publique este repositório no GitHub.
2. Acesse **Settings > Pages**.
3. Selecione a branch principal e a pasta raiz (`/`).
4. Salve as configurações e acesse a URL gerada pelo GitHub Pages.

### Netlify ou Vercel

1. Importe o repositório na plataforma.
2. Configure o diretório de publicação como a raiz do projeto.
3. Não é necessário comando de build.
4. Publique o site.

## Observação sobre dados

Os dados ficam salvos no navegador do usuário. Ao limpar dados do site ou usar outro navegador/dispositivo, será necessário cadastrar novamente.
