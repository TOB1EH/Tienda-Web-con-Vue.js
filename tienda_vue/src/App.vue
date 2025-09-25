<script setup>
// Importamos las funciones necesarias de Vue y Vue Router
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// HOOKS DE VUE ROUTER:
// useRouter(): Acceso al objeto router para navegación programática
// useRoute(): Acceso a información de la ruta actual (params, query, etc.)
const router = useRouter()
const route = useRoute()

// Estado global de la aplicación
// En una aplicación más grande, esto estaría en un store (Pinia/Vuex)
const estadoGlobal = ref({
  usuario: null,
  configuracion: {
    tema: 'claro',
    idioma: 'es'
  },
  notificaciones: []
})

// Computed property para determinar la página activa basada en la ruta
const paginaActual = computed(() => {
  return route.name || 'desconocida'
})

// Computed property para el título de la página
const tituloSeccion = computed(() => {
  const titulos = {
    'inicio': '🏠 Inicio',
    'productos': '📦 Productos', 
    'producto-detalle': '🔍 Detalle del Producto',
    'clientes': '👥 Clientes',
    'carrito': '🛒 Carrito'
  }
  return titulos[paginaActual.value] || '📄 Página'
})

// Función para navegar programáticamente
const navegarA = (ruta) => {
  router.push(ruta)
}

// Función para volver atrás en el historial
const volverAtras = () => {
  router.back()
}

// Función para mostrar notificación temporal
const mostrarNotificacion = (mensaje, tipo = 'info') => {
  const notificacion = {
    id: Date.now(),
    mensaje,
    tipo,
    timestamp: new Date()
  }
  
  estadoGlobal.value.notificaciones.push(notificacion)
  
  // Remover notificación después de 5 segundos
  setTimeout(() => {
    const index = estadoGlobal.value.notificaciones.findIndex(n => n.id === notificacion.id)
    if (index > -1) {
      estadoGlobal.value.notificaciones.splice(index, 1)
    }
  }, 5000)
}

// Hook de ciclo de vida
onMounted(() => {
  console.log('🚀 Aplicación TiendaVue iniciada con Vue Router')
  console.log(`📍 Ruta inicial: ${route.path}`)
  
  // Mostrar notificación de bienvenida
  mostrarNotificacion('¡Bienvenido a TiendaVue!', 'exito')
})

// Función para cerrar notificación manualmente
const cerrarNotificacion = (notificacionId) => {
  const index = estadoGlobal.value.notificaciones.findIndex(n => n.id === notificacionId)
  if (index > -1) {
    estadoGlobal.value.notificaciones.splice(index, 1)
  }
}
</script>

