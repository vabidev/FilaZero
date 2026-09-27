# Estado atual do FilaZero

O FilaZero chegou à versão 2.2 como um projeto gratuito e open source de agendamento online.

## Funcionalidades disponíveis

### Site público

- Página inicial
- Página sobre
- Página de contato
- Agendamento de serviços
- Escolha de data e horário
- Exibição dos valores cadastrados para cada serviço
- Histórico de agendamentos
- Notificações
- Tema claro e escuro
- Layout responsivo

### Administração

- Login administrativo
- Dashboard
- Gerenciamento de serviços
- Gerenciamento de clientes
- Controle de agendamentos
- Alteração de status
- Horários de funcionamento
- Dias indisponíveis
- Número de funcionários
- Configurações do negócio
- Alteração de credenciais

### Infraestrutura

- Backend Node.js + Express
- Banco SQLite
- Dockerfile
- Configuração para Fly.io
- Variáveis de ambiente para segredos
- Arquivos locais e banco fora do Git por padrão

## Distribuição

O código do FilaZero é gratuito e licenciado sob MIT.

Não existe compra, plano pago ou licença comercial obrigatória para usar o projeto.

Quem utiliza o sistema continua livre para definir os preços dos próprios serviços cadastrados no FilaZero. Esses valores pertencem ao negócio que executa a instância e não são cobrança pelo software.

## Segurança

Para produção:

- defina `SESSION_SECRET`;
- defina `ADMIN_PASSWORD`;
- use HTTPS;
- não publique `.env`;
- não versione bancos com dados reais;
- mantenha dependências atualizadas.

A instalação de desenvolvimento continua podendo usar `admin / admin123` para facilitar testes locais.

## Próximos passos

Contribuições podem incluir:

- melhorias de acessibilidade;
- testes automatizados;
- melhorias de segurança;
- integrações opcionais;
- internacionalização;
- melhorias de documentação;
- novos recursos de agenda.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) antes de enviar alterações.

---

**FilaZero v2.2 — gratuito, open source e sob licença MIT.**
