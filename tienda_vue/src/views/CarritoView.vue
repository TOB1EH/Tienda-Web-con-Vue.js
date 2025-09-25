<template>
  <div class="carrito-view">
    <div class="header-section">
      <h1>🛒 Carrito de Compras</h1>
      <p>Revisa y gestiona los productos en tu carrito</p>
    </div>

    <!-- Usar el componente CarritoCompras existente -->
    <CarritoCompras />
  </div>
</template>

<script setup>
// Importar el componente CarritoCompras existente
import CarritoCompras from '../components/CarritoCompras.vue'
</script>

<style scoped>
.carrito-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-section h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.header-section p {
  font-size: 1.2rem;
  color: #ffff;
}

@media (max-width: 768px) {
  .carrito-view {
    padding: 1rem;
  }

  .header-section h1 {
    font-size: 2rem;
  }
}
</style>
