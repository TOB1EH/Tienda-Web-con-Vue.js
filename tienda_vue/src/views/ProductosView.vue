<template>
  <div class="productos-view">
    <div class="header-section">
      <h1>📦 Catálogo de Productos</h1>
      <p>Explora nuestro catálogo completo de productos</p>
    </div>

    <!-- Usar el componente ListaProductos existente -->
    <ListaProductos />
  </div>
</template>

<script setup>
// Importar el componente ListaProductos existente
import ListaProductos from '../components/ListaProductos.vue'
</script>

<style scoped>
.productos-view {
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
  color: #fff;
}

@media (max-width: 768px) {
  .productos-view {
    padding: 1rem;
  }

  .header-section h1 {
    font-size: 2rem;
  }
}
</style>
