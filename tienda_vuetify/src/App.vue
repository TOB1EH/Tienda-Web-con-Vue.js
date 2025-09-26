<script setup>
// Importamos las funciones necesarias de Vue, Vue Router y Vuetify
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import { useTheme, useDisplay } from 'vuetify'

// HOOKS DE COMPOSICIÓN
const router = useRouter()
const route = useRoute()
const theme = useTheme()
const { mobile } = useDisplay()

// ESTADO DE LA APLICACIÓN
// Control del drawer de navegación
const drawer = ref(null) // Se inicializa en null para que Vuetify decida

// Sistema de notificaciones mejorado con Vuetify
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const snackbarTimeout = ref(4000)

// Información de la aplicación
const appInfo = ref({
  nombre: 'TiendaVue',
  version: '2.0.0'
})

// --- ESTADO GLOBAL DEL CARRITO ---
// Estado compartido del carrito entre todas las vistas
const itemsCarrito = ref([])
const productosDB = ref([
  { id: 1, nombre: 'Laptop Gaming MSI', precio: 150000, stock: 5 },
  { id: 2, nombre: 'Mouse Inalámbrico Logitech', precio: 2500, stock: 0 },
  { id: 3, nombre: 'Teclado Mecánico Corsair', precio: 8500, stock: 12 },
  { id: 4, nombre: 'Monitor 24" Samsung', precio: 45000, stock: 3 },
  { id: 5, nombre: 'Auriculares Gaming HyperX', precio: 12000, stock: 8 },
  { id: 6, nombre: 'Webcam HD Logitech', precio: 7500, stock: 0 },
  { id: 7, nombre: 'Silla Gamer DXRacer', precio: 85000, stock: 2 },
  { id: 8, nombre: 'Mousepad XL SteelSeries', precio: 3500, stock: 15 }
])

// COMPUTED: Carrito con detalles completos del producto
const carritoCompleto = computed(() => {
  return itemsCarrito.value.map(item => {
    const producto = productosDB.value.find(p => p.id === item.id)
    return {
      ...item,
      nombre: producto?.nombre || 'Producto no encontrado',
      precio: producto?.precio || 0,
      subtotal: (producto?.precio || 0) * item.cantidad
    }
  })
})

// COMPUTED: Total general del carrito
const totalGeneral = computed(() => {
  return carritoCompleto.value.reduce((total, item) => total + item.subtotal, 0)
})

// MÉTODOS DEL CARRITO
const agregarAlCarrito = (productoId) => {
  const producto = productosDB.value.find(p => p.id === productoId)
  if (!producto || producto.stock === 0) {
    mostrarNotificacion('Producto sin stock disponible', 'warning')
    return
  }

  const itemExistente = itemsCarrito.value.find(item => item.id === productoId)

  if (itemExistente) {
    itemExistente.cantidad++
  } else {
    itemsCarrito.value.push({ id: productoId, cantidad: 1 })
  }

  mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success')
}

const incrementarCantidad = (itemId) => {
  const item = itemsCarrito.value.find(i => i.id === itemId)
  if (item) {
    item.cantidad++
  }
}

const decrementarCantidad = (itemId) => {
  const item = itemsCarrito.value.find(i => i.id === itemId)
  if (item && item.cantidad > 1) {
    item.cantidad--
  } else if (item && item.cantidad === 1) {
    eliminarItem(itemId)
  }
}

const eliminarItem = (itemId) => {
  const index = itemsCarrito.value.findIndex(i => i.id === itemId)
  if (index > -1) {
    const nombreProducto = carritoCompleto.value.find(i => i.id === itemId)?.nombre || 'Producto'
    itemsCarrito.value.splice(index, 1)
    mostrarNotificacion(`${nombreProducto} eliminado del carrito`, 'info')
  }
}

const vaciarCarrito = () => {
  if (itemsCarrito.value.length > 0) {
    itemsCarrito.value = []
    mostrarNotificacion('Carrito vaciado', 'info')
  }
}

// ELEMENTOS DE NAVEGACIÓN
// Configuración del menú lateral
const menuItems = ref([
  {
    title: 'Dashboard',
    icon: 'mdi-home',
    to: '/'
  },
  {
    title: 'Productos',
    icon: 'mdi-package-variant',
    to: '/productos'
  },
  {
    title: 'Carrito',
    icon: 'mdi-cart',
    to: '/carrito',
    badge: computed(() => itemsCarrito.value.length > 0 ? itemsCarrito.value.length : null)
  },
  {
    title: 'Clientes',
    icon: 'mdi-account-group',
    to: '/clientes'
  }
])

// COMPUTED PROPERTIES
// Título dinámico basado en la ruta actual
const pageTitle = computed(() => {
  return route.name || 'TiendaVue'
})