<template>
  <div class="app">
    <!-- Barra de navegación con Vue Router -->
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo que navega al inicio -->
        <router-link to="/" class="logo">
          🏪 TiendaVue
        </router-link>
        
        <!-- Enlaces de navegación usando router-link -->
        <ul class="nav-links">
          <li>
            <!-- 
              router-link: Componente de Vue Router para navegación SPA
              - 'to' especifica la ruta de destino
              - Se renderiza como <a> pero intercepta clicks para navegación SPA
              - Agrega automáticamente clases CSS para estado activo
              
              Documentación: https://router.vuejs.org/guide/essentials/navigation.html
            -->
            <router-link to="/" class="nav-link">
              🏠 Inicio
            </router-link>
          </li>
          <li>
            <router-link to="/productos" class="nav-link">
              📦 Productos
            </router-link>
          </li>
          <li>
            <router-link to="/carrito" class="nav-link">
              🛒 Carrito
            </router-link>
          </li>
          <li>
            <router-link to="/clientes" class="nav-link">
              👥 Clientes
            </router-link>
          </li>
        </ul>

        <!-- Información de estado y navegación -->
        <!-- <div class="nav-info">
          <button @click="volverAtras" class="btn-back" title="Volver atrás">
            ←
          </button>
          <span class="ruta-actual">{{ tituloSeccion }}</span>
        </div> -->
      </div>
    </nav>

    <!-- Sistema de notificaciones -->
    <div v-if="estadoGlobal.notificaciones.length > 0" class="notificaciones-container">
      <transition-group name="notificacion" tag="div">
        <div
          v-for="notif in estadoGlobal.notificaciones"
          :key="notif.id"
          :class="['notificacion', `notificacion-${notif.tipo}`]"
          @click="cerrarNotificacion(notif.id)"
        >
          <span class="notif-mensaje">{{ notif.mensaje }}</span>
          <button class="notif-cerrar" @click.stop="cerrarNotificacion(notif.id)">
            ✕
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Contenido principal - Aquí se renderizan las vistas -->
    <main class="main-content">
      <!-- 
        router-view: Componente donde se renderizan las vistas según la ruta
        Es como un "slot dinámico" donde Vue Router coloca el componente correspondiente
        
        Transiciones: Agregamos animaciones entre cambios de vista
        Documentación: https://router.vuejs.org/guide/advanced/transitions.html
      -->
      <router-view v-slot="{ Component, route }">
        <transition name="vista" mode="out-in">
          <!-- 
            component :is: Renderizado dinámico de componentes
            Permite renderizar diferentes componentes basándose en una variable
          -->
          <component 
            :is="Component" 
            :key="route.path"
            @notificacion="mostrarNotificacion"
          />
        </transition>
      </router-view>
    </main>

    <!-- Footer con información de debug -->
    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-main">
          <p>&copy; 2025 TiendaVue - Sistema desarrollado con Vue.js 3</p>
        </div>
        
        <!-- Panel de información del router (útil para aprender) -->
        <!--
        <div class="router-debug">
          <details>
            <summary>🔧 Debug Info del Router</summary>
            <div class="debug-grid">
              <div class="debug-item">
                <strong>Ruta actual:</strong> {{ route.path }}
              </div>
              <div class="debug-item">
                <strong>Nombre:</strong> {{ route.name || 'Sin nombre' }}
              </div>
              <div class="debug-item">
                <strong>Parámetros:</strong> {{ JSON.stringify(route.params) }}
              </div>
              <div class="debug-item">
                <strong>Query:</strong> {{ JSON.stringify(route.query) }}
              </div>
              <div class="debug-item">
                <strong>Hash:</strong> {{ route.hash || 'N/A' }}
              </div>
              <div class="debug-item">
                <strong>Matched:</strong> {{ route.matched.length }} ruta(s)
              </div>
            </div>
          </details>
        </div>
      -->
      </div>
    </footer>
  </div>
</template>

<style>
/* Estilos globales para toda la aplicación */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navegación */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo:hover {
  color: #3498db;
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: block;
  padding: 0.7rem 1.2rem;
  text-decoration: none;
  color: #5d6d7e;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  transform: translateY(-2px);
}

/* 
  Clases automáticas de Vue Router:
  - router-link-active: Se aplica cuando la ruta coincide parcialmente
  - router-link-exact-active: Se aplica cuando la ruta coincide exactamente
*/
.nav-link.router-link-active {
  background: #3498db;
  color: white;
  font-weight: 600;
}

.nav-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  background: rgba(52, 152, 219, 0.1);
  border: 1px solid #3498db;
  color: #3498db;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #3498db;
  color: white;
}

.ruta-actual {
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
}

/* Sistema de notificaciones */
.notificaciones-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notificacion {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 300px;
  cursor: pointer;
  border-left: 4px solid;
}

.notificacion-info {
  border-left-color: #3498db;
}

.notificacion-exito {
  border-left-color: #27ae60;
}

.notificacion-error {
  border-left-color: #e74c3c;
}

.notificacion-advertencia {
  border-left-color: #f39c12;
}

.notif-mensaje {
  font-weight: 500;
  color: #2c3e50;
}

.notif-cerrar {
  background: none;
  border: none;
  color: #95a5a6;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.2rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.notif-cerrar:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #e74c3c;
}

/* Contenido principal */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Footer */
.app-footer {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 2rem;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.9);
}

.footer-main {
  text-align: center;
  margin-bottom: 1rem;
}

.router-debug {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
}

.router-debug summary {
  cursor: pointer;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-top: 1rem;
}

.debug-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.debug-item strong {
  color: rgba(255, 255, 255, 1);
}

/* Animaciones de transición entre vistas */
.vista-enter-active,
.vista-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.vista-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.vista-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Animaciones para notificaciones */
.notificacion-enter-active,
.notificacion-leave-active {
  transition: all 0.3s ease;
}

.notificacion-enter-from,
.notificacion-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsividad */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .notificaciones-container {
    right: 10px;
    left: 10px;
    top: 120px;
  }
  
  .notificacion {
    min-width: auto;
  }
  
  .debug-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-info {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .nav-links {
    width: 100%;
  }
  
  .nav-link {
    flex: 1;
    text-align: center;
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .logo {
    font-size: 1.3rem;
  }
}
</style>