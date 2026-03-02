# Autoflex - Frontend

Aplicação web em React para o desafio técnico Autoflex.

O frontend permite:

- Gerenciar **matérias-primas** (CRUD).
- Gerenciar **produtos e composições** (receitas por insumo).
- Visualizar **sugestões de produção** com base no estoque disponível.

## Stack e bibliotecas

- **React 19** + **Vite 7**
- **Material UI (MUI)** para interface
- **Redux Toolkit** + **React Redux** para estado global
- **React Router DOM** para rotas
- **Axios** para comunicação HTTP
- **Vitest** + **Testing Library** para testes
- **ESLint** para lint

## Estrutura do projeto

```text
src/
	App.jsx
	main.jsx
	components/
		Layout.jsx
		ConfirmDialog.jsx
	pages/
		Home.jsx
		RawMaterials.jsx
		Products.jsx
		Production.jsx
		Production.test.jsx
	services/
		api.js
	store/
		index.js
		rawMaterialSlice.js
		rawMaterialSlice.test.js
		productSlice.js
		productSlice.test.js
		productionSlice.js
styles/
	theme.js
```

## Rotas e páginas

As rotas são definidas em `src/App.jsx` com carregamento lazy (`React.lazy`) e fallback de loading (`Suspense`).

- `/` e `/home` → `Home`
  - Tela de boas-vindas e acesso rápido para produtos.
- `/raw-materials` → `RawMaterials`
  - CRUD de matérias-primas: listar, criar, editar e excluir.
- `/products` → `Products`
  - CRUD de produtos + definição de composição (insumos e quantidades).
- `/production` → `Production`
  - Exibe sugestões de produção e valor potencial total.
- `*` → redireciona para `/home`.

As páginas de gestão usam o componente `Layout` (menu lateral + barra superior).

## Componentes principais

- `Layout.jsx`
  - Estrutura visual principal com `AppBar` e `Drawer`.
  - Navegação lateral para Matérias-Primas, Produtos e Sugestão de Produção.

- `ConfirmDialog.jsx`
  - Modal reutilizável de confirmação de exclusão.
  - Usado nas páginas de matérias-primas e produtos.

## Estado global (Redux) e hooks

O estado global é configurado em `src/store/index.js`, com três slices:

- `rawMaterials`
- `products`
- `production`

### Slices

- `rawMaterialSlice.js`
  - Thunks: `fetchRawMaterials`, `createRawMaterial`, `updateRawMaterial`, `deleteRawMaterial`.
  - Controla `list`, `loading`, `error`.

- `productSlice.js`
  - Thunks: `fetchProducts`, `createProduct`, `updateProduct`, `deleteProduct`.
  - Sincroniza composição de produto via endpoint de `product-compositions`.
  - Controla `list`, `loading`, `error`.

- `productionSlice.js`
  - Thunk: `fetchSuggestions`.
  - Normaliza payload da API para `{ suggestions, totalPotentialValue }`.
  - Controla `suggestions`, `loading`, `error`.

### Hooks usados no app

Não há hooks customizados no projeto no momento. O app usa hooks nativos e de biblioteca:

- React: `useEffect`, `useState`, `lazy`, `Suspense`.
- React Router: `useNavigate`.
- React Redux: `useDispatch`, `useSelector`.

## Integração com API

Configuração em `src/services/api.js`:

- Base URL: `http://localhost:8080`

Endpoints utilizados pelos slices:

- `GET /raw-materials`
- `POST /raw-materials`
- `PUT /raw-materials/:id`
- `DELETE /raw-materials/:id`
- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /product-compositions/product/:productId`
- `POST /product-compositions`
- `GET /production-suggestion`

## Testes

Testes configurados no Vite (`vite.config.js`) com:

- Ambiente: `jsdom`
- Glob: `src/**/*.test.{js,jsx}`
- `globals: true` e `clearMocks: true`

### Testes existentes

- `src/store/rawMaterialSlice.test.js`
  - Valida fetch, criação e exclusão de matérias-primas.

- `src/store/productSlice.test.js`
  - Valida fetch de produtos.
  - Valida criação de produto com sincronização de composição.

- `src/pages/Production.test.jsx`
  - Valida renderização da página de sugestão com dados.
  - Valida estado vazio sem sugestões.
  - Valida estado de erro.

## Como rodar o frontend

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm
- Backend da Autoflex rodando em `http://localhost:8080`

### Instalação

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
npm run dev
```

Aplicação disponível em `http://localhost:5173` (porta padrão do Vite).

### Build de produção

```bash
npm run build
```

### Preview do build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Testes

Executar uma vez:

```bash
npm run test
```

Modo watch:

```bash
npm run test:watch
```

## Scripts disponíveis

- `npm run dev` → inicia servidor de desenvolvimento (Vite)
- `npm run build` → gera build de produção
- `npm run preview` → sobe preview do build gerado
- `npm run lint` → executa ESLint
- `npm run test` → executa testes com Vitest (run)
- `npm run test:watch` → executa testes em modo watch
