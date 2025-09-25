<template>
  <div class="not-found-view">
    <div class="error-content">
      <div class="error-icon">🔍</div>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <div class="error-actions">
        <router-link to="/" class="btn-primary">
          🏠 Ir al Inicio
        </router-link>
        <router-link to="/productos" class="btn-secondary">
          📦 Ver Productos
        </router-link>
      </div>
    </div>

    <div class="suggestions">
      <h2>¿Qué puedes hacer?</h2>
      <ul>
        <li>Verificar que la URL esté escrita correctamente</li>
        <li>Regresar a la página anterior</li>
        <li>Ir a la página de inicio</li>
        <li>Contactar al soporte si el problema persiste</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional para esta vista
</script>

<style scoped>
.not-found-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.error-content {
  margin-bottom: 3rem;
}

.error-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
}

.error-content h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.error-content p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.error-actions {
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
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
  border: 2px solid #bdc3c7;
}

.btn-secondary:hover {
  background: #bdc3c7;
  transform: translateY(-2px);
}

.suggestions {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #3498db;
}

.suggestions h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.suggestions ul {
  list-style: none;
  padding: 0;
  text-align: left;
}

.suggestions li {
  padding: 0.5rem 0;
  color: #7f8c8d;
  position: relative;
  padding-left: 1.5rem;
}

.suggestions li:before {
  content: "✓";
  color: #27ae60;
  font-weight: bold;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .not-found-view {
    padding: 2rem 1rem;
  }

  .error-content h1 {
    font-size: 2rem;
  }

  .error-icon {
    font-size: 3rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
}
</style>
