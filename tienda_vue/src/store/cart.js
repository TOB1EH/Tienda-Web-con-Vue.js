import { reactive, readonly } from 'vue'

// Estado reactivo para el carrito
const state = reactive({
  productos: []
})

// Función para agregar un producto al carrito
function agregarProducto(producto) {
  const productoExistente = state.productos.find(p => p.id === producto.id)
  if (productoExistente) {
    productoExistente.cantidad += 1
  } else {
    state.productos.push({ ...producto, cantidad: 1 })
  }
}

// Función para eliminar un producto del carrito
function eliminarProducto(productoId) {
  const index = state.productos.findIndex(p => p.id === productoId)
  if (index !== -1) {
    state.productos.splice(index, 1)
  }
}

// Función para limpiar el carrito
function limpiarCarrito() {
  state.productos = []
}

// Exportamos el estado y funciones como solo lectura para evitar modificaciones directas
export default {
  state: readonly(state),
  agregarProducto,
  eliminarProducto,
  limpiarCarrito
}
