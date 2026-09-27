# FAQ — FilaZero

## O FilaZero é gratuito?

Sim. O código é gratuito e open source sob a licença MIT.

## Preciso pagar licença ou mensalidade?

Não. O FilaZero não cobra licença, compra única ou mensalidade.

Você pode ter custos externos se escolher contratar hospedagem, domínio, e-mail ou outros serviços de terceiros.

## Posso usar comercialmente?

Sim. A licença MIT permite uso comercial, modificação e redistribuição, desde que os termos da licença sejam respeitados.

## Posso modificar o código?

Sim. Você pode criar sua própria versão ou fork.

## Posso contribuir?

Sim. Veja [CONTRIBUTING.md](CONTRIBUTING.md).

## Preciso comprar um domínio?

Não. Para desenvolvimento, basta acessar `http://localhost:3000`.

Para disponibilizar uma instância na internet, você pode usar o endereço fornecido por uma plataforma de hospedagem ou configurar um domínio próprio.

## Qual banco de dados é usado?

SQLite.

Por padrão, o arquivo é `database.sqlite`, mas o caminho pode ser configurado com `DATABASE_PATH`.

## Quais são as credenciais padrão?

Em desenvolvimento, quando nenhuma credencial é configurada:

- usuário: `admin`
- senha: `admin123`

Em produção, configure `ADMIN_PASSWORD`.

## Onde configuro os segredos?

Use variáveis de ambiente:

```env
SESSION_SECRET=uma-chave-longa-e-aleatoria
ADMIN_USERNAME=admin
ADMIN_PASSWORD=uma-senha-forte
DATABASE_PATH=./database.sqlite
```

Não envie seu arquivo `.env` para o Git.

## Posso cadastrar preços nos serviços?

Sim. O campo de preço representa o valor cobrado pelo profissional ou negócio pelo serviço agendado.

Esse valor não tem relação com cobrança pelo FilaZero, que continua gratuito e open source.

## Posso executar sem internet?

Sim, em uma rede local. Recursos externos do navegador, como fontes carregadas da web, podem depender de conexão.

## Posso colocar em produção?

Sim. Use um ambiente Node.js compatível, armazenamento persistente para o SQLite e HTTPS.

## Existe suporte oficial?

O projeto é mantido de forma aberta. A documentação, issues e contribuições da comunidade são os canais recomendados.

## Como reportar uma vulnerabilidade?

Veja [SECURITY.md](SECURITY.md).

## Posso integrar outros serviços?

Sim. Como o código é aberto, você pode desenvolver integrações opcionais conforme a necessidade da sua instalação.

## Qual é a licença?

MIT. Veja [LICENSE](LICENSE).

---

Para instalação e configuração, consulte [README.md](README.md) e [MANUAL.md](MANUAL.md).
