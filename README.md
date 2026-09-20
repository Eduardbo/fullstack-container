## Download e Execução do Projeto

Siga as instruções abaixo para clonar o repositório e inicializar a infraestrutura em contêineres na sua máquina.

### Pré-requisitos

* **Git**
* **Docker Engine** (v20.10+) e **Docker Compose** (v2.0+)

### 1. Clonar o Repositório

Abra o terminal e faça o clone do projeto:

```bash
git clone git@github.com:Eduardbo/fullstack-container.git
cd fullstack-container
# Full-Stack Containerized Authentication Architecture

Projeto de arquitetura full-stack desacoplada em contêineres, orquestrada via Docker Compose. O sistema implementa um painel de autenticação com separação clara de responsabilidades entre camada de apresentação, serviços de API, persistência relacional e roteamento de tráfego.

## Visão Geral da Arquitetura

A estrutura foi desenhada no modelo de microsserviços/serviços isolados. O acesso externo é centralizado em uma única porta pública, utilizando um proxy reverso para distribuição do tráfego interno e abstração da topologia da rede.

O ecossistema é dividido em 4 serviços principais:

* **proxy (Nginx):** Atua como o ponto de entrada único do sistema (porta 80). Responsável pelo roteamento de tráfego entre a interface web e as chamadas de API, ocultando as portas internas dos contêineres da rede externa.
* **web (React / Vite):** Servidor de desenvolvimento para a interface do usuário rodando em Node.js. As chamadas do cliente são direcionadas para caminhos relativos (`/api/`), permitindo que o proxy gerencie a comunicação sem expor o backend diretamente ao navegador.
* **api (NestJS):** Aplicação backend construída com NestJS, responsável pelas regras de negócio, validação de requisições, emissão/validação de tokens JWT e manipulação dos dados.
* **db (MariaDB):** Instância de banco de dados relacional isolada na rede interna do Docker. Utiliza volumes para persistência dos dados e scripts de inicialização automatizada para criação do schema inicial.

```text
               +-----------------------------------+
               |          Cliente (Browser)        |
               +-----------------------------------+
                                 |
                                 | HTTP (Porta 80)
                                 v
               +-----------------------------------+
               |           proxy (Nginx)           |
               +-----------------------------------+
                 /                               \
  /api/* (Porta 3000)                             /* (Porta 5173)
               /                                   \
              v                                     v
+---------------------------+         +---------------------------+
|        api (NestJS)       |         |     web (React / Vite)    |
+---------------------------+         +---------------------------+
              |
              | TCP (Porta 3306)
              v
+---------------------------+
|        db (MariaDB)       |
+---------------------------+
