# Controle de Estudos (Next.js)

Dashboard web responsivo para controle de matérias e submatérias com status e quantidade de questões.

## Stack

- Next.js 14+ (App Router) + TypeScript
- TailwindCSS
- shadcn/ui (componentes base no diretório `components/ui`)
- Recharts
- Zustand + LocalStorage
- Zod

## Como rodar

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Funcionalidades

- Dashboard com cards de matérias e edição inline de submatérias
- Status Geral com KPIs e gráficos
- Busca global por matéria/submatéria
- Persistência local (LocalStorage) com hidratação segura no client
- Importar/Exportar JSON com validação Zod
- Reset de dados com confirmação
