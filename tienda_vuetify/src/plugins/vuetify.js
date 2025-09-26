// plugins/vuetify.js - Configuración de Vuetify 3
// 
// Este archivo configura Vuetify 3 para trabajar con Vue 3
// Vuetify es un framework de componentes que sigue Material Design
// Documentación: https://vuetifyjs.com/

import { createVuetify } from 'vuetify'

// Importamos los componentes que necesitamos
// Vuetify 3 usa tree-shaking, solo importa lo que usas
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Importamos los estilos CSS de Vuetify
import 'vuetify/styles'

// Importamos los iconos Material Design
import { mdi } from 'vuetify/iconsets/mdi'

// CONFIGURACIÓN PERSONALIZADA PARA NUESTRO PROYECTO
const vuetify = createVuetify({
  // COMPONENTES: Registramos todos los componentes de Vuetify
  // En un proyecto más grande, importarías solo los que necesitas
  components,
  
  // DIRECTIVAS: Como v-ripple, v-intersect, etc.
  directives,
  
  // TEMA: Configuración de colores y apariencia
  theme: {
    // Tema por defecto que se aplicará inicialmente
    defaultTheme: 'tiendaTheme',
    
    themes: {
      // TEMA PERSONALIZADO PARA TIENDAVUE
      tiendaTheme: {
        // Material Design con toques personalizados para comercio
        dark: false, // Tema claro por defecto
        colors: {
          // COLORES PRIMARIOS (basados en Material Design)
          primary: '#1976D2',        // Azul principal para botones y enlaces
          'primary-darken-1': '#1565C0', // Variante más oscura del azul
          secondary: '#424242',       // Gris para elementos secundarios
          accent: '#82B1FF',         // Azul claro para destacar
          
          // COLORES SEMÁNTICOS
          success: '#4CAF50',        // Verde para éxito/confirmaciones
          warning: '#FF9800',        // Naranja para advertencias
          error: '#F44336',          // Rojo para errores
          info: '#2196F3',           // Azul para información
          
          // COLORES DE SUPERFICIE
          surface: '#FFFFFF',        // Fondo de tarjetas y elementos
          background: '#FAFAFA',     // Fondo general de la aplicación
          
          // COLORES COMERCIALES ESPECÍFICOS
          // Estos los usaremos para elementos específicos del e-commerce
          'cart-primary': '#4CAF50',     // Verde para carrito/compras
          'product-accent': '#FF5722',   // Naranja para productos destacados
          'client-info': '#9C27B0',      // Púrpura para información de clientes
          
          // COLORES DE TEXTO
          'on-primary': '#FFFFFF',   // Texto sobre color primario
          'on-surface': '#1D1D1D',   // Texto sobre superficies
          'on-background': '#1D1D1D' // Texto sobre el fondo
        },
        
        // VARIABLES PERSONALIZADAS DE TEMA
        variables: {
          // Estas variables se pueden usar en los estilos de componentes
          'border-color': '#E0E0E0',
          'border-radius-root': '8px',
          'activated-opacity': 0.12,
          'hover-opacity': 0.04,
          'selected-opacity': 0.08,
        }
      },
      
      // TEMA OSCURO (opcional para futuro)
      darkTheme: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#F44336',
          info: '#2196F3',
          surface: '#121212',
          background: '#121212',
        }
      }
    },
    
    // VARIACIONES DE TEMA
    // Vuetify puede generar automáticamente variaciones de colores
    variations: {
      colors: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
      lighten: 4, // Genera 4 variaciones más claras
      darken: 4,  // Genera 4 variaciones más oscuras
    }
  },
  
  // ICONOS: Configuración del set de iconos
  icons: {
    defaultSet: 'mdi', // Material Design Icons
    sets: {
      mdi
    }
  },
  
  // CONFIGURACIÓN DE PANTALLA/RESPONSIVE
  display: {
    // Breakpoints personalizados para nuestro diseño responsivo
    mobileBreakpoint: 'sm',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1264,
      xl: 1904,
    },
  },
  
  // CONFIGURACIÓN DE COMPONENTES GLOBALES
  defaults: {
    // Configuraciones por defecto para componentes específicos
    VBtn: {
      // Todos los botones tendrán estas propiedades por defecto
      color: 'primary',
      variant: 'elevated',
      style: 'text-transform: none;', // Sin mayúsculas automáticas
    },
    VTextField: {
      // Todos los campos de texto tendrán estas propiedades
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VCard: {
      // Todas las tarjetas tendrán estas propiedades
      elevation: 2,
      rounded: 'lg',
    },
    VAppBar: {
      // Configuración por defecto de la barra de aplicación
      elevation: 1,
      color: 'primary',
    },
    VNavigationDrawer: {
      // Configuración por defecto del drawer lateral
      elevation: 1,
    },
    VDataTable: {
      // Configuración por defecto de tablas (si las usamos)
      itemsPerPage: 10,
      showCurrentPage: true,
    }
  },
  
  // CONFIGURACIÓN DE SSR (Server Side Rendering) - opcional
  ssr: false,
})

