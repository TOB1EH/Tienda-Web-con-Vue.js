<script setup>
// Importamos funciones necesarias de Vue y Vue Router
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// HOOK DE COMPOSICIÓN useRoute(): 
// Nos da acceso a la información de la ruta actual
// Similar a this.$route en Options API
const route = useRoute()

// HOOK DE COMPOSICIÓN useRouter():
// Nos da acceso al objeto router para navegación programática
// Similar a this.$router en Options API
const router = useRouter()

// Props recibidos desde la configuración del router (props: true)
// El parámetro :id de la URL se pasa automáticamente como prop
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

// Estado local del componente
const producto = ref(null)
const cargando = ref(true)
const error = ref(null)

// Simulamos una base de datos de productos
// En una aplicación real, esto vendría de una API
const baseDatosProductos = [
  { 
    id: 1, 
    nombre: 'Laptop Gaming', 
    precio: 150000, 
    stock: 5,
    descripcion: 'Laptop de alta gama para gaming con procesador Intel i7, 16GB RAM, SSD 512GB y tarjeta gráfica RTX 3070.',
    categoria: 'Computadoras',
    marca: 'TechPro',
    especificaciones: {
      procesador: 'Intel Core i7-11800H',
      memoria: '16GB DDR4',
      almacenamiento: '512GB SSD NVMe',
      pantalla: '15.6" Full HD 144Hz',
      grafica: 'NVIDIA RTX 3070 8GB'
    },
    imagenes: [
      'https://via.placeholder.com/400x300/667eea/white?text=Laptop+Gaming',
      'https://via.placeholder.com/400x300/764ba2/white?text=Vista+Lateral',
      'https://via.placeholder.com/400x300/f093fb/white?text=Teclado'
    ]
  },
  { 
    id: 2, 
    nombre: 'Mouse Inalámbrico', 
    precio: 2500, 
    stock: 0,
    descripcion: 'Mouse inalámbrico ergonómico con sensor óptico de alta precisión y batería de larga duración.',
    categoria: 'Periféricos',
    marca: 'TechPro',
    especificaciones: {
      conectividad: 'Bluetooth 5.0 / USB 2.4GHz',
      sensor: 'Óptico 1600 DPI',
      bateria: 'Hasta 12 meses',
      botones: '6 botones programables',
      compatibilidad: 'Windows, Mac, Linux'
    },
    imagenes: [
      'https://via.placeholder.com/400x300/27ae60/white?text=Mouse+Wireless'
    ]
  },
  { 
    id: 3, 
    nombre: 'Teclado Mecánico', 
    precio: 8500, 
    stock: 12,
    descripcion: 'Teclado mecánico con switches azules, retroiluminación RGB y diseño compacto para gaming profesional.',
    categoria: 'Periféricos',
    marca: 'GamerTech',
    especificaciones: {
      switches: 'Cherry MX Blue',
      iluminacion: 'RGB personalizable',
      formato: 'TKL (Sin numpad)',
      material: 'Aluminio anodizado',
      cables: 'USB-C extraíble'
    },
    imagenes: [
      'https://via.placeholder.com/400x300/e74c3c/white?text=Teclado+RGB'
    ]
  }
]

// Computed property para convertir el ID a número
const productoId = computed(() => parseInt(props.id))

// Función para cargar los datos del producto
const cargarProducto = async () => {
  cargando.value = true
  error.value = null
  
  try {
    // Simulamos una llamada a API con delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Buscamos el producto en nuestra "base de datos"
    const productoEncontrado = baseDatosProductos.find(p => p.id === productoId.value)
    
    if (!productoEncontrado) {
      throw new Error(`Producto con ID ${productoId.value} no encontrado`)
    }
    
    producto.value = productoEncontrado
    console.log('📦 Producto cargado:', productoEncontrado)
    
  } catch (err) {
    error.value = err.message
    console.error('❌ Error cargando producto:', err)
  } finally {
    cargando.value = false
  }
}

// Función para volver a la lista de productos
const volverAProductos = () => {
  // Navegación programática usando router.push()
  // Documentación: https://router.vuejs.org/guide/essentials/navigation.html
  router.push('/productos')
}

// Función para navegar al siguiente producto
const navegarASiguiente = () => {
  const siguienteId = productoId.value + 1
  const siguienteProducto = baseDatosProductos.find(p => p.id === siguienteId)
  
  if (siguienteProducto) {
    router.push(`/productos/${siguienteId}`)
  } else {
    // Si no hay siguiente, ir al primer producto
    router.push(`/productos/1`)
  }
}

// Función para navegar al producto anterior
const navegarAAnterior = () => {
  const anteriorId = productoId.value - 1
  const anteriorProducto = baseDatosProductos.find(p => p.id === anteriorId)
  
  if (anteriorProducto) {
    router.push(`/productos/${anteriorId}`)
  } else {
    // Si no hay anterior, ir al último producto
    const ultimoId = Math.max(...baseDatosProductos.map(p => p.id))
    router.push(`/productos/${ultimoId}`)
  }
}

import cartStore from '@/store/cart.js'

