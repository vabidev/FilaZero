# 📅 FilaZero - Sistema de Agendamento Online

Sistema completo e profissional de agendamento online, ideal para barbearias, salões de beleza, clínicas, estúdios, consultórios e profissionais autônomos.

## ✨ Características

- ✅ Sistema completo: frontend + backend integrado
- ✅ Interface moderna e responsiva
- ✅ Modo claro e modo escuro
- ✅ Painel administrativo completo
- ✅ Banco de dados SQLite (sem configuração complexa)
- ✅ Fácil instalação e personalização
- ✅ Código limpo e comentado
- ✅ Pronto para revenda ilimitada

## 🎨 Recursos do Site Público

### Páginas Disponíveis
- **Home**: Apresentação do serviço com call-to-action
- **Agendamento**: Sistema completo de reserva de horários
- **Sobre**: Informações sobre o negócio
- **Contato**: Formulário e dados de contato

### Funcionalidades
- Visualização de serviços disponíveis
- Seleção de data e horário
- Formulário de agendamento simples
- Confirmação instantânea
- Interface intuitiva e responsiva

## 🔐 Painel Administrativo

Acesso: `http://seudominio.com/admin`

**Credenciais Padrão:**
- Usuário: `admin`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após a primeira instalação!

### Recursos do Painel

#### Dashboard
- Visão geral dos agendamentos do dia
- Estatísticas em tempo real
- Próximos horários
- Contadores de clientes e serviços

#### Gerenciamento de Serviços
- Criar, editar e excluir serviços
- Definir duração e preço
- Ativar/desativar serviços
- Descrições personalizadas

#### Agenda
- Visualização de todos os agendamentos
- Filtros por data e status
- Alterar status (pendente, confirmado, concluído, cancelado)
- Excluir agendamentos

#### Clientes
- Lista completa de clientes
- Histórico de agendamentos por cliente
- Informações de contato

#### Configurações
- Personalizar nome do negócio
- Definir informações de contato
- Configurar horários de funcionamento
- Editar página "Sobre"
- Personalização do site

## 🚀 Instalação

### Requisitos
- Node.js versão 14 ou superior
- npm ou yarn

### Passo a Passo

1. **Extrair os arquivos**
   ```bash
   # Extraia o pacote FilaZero para uma pasta de sua escolha
   cd FilaZero
   ```

2. **Instalar dependências**
   ```bash
   npm install
   ```

3. **Iniciar o servidor**
   ```bash
   npm start
   ```

4. **Acessar o sistema**
   - Site público: `http://localhost:3000`
   - Painel admin: `http://localhost:3000/admin`

### Modo de Desenvolvimento

Para desenvolvimento com reinicialização automática:
```bash
npm run dev
```

## 🌐 Colocar em Produção

### Opção 1: Hospedagem VPS/Servidor

1. **Fazer upload dos arquivos** para seu servidor

2. **Instalar Node.js** no servidor (se ainda não tiver)

3. **Instalar dependências**
   ```bash
   npm install --production
   ```

4. **Configurar porta** (opcional)
   
   Edite o arquivo `config.js`:
   ```javascript
   port: process.env.PORT || 3000
   ```

5. **Iniciar com PM2** (recomendado para produção)
   ```bash
   npm install -g pm2
   pm2 start server.js --name filazero
   pm2 save
   pm2 startup
   ```

