# AcolheMar

Sistema web de gestão de doações desenvolvido para a ONG **AcolheMar** no Projeto Integrador Extensionista II (Superior de Tecnologia em Análise e Desenvolvimento de Sistemas — Unimar).

Permite autenticação de voluntários com JWT, cadastro, edição e exclusão de doadores, registro de doações com múltiplos itens por gênero e listagem responsiva de doações. Roda em ambiente local com frontend em Vite+, API em Node.js com Express e banco MySQL ou MariaDB.

- **Aluno:** Fabio de Oliveira
- **Repositório:** https://github.com/fabioliveira-dev/acolhemar

## Pré-requisitos

- Node.js 22 ou mais recente
- Vite+ (`vp`), instalado conforme https://viteplus.dev/guide/
- MySQL 8 ou MariaDB 10.6 (ou mais recentes) rodando localmente
- Git

## Como rodar

1. Clone o repositório e entre na pasta do projeto:

```bash
git clone [https://github.com/fabioliveira-dev/acolhemar.git](https://github.com/fabioliveira-dev/acolhemar.git)
cd acolhemar
```

2. Instale as dependências:

```bash
vp install
```

3. Crie o banco de dados e insira os dados iniciais. No cliente do MySQL (`mysql -u root -p`):

```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

Também funciona abrindo e executando os dois arquivos, nessa ordem, no DBeaver, MySQL Workbench ou HeidiSQL.

4. Copie `.env.example` para `.env` e preencha a senha do banco (`DB_PASSWORD`) e o segredo do token (`JWT_SECRET`):

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Para gerar um `JWT_SECRET` seguro no terminal:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

5. Em um terminal, inicie a API Express:

```bash
vp run api
```

6. Em outro terminal, inicie o frontend Vite+:

```bash
vp dev
```

7. Abra `http://localhost:5173` no navegador e entre com o usuário de demonstração.

## Usuário de demonstração

| E-mail                     | Senha          |
| :------------------------- | :------------- |
| `voluntario@acolhemar.org` | `acolhemar123` |

Para trocar a senha de demonstração, gere um novo hash bcrypt com `node server/gerar-hash.js NOVA_SENHA`, substitua o valor de `senha_hash` no arquivo `database/seed.sql` e reexecute os scripts do banco.

## Variáveis de ambiente

| Variável                 | Para que serve                                       |
| :----------------------- | :--------------------------------------------------- |
| `PORT`                   | Porta da API (padrão `3000`)                         |
| `DB_HOST`, `DB_PORT`     | Endereço e porta do banco (use `127.0.0.1` e `3306`) |
| `DB_USER`, `DB_PASSWORD` | Usuário e senha do MySQL/MariaDB                     |
| `DB_NAME`                | Nome do banco de dados (`acolhemar`)                 |
| `JWT_SECRET`             | Segredo usado para assinar e validar os tokens JWT   |
| `JWT_EXPIRES_IN`         | Validade do token de login (padrão `8h`)             |

## Telas do MVP

| Endereço         | Funcionalidade                                                        |
| :--------------- | :-------------------------------------------------------------------- |
| `/` (sem token)  | Autenticação do voluntário com e-mail e senha                         |
| `#/doadores`     | Cadastro, listagem, edição e exclusão de doadores                     |
| `#/doacoes/nova` | Registro de doação com seleção de gênero, item livre e quantidade     |
| `#/doacoes`      | Listagem responsiva das doações registradas com status, datas e itens |

## Rotas da API

| Método                 | Rota                | Token? |
| :--------------------- | :------------------ | :----- |
| `GET`                  | `/api/health`       | não    |
| `POST`                 | `/api/auth/login`   | não    |
| `GET`, `POST`          | `/api/doadores`     | sim    |
| `GET`, `PUT`, `DELETE` | `/api/doadores/:id` | sim    |
| `GET`                  | `/api/itens`        | sim    |
| `GET`, `POST`          | `/api/doacoes`      | sim    |

O contrato completo está documentado em `openapi.yaml` e os testes manuais das rotas estão em `api.http`.

## Qualidade de código e build

```bash
vp check
vp build
```

## Backup do banco

Para gerar um backup completo (estrutura e dados):

```bash
mysqldump -u root -p acolhemar > backup.sql
```

Para restaurar no Linux/Mac:

```bash
mysql -u root -p acolhemar < backup.sql
```

Para restaurar no Windows (PowerShell):

```powershell
Get-Content backup.sql | mysql -u root -p acolhemar
```

> Nunca envie arquivos `backup*.sql` nem `.env` para o repositório Git (ambos estão listados no `.gitignore`).

## Estrutura

```text
database/       schema.sql e seed.sql
server/         API Express (index.js, db.js, auth.js, gerar-hash.js, validacao.js e routes/)
src/            Frontend Vite+ (main.js, api.js, ui.js, style.css e pages/)
api.http        Requisições manuais de teste das rotas públicas e autenticadas
openapi.yaml    Contrato OpenAPI 3.0.3 com esquema bearerAuth (JWT)
.env.example    Modelo das variáveis de ambiente necessárias para execução
```

# AcolheMar

Sistema web de gestão de doações para a ONG **AcolheMar**. Projeto Integrador Extensionista II (Análise e Desenvolvimento de Sistemas — Unimar).

Permite autenticação de voluntários com JWT, cadastro/edição/exclusão de doadores, registro de doações com múltiplos itens por gênero e listagem responsiva de doações. Roda em ambiente local com frontend em Vite+, API em Node.js com Express e banco MySQL ou MariaDB.

## Pré-requisitos

- Node.js 22 ou mais recente
- Vite+ (`vp`), instalado conforme https://viteplus.dev/guide/
- MySQL 8 ou MariaDB 10.6 (ou mais recentes) rodando localmente
- Git

## Como rodar

1. Clone o repositório e entre na pasta:

```bash
   git clone [https://github.com/fabioliveira-dev/acolhemar.git](https://github.com/fabioliveira-dev/acolhemar.git)
   cd acolhemar
```

# AcolheMar — Sistema Web de Gestão de Doações

Sistema web desenvolvido no Projeto Integrador Extensionista II (ADS - Unimar) para apoiar a ONG **AcolheMar** no gerenciamento de doadores, arrecadação e controle de doações.

- **Aluno:** Fabio de Oliveira
- **Curso:** Tecnologia em Análise e Desenvolvimento de Sistemas (ADS) — Unimar

## Requisitos

- Git
- Vite+ (`vp`): https://viteplus.dev
- MySQL ou MariaDB rodando localmente

## Como rodar localmente

1. Clone o repositório e acesse a pasta do projeto:
   ```bash
   git clone [https://github.com/fabioliveira-dev/acolhemar.git](https://github.com/fabioliveira-dev/acolhemar.git)
   cd acolhemar
   ```
