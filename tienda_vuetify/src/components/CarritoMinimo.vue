<script setup>
// PARTE B — COMUNICACIÓN Y ESTADO (carrito mínimo)
// Objetivo: Componente presentacional que muestra el estado del carrito y emite eventos.

import { ref, computed } from 'vue'

// PROPS: Recibimos la lista de productos del componente padre
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  totalGeneral: {
    type: Number,
    required: true,
    default: 0
  }
})

// Computed adicionales para información del carrito
const cantidadTotalItems = computed(() => {
  return props.items.reduce((total, item) => total + item.cantidad, 0)
})

const carritoVacio = computed(() => {
  return props.items.length === 0
})

// EVENTOS EMITIDOS
const emit = defineEmits([
  'notification', 
  'incrementar-cantidad', 
  'decrementar-cantidad', 
  'eliminar-item', 
  'vaciar-carrito'
])

// CRITERIO: Controles + / − para cantidad
const incrementarCantidad = (itemId) => {
  emit('incrementar-cantidad', itemId)
}

const decrementarCantidad = (itemId) => {
  emit('decrementar-cantidad', itemId)
}

// CRITERIO: Controles nunca llevan cantidad a valores negativos
const eliminarItem = (itemId) => {
  emit('eliminar-item', itemId)
}

// Método para vaciar completamente el carrito
const vaciarCarrito = () => {
  emit('vaciar-carrito')
}
</script>

