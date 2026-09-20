# Full-Stack Containerized Authentication

Aplicação full-stack de autenticação desenvolvida com **React, NestJS e MariaDB**, totalmente containerizada com **Docker Compose**.

A arquitetura separa frontend, API, banco de dados e proxy reverso, mantendo os serviços isolados e permitindo que o acesso externo seja feito por uma única porta.

## Arquitetura

```text
Browser
   │
   │ HTTP :80
   ▼
 Nginx
 ├── /      → React/Vite :5173
 └── /api/  → NestJS :3000
                  │
                  │ TCP :3306
                  ▼
               MariaDB
```

### Serviços

| Serviço | Tecnologia   | Função                           |
| ------- | ------------ | -------------------------------- |
| `proxy` | Nginx        | Entrada única e roteamento       |
| `web`   | React + Vite | Interface da aplicação           |
| `api`   | NestJS       | Autenticação e regras de negócio |
| `db`    | MariaDB      | Persistência dos dados           |

A comunicação entre os containers utiliza a rede interna do Docker Compose. A API acessa o banco pelo nome do serviço:

```env
DB_HOST=db
```

## Autenticação

O fluxo de login ocorre da seguinte forma:

1. O frontend envia a requisição para `/api/`.
2. O Nginx encaminha a requisição para a API.
3. O NestJS valida os dados recebidos.
4. A API consulta o MariaDB.
5. A senha é comparada utilizando `bcrypt`.
6. Um token JWT é gerado após a autenticação.
7. O token é armazenado em cookie `httpOnly`.

Isso mantém o backend e o banco fora da exposição direta ao navegador.

## Estrutura

```text
.
├── docker-compose.yml
├── proxy/
│   └── nginx.conf
├── web/
└── painel-login-api/
```

## Requisitos

* Git
* Docker Engine 20.10+
* Docker Compose 2.0+

## Instalação

Clone o projeto:

```bash
git clone git@github.com:Eduardbo/fullstack-container.git
cd fullstack-container
```

Configure as variáveis da API:

```bash
cp painel-login-api/.env.example painel-login-api/.env
```

Inicie todo o ambiente:

```bash
docker compose up -d --build
```

Após a inicialização, acesse:

```text
http://localhost
```

## Comandos úteis

Verificar os containers:

```bash
docker compose ps
```

Visualizar logs:

```bash
docker compose logs -f
```

Parar os serviços:

```bash
docker compose down
```

Parar os serviços e remover os volumes:

```bash
docker compose down -v
```

> `down -v` remove os volumes persistentes e pode apagar os dados do banco.

## Segurança

* **Isolamento:** MariaDB é acessado apenas pela rede interna do Docker.
* **JWT:** utilizado para autenticação.
* **Cookies:** configurados com `httpOnly` e `sameSite: lax`.
* **Senhas:** armazenadas como hash utilizando `bcrypt`.
* **Validação:** requisições tratadas pelo `ValidationPipe` do NestJS.
* **Proxy reverso:** apenas o Nginx expõe a porta `80` externamente.

## Tecnologias

**Docker · Docker Compose · Nginx · React · Vite · Node.js · NestJS · MariaDB · Knex · JWT · bcrypt**
