// router/index.js - Configuración de Vue Router 4
// 
// Vue Router es la librería oficial de enrutamiento para Vue.js
// Permite crear Single Page Applications (SPA) con navegación entre vistas
// sin recargar la página
//
// Documentación oficial: https://router.vuejs.org/

import { createRouter, createWebHistory } from 'vue-router'

// Importamos los componentes que servirán como vistas/páginas
// En una aplicación real, estos estarían en la carpeta views/
import InicioView from '../views/InicioView.vue'
import ProductosView from '../views/ProductosView.vue' 
import ProductoDetalleView from '../views/ProductoDetalleView.vue'
import ClientesView from '../views/ClientesView.vue'
import CarritoView from '../views/CarritoView.vue'

// Definición de rutas de la aplicación
// Cada ruta asocia una URL con un componente específico
const routes = [
  // RUTA RAÍZ: Página de inicio
  {
    path: '/',
    name: 'inicio',
    component: InicioView,
    meta: {
      title: 'Inicio - TiendaVue',
      description: 'Página principal del sistema de gestión'
    }
  },
  
  // RUTA PRODUCTOS: Lista de productos con búsqueda
  {
    path: '/productos',
    name: 'productos',
    component: ProductosView,
    meta: {
      title: 'Productos - TiendaVue',
      description: 'Catálogo de productos disponibles'
    }
  },
  
  // RUTA DINÁMICA: Detalle de producto específico
  // :id es un parámetro dinámico que captura el ID del producto
  {
    path: '/productos/:id',
    name: 'producto-detalle',
    component: ProductoDetalleView,
    // Props: permite pasar el parámetro de ruta como prop al componente
    props: true,
    meta: {
      title: 'Detalle del Producto - TiendaVue',
      description: 'Información detallada del producto'
    },
    // Guardia de ruta: validación antes de entrar a la ruta
    beforeEnter: (to, from, next) => {
      // Verificamos que el ID sea un número válido
      const id = parseInt(to.params.id)
      if (isNaN(id) || id <= 0) {
        // Si el ID no es válido, redirigimos a productos
        console.warn(`⚠️ ID de producto inválido: ${to.params.id}`)
        next('/productos')
      } else {
        // Si es válido, permitimos el acceso
        next()
      }
    }
  },
  
  // RUTA CLIENTES: Gestión de clientes
  {
    path: '/clientes',
    name: 'clientes',
    component: ClientesView,
    meta: {
      title: 'Gestión de Clientes - TiendaVue',
      description: 'Registro y administración de clientes'
    }
  },

  // RUTA CARRITO: Carrito de compras
  {
    path: '/carrito',
    name: 'carrito',
    component: CarritoView,
    meta: {
      title: 'Carrito de Compras - TiendaVue',
      description: 'Productos seleccionados para compra'
    }
  },

  // RUTA COMODÍN: Maneja URLs no encontradas (404)
  {
    path: '/:pathMatch(.*)*',
    name: 'no-encontrada',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: '404 - Página no encontrada',
      description: 'La página solicitada no existe'
    }
  }
]

// Creación del router con configuración
const router = createRouter({
  // MODO HISTORY: URLs limpias sin # (requiere configuración del servidor)
  // Alternativa: createWebHashHistory() para URLs con # (no requiere config servidor)
  history: createWebHistory(import.meta.env.BASE_URL),
  
  // Rutas de la aplicación
  routes,
  
  // COMPORTAMIENTO DE SCROLL: Controla cómo se maneja el scroll al navegar
  scrollBehavior(to, from, savedPosition) {
    // Si el usuario usó botones atrás/adelante, restaurar posición guardada
    if (savedPosition) {
      return savedPosition
    }
    // Si hay un hash (#seccion), hacer scroll a ese elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Por defecto, scroll al inicio de la página
    return { top: 0 }
  }
})

// GUARDIA GLOBAL: Se ejecuta antes de cada cambio de ruta
router.beforeEach((to, from, next) => {
  // Actualizamos el título de la página basado en meta.title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Log para debugging (útil en desarrollo)
  console.log(`🧭 Navegando de "${from.name}" a "${to.name}"`)
  
  // Simulación de autenticación (ejemplo)
  // if (to.meta.requiresAuth && !isAuthenticated()) {
  //   next('/login')
  // } else {
  //   next()
  // }
  
  // Permitir navegación
  next()
})

// GUARDIA GLOBAL: Se ejecuta después de cada cambio de ruta
router.afterEach((to, from) => {
  // Analytics o tracking (ejemplo)
  // trackPageView(to.path)
  
  // Log de navegación exitosa
  console.log(`✅ Navegación completada a: ${to.path}`)
})

// ERROR HANDLER: Maneja errores de navegación
router.onError((error) => {
  console.error('❌ Error en el router:', error)
  
  // En producción, enviarías este error a un servicio de monitoreo
  // como Sentry, LogRocket, etc.
})

// Exportamos el router para usar en main.js
export default router

// EXPLICACIÓN DE CONCEPTOS PARA APRENDIZAJE:
//
// 1. TIPOS DE HISTORIA DEL NAVEGADOR:
//    - createWebHistory(): URLs normales (ejemplo.com/productos)
//    - createWebHashHistory(): URLs con hash (ejemplo.com/#/productos)
//    - createMemoryHistory(): Para testing o SSR
//
// 2. PARÁMETROS DE RUTA:
//    - :id → Parámetro requerido
//    - :id? → Parámetro opcional
//    - :id+ → Uno o más parámetros
//    - :id* → Cero o más parámetros
//
// 3. GUARDIAS DE NAVEGACIÓN:
//    - beforeEach: Antes de cualquier ruta
//    - beforeEnter: Antes de una ruta específica  
//    - beforeRouteEnter: En el componente, antes de entrar
//    - beforeRouteUpdate: En el componente, al actualizar
//    - beforeRouteLeave: En el componente, antes de salir
//
// 4. META CAMPOS:
//    Información adicional sobre la ruta que puede usarse en:
//    - Títulos de página
//    - Breadcrumbs
//    - Permisos/autenticación
//    - SEO metadata
//
// 5. LAZY LOADING:
//    component: () => import('../views/Component.vue')
//    Carga el componente solo cuando se visita la ruta
//    Mejora el rendimiento inicial de la aplicación