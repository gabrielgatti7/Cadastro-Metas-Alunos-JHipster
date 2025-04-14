# Cadastro de Metas dos Alunos

Sistema web desenvolvido com [JHipster](https://www.jhipster.tech/) para gerenciamento de metas, notas e simulados para estudantes que estão se preparando para o ENEM.

---

## 📌 Funcionalidades

- Cadastro de **alunos**
- Criação de **simulados**
- Atribuição de **notas** por área do ENEM para cada aluno e simulado
- Definição de **metas** de desempenho por área para alunos
- Usuários com perfis distintos:
  - **Administrador (ROLE_ADMIN)**: pode criar, editar e excluir qualquer recurso
  - **Aluno (ROLE_USER)**: podem apenas visualizar metas, notas e simulados

## 🧠 Tecnologias Utilizadas

- **Back-end:** Java, Spring Boot, Spring Security, Hibernate
- **Front-end:** Angular, Bootstrap
- **Banco de Dados:** PostgreSQL
- **Ferramentas:** Maven, JHipster, Liquibase, MapStruct

## 📦 Estrutura das Entidades

- `Aluno`: nome, email, usuário associado
- `Simulado`: nome do simulado
- `Nota`: valor, área do ENEM, aluno e simulado associados
- `Meta`: valor desejado, área do ENEM, aluno associado

## ▶️ Executando a Aplicação Localmente

### Pré-requisitos

- Node.js
- Java 17
- PostgreSQL
- Maven

### Passos

```bash
# Instale as dependências do front-end
npm install

# Suba o banco de dados local (se estiver usando Docker)
docker-compose -f src/main/docker/postgresql.yml up -d

# Execute a aplicação
./mvnw
```

Acesse em: http://localhost:8080

## 🚀 Deploy

### Heroku (opcional)

Você pode usar o JHipster para fazer deploy automático para o Heroku:

```bash
jhipster heroku
```

Certifique-se de ter o Heroku CLI instalado.

## 📚 Scripts úteis

```bash
# Criar novo changelog do banco com Liquibase
./mvnw liquibase:diff

# Limpar e reconstruir a base de dados
./mvnw clean
./mvnw liquibase:clearCheckSums
./mvnw
```

---

## 🧑‍💻 Contribuições

Sinta-se à vontade para clonar o projeto e contribuir com melhorias, novas funcionalidades ou correções.
