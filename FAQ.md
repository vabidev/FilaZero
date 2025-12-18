# Perguntas Frequentes - FilaZero

## ❓ Instalação e Configuração

### 1. Quais são os requisitos do sistema?
- Node.js versão 14 ou superior
- npm ou yarn
- Hospedagem que suporte Node.js (VPS, Heroku, Vercel, etc)

### 2. Como faço para instalar em uma hospedagem compartilhada?
Hospedagens compartilhadas tradicionais (cPanel) geralmente não suportam Node.js. Você precisará de:
- VPS (Digital Ocean, Vultr, Linode)
- Hospedagem especializada em Node.js
- Serviços cloud (Heroku, Vercel, Railway, Render)

### 3. Preciso comprar um domínio?
Sim, para uso profissional é altamente recomendado ter um domínio próprio (exemplo: www.seunegocio.com).

### 4. Como altero a senha do admin?
Por segurança, delete o arquivo `database.sqlite` e reinicie o servidor. Um novo admin será criado. Depois altere a senha.

### 5. O sistema perde dados se eu atualizar?
Não! O banco de dados fica no arquivo `database.sqlite`. Sempre faça backup deste arquivo antes de atualizar.

## 🎨 Personalização

### 6. Como mudo as cores do site?
Edite o arquivo `/public/css/style.css` e altere as variáveis CSS no início do arquivo:
```css
:root {
  --accent-primary: #SuaCor;
}
```

### 7. Posso adicionar um logo?
Sim! Substitua os emojis 📅 nos arquivos HTML por uma tag `<img>`:
```html
<img src="/images/logo.png" alt="Logo">
```

### 8. Como personalizar os textos?
- Textos fixos: Edite os arquivos HTML em `/public/`
- Textos dinâmicos: Use o painel admin em Configurações

### 9. Posso mudar o nome "FilaZero"?
Sim! Altere em:
- Arquivo `config.js`
- Painel Admin > Configurações
- Arquivo `package.json`
- Arquivos HTML (buscar e substituir)

## 📅 Funcionamento

### 10. Como funciona o sistema de agendamento?
1. Cliente escolhe um serviço
2. Seleciona data e horário disponível
3. Preenche seus dados
4. Confirma o agendamento
5. Admin recebe no painel e pode confirmar/alterar status

### 11. Os clientes recebem confirmação por e-mail?
Na versão atual, não. Esta funcionalidade pode ser adicionada integrando um serviço de e-mail (SendGrid, Mailgun, etc).

### 12. Como bloqueio um horário específico?
Atualmente, você pode mudar o status de um agendamento para "cancelado" ou configurar os horários de funcionamento em Configurações.

### 13. Posso ter múltiplos profissionais?
A versão atual suporta um negócio/profissional. Para múltiplos profissionais, seria necessário adaptar o código.

### 14. Como defino a duração dos slots de horário?
O sistema usa intervalos de 30 minutos. Para alterar, edite o arquivo `/routes/api.js` na função `available-times`.

## 🔒 Segurança

### 15. O sistema é seguro?
Sim! Usa:
- Bcrypt para criptografia de senhas
- Sessions para autenticação
- Validação de dados
- Proteção contra SQL injection