6. **Configurar domínio**
   
   Configure seu servidor web (Nginx ou Apache) para fazer proxy reverso para a porta 3000.

   Exemplo de configuração Nginx:
   ```nginx
   server {
       listen 80;
       server_name seudominio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Opção 2: Heroku

1. Crie um arquivo `Procfile` na raiz do projeto:
   ```
   web: node server.js
   ```

2. Faça deploy usando Heroku CLI:
   ```bash
   heroku create seu-app
   git push heroku main
   ```

### Opção 3: Vercel/Railway/Render

Estas plataformas detectam automaticamente aplicações Node.js. Basta:
1. Conectar seu repositório
2. Fazer deploy

## ⚙️ Personalização

### Alterar Cores e Estilo

Edite o arquivo `/public/css/style.css` nas variáveis CSS:

```css
:root {
  --accent-primary: #0d6efd;  /* Cor principal */
  --accent-hover: #0b5ed7;    /* Cor ao passar o mouse */
  /* ... outras cores ... */
}
```

### Alterar Configurações Padrão

Edite o arquivo `config.js`:

```javascript
module.exports = {
  port: 3000,
  sessionSecret: 'sua-chave-secreta-aqui',
  business: {
    name: 'Nome do Seu Negócio',
    // ... outras configurações ...
  }
};
```

### Adicionar Logo

Substitua o emoji 📅 nos arquivos HTML por uma tag `<img>`:

```html
<img src="/images/logo.png" alt="Logo" style="height: 40px;">
```

## 🔒 Segurança

### Alterar Senha do Admin

1. Acesse o painel administrativo
2. O sistema usa bcrypt para criptografia de senhas
3. Para resetar a senha, delete o arquivo `database.sqlite` e reinicie o servidor (isso apagará todos os dados)

### Alterar Secret da Sessão

Edite `config.js` e altere o `sessionSecret`:

```javascript
sessionSecret: 'SUA-CHAVE-SUPER-SECRETA-AQUI'
```

### HTTPS

Para produção, sempre use HTTPS. Configure certificado SSL no seu servidor web (Nginx/Apache) ou use plataformas que fornecem SSL automaticamente (Heroku, Vercel, etc).

## 📁 Estrutura de Pastas

```
FilaZero/
├── config.js              # Configurações do sistema
├── server.js              # Servidor principal
├── database.js            # Banco de dados SQLite
├── package.json           # Dependências
├── routes/                # Rotas do servidor
│   ├── admin.js          # Rotas administrativas
│   ├── api.js            # API REST
│   └── public.js         # Rotas públicas
└── public/               # Arquivos públicos
    ├── css/              # Estilos
    │   ├── style.css     # Estilos do site
    │   └── admin.css     # Estilos do admin
    ├── js/               # Scripts
    │   ├── main.js       # Funções principais
    │   ├── admin.js      # Admin functions
    │   └── booking.js    # Agendamento
    ├── admin/            # Páginas admin
    │   ├── login.html
    │   ├── dashboard.html
    │   ├── services.html
    │   ├── appointments.html
    │   ├── clients.html
    │   └── settings.html
    ├── index.html        # Home
    ├── booking.html      # Agendamento
    ├── about.html        # Sobre
    └── contact.html      # Contato
```

## 🛠️ Banco de Dados

O sistema usa SQLite, um banco de dados leve e sem necessidade de servidor separado.

### Localização
O arquivo do banco é criado automaticamente como `database.sqlite` na raiz do projeto.

### Backup
Para fazer backup, simplesmente copie o arquivo `database.sqlite`.

### Reset
Para resetar o sistema (apaga todos os dados):
1. Pare o servidor
2. Delete o arquivo `database.sqlite`
3. Reinicie o servidor

Um novo banco será criado automaticamente com o admin padrão.

## 📞 Suporte e Dúvidas

Este é um sistema completo e autônomo. Todas as funcionalidades estão implementadas e funcionais.

Para personalizar ou adicionar recursos, você pode:
- Editar os arquivos HTML nas pastas `public/` e `public/admin/`
- Modificar os estilos em `public/css/`
- Adicionar funcionalidades no backend em `routes/api.js`

## 📝 Licença de Uso

Este produto foi desenvolvido para **revenda ilimitada**.

Você pode:
- ✅ Personalizar para seus clientes
- ✅ Usar em projetos próprios
- ✅ Modificar o código-fonte

## 🎯 Casos de Uso

Este sistema é perfeito para:
- 💈 Barbearias
- 💅 Salões de beleza
- 🏥 Clínicas médicas
- 🦷 Consultórios odontológicos
- 💪 Personal trainers
- 🎨 Estúdios de tatuagem
- 📸 Fotógrafos
- 🎓 Professores particulares
- 🔧 Prestadores de serviços em geral

## 🌟 Diferenciais

- Interface moderna e profissional
- Totalmente responsivo (funciona em celulares, tablets e desktops)
- Modo escuro incluído
- Sem mensalidades ou dependências de APIs pagas
- Código limpo e bem documentado
- Fácil de personalizar
- Instalação simples

## 📈 Próximos Passos

Após instalar, recomendamos:

1. ✅ Alterar a senha do administrador
2. ✅ Configurar as informações do negócio em Configurações
3. ✅ Cadastrar os serviços oferecidos
4. ✅ Configurar os horários de funcionamento
5. ✅ Personalizar o texto da página "Sobre"
6. ✅ Testar o sistema de agendamento

---

**FilaZero** - Sistema Profissional de Agendamento Online
Versão 1.8 - 2025
