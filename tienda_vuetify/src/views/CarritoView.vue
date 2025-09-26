<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import CarritoMinimo from '../components/CarritoMinimo.vue'

const router = useRouter()

// Props recibidas del componente padre (App.vue)
const props = defineProps({
  carritoCompleto: {
    type: Array,
    required: true
  },
  totalGeneral: {
    type: Number,
    required: true
  }
})

// Eventos emitidos al componente padre (App.vue)
const emit = defineEmits([
  'notification',
  'incrementar-cantidad',
  'decrementar-cantidad',
  'eliminar-item',
  'vaciar-carrito'
])

// Volver a productos
const volverAProductos = () => {
  router.push('/productos')
}
</script>

<template>
  <v-container class="pa-6">
<!--  
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" rounded="lg" class="mb-6">
          <v-card-title class="text-h4 text-center pa-6 bg-success text-white">
            <v-icon class="mr-3" size="32">mdi-cart</v-icon>
            Carrito de Compras
          </v-card-title>
          <v-card-subtitle class="text-center pb-4">
            Revisa tus productos seleccionados
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row> 
    -->

    <CarritoMinimo
      :items="carritoCompleto"
      :total-general="totalGeneral"
      @incrementar-cantidad="(id) => emit('incrementar-cantidad', id)"
      @decrementar-cantidad="(id) => emit('decrementar-cantidad', id)"
      @eliminar-item="(id) => emit('eliminar-item', id)"
      @vaciar-carrito="emit('vaciar-carrito')"
    />

    <v-card elevation="2" rounded="lg" class="mt-6">
      <v-card-actions class="pa-4 justify-center">
        <v-btn
          @click="volverAProductos"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          size="large"
          class="mr-4"
        >
          Continuar Comprando
        </v-btn>
        <v-btn
          color="success"
          size="large"
          prepend-icon="mdi-credit-card"
          :disabled="totalGeneral === 0"
        >
          Proceder al Pago ({{ totalGeneral.toLocaleString('es-AR') }})
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
/* Estilos mínimos */
.v-card-actions {
  flex-wrap: wrap;
}
</style>
