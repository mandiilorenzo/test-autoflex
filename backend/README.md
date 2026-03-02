# Autoflex - Backend API

Backend em **Java 21 + Quarkus** para gerenciamento de:

- produtos,
- matérias-primas,
- composição de produtos,
- sugestão de produção com base em estoque disponível.

A API segue padrão REST, usa **Hibernate ORM com Panache** e banco **PostgreSQL**.

## Tecnologias

- Java 21
- Quarkus 3.31.2
- Maven Wrapper (`./mvnw`)
- Hibernate ORM + Panache
- PostgreSQL (`quarkus-jdbc-postgresql`)
- JUnit 5 + RestAssured

## Funcionalidades (CRUD e regras)

### 1) Produtos (`/products`)

- `GET /products`: lista todos os produtos
- `POST /products`: cria produto
- `PUT /products/{id}`: atualiza nome e preço
- `DELETE /products/{id}`: remove produto

Regra importante: ao excluir produto, o backend remove também composições vinculadas em `product_compositions`.

### 2) Matérias-primas (`/raw-materials`)

- `GET /raw-materials`: lista matérias-primas
- `POST /raw-materials`: cria matéria-prima
- `PUT /raw-materials/{id}`: atualiza nome e estoque (`stockQuantity`)
- `DELETE /raw-materials/{id}`: remove matéria-prima

Regra importante: ao excluir matéria-prima, composições vinculadas também são removidas.

### 3) Composição de produto (`/product-compositions`)

- `GET /product-compositions/product/{productId}`: lista composição de um produto
- `POST /product-compositions`: adiciona matéria-prima à composição de um produto

Payload esperado no `POST`:

```json
{
  "productId": 1,
  "materialId": 2,
  "quantity": 1.5
}
```

Também é aceito `rawMaterialId` no lugar de `materialId`.

### 4) Sugestão de produção (`/production-suggestion`)

- `GET /production-suggestion`: calcula sugestão de produção priorizando produtos de maior preço, respeitando o estoque virtual disponível e retornando o valor potencial total.

## Banco de dados

Configuração principal em `src/main/resources/application.properties`:

- `quarkus.datasource.db-kind=postgresql`
- `quarkus.datasource.devservices.enabled=true`
- `quarkus.hibernate-orm.database.generation=drop-and-create`
- `quarkus.hibernate-orm.sql-load-script=import.sql`

### Como funciona no ambiente de desenvolvimento

- Com **Dev Services habilitado**, o Quarkus sobe automaticamente um PostgreSQL (normalmente via Docker).
- O schema é recriado a cada subida (`drop-and-create`).
- O `import.sql` atual não possui carga inicial, os dados devem ser criados via API.

## Testes

O projeto possui:

- testes de API com `@QuarkusTest` (execução em modo de teste)
- testes de integração com `@QuarkusIntegrationTest` (modo empacotado)

Arquivos principais:

- `src/test/java/com/autoflex/BackendCrudResourceTest.java`
- `src/test/java/com/autoflex/GreetingResourceTest.java`
- `src/test/java/com/autoflex/BackendCrudResourceIT.java`
- `src/test/java/com/autoflex/GreetingResourceIT.java`

### Rodar testes

```bash
./mvnw test
```

Para validação mais completa no ciclo de build:

```bash
./mvnw verify
```

## Como rodar o backend

### Pré-requisitos

- Java 21
- Docker (recomendado para Dev Services do PostgreSQL)

### 1) Rodar em modo desenvolvimento

```bash
./mvnw compile quarkus:dev
```

URLs úteis:

- API: `http://localhost:8080`
- Dev UI (apenas dev mode): `http://localhost:8080/q/dev/`

### 2) Build e execução empacotada (JVM)

```bash
./mvnw package
java -jar target/quarkus-app/quarkus-run.jar
```

### 3) Build nativo (opcional)

```bash
./mvnw package -Dnative
```

Sem GraalVM local:

```bash
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

Executável nativo:

```bash
./target/backend-1.0.0-SNAPSHOT-runner
```

## Observação de CORS

Há um filtro de CORS liberando origem para:

- `http://localhost:5173`

Esse valor está em `src/main/java/com/autoflex/configuration/CorsFilter.java`.