// Función para agregar al carrito
const agregarAlCarrito = () => {
  if (!producto.value) return
  
  if (producto.value.stock <= 0) {
    alert('⚠️ Este producto no tiene stock disponible')
    return
  }
  
  // Actualizamos el store global del carrito
  cartStore.agregarProducto(producto.value)
  
  alert(`✅ ${producto.value.nombre} agregado al carrito`)
  console.log('🛒 Agregando al carrito:', producto.value)
}

// Watcher: observa cambios en el ID de la ruta
// Esto es útil cuando navegamos de un producto a otro sin salir del componente
watch(
  () => props.id,
  (nuevoId, idAnterior) => {
    console.log(`🔄 ID cambió de ${idAnterior} a ${nuevoId}`)
    cargarProducto()
  },
  { immediate: true } // Ejecutar inmediatamente al montar el componente
)

// Hook de ciclo de vida: se ejecuta cuando el componente se monta
onMounted(() => {
  console.log(`🚀 Componente ProductoDetalle montado para ID: ${props.id}`)
  
  // cargarProducto() ya se ejecuta por el watcher con immediate: true
  // pero lo dejamos aquí como backup por si el watcher falla
})

// Meta información para SEO (se podría usar con un plugin)
const metaInfo = computed(() => {
  if (!producto.value) return {}
  
  return {
    title: `${producto.value.nombre} - TiendaVue`,
    description: producto.value.descripcion,
    keywords: `${producto.value.nombre}, ${producto.value.categoria}, ${producto.value.marca}`
  }
})
</script>

<template>
  <div class="producto-detalle">
    
    <!-- Navegación breadcrumb -->
    <nav class="breadcrumb">
      <button @click="volverAProductos" class="breadcrumb-link">
        ← Productos
      </button>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">
        {{ cargando ? 'Cargando...' : (producto ? producto.nombre : 'Producto no encontrado') }}
      </span>
    </nav>

    <!-- Estado de carga -->
    <div v-if="cargando" class="loading-state">
      <div class="loading-spinner"></div>
      <h3>Cargando producto...</h3>
      <p>Por favor espere mientras obtenemos la información</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h3>Producto no encontrado</h3>
      <p>{{ error }}</p>
      <div class="error-actions">
        <button @click="volverAProductos" class="btn btn-primary">
          Ver todos los productos
        </button>
        <button @click="cargarProducto" class="btn btn-outline">
          Intentar nuevamente
        </button>
      </div>
    </div>

    <!-- Contenido del producto -->
    <div v-else-if="producto" class="producto-content">
      
      <!-- Información principal del producto -->
      <div class="producto-main">
        
        <!-- Galería de imágenes -->
        <div class="producto-images">
          <div class="image-main">
            <img :src="producto.imagenes[0]" :alt="producto.nombre" />
          </div>
          <!-- Thumbnails de imágenes adicionales -->
          <div v-if="producto.imagenes.length > 1" class="image-thumbnails">
            <img 
              v-for="(imagen, index) in producto.imagenes" 
              :key="index"
              :src="imagen" 
              :alt="`${producto.nombre} - Vista ${index + 1}`"
              class="thumbnail"
            />
          </div>
        </div>

        <!-- Información del producto -->
        <div class="producto-info">
          <div class="producto-header">
            <h1>{{ producto.nombre }}</h1>
            <div class="producto-meta">
              <span class="categoria">{{ producto.categoria }}</span>
              <span class="marca">{{ producto.marca }}</span>
            </div>
          </div>

          <div class="producto-precio">
            <span class="precio-actual">${{ producto.precio.toLocaleString('es-AR') }}</span>
          </div>

          <!-- Estado del stock -->
          <div class="producto-stock">
            <div :class="['stock-indicator', producto.stock > 0 ? 'disponible' : 'agotado']">
              {{ producto.stock > 0 ? `✅ ${producto.stock} disponibles` : '❌ Sin stock' }}
            </div>
          </div>

          <!-- Descripción -->
          <div class="producto-descripcion">
            <h3>Descripción</h3>
            <p>{{ producto.descripcion }}</p>
          </div>

          <!-- Acciones -->
          <div class="producto-acciones">
            <button 
              @click="agregarAlCarrito"
              :disabled="producto.stock <= 0"
              :class="['btn-agregar', producto.stock > 0 ? 'btn-primary' : 'btn-disabled']"
            >
              {{ producto.stock > 0 ? '🛒 Agregar al Carrito' : 'Sin Stock' }}
            </button>
            
            <button @click="volverAProductos" class="btn btn-outline">
              Ver más productos
            </button>
          </div>
        </div>
      </div>

      <!-- Especificaciones técnicas -->
      <div class="producto-specs">
        <h3>🔧 Especificaciones Técnicas</h3>
        <div class="specs-grid">
          <div 
            v-for="(valor, clave) in producto.especificaciones" 
            :key="clave"
            class="spec-item"
          >
            <div class="spec-label">{{ clave.charAt(0).toUpperCase() + clave.slice(1) }}:</div>
            <div class="spec-value">{{ valor }}</div>
          </div>
        </div>
      </div>

      <!-- Navegación entre productos -->
      <div class="producto-navegacion">
        <h3>🔄 Explorar productos</h3>
        <div class="nav-buttons">
          <button @click="navegarAAnterior" class="nav-btn">
            ← Producto Anterior
          </button>
          <button @click="navegarASiguiente" class="nav-btn">
            Producto Siguiente →
          </button>
        </div>
      </div>

      <!-- Debug info (solo en desarrollo) -->
      <!--
      <div class="debug-info">
        <h4>🔧 Información de Debug</h4>
        <div class="debug-grid">
          <div><strong>ID Ruta:</strong> {{ route.params.id }}</div>
          <div><strong>ID Procesado:</strong> {{ productoId }}</div>
          <div><strong>Path Completo:</strong> {{ route.path }}</div>
          <div><strong>Query Params:</strong> {{ JSON.stringify(route.query) }}</div>
        </div>
      </div>
    -->
    </div>
  </div>
