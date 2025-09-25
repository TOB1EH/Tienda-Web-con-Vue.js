// main.js - Punto de entrada de la aplicación Vue con Router
//
// Este archivo es donde se inicializa y configura toda la aplicación Vue.
// En un proyecto real creado con 'npm create vue@latest' o 'vue create',
// este archivo estaría en la carpeta src/

// PASO 1: Importaciones principales
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// PASO 2: Importaciones opcionales (ejemplos para aplicaciones reales)
// import store from './store'              // Pinia o Vuex para estado global
// import i18n from './i18n'                // Vue I18n para internacionalización
// import './assets/css/main.css'           // Estilos globales adicionales

// PASO 3: Crear la instancia de la aplicación
// createApp() es la función principal de Vue 3 para crear aplicaciones
// Recibe el componente raíz y devuelve una instancia que podemos configurar
const app = createApp(App)

// PASO 4: Configuración global de la aplicación
// Aquí configuramos aspectos que afectarán toda la aplicación

// Propiedades globales (accesibles desde cualquier componente)
app.config.globalProperties.$appName = 'TiendaVue'
app.config.globalProperties.$version = '1.0.0'

// Configuración de desarrollo vs producción
if (import.meta.env.DEV) {
  // Configuraciones solo para desarrollo
  app.config.performance = true           // Habilita medición de performance
  app.config.devtools = true             // Habilita Vue DevTools
  
  console.log('🔧 Modo desarrollo activado')
  console.log('📊 Performance tracking: ON')
  console.log('🛠️ Vue DevTools: ON')
} else {
  // Configuraciones para producción
  app.config.performance = false
  app.config.devtools = false
  
  console.log('🚀 Aplicación en modo producción')
}

// Manejo global de errores
app.config.errorHandler = (error, instance, info) => {
  console.error('❌ Error global capturado:', error)
  console.error('🔍 Información del error:', info)
  console.error('⚙️ Instancia del componente:', instance)
  
  // En producción, aquí enviarías el error a un servicio de monitoreo
  // como Sentry, Bugsnag, LogRocket, etc.
  // 
  // Ejemplo:
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(error, {
  //     extra: { info, componentInstance: instance }
  //   })
  // }
}

// Manejo de warnings (solo en desarrollo)
app.config.warnHandler = (msg, instance, trace) => {
  if (import.meta.env.DEV) {
    console.warn('⚠️ Vue Warning:', msg)
    console.warn('📍 Component trace:', trace)
  }
}

// PASO 5: Instalación de plugins
// Los plugins extienden la funcionalidad de Vue globalmente

// Vue Router (OBLIGATORIO para navegación SPA)
app.use(router)

// Ejemplos de otros plugins comunes:
// app.use(store)                    // Pinia/Vuex para estado global
// app.use(i18n)                     // Internacionalización
// app.use(VueToastification)        // Sistema de notificaciones
// app.use(VueFormulate)             // Construcción de formularios avanzados

// PASO 6: Directivas personalizadas globales (opcional)
// Las directivas permiten manipular el DOM directamente

// Directiva personalizada para auto-focus
app.directive('focus', {
  // Se ejecuta cuando el elemento se monta en el DOM
  mounted(el) {
    el.focus()
  }
})

// Directiva personalizada para click outside
app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      // Verifica si el click fue fuera del elemento
      if (!(el === event.target || el.contains(event.target))) {
        // Ejecuta la función pasada a la directiva
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
})

// PASO 7: Componentes globales (usar con moderación)
// Solo registra globalmente componentes que usas en TODA la aplicación

// Ejemplo de componente global (icono base)
// app.component('BaseIcon', BaseIcon)
// app.component('BaseButton', BaseButton)
// app.component('BaseModal', BaseModal)

// PASO 8: Configuración de desarrollo adicional
if (import.meta.env.DEV) {
  // Debug helper: inspeccionar la aplicación desde la consola
  window.__VUE_APP__ = app
  
  // Log de información útil para desarrollo
  console.log('🏗️ Aplicación Vue creada')
  console.log('📦 Versión de Vue:', app.version)
  console.log('🧭 Router instalado:', !!app.config.globalProperties.$router)
  
  // Información sobre el entorno
  console.log('🌍 Variables de entorno:')
  console.log('  - BASE_URL:', import.meta.env.BASE_URL)
  console.log('  - MODE:', import.meta.env.MODE)
  console.log('  - DEV:', import.meta.env.DEV)
  console.log('  - PROD:', import.meta.env.PROD)
}

// PASO 9: Montar la aplicación
// Este es el momento donde Vue toma control del DOM
try {
  // mount() conecta la aplicación con el elemento HTML
  const mountedApp = app.mount('#app')
  
  if (import.meta.env.DEV) {
    console.log('✅ Aplicación montada exitosamente')
    console.log('🎯 Elemento objetivo: #app')
    console.log('🏠 Ruta inicial:', router.currentRoute.value.path)
  }
  
  // Referencia global para debugging (solo desarrollo)
  if (import.meta.env.DEV) {
    window.__VUE_INSTANCE__ = mountedApp
  }
  
} catch (error) {
  console.error('💥 Error al montar la aplicación:', error)
  
  // Mostrar mensaje de error al usuario
  document.getElementById('app').innerHTML = `
    <div style="
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: system-ui;
      text-align: center;
      padding: 2rem;
    ">
      <h1>❌ Error al cargar la aplicación</h1>
      <p>Ha ocurrido un error inesperado. Por favor, recarga la página.</p>
      <button onclick="location.reload()" style="
        margin-top: 1rem;
        padding: 0.8rem 1.5rem;
        background: white;
        color: #333;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      ">
        🔄 Recargar página
      </button>
      <details style="margin-top: 2rem; max-width: 600px;">
        <summary style="cursor: pointer; margin-bottom: 1rem;">Ver detalles técnicos</summary>
        <pre style="
          background: rgba(0,0,0,0.3);
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.8rem;
          text-align: left;
          overflow: auto;
        ">${error.message}\n\n${error.stack}</pre>
      </details>
    </div>
  `
}