<script setup>
// Importamos las funciones necesarias de Vue
// ref: para arrays y objetos reactivos
// computed: para cálculos automáticos basados en el estado del carrito
import { ref, computed } from 'vue'

// defineProps permite recibir datos del componente padre
// En este caso, recibimos la lista de productos para poder mostrar información completa
const props = defineProps({
  productos: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Estado del carrito: array que contiene los items agregados
// Cada item tendrá: { id, cantidad }
const itemsCarrito = ref([])

// Computed property para obtener el carrito con información completa de productos
// Esta función combina los IDs del carrito con la información completa de productos
const carritoCompleto = computed(() => {
  return itemsCarrito.value.map(item => {
    // Buscamos la información completa del producto
    const producto = props.productos.find(p => p.id === item.id)
    
    // Si no encontramos el producto, devolvemos información mínima
    if (!producto) {
      return {
        ...item,
        nombre: 'Producto no encontrado',
        precio: 0,
        subtotal: 0
      }
    }
    
    // Calculamos el subtotal para este item
    const subtotal = producto.precio * item.cantidad
    
    // Retornamos el item completo con toda la información
    return {
      ...item,
      ...producto,
      subtotal
    }
  })
})

// Computed property para calcular el total general del carrito
// Se recalcula automáticamente cada vez que cambia carritoCompleto
const totalCarrito = computed(() => {
  return carritoCompleto.value.reduce((total, item) => total + item.subtotal, 0)
})

// Computed property para contar la cantidad total de items
const cantidadTotalItems = computed(() => {
  return itemsCarrito.value.reduce((total, item) => total + item.cantidad, 0)
})

// Función para agregar un producto al carrito
// Esta función será llamada desde el componente padre cuando se emita el evento
const agregarProducto = (productoId) => {
  // Verificamos si el producto ya está en el carrito
  const itemExistente = itemsCarrito.value.find(item => item.id === productoId)
  
  if (itemExistente) {
    // Si ya existe, incrementamos la cantidad
    itemExistente.cantidad++
  } else {
    // Si no existe, lo agregamos con cantidad 1
    itemsCarrito.value.push({
      id: productoId,
      cantidad: 1
    })
  }
  
  console.log('🛒 Producto agregado al carrito. Total items:', cantidadTotalItems.value)
}

// Función para incrementar la cantidad de un item específico
const incrementarCantidad = (itemId) => {
  const item = itemsCarrito.value.find(i => i.id === itemId)
  if (item) {
    item.cantidad++
  }
}

// Función para decrementar la cantidad de un item específico
// Si la cantidad llega a 0, eliminamos el item del carrito
const decrementarCantidad = (itemId) => {
  const item = itemsCarrito.value.find(i => i.id === itemId)
  if (item) {
    item.cantidad--
    
    // Si la cantidad llega a 0, eliminamos el item del carrito
    if (item.cantidad <= 0) {
      eliminarItem(itemId)
    }
  }
}

// Función para eliminar completamente un item del carrito
const eliminarItem = (itemId) => {
  const index = itemsCarrito.value.findIndex(i => i.id === itemId)
  if (index > -1) {
    itemsCarrito.value.splice(index, 1)
    console.log('🗑️ Item eliminado del carrito')
  }
}

// Función para vaciar completamente el carrito
const vaciarCarrito = () => {
  if (itemsCarrito.value.length === 0) return
  
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    itemsCarrito.value = []
    console.log('🗑️ Carrito vaciado completamente')
  }
}

// Función para procesar la compra (simulada)
const procesarCompra = () => {
  if (itemsCarrito.value.length === 0) {
    alert('⚠️ El carrito está vacío')
    return
  }
  
  // Simulamos el procesamiento de la compra
  const resumenCompra = {
    items: carritoCompleto.value.map(item => ({
      producto: item.nombre,
      cantidad: item.cantidad,
      precio: item.precio,
      subtotal: item.subtotal
    })),
    total: totalCarrito.value,
    fecha: new Date().toISOString()
  }
  
  console.log('Procesando compra:', resumenCompra)
  alert(`¡Compra procesada exitosamente! Total: ${totalCarrito.value.toLocaleString('es-AR')}`)
  
  // Vaciamos el carrito después de la compra
  itemsCarrito.value = []
}

</script>

<template>
  <div class="carrito-container">
    <!-- Header del carrito con estadísticas -->
    <div class="carrito-header">
      <h3>🛒 Carrito de Compras</h3>
      <div class="carrito-stats">
        <span class="stat-badge">
          {{ cantidadTotalItems }} {{ cantidadTotalItems === 1 ? 'item' : 'items' }}
        </span>
      </div>
    </div>

    <!-- Lista de items del carrito -->
    <!-- v-if verifica que hay items antes de mostrar la lista -->
    <div v-if="itemsCarrito.length > 0" class="carrito-items">
      <!-- 
        Iteramos sobre carritoCompleto (no itemsCarrito) porque necesitamos
        la información completa del producto para mostrar nombre, precio, etc.
      -->
      <div 
        v-for="item in carritoCompleto" 
        :key="item.id"
        class="carrito-item"
      >
        <!-- Información del producto -->
        <div class="item-info">
          <h4 class="item-nombre">{{ item.nombre }}</h4>
          <p class="item-precio">
            ${{ item.precio.toLocaleString('es-AR') }} c/u
          </p>
        </div>

        <!-- Controles de cantidad -->
        <div class="item-controles">
          <!-- Botón decrementar -->
          <button 
            @click="decrementarCantidad(item.id)"
            class="btn-cantidad btn-decrementar"
            :title="item.cantidad === 1 ? 'Eliminar del carrito' : 'Reducir cantidad'"
          >
            {{ item.cantidad === 1 ? '🗑️' : '−' }}
          </button>
          
          <!-- Cantidad actual -->
          <span class="cantidad-display">{{ item.cantidad }}</span>
          
          <!-- Botón incrementar -->
          <button 
            @click="incrementarCantidad(item.id)"
            class="btn-cantidad btn-incrementar"
            title="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <!-- Subtotal del item -->
        <div class="item-subtotal">
          <strong>${{ item.subtotal.toLocaleString('es-AR') }}</strong>
        </div>

        <!-- Botón eliminar item completo -->
        <button 
          @click="eliminarItem(item.id)"
          class="btn-eliminar"
          title="Eliminar producto del carrito"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- Estado vacío cuando no hay items en el carrito -->
    <!-- v-else se ejecuta cuando la condición del v-if anterior es falsa -->
    <div v-else class="carrito-vacio">
      <div class="vacio-icon">🛒</div>
      <h4>Tu carrito está vacío</h4>
      <p>Agrega algunos productos para comenzar tu compra</p>
    </div>

    <!-- Resumen del carrito y acciones -->
    <!-- Solo se muestra si hay items en el carrito -->
    <div v-if="itemsCarrito.length > 0" class="carrito-resumen">
      <!-- Total general -->
      <div class="total-section">
        <div class="total-label">Total a pagar:</div>
        <div class="total-amount">
          ${{ totalCarrito.toLocaleString('es-AR') }}
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="carrito-acciones">
        <button 
          @click="vaciarCarrito"
          class="btn btn-outline btn-vaciar"
        >
          Vaciar Carrito
        </button>
        
        <button 
          @click="procesarCompra"
          class="btn btn-primary btn-comprar"
        >
          Procesar Compra
        </button>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="carrito-info">
      <small>💡 Tip: Usa los botones + y − para ajustar cantidades</small>
    </div>
  </div>
</template>

<style scoped>
    .carrito-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    /* Header del carrito */
    .carrito-header {
      background: #f8f9fa;
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .carrito-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }

    .carrito-stats {
      display: flex;
      gap: 0.5rem;
    }

    .stat-badge {
      background: #3498db;
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    /* Items del carrito */
    .carrito-items {
      max-height: 400px;
      overflow-y: auto;
    }

    .carrito-item {
      display: flex;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
      gap: 1rem;
      transition: background-color 0.2s ease;
    }

    .carrito-item:hover {
      background-color: #f8f9fa;
    }

    .carrito-item:last-child {
      border-bottom: none;
    }

    /* Información del item */
    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-nombre {
      margin: 0 0 0.3rem 0;
      font-size: 1rem;
      color: #2c3e50;
      font-weight: 600;
    }

    .item-precio {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    /* Controles de cantidad */
    .item-controles {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8f9fa;
      padding: 0.3rem;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .btn-cantidad {
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-decrementar {
      background: #e74c3c;
      color: white;
    }

    .btn-decrementar:hover {
      background: #c0392b;
    }

    .btn-incrementar {
      background: #27ae60;
      color: white;
    }

    .btn-incrementar:hover {
      background: #229954;
    }

    .cantidad-display {
      min-width: 30px;
      text-align: center;
      font-weight: bold;
      color: #2c3e50;
    }

    /* Subtotal del item */
    .item-subtotal {
      min-width: 100px;
      text-align: right;
      font-size: 1.1rem;
      color: #27ae60;
    }

    /* Botón eliminar */
    .btn-eliminar {
      width: 30px;
      height: 30px;
      border: none;
      background: #e74c3c;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-eliminar:hover {
      background: #c0392b;
      transform: scale(1.1);
    }

    /* Estado vacío */
    .carrito-vacio {
      text-align: center;
      padding: 3rem 2rem;
      color: #7f8c8d;
    }

    .vacio-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .carrito-vacio h4 {
      margin: 0 0 0.5rem 0;
      color: #95a5a6;
    }

    .carrito-vacio p {
      margin: 0;
      font-size: 0.9rem;
    }

    /* Resumen del carrito */
    .carrito-resumen {
      border-top: 2px solid #e9ecef;
      padding: 1.5rem;
      background: #f8f9fa;
    }

    .total-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      border: 2px solid #27ae60;
    }

    .total-label {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .total-amount {
      font-size: 1.5rem;
      font-weight: bold;
      color: #27ae60;
    }

    /* Botones de acción */
    .carrito-acciones {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      min-width: 140px;
    }

    .btn-primary {
      background: #27ae60;
      color: white;
    }

    .btn-primary:hover {
      background: #229954;
      transform: translateY(-2px);
    }

    .btn-outline {
      background: transparent;
      color: #e74c3c;
      border: 2px solid #e74c3c;
    }

    .btn-outline:hover {
      background: #e74c3c;
      color: white;
    }

    /* Información adicional */
    .carrito-info {
      padding: 1rem 1.5rem;
      background: #ecf0f1;
      border-top: 1px solid #bdc3c7;
    }

    .carrito-info small {
      color: #7f8c8d;
      font-size: 0.8rem;
    }

    /* Scrollbar personalizada para la lista de items */
    .carrito-items::-webkit-scrollbar {
      width: 6px;
    }

    .carrito-items::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .carrito-items::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .carrito-items::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    /* Responsividad */
    @media (max-width: 768px) {
      .carrito-item {
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .item-info {
        flex: 1 1 100%;
      }

      .item-controles {
        flex: 1 1 auto;
      }

      .item-subtotal {
        flex: 1 1 auto;
        text-align: left;
      }

      .carrito-acciones {
        flex-direction: column;
      }

      .total-section {
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
      }
    }
</style>