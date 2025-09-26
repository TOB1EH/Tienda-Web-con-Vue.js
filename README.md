# Proyecto de Tienda Web Estática con Vue.js y Vuetify

Este proyecto consta de dos implementaciones de una tienda web estática sin conexión a backend, desarrolladas como actividades prácticas para la materia **Ingeniería Web III** de la carrera de **Ingeniería Informática**. Las aplicaciones permiten gestionar productos, carrito de compras, clientes y métricas básicas desde la perspectiva de un administrador.

## Descripción General

- **Primera Implementación (tienda_vue)**: Desarrollada con Vue.js 3 utilizando Composition API, enfocada en conceptos básicos de Vue como componentes, estado reactivo, enrutamiento y gestión de estado simple.
- **Segunda Implementación (tienda_vuetify)**: Basada en la primera, pero utilizando el framework de diseño Vuetify 3 para una interfaz más moderna y responsive, con componentes Material Design, dashboard inicial y funcionalidades avanzadas como notificaciones y navegación adaptativa.

Ambas versiones son prototipos estáticos que simulan una base de datos con productos hardcodeados, permitiendo agregar al carrito, gestionar clientes y visualizar métricas.

## Proyectos Incluidos

### 1. tienda_vue
Tienda web básica desarrollada 100% con Vue 3 y Vite. Orientada a la vista del administrador para administrar usuarios, productos y ver métricas del estado de la plataforma.

**Características Principales:**
- Catálogo de productos con búsqueda.
- Vista detallada de productos.
- Carrito de compras con gestión de estado reactivo.
- Formulario de registro de clientes con validaciones.
- Navegación con Vue Router.

**Tecnologías:**
- Vue.js 3 (Composition API)
- Vue Router 4
- Vite
- Estado global con reactive/readonly

### 2. tienda_vuetify
Aplicación web moderna y responsive con Vue.js 3 y Vuetify 3, enfocada en gestión comercial de tienda en línea.

**Características Principales:**
- Dashboard inicial con estadísticas (productos, clientes, ventas).
- Gestión de productos y carrito con notificaciones en tiempo real.
- Navegación responsive con menú lateral adaptable a móviles.
- Sistema de notificaciones (Snackbar).
- Verificación de stock al agregar productos.

**Tecnologías:**
- Vue.js 3 (Composition API)
- Vuetify 3 (Material Design 3)
- Vue Router 4
- Vite
- Sass para estilos
- Pinia (preparado para state management)

## Requisitos

- Node.js (versión 18 o superior recomendada)
- npm (gestor de paquetes de Node.js)
- Editor de código recomendado: VSCode con extensión Volar para Vue

## Instalación y Ejecución

### Para tienda_vue:

1. Navega al directorio del proyecto:
   ```
   cd tienda_vue
   ```

2. Instala dependencias:
   ```
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```
   - Abre en navegador: http://localhost:5173

4. Construcción para producción:
   ```
   npm run build
   npm run preview
   ```

### Para tienda_vuetify:

1. Navega al directorio del proyecto:
   ```
   cd tienda_vuetify
   ```

2. Instala dependencias:
   ```
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```
   - Abre en navegador: http://localhost:3000

4. Construcción para producción:
   ```
   npm run build
   npm run preview
   ```

## Estructura del Proyecto

```
tps_iw3/
├── consignas/              # Documentos PDF de las prácticas
│   ├── [2025] Práctico 1.pdf
│   ├── [2025] Práctico 2.pdf
│   └── Práctico_Primer_Parcial.pdf
├── tienda_vue/             # Primera implementación con Vue básico
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── views/          # Vistas principales
│   │   ├── store/          # Gestión de estado (carrito)
│   │   └── router/         # Configuración de rutas
│   ├── public/             # Archivos estáticos
│   ├── package.json
│   └── README.md           # Documentación específica
├── tienda_vuetify/         # Segunda implementación con Vuetify
│   ├── src/
│   │   ├── components/     # Componentes con Vuetify
│   │   ├── views/          # Vistas
│   │   ├── plugins/        # Configuración Vuetify
│   │   └── assets/         # Estilos y recursos
│   ├── public/             # Archivos estáticos
│   ├── package.json
│   └── README.md           # Documentación específica
└── README.md               # Este archivo (documentación general)
```

## Navegación y Rutas

Ambas aplicaciones comparten rutas similares:
- `/`: Inicio/Dashboard
- `/productos`: Lista de productos
- `/productos/:id`: Detalle de producto
- `/carrito`: Vista del carrito
- `/clientes`: Gestión de clientes

## Recursos Adicionales

- [Documentación oficial de Vue 3](https://vuejs.org/)
- [Vuetify 3 Documentation](https://vuetifyjs.com/)
- [Guía de Vue Router](https://router.vuejs.org/)
- [Vite - Herramienta de construcción](https://vite.dev/)

## Autor

Desarrollado como actividad práctica para Ingeniería Web III - Carrera de Ingeniería Informática.

Funes Tobias.
