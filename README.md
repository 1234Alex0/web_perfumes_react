# Web_Perfumes_React

## Descripción del proyecto
Aplicación web desarrollada con React para consumir una API pública distinta de Pokémon.

La API utilizada es **DummyJSON**: https://dummyjson.com

Características implementadas:
- Rutas con React Router.
- Login con API (`POST /auth/login`) y sesión persistida en `localStorage`.
- Apartado de usuario (`/user`) y apartado admin (`/admin`) con control por rol.
- Consumo de API con métodos:
  - `GET`: listado y detalle de productos.
  - `POST`: login y creación de producto.
  - `PUT`: reemplazo completo de producto.
  - `PATCH`: edición parcial de producto.
  - `DELETE`: eliminación de producto.
- Diseño responsive adaptado a breakpoints: `1920px`, `990px`, `767px`, `510px`, `480px`.
- Estructura profesional por capas: `services`, `context`, `hooks`, `components`, `pages`, `routes`.

## Estructura recomendada (React)

```text
src/
	config/
		env.js
	context/
		AuthContext.jsx
		index.js
	hooks/
		useAuth.js
		index.js
	services/
		apiClient.js
		authService.js
		productsService.js
		index.js
	components/
		Cards/
			ProductCard.jsx
		AppNavbar.jsx
		ProductForm.jsx
		ProtectedRoute.jsx
		RoleRoute.jsx
		index.js
	pages/
		catalog/
			ProductsPage.jsx
		details/
			ProductDetailPage.jsx
		AdminPage.jsx
		HomePage.jsx
		LoginPage.jsx
		NotFoundPage.jsx
		UserPage.jsx
		index.js
	routes/
		AppRouter.jsx
		index.js
	App.jsx
	main.jsx
```

Buenas prácticas aplicadas:
- Configuración de endpoints y claves en `env.js` con soporte para `.env`.
- Eliminación de componentes/páginas duplicadas sin uso.
- `index.js` por capa para imports más limpios y mantenibles.
- Separación clara entre `services`, `context`, `hooks`, `components`, `pages` y `routes`.

## Framework + librerías (con versiones)
- `react` `^19.2.0`
- `react-dom` `^19.2.0`
- `vite` `^7.3.1`
- `react-router-dom` `^7.13.1`
- `bootstrap` `^5.3.8` (obligatoria por rúbrica)
- `react-hook-form` `^7.71.2`
- `zod` `^4.3.6`
- `@hookform/resolvers` `^5.2.2`
- `react-toastify` `^11.0.5`

> No se usa Axios ni librerías de iconos.

## Guía de instalación
1. Clonar el repositorio público:
	```bash
	git clone <url-del-repo>
	```
2. Entrar al proyecto:
	```bash
	cd Web_Perfumes_React
	```
3. Instalar dependencias:
	```bash
	npm install
	```
4. Crear archivo de entorno (Windows PowerShell):
	```bash
	Copy-Item .env.example .env
	```
5. Ejecutar en desarrollo:
	```bash
	npm run dev
	```
6. Compilar para producción:
	```bash
	npm run build
	```
7. Previsualizar build:
	```bash
	npm run preview
	```

## Usuario de prueba para login
- Username: `emilys`
- Password: `emilyspass`

## Despliegue en hosting estático gratuito (GitHub Pages)
Opciones recomendadas:
1. **GitHub Pages con GitHub Actions** (recomendado).
2. **Netlify** (drag and drop de carpeta `dist`).
3. **Vercel** (importando repo público).

Para GitHub Pages:
- Ya está configurado el workflow en `.github/workflows/deploy-pages.yml`.
- Sube los cambios a la rama `main`.
- En GitHub, entra a **Settings > Pages** y en **Source** selecciona **GitHub Actions**.
- Cada `push` a `main` hará build y publicará automáticamente.

### URL final esperada
- `https://<tu-usuario>.github.io/Web_Perfumes_React/`

### Nota sobre rutas (React Router)
- El deploy genera `404.html` automáticamente para evitar errores al refrescar rutas internas en GitHub Pages.

## Requisitos académicos cubiertos
- Rutas React: Cumplido
- API con login: Cumplido
- Apartado usuario y admin: Cumplido
- Métodos GET/POST + PUT/PATCH/DELETE: Cumplido
- Responsive obligatorio: Cumplido
- 3+ librerías extra (sin Axios ni iconos): Cumplido
- Estructura profesional: Cumplido
- README con descripción, stack/versions, licencia e instalación: Cumplido

## Licencia de uso
Proyecto bajo licencia **MIT**. Ver archivo [LICENSE](./LICENSE).
