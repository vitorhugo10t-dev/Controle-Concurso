# Controle Concurso | Dashboard Financeiro

Dashboard estático para controle mensal de finanças pessoais, com cadastro de bancos, contas/carteiras, contas a pagar e resumo por mês de referência.

## Estratégia de publicação

Este projeto foi preparado para publicação no **GitHub Pages** porque é uma aplicação estática composta por `index.html`, `src/styles.css` e `src/app.js`, sem etapa de build. O workflow em `.github/workflows/pages.yml` publica diretamente os arquivos do repositório.

Os caminhos atuais são relativos:

- `src/styles.css`, referenciado pelo `index.html`.
- `src/app.js`, carregado como módulo pelo `index.html`.

Essa estrutura funciona no GitHub Pages, inclusive em URLs de projeto como `https://usuario.github.io/repositorio/`, porque os assets são resolvidos a partir do diretório onde o `index.html` é servido.

## Como abrir localmente

Pré-requisitos:

- Node.js instalado para executar os scripts do `package.json`.
- Python 3 disponível no ambiente para o servidor estático local usado pelo script `dev`.

Execute:

```bash
npm run dev
```

Depois acesse:

```text
http://localhost:4173
```

Também é possível abrir o arquivo `index.html` diretamente no navegador, mas o servidor local é recomendado para simular melhor a publicação em um host estático.

## Testes

Execute:

```bash
npm test
```

O script mantém a suíte atual em `tests/finance.test.js`.

## Como publicar online com GitHub Pages

1. Envie o repositório para o GitHub.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment**, selecione **GitHub Actions** como origem.
4. Faça push para a branch `main`.
5. O workflow `.github/workflows/pages.yml` fará upload de `index.html`, `src/`, `package.json`, `README.md` e demais arquivos versionados necessários para servir o dashboard.

Após a execução do workflow, o site ficará disponível na URL informada pela página de configuração do GitHub Pages.

## Persistência dos dados

Os dados do dashboard são salvos no próprio navegador usando `localStorage`. Isso significa que:

- As informações permanecem disponíveis ao recarregar a página no mesmo navegador e dispositivo.
- Os dados não são enviados para servidor externo.
- Limpar os dados do site/navegador remove os registros salvos.
- Outro navegador, dispositivo ou perfil de usuário terá uma base de dados separada.

