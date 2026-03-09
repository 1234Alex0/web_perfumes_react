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
4. Ejecutar en desarrollo:
	```bash
	npm run dev
	```
5. Compilar para producción:
	```bash
	npm run build
	```
6. Previsualizar build:
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
- Subir el repo a GitHub.
- Ejecutar `npm run build`.
- Publicar el contenido de `dist` con Actions o rama `gh-pages`.

## Requisitos académicos cubiertos
- Rutas React: ✅
- API con login: ✅
- Apartado usuario y admin: ✅
- Métodos GET/POST + PUT/PATCH/DELETE: ✅
- Responsive obligatorio: ✅
- 3+ librerías extra (sin Axios ni iconos): ✅
- Estructura profesional: ✅
- README con descripción, stack/versions, licencia e instalación: ✅

## Licencia de uso
Proyecto bajo licencia **MIT**. Ver archivo [LICENSE](./LICENSE).
