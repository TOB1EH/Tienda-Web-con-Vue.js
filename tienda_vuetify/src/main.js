// main.js - Punto de entrada con Vuetify 3 integrado
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// IMPORTACIÓN DE VUETIFY
import vuetify from './plugins/vuetify'

// Importamos los estilos de Vuetify ANTES de crear la app
import 'vuetify/styles'

// Importamos los iconos Material Design desde CDN
// En un proyecto real, instalarías: npm install @mdi/font
// Por ahora usaremos CDN para simplicidad
import '@mdi/font/css/materialdesignicons.css'

// CSS personalizado adicional (opcional)
import './assets/css/custom-vuetify.css'

// Crear la instancia de la aplicación
const app = createApp(App)

// Configuración global de la aplicación
app.config.globalProperties.$appName = 'TiendaVue'
app.config.globalProperties.$version = '2.0.0' // Actualizamos versión con Vuetify

// Configuración condicional según el entorno (devtools solo en desarrollo)
if (import.meta.env.DEV) {
  app.config.devtools = true
} else {
  app.config.devtools = false
}

// Manejo global de errores (simplificado para producción)
app.config.errorHandler = (error, instance, info) => {
  // En una app real con Vuetify, podrías mostrar un v-snackbar o v-dialog
  // para informar al usuario sobre el error de manera elegante
}

// INSTALACIÓN DE PLUGINS
// Vue Router (para navegación SPA)
app.use(router)

// Vuetify (para UI/UX con Material Design)
app.use(vuetify)

// Directivas personalizadas mejoradas para trabajar con Vuetify
app.directive('focus', {
  mounted(el) {
    // Si es un componente de Vuetify, buscamos el input interno
    const input = el.querySelector('input') || el.querySelector('textarea') || el
    input.focus()
  }
})

// Directiva para animaciones de entrada (útil con v-card, v-list-item, etc.)
app.directive('slide-in', {
  beforeMount(el) {
    el.style.transform = 'translateX(-100%)'
    el.style.opacity = '0'
    el.style.transition = 'all 0.5s ease'
  },
  mounted(el) {
    setTimeout(() => {
      el.style.transform = 'translateX(0)'
      el.style.opacity = '1'
    }, 100)
  }
})

// COMPONENTES GLOBALES ESPECÍFICOS PARA VUETIFY
// Solo registramos componentes que usaremos en múltiples lugares

// Componente de loading personalizado con Vuetify
app.component('LoadingSpinner', {
  template: `
    <v-container class="d-flex justify-center align-center" style="min-height: 200px;">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      >
        <template v-slot:default>
          <v-icon icon="mdi-shopping" size="24"></v-icon>
        </template>
      </v-progress-circular>
    </v-container>
  `
})

// Componente de error personalizado con Vuetify
app.component('ErrorMessage', {
  props: {
    message: {
      type: String,
      default: 'Ha ocurrido un error inesperado'
    },
    retry: {
      type: Function,
      default: null
    }
  },
  template: `
    <v-container class="text-center">
      <v-alert
        type="error"
        prominent
        border="start"
        closable
        class="mb-4"
      >
        <v-alert-title>Error</v-alert-title>
        {{ message }}
      </v-alert>
      <v-btn
        v-if="retry"
        @click="retry"
        color="primary"
        prepend-icon="mdi-refresh"
      >
        Intentar nuevamente
      </v-btn>
    </v-container>
  `
})

// CONFIGURACIÓN DE DESARROLLO ADICIONAL (comentado para producción)
/*
if (import.meta.env.DEV) {
  // Referencias globales para debugging
  window.__VUE_APP__ = app
  window.__VUETIFY__ = vuetify
  
  // Información de la configuración
  console.log('🏗️ TiendaVue con Vuetify creada')
  console.log('📦 Vue version:', app.version)
  console.log('🎨 Vuetify theme:', vuetify.theme.global.current.value)
  console.log('🧭 Router instalado:', !!app.config.globalProperties.$router)
  
  // Helper para cambiar tema desde la consola del navegador
  window.toggleTheme = () => {
    const currentTheme = vuetify.theme.global.current.value
    vuetify.theme.global.name.value = currentTheme.dark ? 'tiendaTheme' : 'darkTheme'
    console.log('🌓 Tema cambiado a:', vuetify.theme.global.current.value)
  }
  
  console.log('💡 Tip: Usa toggleTheme() en la consola para cambiar entre tema claro y oscuro')
}
*/

// MONTAR LA APLICACIÓN
try {
  app.mount('#app')
} catch (error) {
  // En producción, manejar error de montaje de forma simple (comentado el HTML detallado)
  console.error('Error al montar la aplicación:', error)
  document.getElementById('app').innerHTML = '<div style="padding: 20px; text-align: center;">Error al cargar la aplicación. Por favor, recarga la página.</div>'
  /*
  // Versión detallada para debugging (comentada en producción):
  document.getElementById('app').innerHTML = `
    <div style="... [full HTML as before] ...">
  `
  */
}

// INFORMACIÓN ADICIONAL PARA EL DESARROLLO (comentado para producción):
/*
COMANDOS ÚTILES DE VUETIFY:

1. Instalar Vuetify en un proyecto nuevo:
   npm create vuetify

2. Agregar Vuetify a un proyecto existente:
   npm install vuetify@^3.0.0
   npm install @mdi/font

3. Usar Vuetify con TypeScript:
   npm install -D @types/vuetify

ESTRUCTURA RECOMENDADA CON VUETIFY:

src/
├── plugins/
│   └── vuetify.js          ← Configuración de Vuetify
├── components/
│   ├── base/               ← Componentes base reutilizables
│   └── features/           ← Componentes específicos de funcionalidades
├── layouts/                ← Layouts de página (con v-app-bar, v-navigation-drawer)
├── views/                  ← Páginas/vistas principales
├── assets/
│   └── css/
│       └── custom-vuetify.css  ← Estilos personalizados
└── main.js                 ← Este archivo
*/

// main.js Valor por defecto (comentado - no usado)
/*
// main.js
//
// Bootstraps Vuetify and other plugins then mounts the App

// Plugins
// import { registerPlugins } from '@/plugins'

// Components
// import App from './App.vue'

// Composables
// import { createApp } from 'vue'

// Styles
// import 'unfonts.css'

// const app = createApp(App)

// registerPlugins(app)

// app.mount('#app')
*/
