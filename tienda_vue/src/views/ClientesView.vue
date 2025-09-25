<template>
  <div class="clientes-view">
    <div class="header-section">
      <h1>👥 Gestión de Clientes</h1>
      <p>Administra la información de tus clientes</p>
    </div>

    <!-- Usar el componente RegistroClientesValidacion existente -->
    <RegistroClientesValidacion />
  </div>
</template>

<script setup>
// Importar el componente RegistroClientesValidacion existente
import RegistroClientesValidacion from '../components/RegistroClientesValidacion.vue'
</script>

<style scoped>
.clientes-view {
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
  color: #7f8c8d;
}

@media (max-width: 768px) {
  .clientes-view {
    padding: 1rem;
  }

  .header-section h1 {
    font-size: 2rem;
  }
}
</style>
