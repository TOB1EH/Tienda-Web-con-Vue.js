<script setup>
// Importamos las funciones necesarias de Vue
// ref: para variables reactivas simples
// computed: para valores calculados que se actualizan automáticamente
import { ref, computed } from 'vue'
// Importamos useRouter para navegación programática
import { useRouter } from 'vue-router'

// defineEmits: función especial de Vue que permite definir eventos que este componente puede emitir
// Los eventos son la forma de comunicación de hijos a padres en Vue
const emit = defineEmits(['add-to-cart'])

// Instancia del router para navegación
const router = useRouter()

// Base de datos simulada de productos
// En una aplicación real, estos datos vendrían de una API
const productos = ref([
  { id: 1, nombre: 'Laptop Gaming', precio: 150000, stock: 5 },
  { id: 2, nombre: 'Mouse Inalámbrico', precio: 2500, stock: 0 },
  { id: 3, nombre: 'Teclado Mecánico', precio: 8500, stock: 12 },
  { id: 4, nombre: 'Monitor 24"', precio: 45000, stock: 3 },
  { id: 5, nombre: 'Auriculares Gaming', precio: 12000, stock: 8 },
  { id: 6, nombre: 'Webcam HD', precio: 7500, stock: 0 },
  { id: 7, nombre: 'Silla Gamer', precio: 85000, stock: 2 },
  { id: 8, nombre: 'Mousepad XL', precio: 3500, stock: 15 }
])

// Variable reactiva para el término de búsqueda
// Se conectará con el input de búsqueda usando v-model
const busqueda = ref('')

// Computed property para filtrar productos
// computed() crea un valor que se recalcula automáticamente cuando sus dependencias cambian
// Es más eficiente que usar methods porque Vue cachea el resultado hasta que cambian las dependencias
const productosFiltrados = computed(() => {
  // Si no hay término de búsqueda, devolvemos todos los productos
  if (!busqueda.value.trim()) {
    return productos.value
  }
  
  // Filtramos productos por nombre (case-insensitive)
  // toLowerCase() asegura que la búsqueda no sea sensible a mayúsculas/minúsculas
  return productos.value.filter(producto => 
    producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase().trim())
  )
})

// Función para emitir evento de agregar al carrito
// Esta función se ejecuta cuando el usuario hace clic en "Agregar al carrito"
const agregarAlCarrito = (producto) => {
  // Verificamos que el producto tenga stock antes de agregarlo
  if (producto.stock <= 0) {
    alert('⚠️ Este producto no tiene stock disponible')
    return
  }
  
  // Emitimos un evento personalizado al componente padre
  // El padre puede escuchar este evento y manejar la lógica del carrito
  emit('add-to-cart', producto.id)
  
  // Log para debugging - en desarrollo es útil ver qué está pasando
  console.log('🛒 Producto agregado al carrito:', producto)
}


</script>

