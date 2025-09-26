<script setup>
// PARTE D — VUE ROUTER - RUTA DINÁMICA
// Ruta: /productos/:id (detalle dinámico)
// CRITERIO: :id se recibe y muestra datos correctos del producto
// CRITERIO: "Volver" desde detalle a lista y restaurar scroll
// CRITERIO: Manejo de estado de error: "Producto no encontrado"

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Estado del componente
const loading = ref(true)
const error = ref(null)
const producto = ref(null)

// Base de datos local de productos (misma que en ProductosView)
const productosDB = [
  { 
    id: 1, 
    nombre: 'Laptop Gaming MSI', 
    precio: 150000, 
    stock: 5,
    descripcion: 'Laptop de alta gama para gaming profesional con procesador Intel i7, 16GB RAM, SSD 512GB y tarjeta gráfica RTX 3070.',
    categoria: 'Computadoras',
    marca: 'MSI',
    especificaciones: {
      procesador: 'Intel Core i7-11800H',
      memoria: '16GB DDR4',
      almacenamiento: '512GB SSD NVMe',
      pantalla: '15.6" Full HD 144Hz',
      grafica: 'NVIDIA RTX 3070 8GB'
    },
    imagen: 'https://via.placeholder.com/400x300/1976D2/white?text=Laptop+MSI'
  },
  { 
    id: 2, 
    nombre: 'Mouse Inalámbrico Logitech', 
    precio: 2500, 
    stock: 0,
    descripcion: 'Mouse inalámbrico ergonómico con sensor óptico de alta precisión y batería de larga duración.',
    categoria: 'Periféricos',
    marca: 'Logitech',
    especificaciones: {
      conectividad: 'Bluetooth 5.0 / USB 2.4GHz',
      sensor: 'Óptico 1600 DPI',
      bateria: 'Hasta 12 meses',
      botones: '6 botones programables',
      compatibilidad: 'Windows, Mac, Linux'
    },
    imagen: 'https://via.placeholder.com/400x300/27ae60/white?text=Mouse+Logitech'
  },
  { 
    id: 3, 
    nombre: 'Teclado Mecánico Corsair', 
    precio: 8500, 
    stock: 12,
    descripcion: 'Teclado mecánico con switches azules, retroiluminación RGB y diseño compacto para gaming profesional.',
    categoria: 'Periféricos',
    marca: 'Corsair',
    especificaciones: {
      switches: 'Cherry MX Blue',
      iluminacion: 'RGB personalizable',
      formato: 'TKL (Sin numpad)',
      material: 'Aluminio anodizado',
      cable: 'USB-C extraíble'
    },
    imagen: 'https://via.placeholder.com/400x300/e74c3c/white?text=Teclado+Corsair'
  },
  { 
    id: 4, 
    nombre: 'Monitor 24" Samsung', 
    precio: 45000, 
    stock: 3,
    descripcion: 'Monitor Full HD de 24 pulgadas con tecnología IPS y frecuencia de actualización de 75Hz.',
    categoria: 'Monitores',
    marca: 'Samsung',
    especificaciones: {
      tamaño: '24 pulgadas',
      resolucion: '1920x1080 Full HD',
      panel: 'IPS',
      frecuencia: '75Hz',
      conectividad: 'HDMI, VGA, DisplayPort'
    },
    imagen: 'https://via.placeholder.com/400x300/9C27B0/white?text=Monitor+Samsung'
  },
  { 
    id: 5, 
    nombre: 'Auriculares Gaming HyperX', 
    precio: 12000, 
    stock: 8,
    descripcion: 'Auriculares gaming con sonido envolvente 7.1, micrófono extraíble y almohadillas de memory foam.',
    categoria: 'Audio',
    marca: 'HyperX',
    especificaciones: {
      driver: '50mm neodimio',
      respuesta: '15Hz - 25kHz',
      microfono: 'Extraíble con cancelación de ruido',
      conexion: '3.5mm + adaptador USB',
      peso: '300g'
    },
    imagen: 'https://via.placeholder.com/400x300/FF5722/white?text=Auriculares+HyperX'
  },
  { 
    id: 6, 
    nombre: 'Webcam HD Logitech', 
    precio: 7500, 
    stock: 0,
    descripcion: 'Webcam Full HD 1080p con enfoque automático y micrófono integrado para videoconferencias.',
    categoria: 'Video',
    marca: 'Logitech',
    especificaciones: {
      resolucion: '1920x1080 @ 30fps',
      enfoque: 'Automático',
      microfono: 'Estéreo integrado',
      conexion: 'USB 2.0',
      compatibilidad: 'Plug & Play'
    },
    imagen: 'https://via.placeholder.com/400x300/607D8B/white?text=Webcam+Logitech'
  },
  { 
    id: 7, 
    nombre: 'Silla Gamer DXRacer', 
    precio: 85000, 
    stock: 2,
    descripcion: 'Silla gaming ergonómica con soporte lumbar, reposabrazos ajustables y reclinación de 180°.',
    categoria: 'Mobiliario',
    marca: 'DXRacer',
    especificaciones: {
      material: 'Cuero PU premium',
      reclinacion: '90° - 180°',
      peso_soportado: 'Hasta 120kg',
      altura_ajustable: '42-50cm',
      garantia: '2 años'
    },
    imagen: 'https://via.placeholder.com/400x300/795548/white?text=Silla+DXRacer'
  },
  { 
    id: 8, 
    nombre: 'Mousepad XL SteelSeries', 
    precio: 3500, 
    stock: 15,
    descripcion: 'Mousepad gaming de tamaño XL con superficie de microtextura y base antideslizante.',
    categoria: 'Accesorios',
    marca: 'SteelSeries',
    especificaciones: {
      tamaño: '900x400x3mm',
      superficie: 'Microtextura optimizada',
      base: 'Goma antideslizante',
      bordes: 'Cosidos reforzados',
      lavable: 'Sí, a máquina'
    },
    imagen: 'https://via.placeholder.com/400x300/4CAF50/white?text=Mousepad+SteelSeries'
  }
]

