// main.js - Punto de entrada de la aplicación Vue
// 
// Este archivo es donde Vue se inicializa y se conecta con el HTML
// En una aplicación real creada con 'npm create vue@latest', este archivo
// estaría en la carpeta src/ y sería procesado por Vite o Vue CLI

// PASO 1: Importación de Vue y el componente raíz
//
// createApp: Función para crear una nueva instancia de aplicación Vue
// ¿Por qué createApp y no new Vue()?
// Vue 3 cambió la API para permitir múltiples aplicaciones Vue
// en la misma página y mejor aislamiento entre aplicaciones

// Documentación: https://vuejs.org/guide/essentials/application.html#creating-an-application
import { createApp } from 'vue'
import App from './App.vue'

// PASO 2: Opcional - Importar estilos globales adicionales
// import './assets/css/reset.css'
// import './assets/css/main.css'

// PASO 3: Crear la instancia de la aplicación
//
// createApp() recibe el componente raíz (App.vue) y retorna
// una instancia de aplicación que podemos configurar
const app = createApp(App)

// PASO 4: Configuración opcional de la aplicación
//
// Aquí podrías agregar configuraciones globales como:

// Propiedades globales accesibles en todos los componentes
app.config.globalProperties.$appName = 'TiendaVue'

// Manejo global de errores:
// app.config.errorHandler = (err, vm, info) => {
  // console.error('Error en la aplicación:', err)
  // console.error('Información del error:', info)
  // En producción, aquí enviarías el error a un servicio de monitoreo
  // como Sentry, LogRocket, etc.
// }

// Configurar el modo de desarrollo
// En producción, Vue automáticamente desactiva warnings y devtools
// if (import.meta.env.DEV) {
  // app.config.performance = true // Habilita medición de rendimiento
// }

// PASO 5: Registro de componentes globales (opcional)
//
// Si tienes componentes que usarás en toda la aplicación,
// puedes registrarlos globalmente aquí:
//
// import ComponenteGlobal from './components/ComponenteGlobal.vue'
// app.component('ComponenteGlobal', ComponenteGlobal)
//
// ¿Cuándo usar componentes globales?
// - Íconos que usas en toda la app
// - Modales o tooltips reutilizables
// - Componentes UI base como botones, inputs
//
// Pero ten cuidado: los componentes globales siempre se incluyen
// en el bundle final, incluso si no los usas

// PASO 6: Plugins (opcional)
//
// Los plugins agregan funcionalidad global a la aplicación:
//
// import router from './router'           // Vue Router para navegación
// import store from './store'             // Pinia/Vuex para estado global
// import i18n from './i18n'               // Vue I18n para internacionalización
//
// app.use(router)
// app.use(store)
// app.use(i18n)

// PASO 7: Montar la aplicación
//
// mount() conecta la aplicación Vue con un elemento DOM
// El string '#app' corresponde al elemento <div id="app"> en index.html
//
// ¿Qué pasa cuando se monta?
// 1. Vue compila todos los templates
// 2. Ejecuta el ciclo de vida de componentes (setup, mounted, etc.)
// 3. Renderiza la aplicación en el DOM
// 4. Establece la reactividad
app.mount('#app')

// EXPLICACIÓN ADICIONAL PARA APRENDER:
//
// Estructura típica de una aplicación Vue 3:
//
// proyecto/
// ├── public/
// │   ├── favicon.ico
// ├── src/
// │   ├── assets/            ← Imágenes, estilos, etc.
// │   ├── components/        ← Componentes reutilizables
// │   │   └── RegistroRapidoClientes.vue
// │   ├── views/             ← Páginas/vistas principales
// │   ├── router/            ← Configuración de rutas
// │   ├── stores/            ← Estado global (Pinia)
// │   ├── App.vue            ← Componente raíz
// │   └── main.js            ← Este archivo
// ├── index.html          ← HTML base con <div id="app">
// ├── package.json
// └── vite.config.js



// CONSEJOS DE DESARROLLO:
//
// 1. Usa Vue DevTools extension para Chrome/Firefox
//    Te permite inspeccionar componentes, estado, eventos
//    Descarga: https://devtools.vuejs.org/
//
// 2. Para depurar reactividad, usa:
//    import { watchEffect } from 'vue'
//    watchEffect(() => {
//      console.log('Variable cambió:', miVariable.value)
//    })
//
// 3. Para medir rendimiento:
//    app.config.performance = true
//    Luego usa las herramientas de desarrollador del navegador
//
// 4. Configuración de desarrollo vs producción:
//    - Desarrollo: Warnings detallados, Vue DevTools habilitado
//    - Producción: Optimizado, warnings deshabilitados