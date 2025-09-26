<script setup>
// VISTA DE PRODUCTOS - RUTA /productos
// Objetivo: Mostrar únicamente la lista de productos. El carrito se maneja en /carrito

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Importamos el componente de lista de productos
import ProductosLista from '../components/ProductosLista.vue'

const router = useRouter()

// Props recibidas del componente padre (App.vue)
const props = defineProps({
  productosDb: {
    type: Array,
    required: true
  }
})

// Estado de la vista
const loading = ref(true)

// Eventos emitidos al componente padre (App.vue)
const emit = defineEmits(['notification', 'agregar-al-carrito'])

// --- NAVEGACIÓN ---

// CRITERIO: Navegación programática hacia el detalle
const navegarAlDetalle = (productoId) => {
  // console.log(`🔍 Navegando programáticamente al detalle del producto: ${productoId}`) // Comentado para producción
  router.push(`/productos/${productoId}`)
}

// Simular carga inicial
onMounted(() => {
  loading.value = false
  emit('notification', 'Productos cargados correctamente', 'success')
})
</script>

<template>
  <!-- VISTA DE PRODUCTOS - SOLO LISTA -->
  <div>
    <!-- HEADER DE LA VISTA -->
    <v-container class="pa-6">
      <v-row>
        <v-col cols="12">
          <!-- Título de la sección -->
          <v-card elevation="2" rounded="lg" class="mb-6">
            <v-card-title class="text-h4 text-center pa-6 bg-primary text-white">
              <v-icon class="mr-3" size="32">mdi-package-variant</v-icon>
              Catálogo de Productos
            </v-card-title>
            <v-card-subtitle class="text-center pb-4">
              <h2><br>Explora nuestros productos disponibles</h2>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>

      <!-- CONTENIDO: LISTA DE PRODUCTOS -->
      <v-row>
        <v-col cols="12">
          <ProductosLista
            :productos="productosDb"
            @add-to-cart="(productoId) => emit('agregar-al-carrito', productoId)"
            @notification="(message, type) => emit('notification', message, type)"
          />

          <!-- Información de la sección -->
          <v-alert
            type="info"
            variant="tonal"
            class="mt-6"
            prominent
          >
            <v-alert-title>📦 Catálogo de Productos</v-alert-title>
            <p>
              Explora nuestros productos disponibles. Haz clic en "Agregar al
              Carrito" para incluir productos en tu compra. El carrito se gestiona
              en la sección dedicada.
            </p>
          </v-alert>

          <!-- Acciones de navegación -->
          <v-card elevation="1" rounded="lg" class="mt-6">
            <v-card-actions class="pa-4 justify-center">
              <v-btn
                @click="router.push('/carrito')"
                color="success"
                size="large"
                prepend-icon="mdi-cart"
                class="mr-4"
              >
                Ver Carrito de Compras
              </v-btn>

              <v-btn
                @click="router.push('/')"
                variant="outlined"
                color="primary"
                prepend-icon="mdi-home"
              >
                Volver al Inicio
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Loading overlay -->
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
      opacity="0.8"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
          class="mb-4"
        />
        <div class="text-h6">Cargando productos...</div>
      </div>
    </v-overlay>
  </div>
</template>

<style scoped>
/* Transiciones suaves entre tabs */
.v-window-item {
  transition: all 0.3s ease;
}

/* Mejorar la apariencia de los tabs */
.v-tabs {
  border-radius: 8px 8px 0 0;
}

/* Estados hover para mejor UX */
.v-card:hover {
  transition: transform 0.2s ease;
}
</style>