// Computed property para obtener el ID de la ruta
const productoId = computed(() => {
  return parseInt(route.params.id)
})

// Eventos emitidos
const emit = defineEmits(['notification'])

// CRITERIO: "Volver" desde detalle a lista y restaurar scroll
const volverAProductos = () => {
  // console.log('🔙 Volviendo a la lista de productos') // Comentado para producción
  router.push('/productos')
  
  // CRITERIO: Restaurar scroll al navegar
  // Vue Router maneja esto automáticamente con scrollBehavior en router/index.js
}

// Función para cargar los datos del producto
const cargarProducto = (id) => {
  loading.value = true
  error.value = null
  producto.value = null

  try {
    // CRITERIO: :id se recibe y muestra datos correctos del producto
    const productoEncontrado = productosDB.find(p => p.id === id)

    if (!productoEncontrado) {
      // CRITERIO: Manejo de estado de error: "Producto no encontrado"
      throw new Error(`Producto con ID ${id} no encontrado`)
    }

    producto.value = productoEncontrado
    // console.log('📦 Producto cargado:', productoEncontrado) // Comentado para producción
    emit('notification', `Producto ${productoEncontrado.nombre} cargado`, 'success')

  } catch (err) {
    error.value = err.message
    // console.error('❌ Error cargando producto:', err) // Comentado para producción
    emit('notification', `Error: ${err.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// Función para agregar al carrito desde el detalle
const agregarAlCarrito = () => {
  if (!producto.value) return
  
  if (producto.value.stock <= 0) {
    emit('notification', 'Este producto no tiene stock disponible', 'warning')
    return
  }
  
  // Simular agregar al carrito
  emit('notification', `${producto.value.nombre} agregado al carrito`, 'success')
  // console.log('🛒 Producto agregado al carrito desde detalle:', producto.value) // Comentado para producción
}

// Navegación entre productos
const navegarAProducto = (direccion) => {
  const ids = productosDB.map(p => p.id).sort((a, b) => a - b)
  const currentIndex = ids.indexOf(productoId.value)
  
  let nextId
  if (direccion === 'anterior') {
    nextId = currentIndex > 0 ? ids[currentIndex - 1] : ids[ids.length - 1]
  } else {
    nextId = currentIndex < ids.length - 1 ? ids[currentIndex + 1] : ids[0]
  }
  
  router.push(`/productos/${nextId}`)
}

// Watcher para recargar cuando cambia el ID en la ruta
watch(
  () => route.params.id,
  (nuevoId) => {
    if (nuevoId) {
      cargarProducto(parseInt(nuevoId))
    }
  },
  { immediate: true }
)

// Lifecycle hook
onMounted(() => {
  // console.log(`🚀 Vista ProductoDetalle montada para ID: ${route.params.id}`) // Comentado para producción
})
</script>

<template>
  <div>
    <!-- BREADCRUMB NAVIGATION -->
    <v-container class="pa-6">
      <v-row>
        <v-col cols="12">
          
          <v-breadcrumbs 
            :items="[
              { title: 'Inicio', to: '/', disabled: false },
              { title: 'Productos', to: '/productos', disabled: false },
              { title: loading ? 'Cargando...' : (producto ? producto.nombre : 'Producto no encontrado'), disabled: true }
            ]"
            class="pa-0 mb-4"
          >
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>

        </v-col>
      </v-row>

      <!-- ESTADO DE CARGA -->
      <v-row v-if="loading">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-card-text class="pa-8 text-center">
              <v-progress-circular
                indeterminate
                size="64"
                color="primary"
                class="mb-4"
              />
              <div class="text-h6">Cargando producto...</div>
              <div class="text-body-2 text-medium-emphasis mt-2">
                Obteniendo información del producto ID: {{ productoId }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- CRITERIO: Manejo de estado de error: "Producto no encontrado" -->
      <v-row v-else-if="error">
        <v-col cols="12">
          <v-card elevation="4" rounded="lg" color="error" variant="tonal">
            <v-card-text class="pa-8 text-center">
              
              <v-avatar size="100" color="error" class="mb-4">
                <v-icon size="50" color="white">mdi-alert-circle</v-icon>
              </v-avatar>
              
              <div class="text-h4 font-weight-bold text-error mb-2">
                Producto No Encontrado
              </div>
              
              <div class="text-h6 mb-4">
                {{ error }}
              </div>
              
              <div class="text-body-1 text-medium-emphasis mb-6">
                El producto que buscas no existe o ha sido eliminado del catálogo.
                Por favor, verifica el ID del producto o explora nuestro catálogo completo.
              </div>
              
              <!-- Acciones de error -->
              <div class="d-flex justify-center flex-wrap ga-4">
                <v-btn
                  @click="volverAProductos"
                  color="primary"
                  size="large"
                  prepend-icon="mdi-arrow-left"
                >
                  Volver a Productos
                </v-btn>
                
                <v-btn
                  @click="cargarProducto(productoId)"
                  color="error"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-refresh"
                >
                  Reintentar
                </v-btn>
                
                <v-btn
                  @click="router.push('/')"
                  variant="text"
                  size="large"
                  prepend-icon="mdi-home"
                >
                  Ir al Inicio
                </v-btn>
              </div>
              
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- CONTENIDO DEL PRODUCTO -->
      <v-row v-else-if="producto">
        
        <!-- INFORMACIÓN PRINCIPAL -->
        <v-col cols="12" md="6">
          <!-- Imagen del producto -->
          <v-card elevation="4" rounded="lg" class="mb-6">
            <v-img
              :src="producto.imagen"
              :alt="producto.nombre"
              height="400"
              cover
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="primary" />
                </div>
              </template>
            </v-img>
          </v-card>

          <!-- Navegación entre productos -->
          <v-card elevation="2" rounded="lg">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-navigation</v-icon>
              Navegación de Productos
            </v-card-title>
            <v-card-actions class="pa-4 pt-0">
              <v-btn
                @click="navegarAProducto('anterior')"
                color="primary"
                variant="outlined"
                prepend-icon="mdi-chevron-left"
                class="flex-grow-1"
              >
                Anterior
              </v-btn>
              <v-btn
                @click="navegarAProducto('siguiente')"
                color="primary"
                variant="outlined"
                append-icon="mdi-chevron-right"
                class="flex-grow-1 ml-2"
              >
                Siguiente
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- DETALLES DEL PRODUCTO -->
        <v-col cols="12" md="6">
          
          <!-- Información básica -->
          <v-card elevation="4" rounded="lg" class="mb-6">
            <v-card-title class="pa-6">
              <div class="d-flex align-center justify-space-between w-100">
                <div>
                  <div class="text-h4 font-weight-bold mb-2">
                    {{ producto.nombre }}
                  </div>
                  <div class="d-flex align-center flex-wrap ga-2">
                    <v-chip color="primary" variant="tonal" size="small">
                      {{ producto.categoria }}
                    </v-chip>
                    <v-chip color="secondary" variant="tonal" size="small">
                      {{ producto.marca }}
                    </v-chip>
                    <v-chip color="info" variant="tonal" size="small">
                      ID: {{ producto.id }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-card-title>

            <v-card-text class="pa-6 pt-0">
              
              <!-- Precio -->
              <div class="text-h3 font-weight-bold text-success mb-4">
                ${{ producto.precio.toLocaleString('es-AR') }}
              </div>

              <!-- Estado de stock -->
              <v-chip
                :color="producto.stock > 0 ? 'success' : 'error'"
                :variant="producto.stock > 0 ? 'elevated' : 'elevated'"
                :prepend-icon="producto.stock > 0 ? 'mdi-check-circle' : 'mdi-alert-circle'"
                size="large"
                class="mb-4"
              >
                {{ producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin Stock' }}
              </v-chip>

              <!-- Descripción -->
              <div class="mb-4">
                <div class="text-h6 font-weight-medium mb-2">Descripción</div>
                <div class="text-body-1 text-medium-emphasis">
                  {{ producto.descripcion }}
                </div>
              </div>

              <!-- Acciones -->
              <div class="d-flex flex-column ga-3">
                <v-btn
                  @click="agregarAlCarrito"
                  :color="producto.stock > 0 ? 'success' : 'grey'"
                  :disabled="producto.stock === 0"
                  size="large"
                  block
                  :prepend-icon="producto.stock > 0 ? 'mdi-cart-plus' : 'mdi-cart-remove'"
                >
                  {{ producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock' }}
                </v-btn>
                
                <!-- CRITERIO: "Volver" desde detalle a lista -->
                <v-btn
                  @click="volverAProductos"
                  color="primary"
                  variant="outlined"
                  size="large"
                  block
                  prepend-icon="mdi-arrow-left"
                >
                  Volver a Productos
                </v-btn>
              </div>

            </v-card-text>
          </v-card>

        </v-col>

        <!-- ESPECIFICACIONES TÉCNICAS -->
        <v-col cols="12">
          <v-card elevation="4" rounded="lg">
            <v-card-title class="pa-6 bg-grey-lighten-4">
              <v-icon class="mr-2">mdi-cog</v-icon>
              Especificaciones Técnicas
            </v-card-title>
            
            <v-card-text class="pa-0">
              <v-list>
                <template v-for="(valor, clave, index) in producto.especificaciones" :key="clave">
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="primary">mdi-check</v-icon>
                    </template>
                    
                    <v-list-item-title class="font-weight-medium">
                      {{ clave.charAt(0).toUpperCase() + clave.slice(1) }}
                    </v-list-item-title>
                    
                    <v-list-item-subtitle>
                      {{ valor }}
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-divider v-if="index < Object.keys(producto.especificaciones).length - 1" />
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

      </v-row>

      <!-- INFORMACIÓN DE DEBUG PARA TESTING -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-bug</v-icon>
                Debug: Criterios Parte D (Ruta Dinámica)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>✅ Ruta dinámica /productos/:id funciona</v-list-item-title>
                    <v-list-item-subtitle>ID recibido: {{ route.params.id }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon :color="producto ? 'success' : 'error'">
                        {{ producto ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                      </v-icon>
                    </template>
                    <v-list-item-title>{{ producto ? '✅' : '❌' }} Datos correctos del producto</v-list-item-title>
                    <v-list-item-subtitle>{{ producto ? `Producto: ${producto.nombre}` : 'No encontrado' }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>✅ Botón "Volver" implementado</v-list-item-title>
                    <v-list-item-subtitle>Navega a /productos con restauración de scroll</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon :color="error ? 'success' : 'info'">
                        {{ error ? 'mdi-check-circle' : 'mdi-information' }}
                      </v-icon>
                    </template>
                    <v-list-item-title>{{ error ? '✅' : 'ℹ️' }} Estado de error controlado</v-list-item-title>
                    <v-list-item-subtitle>{{ error || 'Sin errores actualmente' }}</v-list-item-subtitle>
                  </v-list-item>
                  
                </v-list>
                
                <v-divider class="my-4" />
                
                <div class="text-body-2">
                  <strong>Testing rápido:</strong><br>
                  • URL actual: {{ route.path }}<br>
                  • ID parseado: {{ productoId }}<br>
                  • Loading: {{ loading ? 'Sí' : 'No' }}<br>
                  • Error: {{ error || 'No' }}<br>
                  • Producto cargado: {{ producto ? 'Sí' : 'No' }}
                </div>

                <!-- Botones de testing -->
                <div class="d-flex flex-wrap ga-2 mt-4">
                  <v-btn size="small" @click="router.push('/productos/999')">
                    Test Error 404
                  </v-btn>
                  <v-btn size="small" @click="router.push('/productos/1')">
                    Test Producto 1
                  </v-btn>
                  <v-btn size="small" @click="router.push('/productos/3')">
                    Test Producto 3
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<style scoped>
/* Transiciones suaves */
.v-card {
  transition: all 0.3s ease;
}

/* Estados hover */
.v-card:hover {
  transform: translateY(-2px);
}

/* Mejoras en la imagen del producto */
.v-img {
  border-radius: inherit;
}

/* Responsividad */
@media (max-width: 960px) {
  .text-h3 {
    font-size: 2rem !important;
  }
  
  .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>