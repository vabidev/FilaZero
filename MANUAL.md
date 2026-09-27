# Manual do FilaZero

O FilaZero é um sistema gratuito e open source de agendamento online. Ele pode ser instalado, modificado e redistribuído de acordo com a licença MIT.

## Requisitos

- Node.js 18 ou superior
- npm
- Um ambiente com escrita em disco para o banco SQLite

## Instalação local

```bash
git clone https://github.com/vabidev/FilaZero.git
cd FilaZero
npm install
cp .env.example .env
npm start
```

Acesse:

- Site: `http://localhost:3000`
- Administração: `http://localhost:3000/admin`

## Variáveis de ambiente

```env
PORT=3000
SESSION_SECRET=troque-por-uma-chave-longa-e-aleatoria
ADMIN_USERNAME=admin
ADMIN_PASSWORD=troque-por-uma-senha-forte
DATABASE_PATH=./database.sqlite
```

Em produção, `SESSION_SECRET` e `ADMIN_PASSWORD` são obrigatórias. Não publique o arquivo `.env`.

## Primeiro acesso

Na primeira inicialização, o FilaZero cria o administrador usando `ADMIN_USERNAME` e `ADMIN_PASSWORD`.

Em desenvolvimento, se essas variáveis não forem definidas, o sistema mantém o usuário `admin` e a senha `admin123` apenas para facilitar testes locais. Não use essa senha em produção.

## Funcionalidades

### Site público

- Página inicial
- Agendamento de serviços
- Página sobre
- Contato
- Histórico e notificações
- Tema claro e escuro

### Painel administrativo

- Dashboard
- Serviços
- Agendamentos
- Clientes
- Configurações
- Horários de funcionamento
- Dias indisponíveis
- Número de funcionários
- Alteração de credenciais

## Banco de dados

Por padrão, o banco é criado em `./database.sqlite`. O caminho pode ser alterado com `DATABASE_PATH`.

Para backup, pare a aplicação e copie o arquivo SQLite para um local seguro.

## Produção

Use HTTPS e configure as variáveis de ambiente no provedor de hospedagem. O repositório inclui `Dockerfile` e `fly.toml`.

Nunca coloque senhas, tokens ou chaves diretamente no repositório.

## Personalização

Os arquivos principais ficam em:

```text
public/              interface pública e painel
public/css/          estilos
public/js/           scripts do navegador
routes/              rotas Express
database.js          estrutura e acesso ao SQLite
config.js            configuração por ambiente
server.js            inicialização do servidor
```

Os preços cadastrados em serviços pertencem ao negócio que usa o sistema e são independentes da distribuição do FilaZero, que é gratuita e open source.

## Licença

O projeto usa a licença MIT. Consulte [LICENSE](LICENSE).