<template>
  <!-- CONTENEDOR PRINCIPAL DEL CARRITO -->
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        
        <!-- HEADER DEL CARRITO -->
         
        <v-card elevation="2" rounded="lg" class="mb-6">
          <v-card-title class="text-h4 text-center pa-6 bg-success text-white">
            <v-icon class="mr-3" size="32">mdi-cart</v-icon>
            Carrito de Compras
            
            <!-- Badge con cantidad total -->
            <v-badge
              v-if="cantidadTotalItems > 0"
              :content="cantidadTotalItems"
              color="error"
              inline
              class="ml-3"
            />
          </v-card-title>
          
          <v-card-subtitle class="text-center pb-4">
            <h2><br>Revisa tus productos seleccionados</h2>
          </v-card-subtitle>
        </v-card>

      </v-col>
    </v-row>

    <!-- CRITERIO: Mensaje si el carrito está vacío -->
    <v-row v-if="carritoVacio">
      <v-col cols="12">
        <v-card elevation="2" rounded="lg" class="text-center pa-8">
          
          <!-- Ícono de carrito vacío -->
          <v-avatar size="120" color="grey-lighten-3" class="mb-4">
            <v-icon size="60" color="grey-lighten-1">mdi-cart-outline</v-icon>
          </v-avatar>

          <!-- Mensaje de carrito vacío -->
          <div class="text-h5 text-medium-emphasis mb-3">
            Tu carrito está vacío
          </div>

          <div class="text-body-1 text-medium-emphasis mb-4">
            Agrega algunos productos desde el catálogo<br>
            para comenzar tu compra
          </div>

          <v-btn
            color="primary"
            prepend-icon="mdi-shopping"
            variant="outlined"
            disabled
          >
            Explorar Productos
          </v-btn>

        </v-card>
      </v-col>
    </v-row>

    <!-- CRITERIO: Listar ítems del carrito con cantidad, precio, subtotal -->
    <v-row v-else>
      <v-col cols="12">
        
        <!-- LISTA DE ITEMS DEL CARRITO -->
        <v-card elevation="4" rounded="lg" class="mb-6">
          <v-card-title class="pa-4 bg-grey-lighten-4">
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            Items en el Carrito ({{ items.length }})
          </v-card-title>

          <v-list lines="three">
            <template v-for="(item, index) in items" :key="item.id">
              
              <v-list-item class="pa-4">
                
                <!-- Información del producto -->
                <template v-slot:prepend>
                  <v-avatar color="primary" class="mr-4">
                    <v-icon>mdi-package-variant</v-icon>
                  </v-avatar>
                </template>

                <!-- Contenido principal -->
                <v-list-item-title class="text-h6 mb-2">
                  {{ item.nombre }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  <div class="d-flex align-center flex-wrap ga-4">
                    <!-- Precio unitario -->
                    <v-chip
                      color="info"
                      variant="tonal"
                      size="small"
                      prepend-icon="mdi-currency-usd"
                    >
                      ${{ item.precio.toLocaleString('es-AR') }} c/u
                    </v-chip>
                    
                    <!-- ID del producto -->
                    <v-chip
                      color="grey"
                      variant="tonal"
                      size="small"
                    >
                      ID: {{ item.id }}
                    </v-chip>
                  </div>
                </v-list-item-subtitle>

                <!-- Controles y subtotal -->
                <template v-slot:append>
                  <div class="d-flex flex-column align-end ga-2">
                    
                    <!-- CRITERIO: Controles + / − para cantidad -->
                    <div class="d-flex align-center ga-1">
                      <!-- Botón decrementar -->
                      <v-btn
                        @click="decrementarCantidad(item.id)"
                        icon
                        size="small"
                        color="error"
                        variant="outlined"
                      >
                        <v-icon>{{ item.cantidad === 1 ? 'mdi-delete' : 'mdi-minus' }}</v-icon>
                      </v-btn>

                      <!-- Cantidad actual -->
                      <v-chip
                        color="primary"
                        variant="elevated"
                        class="mx-2 font-weight-bold"
                        min-width="60"
                      >
                        {{ item.cantidad }}
                      </v-chip>

                      <!-- Botón incrementar -->
                      <v-btn
                        @click="incrementarCantidad(item.id)"
                        icon
                        size="small"
                        color="success"
                        variant="outlined"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>

                    <!-- Subtotal del item -->
                    <v-chip
                      color="success"
                      variant="elevated"
                      size="large"
                      prepend-icon="mdi-calculator"
                      class="font-weight-bold"
                    >
                      ${{ item.subtotal.toLocaleString('es-AR') }}
                    </v-chip>

                    <!-- Botón eliminar item completo -->
                    <v-btn
                      @click="eliminarItem(item.id)"
                      icon
                      size="small"
                      color="error"
                      variant="text"
                    >
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>

                  </div>
                </template>

              </v-list-item>

              <!-- Divider entre items (excepto el último) -->
              <v-divider v-if="index < items.length - 1" />

            </template>
          </v-list>
        </v-card>

        <!-- CRITERIO: Cálculo de total general con propiedad computada -->
        <!-- CRITERIO: El total se actualiza reactivamente -->
        <v-card elevation="6" rounded="lg" color="success" class="mb-6">
          <v-card-text class="pa-6">
            
            <!-- Resumen del carrito -->
            <div class="text-center text-white">
              <div class="text-h3 font-weight-bold mb-2">
                ${{ props.totalGeneral.toLocaleString('es-AR') }}
              </div>
              
              <div class="text-h6 mb-4">
                Total General
              </div>
              
              <!-- Información detallada -->
              <div class="d-flex justify-space-around flex-wrap ga-4">
                <div>
                  <div class="text-h5 font-weight-bold">{{ items.length }}</div>
                  <div class="text-body-2 opacity-80">Productos únicos</div>
                </div>
                
                <div>
                  <div class="text-h5 font-weight-bold">{{ cantidadTotalItems }}</div>
                  <div class="text-body-2 opacity-80">Items totales</div>
                </div>
                
                <div>
                  <div class="text-h5 font-weight-bold">
                    ${{ (cantidadTotalItems > 0 ? Math.round(props.totalGeneral / cantidadTotalItems) : 0).toLocaleString('es-AR') }}
                  </div>
                  <div class="text-body-2 opacity-80">Precio promedio</div>
                </div>
              </div>
              
            </div>
          </v-card-text>
        </v-card>

        <!-- ACCIONES DEL CARRITO -->
        <v-card elevation="2" rounded="lg">
          <v-card-actions class="pa-4 justify-center">
            <v-btn
              @click="vaciarCarrito"
              color="error"
              variant="outlined"
              prepend-icon="mdi-cart-remove"
              class="mr-4"
            >
              Vaciar Carrito
            </v-btn>
            
            <v-btn
              color="success"
              size="large"
              prepend-icon="mdi-credit-card"
              disabled
            >
              Proceder al Pago (${{ props.totalGeneral.toLocaleString('es-AR') }})
            </v-btn>
          </v-card-actions>
        </v-card>

      </v-col>
    </v-row>

    <!-- INFORMACIÓN DE DEBUG (verificar criterios de aceptación) -->
     <!-- 
    <v-row class="mt-6">
      <v-col cols="12">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-bug</v-icon>
              Debug: Criterios Parte B (Comunicación y Estado)
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title>✅ Escucha evento add-to-cart(id)</v-list-item-title>
                  <v-list-item-subtitle>Método agregarProducto() expuesto</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title>✅ Lista items con cantidad, precio, subtotal</v-list-item-title>
                  <v-list-item-subtitle>{{ items.length }} items mostrados</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title>✅ Total con computed reactiva</v-list-item-title>
                  <v-list-item-subtitle>Total actual: ${{ props.totalGeneral.toLocaleString('es-AR') }}</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title>✅ Controles + / − funcionan</v-list-item-title>
                  <v-list-item-subtitle>Nunca valores negativos</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="success">mdi-check-circle</v-icon>
                  </template>
                  <v-list-item-title>✅ Elimina cuando cantidad = 0</v-list-item-title>
                  <v-list-item-subtitle>Lógica implementada en decrementarCantidad()</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon :color="carritoVacio ? 'success' : 'warning'">
                      {{ carritoVacio ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                    </v-icon>
                  </template>
                  <v-list-item-title>{{ carritoVacio ? '✅' : '⚠️' }} Mensaje si carrito vacío</v-list-item-title>
                  <v-list-item-subtitle>Estado actual: {{ carritoVacio ? 'VACÍO' : 'CON ITEMS' }}</v-list-item-subtitle>
                </v-list-item>
                
              </v-list>
              
              <v-divider class="my-4" />
              
              <div class="text-body-2">
                <strong>Estado en tiempo real:</strong><br>
                • Items únicos: {{ items.length }}<br>
                • Cantidad total: {{ cantidadTotalItems }}<br>
                • Total general: ${{ props.totalGeneral.toLocaleString('es-AR') }}<br>
                • Carrito vacío: {{ carritoVacio ? 'Sí' : 'No' }}
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

  -->

  </v-container>
</template>

<style scoped>
/* 
  Solo estilos que Vuetify no puede manejar automáticamente
  En este caso, principalmente transiciones suaves
*/

.v-list-item {
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

/* Animación para cambios en el total */
.text-h3 {
  transition: all 0.3s ease;
}
</style>