// MÉTODOS
// Alternar el estado del drawer
const toggleDrawer = () => {
  drawer.value = !drawer.value
}

// Navegación programática
const navegarA = (ruta) => {
  router.push(ruta)
}

// Sistema de notificaciones mejorado
const mostrarNotificacion = (message, type = 'info') => {
  snackbarText.value = message
  snackbarColor.value = type
  snackbar.value = true
}

// Función para alternar tema (claro/oscuro)
const toggleTheme = () => {
  const currentTheme = theme.global.current.value
  theme.global.name.value = currentTheme.dark ? 'tiendaTheme' : 'darkTheme'

  const newTheme = theme.global.current.value.dark ? 'oscuro' : 'claro'
  mostrarNotificacion(`Tema cambiado a ${newTheme}`, 'info')
}

// LIFECYCLE HOOKS
onMounted(() => {
  mostrarNotificacion('¡Bienvenido a TiendaVue!', 'success')

  // Escuchar cambios de ruta para analytics (simulado)
  router.afterEach((to, from) => {
    // Actualizar título de la página
    document.title = `${pageTitle.value} - ${appInfo.value.nombre}`
  })
})
</script>

<template>
  <!-- 
    V-APP: Contenedor principal requerido por Vuetify
    Proporciona el contexto necesario para todos los componentes de Vuetify
  -->
  <v-app>
    <!-- 
      V-APP-BAR: Barra de navegación superior
      Incluye el menú hamburguesa, título y acciones
    -->
    <v-app-bar app color="primary" dark>
      <!-- Contenido principal de la barra -->
      <template v-slot:prepend>
        <!-- Botón hamburguesa para mostrar/ocultar drawer -->
        <v-app-bar-nav-icon @click="toggleDrawer" />
      </template>

      <!-- Logo y título -->
      <v-app-bar-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-store</v-icon>
        <span class="font-weight-bold">{{ appInfo.nombre }}</span>
        <v-chip small color="white" text-color="primary" class="ml-2 font-weight-bold">
          {{ appInfo.version }}
        </v-chip>
      </v-app-bar-title>

      <!-- Spacer para empujar elementos a la derecha -->
      <v-spacer />

      <!-- Acciones de la barra -->
      <!-- Botón para alternar tema -->
      <v-btn
        icon
        @click="toggleTheme"
        :title="`Cambiar a tema ${theme.global.current.value.dark ? 'claro' : 'oscuro'}`"
      >
        <v-icon>
          {{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>
    </v-app-bar>

    <!-- 
      V-NAVIGATION-DRAWER: Menú lateral deslizable
      Se muestra/oculta según el estado de 'drawer'
    -->
    <v-navigation-drawer v-model="drawer" app>
      <!-- Header del drawer -->
      <v-list-item class="pa-4" :to="'/'">
        <template v-slot:prepend>
          <v-avatar color="primary" size="40">
            <v-icon color="white">mdi-store</v-icon>
          </v-avatar>
        </template>

        <v-list-item-title class="text-h6 font-weight-bold">
          {{ appInfo.nombre }}
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <!-- Lista de navegación principal -->
      <v-list dense nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          link
          :prepend-icon="item.icon"
          :title="item.title"
          @click="mobile ? (drawer = false) : null"
        >
          <template v-if="item.badge" #append>
            <v-badge
              :content="item.badge"
              color="error"
              inline
            />
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- 
      V-MAIN: Contenedor principal para el contenido
      Automáticamente se ajusta al espacio disponible
    -->
    <v-main>
      <!-- Contenido de la aplicación con router-view -->
      <v-container fluid>
        <!--
          Router View simplificado para mejor rendimiento en HMR
          Usamos :key="$route.fullPath" para forzar re-renders en navegación
        -->
        <RouterView v-slot="{ Component }" :key="$route.fullPath">
          <component
            :is="Component"
            @notification="mostrarNotificacion"
            :productos-db="productosDB"
            :items-carrito="itemsCarrito"
            :carrito-completo="carritoCompleto"
            :total-general="totalGeneral"
            @agregar-al-carrito="agregarAlCarrito"
            @incrementar-cantidad="incrementarCantidad"
            @decrementar-cantidad="decrementarCantidad"
            @eliminar-item="eliminarItem"
            @vaciar-carrito="vaciarCarrito"
          />
        </RouterView>
      </v-container>
    </v-main>

    <!-- 
      V-SNACKBAR: Sistema de notificaciones
      Muestra mensajes temporales al usuario
    -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="snackbarTimeout"
      location="bottom right"
      variant="elevated"
    >
      {{ snackbarText }}
      
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar = false"
          icon="mdi-close"
          size="small"
        />
      </template>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
/* ESTILOS ESPECÍFICOS DEL LAYOUT */
/* Transiciones entre páginas (comentado para producción - no usado actualmente) */
/*
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
*/
</style>