export default vuetify

// NOTAS IMPORTANTES PARA EL DESARROLLO:
// 
// 1. IMPORTACIÓN DE ESTILOS:
//    Asegúrate de que en tu main.js importes:
//    import 'vuetify/styles' // Antes de crear la app
//
// 2. ICONOS MATERIAL DESIGN:
//    Para usar iconos, instala: npm install @mdi/font
//    Y luego en tu main.css: @import url('https://cdn.jsdelivr.net/npm/@mdi/font@7.x/css/materialdesignicons.min.css')
//
// 3. TREE-SHAKING:
//    Vuetify 3 automáticamente solo incluye los componentes que usas
//    No necesitas preocuparte por el tamaño del bundle
//
// 4. TEMAS DINÁMICOS:
//    Puedes cambiar el tema programáticamente con:
//    const { theme } = useTheme()
//    theme.global.name.value = 'darkTheme'
//
// 5. VARIABLES CSS PERSONALIZADAS:
//    Las variables definidas aquí se pueden usar en cualquier componente:
//    .mi-elemento {
//      border: 1px solid rgb(var(--v-theme-border-color));
//    }

// COMPONENTES PRINCIPALES QUE USAREMOS EN NUESTRO PROYECTO:
//
// Navegación:
// - v-app-bar (barra superior)
// - v-navigation-drawer (menú lateral)
// - v-bottom-navigation (navegación inferior móvil)
//
// Layout:
// - v-app (contenedor principal)
// - v-main (contenido principal)
// - v-container, v-row, v-col (sistema de grid)
//
// Formularios:
// - v-form (formularios con validación)
// - v-text-field (campos de texto)
// - v-select (selects/dropdowns)
// - v-btn (botones)
//
// Mostrar datos:
// - v-card (tarjetas)
// - v-list (listas)
// - v-data-table (tablas de datos)
// - v-chip (chips para tags/estados)
//
// Feedback:
// - v-alert (alertas/mensajes)
// - v-snackbar (notificaciones temporales)
// - v-progress-circular (loading)
// - v-dialog (modales)
//
// Comercio específico:
// - v-badge (para contadores de carrito)
// - v-rating (para calificaciones de productos)
// - v-expansion-panels (para especificaciones de productos)




// -----------------------------------------------------------------------------------------
// Valor por defecto:
// /**
//  * plugins/vuetify.js
//  *
//  * Framework documentation: https://vuetifyjs.com`
//  */

// // Styles
// import '@mdi/font/css/materialdesignicons.css'
// import 'vuetify/styles'

// // Composables
// import { createVuetify } from 'vuetify'

// // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// export default createVuetify({
//   theme: {
//     defaultTheme: 'system',
//   },
// })
