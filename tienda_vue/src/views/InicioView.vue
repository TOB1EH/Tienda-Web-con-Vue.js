<template>
  <div class="inicio-view">
    <div class="hero-section">
      <h1>🏪 Bienvenido a TiendaVue</h1>
      <p>Sistema de gestión de tienda en línea desarrollado con Vue.js 3</p>
      <div class="hero-actions">
        <router-link to="/productos" class="btn-primary">
          📦 Ver Productos
        </router-link>
        <router-link to="/clientes" class="btn-secondary">
          👥 Gestionar Clientes
        </router-link>
      </div>
    </div>

    <div class="features-section">
      <h2>🚀 Características del Sistema</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Gestión de Productos</h3>
          <p>Administra tu catálogo de productos con facilidad</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>Clientes</h3>
          <p>Registra y administra la información de tus clientes</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛒</div>
          <h3>Carrito de Compras</h3>
          <p>Experiencia de compra intuitiva y moderna</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Responsive</h3>
          <p>Funciona perfectamente en todos los dispositivos</p>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2>📈 Estadísticas del Sistema</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ productosCount }}</div>
          <div class="stat-label">Productos</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ clientesCount }}</div>
          <div class="stat-label">Clientes</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ carritoCount }}</div>
          <div class="stat-label">En Carrito</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Estado de estadísticas (en una app real vendrían de una API)
const productosCount = ref(0)
const clientesCount = ref(0)
const carritoCount = ref(0)

// Simular carga de datos
onMounted(() => {
  // En una aplicación real, aquí harías llamadas a la API
  setTimeout(() => {
    productosCount.value = 25
    clientesCount.value = 150
    carritoCount.value = 3
  }, 500)
})
</script>

<style scoped>
.inicio-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  margin-bottom: 3rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.features-section {
  margin-bottom: 3rem;
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.6;
}

.stats-section {
  margin-bottom: 3rem;
}

.stats-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  color: #7f8c8d;
  font-weight: 500;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 300px;
  }

  .features-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