</template>

<style scoped>
    .producto-detalle {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    /* Breadcrumb navigation */
    .breadcrumb {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 0.95rem;
    }

    .breadcrumb-link {
      background: none;
      border: none;
      color: #3498db;
      cursor: pointer;
      font-size: 0.95rem;
      transition: color 0.3s ease;
    }

    .breadcrumb-link:hover {
      color: #2980b9;
      text-decoration: underline;
    }

    .breadcrumb-separator {
      margin: 0 0.5rem;
      color: #7f8c8d;
    }

    .breadcrumb-current {
      color: #2c3e50;
      font-weight: 500;
    }

    /* Estados de carga y error */
    .loading-state,
    .error-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 2rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    /* Contenido principal del producto */
    .producto-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }

    /* Imágenes */
    .producto-images {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .image-main {
      aspect-ratio: 4/3;
      overflow: hidden;
      border-radius: 12px;
      border: 1px solid #e1e5e9;
    }

    .image-main img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-thumbnails {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }

    .thumbnail {
      width: 80px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
      cursor: pointer;
      border: 2px solid transparent;
      transition: border-color 0.3s ease;
    }

    .thumbnail:hover {
      border-color: #3498db;
    }

    /* Información del producto */
    .producto-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .producto-header h1 {
      margin: 0 0 0.5rem 0;
      color: #2c3e50;
      font-size: 2rem;
      font-weight: 700;
    }

    .producto-meta {
      display: flex;
      gap: 1rem;
    }

    .categoria,
    .marca {
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .categoria {
      background: #e3f2fd;
      color: #1976d2;
    }

    .marca {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .producto-precio {
      font-size: 2rem;
      font-weight: bold;
      color: #27ae60;
      margin: 1rem 0;
    }

    .stock-indicator {
      padding: 0.8rem 1.2rem;
      border-radius: 8px;
      font-weight: 600;
      text-align: center;
    }

    .stock-indicator.disponible {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .stock-indicator.agotado {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .producto-descripcion h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .producto-descripcion p {
      line-height: 1.6;
      color: #5d6d7e;
    }

    /* Acciones */
    .producto-acciones {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-agregar {
      padding: 1rem 2rem;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #27ae60;
      color: white;
    }

    .btn-primary:hover {
      background: #229954;
      transform: translateY(-2px);
    }

    .btn-disabled {
      background: #bdc3c7;
      color: #7f8c8d;
      cursor: not-allowed;
    }

    .btn {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-outline {
      background: transparent;
      color: #3498db;
      border: 2px solid #3498db;
    }

    .btn-outline:hover {
      background: #3498db;
      color: white;
    }

    /* Especificaciones */
    .produto-specs {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .produto-specs h3 {
      margin-bottom: 1.5rem;
      color: #2c3e50;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .spec-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #3498db;
    }

    .spec-label {
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.3rem;
    }

    .spec-value {
      color: #5d6d7e;
    }

    /* Navegación entre productos */
    .producto-navegacion {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      text-align: center;
    }

    .nav-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1rem;
    }

    .nav-btn {
      padding: 0.8rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .nav-btn:hover {
      background: #2980b9;
      transform: translateY(-2px);
    }

    /* Debug info */
    .debug-info {
      background: #2c3e50;
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
    }

    .debug-info h4 {
      margin-bottom: 1rem;
      color: #ecf0f1;
    }

    .debug-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .debug-grid div {
      background: #34495e;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.85rem;
    }

    /* Responsividad */
    @media (max-width: 768px) {
      .producto-detalle {
        padding: 1rem;
      }

      .producto-main {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .producto-header h1 {
        font-size: 1.5rem;
      }

      .producto-precio {
        font-size: 1.5rem;
      }

      .specs-grid {
        grid-template-columns: 1fr;
      }

      .nav-buttons {
        flex-direction: column;
      }

      .error-actions {
        flex-direction: column;
        align-items: center;
      }

      .breadcrumb {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 480px) {
      .producto-main {
        gap: 1.5rem;
      }

      .producto-acciones {
        gap: 0.75rem;
      }

      .btn-agregar,
      .btn {
        padding: 0.8rem 1rem;
        font-size: 1rem;
      }
    }
</style>