# Política de Segurança

## Relatando uma vulnerabilidade

Evite publicar detalhes exploráveis de uma vulnerabilidade em uma issue pública antes de existir uma correção.

Ao relatar um problema, inclua:

- versão ou commit afetado;
- impacto observado;
- passos mínimos para reprodução;
- correção sugerida, se houver.

## Boas práticas de implantação

- defina `SESSION_SECRET` com um valor longo e aleatório;
- defina uma senha administrativa forte em `ADMIN_PASSWORD`;
- use HTTPS em produção;
- mantenha `.env` e arquivos SQLite fora do Git;
- faça backups regulares do banco;
- mantenha Node.js e as dependências atualizados.