<template>
  <div class="productos-container">
    <!-- Sección de búsqueda -->
    <div class="search-section">
      <h2>Listado de Productos</h2>
      
      <!-- Input de búsqueda con v-model para binding bidireccional -->
      <!-- Cada vez que el usuario escribe, busqueda se actualiza y productosFiltrados se recalcula -->
      <div class="search-box">
        <input 
          type="text"
          v-model="busqueda"
          placeholder="Buscar productos por nombre..."
          class="search-input"
        >
      </div>
    </div>

    <!-- Lista de productos filtrados -->
    <!-- v-if verifica que hay productos para mostrar antes de renderizar la grilla -->
    <div v-if="productosFiltrados.length > 0" class="productos-grid">
      <!-- 
        v-for itera sobre el array de productos filtrados
        :key es OBLIGATORIO para el rendimiento y evitar bugs
        Vue usa la key para identificar únicamente cada elemento
      -->
      <div 
        v-for="producto in productosFiltrados" 
        :key="producto.id"
        class="producto-card"
      >
        <!-- Información del producto -->
        <div class="producto-info">
          <h3 class="producto-nombre">{{ producto.nombre }}</h3>
          
          <!-- Precio formateado con separadores de miles -->
          <p class="producto-precio">
            ${{ producto.precio.toLocaleString('es-AR') }}
          </p>
          
          <!-- 
            Indicador de stock con clase dinámica
            :class usa un array donde el segundo elemento es condicional
            Si stock > 0, aplica 'disponible', sino aplica 'agotado'
          -->
          <span 
            :class="['stock-badge', producto.stock > 0 ? 'disponible' : 'agotado']"
          >
            {{ producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado' }}
          </span>
        </div>

        <!-- Acciones del producto -->
        <div class="producto-acciones">
          <!-- Enlace para ver detalle -->
          <router-link
            :to="`/productos/${producto.id}`"
            class="btn btn-outline"
          >
            Ver Detalle
          </router-link>
          
          <!-- 
            Botón agregar al carrito con estado condicional
            :disabled se basa en el stock del producto
            El texto del botón también cambia según disponibilidad
          -->
          <button 
            @click="agregarAlCarrito(producto)"
            :disabled="producto.stock === 0"
            :class="['btn', producto.stock > 0 ? 'btn-primary' : 'btn-disabled']"
          >
            {{ producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Estado vacío cuando no hay resultados -->
    <!-- v-else se ejecuta cuando la condición del v-if anterior es falsa -->
    <div v-else class="empty-state">
      <!-- Mostramos diferentes mensajes según si hay búsqueda activa o no -->
      <div class="empty-icon">📭</div>
      <h3>No se encontraron productos</h3>
      <p>
        {{ busqueda.trim() 
          ? `No hay productos que coincidan con "${busqueda}"` 
          : 'No hay productos disponibles en este momento' 
        }}
      </p>
      
      <!-- Botón para limpiar búsqueda si hay término activo -->
      <button 
        v-if="busqueda.trim()" 
        @click="busqueda = ''"
        class="btn btn-outline"
      >
        Limpiar búsqueda
      </button>
    </div>

    <!-- Información de estadísticas -->
    <div class="stats-section">
      <div class="stats-item">
        <span class="stats-label">Total productos:</span>
        <span class="stats-value">{{ productos.length }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">Mostrando:</span>
        <span class="stats-value">{{ productosFiltrados.length }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">Con stock:</span>
        <span class="stats-value">
          {{ productosFiltrados.filter(p => p.stock > 0).length }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
    .productos-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    /* Sección de búsqueda */
    .search-section {
      margin-bottom: 2rem;
    }

    .search-section h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.8rem;
    }

    .search-box {
      position: relative;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1.5rem;
      font-size: 1.1rem;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      background: white;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .search-input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    /* Grid de productos */
    .productos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .producto-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .producto-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .producto-info {
      margin-bottom: 1.5rem;
    }

    .producto-nombre {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .producto-precio {
      font-size: 1.3rem;
      font-weight: bold;
      color: #27ae60;
      margin: 0.5rem 0;
    }

    /* Badges de stock */
    .stock-badge {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stock-badge.disponible {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .stock-badge.agotado {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* Acciones del producto */
    .producto-acciones {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Botones */
    .btn {
      padding: 0.7rem 1.2rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      flex: 1;
      min-width: 120px;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
      transform: translateY(-2px);
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

    .btn-disabled {
      background: #bdc3c7;
      color: #7f8c8d;
      cursor: not-allowed;
    }

    .btn:disabled {
      cursor: not-allowed;
      transform: none;
    }

    /* Estado vacío */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      margin: 2rem 0;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    .empty-state p {
      color: #7f8c8d;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    /* Sección de estadísticas */
    .stats-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .stats-item {
      text-align: center;
      min-width: 120px;
    }

    .stats-label {
      display: block;
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .stats-value {
      display: block;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: bold;
    }

    /* Responsividad */
    @media (max-width: 768px) {
      .productos-container {
        padding: 1rem;
      }

      .productos-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .producto-acciones {
        flex-direction: column;
      }

      .stats-section {
        flex-direction: column;
        gap: 1rem;
      }
    }
</style>