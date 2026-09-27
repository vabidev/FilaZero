# FilaZero

Sistema de agendamento online gratuito e open source para barbearias, salões, clínicas, consultórios, estúdios e profissionais autônomos.

O FilaZero é distribuído sob a licença MIT: você pode usar, estudar, modificar e redistribuir o projeto livremente, inclusive em projetos comerciais, respeitando os termos da licença.

## Recursos

- Agendamento online com seleção de serviço, data e horário
- Painel administrativo
- Gerenciamento de serviços, clientes e agendamentos
- Horários de funcionamento e dias indisponíveis
- Suporte a múltiplos funcionários
- Notificações e histórico de agendamentos
- Tema claro/escuro
- Interface responsiva
- SQLite, sem dependência obrigatória de serviços pagos

## Tecnologias

- Node.js
- Express
- SQLite
- HTML, CSS e JavaScript
- bcryptjs
- express-session

## Instalação

```bash
git clone https://github.com/vabidev/FilaZero.git
cd FilaZero
npm install
cp .env.example .env
npm start
```

A aplicação fica disponível em `http://localhost:3000`.

## Configuração

Copie `.env.example` para `.env` e ajuste as variáveis:

```env
PORT=3000
SESSION_SECRET=troque-por-uma-chave-longa-e-aleatoria
ADMIN_USERNAME=admin
ADMIN_PASSWORD=troque-por-uma-senha-forte
DATABASE_PATH=./database.sqlite
```

Em produção, `SESSION_SECRET` e `ADMIN_PASSWORD` são obrigatórias.

## Desenvolvimento

```bash
npm run dev
```

## Documentação

Veja [MANUAL.md](MANUAL.md) para instruções de instalação, deploy e personalização.

Para contribuir, veja [CONTRIBUTING.md](CONTRIBUTING.md).

Questões de segurança devem seguir [SECURITY.md](SECURITY.md).

## Licença

MIT. Consulte [LICENSE](LICENSE).

---

**FilaZero v2.2 — Open Source Edition**
