<script setup>
// PARTE A — DIRECTIVAS Y ESTADOS
// Ejercicio 1: Listado de productos con búsqueda
// Objetivo: practicar v-for, :key, estados vacíos, filtros simples y estilos condicionales

import { ref, computed } from 'vue'

// Props recibidas del componente padre
const props = defineProps({
  productos: {
    type: Array,
    required: true,
    default: () => []
  }
})

// INPUT DE BÚSQUEDA (case-insensitive por nombre)
const busqueda = ref('')

// COMPUTED: FILTROS SIMPLES
// Filtrado case-insensitive por nombre según requerimiento
const productosFiltrados = computed(() => {
  if (!busqueda.value.trim()) {
    return props.productos
  }

  return props.productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.value.toLowerCase().trim())
  )
})

// EVENTOS EMITIDOS
// Botón "Agregar al carrito" emite evento con el id (según requerimiento)
const emit = defineEmits(['add-to-cart'])

// MÉTODO: AGREGAR AL CARRITO
const agregarAlCarrito = (producto) => {
  // Verificar stock antes de agregar
  if (producto.stock === 0) {
    // En lugar de alert, emitimos notificación al padre
    emit('notification', 'Este producto no tiene stock disponible', 'warning')
    return
  }
  
  // Emitir evento con el ID según requerimiento
  emit('add-to-cart', producto.id)
  
  // console.log(`🛒 Emitiendo evento add-to-cart con ID: ${producto.id}`) // Comentado para producción
}
</script>

<template>
  <!-- CONTENEDOR PRINCIPAL usando clases de Vuetify -->
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        


        <!-- INPUT DE BÚSQUEDA (case-insensitive por nombre) -->
        <v-card elevation="1" rounded="lg" class="mb-6">
          <v-card-text class="pa-4">
            <v-text-field
              v-model="busqueda"
              label="🔍 Buscar productos por nombre..."
              placeholder="Ejemplo: laptop, mouse, teclado..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              color="primary"
              clearable
              hide-details
            />
            
            <!-- Información de resultados -->
            <div class="text-caption text-medium-emphasis mt-2">
              {{ productosFiltrados.length }} de {{ productos.length }} productos
              {{ busqueda ? `encontrados para "${busqueda}"` : 'disponibles' }}
            </div>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

    <!-- CRITERIO: Uso correcto de v-for con :key estable -->
    <!-- CRITERIO: Manejo de estado vacío -->
    <v-row v-if="productosFiltrados.length > 0">
      <v-col 
        v-for="producto in productosFiltrados" 
        :key="producto.id"
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
      >
        <!-- TARJETA DE PRODUCTO -->
        <v-card 
          elevation="4" 
          rounded="xl" 
          class="h-100 d-flex flex-column"
          hover
        >
          <!-- Header del producto -->
          <v-card-title class="text-h6 pa-4">
            {{ producto.nombre }}
          </v-card-title>

          <!-- Contenido del producto -->
          <v-card-text class="flex-grow-1 pa-4 pt-0">
            
            <!-- PRECIO -->
            <div class="text-h5 text-success font-weight-bold mb-3">
              ${{ producto.precio.toLocaleString('es-AR') }}
            </div>

            <!-- CRITERIO: Estilo/flag visual para stock === 0 -->
            <!-- CRITERIO: Estilos condicionales con :class -->
            <v-chip
              :color="producto.stock > 0 ? 'success' : 'error'"
              :variant="producto.stock > 0 ? 'tonal' : 'elevated'"
              :prepend-icon="producto.stock > 0 ? 'mdi-check-circle' : 'mdi-alert-circle'"
              size="small"
              class="mb-3"
            >
              {{ producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin Stock' }}
            </v-chip>

            <!-- Información adicional -->
            <div class="text-body-2 text-medium-emphasis">
              ID: {{ producto.id }} • 
              Estado: {{ producto.stock > 0 ? 'Disponible' : 'Agotado' }}
            </div>

          </v-card-text>

          <!-- ACCIONES -->
          <v-card-actions class="pa-4 pt-0">
            <!-- CRITERIO: Botón "Agregar al carrito" que emite evento con el id -->
            <v-btn
              @click="agregarAlCarrito(producto)"
              :color="producto.stock > 0 ? 'primary' : 'grey'"
              :disabled="producto.stock === 0"
              :prepend-icon="producto.stock > 0 ? 'mdi-cart-plus' : 'mdi-cart-remove'"
              block
              size="large"
              variant="elevated"
            >
              {{ producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock' }}
            </v-btn>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>

    <!-- CRITERIO: Estado vacío - mostrar mensaje si no hay resultados -->
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg" class="text-center pa-8">
          
          <!-- Ícono de estado vacío -->
          <v-avatar size="120" color="grey-lighten-3" class="mb-4">
            <v-icon size="60" color="grey-lighten-1">
              {{ busqueda ? 'mdi-magnify-remove-outline' : 'mdi-package-variant-remove' }}
            </v-icon>
          </v-avatar>

          <!-- Título del estado vacío -->
          <div class="text-h5 text-medium-emphasis mb-3">
            {{ busqueda ? 'No se encontraron productos' : 'No hay productos disponibles' }}
          </div>

          <!-- Descripción del estado vacío -->
          <div class="text-body-1 text-medium-emphasis mb-4">
            <span v-if="busqueda">
              No hay productos que coincidan con "<strong>{{ busqueda }}</strong>".<br>
              Intenta con otros términos de búsqueda.
            </span>
            <span v-else>
              No hay productos cargados en el sistema.<br>
              Contacta al administrador para agregar productos.
            </span>
          </div>

          <!-- Acciones del estado vacío -->
          <v-btn
            v-if="busqueda"
            @click="busqueda = ''"
            color="primary"
            prepend-icon="mdi-backspace-outline"
            variant="outlined"
          >
            Limpiar búsqueda
          </v-btn>

          <v-btn
            v-else
            disabled
            prepend-icon="mdi-plus"
            variant="outlined"
          >
            Agregar Productos (Próximamente)
          </v-btn>

        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>
/* 
  CRITERIO: Calidad de UI/UX
  Solo estilos que Vuetify no puede manejar automáticamente
  En este caso, usamos SOLO las clases utilitarias de Vuetify
*/

/* Asegurar que las tarjetas tengan altura uniforme */
.v-card.h-100 {
  height: 100%;
}

/* Transición suave para estados hover */
.v-card[hover] {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card[hover]:hover {
  transform: translateY(-2px);
}
</style>