### 16. Preciso de HTTPS?
Sim! Para produção, sempre use HTTPS. A maioria das hospedagens modernas oferece SSL gratuito (Let's Encrypt).

### 17. Como faço backup dos dados?
Copie o arquivo `database.sqlite` regularmente. Você pode automatizar isso com um cron job:
```bash
cp database.sqlite backups/database_$(date +%Y%m%d).sqlite
```

## 💾 Banco de Dados

### 18. Posso usar MySQL/PostgreSQL em vez de SQLite?
Sim, mas requer alterações no código. SQLite é ideal para pequenos e médios negócios.

### 19. Quantos agendamentos o banco suporta?
SQLite suporta milhões de registros. Para negócios com milhares de agendamentos por mês, funciona perfeitamente.

### 20. Como exporto os dados?
Você pode:
- Copiar o arquivo `database.sqlite`
- Usar ferramentas como DB Browser for SQLite
- Criar exportações CSV via código

## 🌐 Hospedagem

### 21. Qual hospedagem você recomenda?
Para iniciantes:
- **Heroku** (gratuito para começar)
- **Vercel** (fácil deploy)
- **Railway** (simples e barato)

Para profissionais:
- **Digital Ocean** (VPS a partir de $5/mês)
- **Vultr** (VPS econômico)
- **AWS/Google Cloud** (mais robusto)

### 22. Quanto custa hospedar?
- **Gratuito**: Heroku, Vercel (com limitações)
- **Econômico**: R$ 25-50/mês (Railway, Render)
- **Profissional**: R$ 30-100/mês (VPS)

### 23. Posso hospedar vários clientes no mesmo servidor?
Sim, mas cada um precisa rodar em portas diferentes ou use subdomínios com proxy reverso.

## 🔧 Problemas Comuns

### 24. O servidor não inicia, o que fazer?
1. Verifique se o Node.js está instalado: `node -v`
2. Certifique-se que instalou as dependências: `npm install`
3. Verifique se a porta 3000 está livre
4. Veja os logs de erro no terminal

### 25. Os horários não aparecem disponíveis
Verifique:
1. Os horários de funcionamento estão configurados?
2. A data selecionada não está no passado?
3. Há serviços ativos cadastrados?

### 26. Esqueci a senha do admin
Delete o arquivo `database.sqlite` e reinicie (cria novo admin com senha padrão). Isso apaga todos os dados!

### 27. O tema escuro não funciona
Limpe o cache do navegador (Ctrl+Shift+Delete) e recarregue a página.

## 📱 Mobile

### 28. Funciona em celular?
Sim! O sistema é totalmente responsivo e funciona em:
- Smartphones (iOS/Android)
- Tablets
- Desktop

### 29. Posso criar um app mobile?
O sistema atual é web. Para app nativo, seria necessário desenvolver usando React Native ou similar.

## 💰 Comercial

### 30. Posso revender o FilaZero?
Sim! O sistema foi desenvolvido para revenda ilimitada.

### 31. Preciso dar créditos ao FilaZero?
Não é obrigatório. Você pode remover todas as referências e usar sua própria marca.

### 32. Posso modificar o código?
Sim! Você tem total liberdade para modificar e adaptar conforme suas necessidades.

### 33. Quanto posso cobrar dos clientes?
Você define o preço! Recomendamos entre R$ 297 e R$ 1.997 dependendo do pacote (instalação, personalização, treinamento).

## 🆘 Suporte

### 34. Tem suporte técnico?
O sistema é vendido "como está". Não há suporte oficial, mas a documentação é completa e o código é bem comentado.

### 35. Vocês fazem customizações?
Este é um produto de revenda. Você é livre para contratar desenvolvedores para customizações.

### 36. Tem atualizações?
Esta é a versão 1.8 completa e funcional. Futuras atualizações dependeriam de nova versão do produto.

## 🚀 Recursos Avançados

### 37. Como adiciono integração com WhatsApp?
Você pode integrar a API do WhatsApp Business ou usar links diretos do WhatsApp para contato.

### 38. Posso integrar com sistemas de pagamento?
Sim! Você pode adicionar integrações com Mercado Pago, PagSeguro, Stripe, etc. Requer conhecimento de programação.

### 39. Como adiciono envio de e-mails automáticos?
Integre serviços como:
- SendGrid
- Mailgun
- Amazon SES
- Nodemailer + SMTP

Exemplo básico já está preparado no código para você expandir.

### 40. Posso adicionar mais funcionalidades?
Sim! O código é aberto para modificações. Algumas ideias:
- Sistema de pagamento online
- Confirmação por SMS/WhatsApp
- Cupons de desconto
- Programa de fidelidade
- Avaliações de clientes
- Relatórios detalhados

## 📊 Relatórios

### 41. Tem relatórios financeiros?
A versão atual mostra agendamentos. Relatórios financeiros podem ser adicionados customizando o código.

### 42. Posso exportar relatórios?
Você pode adicionar funcionalidade de exportação em CSV/PDF customizando o código.

## 🌍 Internacionalização

### 43. Posso traduzir para outros idiomas?
Sim! Basta editar os textos nos arquivos HTML e JavaScript.

### 44. Suporta outros fusos horários?
O sistema usa o horário do servidor. Para múltiplos fusos, seria necessário adaptar o código.

## ⚖️ Legal

### 45. Preciso de contrato para vender?
Recomendamos criar um contrato de prestação de serviços ao vender para proteger você e o cliente.

### 46. Quem é responsável pelos dados dos clientes finais?
Quem hospeda o sistema. Se você vende e hospeda, você é responsável pela LGPD.

### 47. O sistema é compatível com LGPD?
O sistema coleta apenas dados essenciais (nome, telefone, e-mail). Você deve criar uma política de privacidade adequada.

---

## 💬 Não encontrou sua resposta?

Se sua dúvida não está aqui:
1. Leia o MANUAL.md completo
2. Verifique o código-fonte (está comentado)
3. Procure em comunidades de Node.js/Express
4. Contrate um desenvolvedor para ajuda específica

**Boa sorte com o FilaZero! 🚀**
