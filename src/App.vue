<!--
  App.vue - Componente raíz de la aplicación

  Este es el punto de entrada principal de la aplicación Vue.
  En una aplicación real, este archivo estaría en la carpeta src/
  y sería el componente que se monta en el div#app del index.html
-->

<script setup>
// PASO 1: Importación del componente hijo
//
// En una aplicación real con Vite o Vue CLI, importarías así:
// import RegistroRapidoClientes from './components/RegistroRapidoClientes.vue'
//
// ¿Por qué importar componentes?
// Vue funciona como un árbol de componentes. App.vue es la raíz,
// y desde aquí importamos y usamos otros componentes
// Documentación: https://vuejs.org/guide/essentials/component-basics.html#using-a-component


// En <script setup>, cuando importas un componente, automáticamente
// está disponible para usar en el template.
import RegistroRapidoClientes from './components/RegistroRapidoClientes.vue'

// PASO 2: Lógica adicional de la aplicación principal (opcional)
//
// Aquí podrías agregar estado global, configuraciones, etc.
// Para este ejercicio simple, solo necesitamos importar el componente

// Ejemplo de estado global que podrías manejar aquí:
// import { ref } from 'vue'
// const temaOscuro = ref(false)
// const usuario = ref(null)
</script>

<template>
  <!--
    Template de la aplicación principal

    Este template define la estructura general de la aplicación.
    En aplicaciones más complejas, aquí tendrías:
    - Barra de navegación
    - Sidebar
    - Footer
    - Área de contenido principal
  -->

  <div class="app">
    <!-- Header global de la aplicación -->
    <header class="app-header">
      <div class="container">
        <h1>Sistema de Gestión TiendaVue</h1>
        <!-- <p>Aplicación desarrollada con Vue.js 3 y Composition API</p> -->
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="app-main">
      <!--
        Uso del componente importado

        Al importar RegistroRapidoClientes arriba, podemos usarlo
        directamente en el template como si fuera un elemento HTML

        Vue convierte automáticamente:
        - PascalCase (RegistroRapidoClientes)
        - a kebab-case (<registro-rapido-clientes>)

        Ambas formas son válidas, pero PascalCase es más común en SFC
      -->

      
      <RegistroRapidoClientes/>
    </main>

    <!-- Footer global -->
    <footer class="app-footer">
      <div class="container">
        <p>&copy; 2024 TiendaVue - Desarrollado con Vue.js 3 y Composition API</p>
      </div>
    </footer>
  </div>
</template>

<style>
  /*
    ESTILOS GLOBALES (sin scoped)

    Nota: No usamos 'scoped' aquí porque queremos que estos estilos
    sean globales y afecten toda la aplicación

    ¿Cuándo usar estilos globales vs scoped?
    - Globales: Reset CSS, tipografía base, utilidades
    - Scoped: Estilos específicos de cada componente
  */

  /* Reset básico y configuración global */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  /* Contenedor responsivo reutilizable */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
</style>

<style scoped>
  /*
    ESTILOS ESPECÍFICOS DEL COMPONENTE APP (con scoped)
  
    Estos estilos solo afectan elementos del template de App.vue
  */

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Header de la aplicación */
  .app-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 0;
    text-align: center;
  }

  .app-header h1 {
    color: white;
    font-size: 2rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .app-header p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
  }

  /* Contenido principal que crece para ocupar espacio disponible */
  .app-main {
    flex: 1;
    padding: 2rem 0;
  }

  /* Footer de la aplicación */
  .app-footer {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1rem 0;
    text-align: center;
    margin-top: auto;
  }

  .app-footer p {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
  }

  /* Responsividad para dispositivos móviles */
  @media (max-width: 768px) {
    .app-header h1 {
      font-size: 1.5rem;
    }

    .app-header p {
      font-size: 0.9rem;
    }

    .app-main {
      padding: 1rem 0;
    }
  }
</style>