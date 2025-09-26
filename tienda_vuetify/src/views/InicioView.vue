<script setup>
// PARTE D — VUE ROUTER (rutas, navegación y detalle)
// Ruta: / (Inicio)
// Objetivo: dividir la app en vistas y practicar ruta dinámica

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Hook de Vue Router para navegación programática
const router = useRouter()

// Estado de la vista de inicio
const stats = ref({
  productosDisponibles: 8,
  clientesRegistrados: 12,
  ventasHoy: 5,
  ingresosDia: 125000
})

const loading = ref(true)

// Navegación programática a diferentes secciones
const navegarA = (ruta) => {
  router.push(ruta)
}

onMounted(() => {
  loading.value = false
})
</script>

<template>
  <!-- VISTA DE INICIO - RUTA / -->
  <div>
    <!-- HERO SECTION -->
    <v-container class="pa-6">
      <v-row>
        <v-col cols="12">
          
          <!-- Header principal -->
          <v-card 
            elevation="8" 
            rounded="xl" 
            gradient="to right, #1976D2, #42A5F5"
            class="text-white mb-6"
          >
            <v-card-text class="pa-8 text-center">
              <v-avatar size="100" color="white" class="mb-4">
                <v-icon size="60" color="primary">mdi-store</v-icon>
              </v-avatar>
              
              <div class="text-h3 font-weight-bold mb-2">
                Bienvenido a TiendaVuetify
              </div>
              
              <div class="text-h6 mb-4 opacity-90">
                Sistema de Gestión Comercial
              </div>
              
              <div class="text-body-1 opacity-80 mb-6">
                Desarrollado con Vue.js 3, Vue Router y Vuetify<br>
                Práctico Unificado 2025 - Implementación completa
              </div>
              
              <!-- Botones de acceso rápido -->
              <div class="d-flex justify-center flex-wrap ga-4">
                <v-btn
                  @click="navegarA('/productos')"
                  size="large"
                  color="white"
                  variant="elevated"
                  prepend-icon="mdi-package-variant"
                  class="text-primary"
                >
                  Ver Productos
                </v-btn>
                
                <v-btn
                  @click="navegarA('/clientes')"
                  size="large"
                  color="purple"
                  variant="elevated"
                  prepend-icon="mdi-account-group"
                  class="text-white"
                >
                  Gestión de Clientes
                </v-btn>
              </div>
              
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>

      <!-- ESTADÍSTICAS DEL DASHBOARD -->
      <v-row>
        <!-- Estadística 1: Productos -->
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="4" rounded="lg" hover class="h-100">
            <v-card-text class="pa-6 text-center">
              <v-avatar size="60" color="blue" class="mb-3">
                <v-icon color="white" size="30">mdi-package-variant</v-icon>
              </v-avatar>
              
              <div class="text-h4 font-weight-bold text-blue mb-1">
                <span v-if="loading">--</span>
                <span v-else>{{ stats.productosDisponibles }}</span>
              </div>
              
              <div class="text-subtitle-1 text-medium-emphasis">
                Productos Disponibles
              </div>
              
              <v-btn
                @click="navegarA('/productos')"
                size="small"
                color="blue"
                variant="text"
                class="mt-2"
              >
                Ver Catálogo
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Estadística 2: Clientes -->
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="4" rounded="lg" hover class="h-100">
            <v-card-text class="pa-6 text-center">
              <v-avatar size="60" color="purple" class="mb-3">
                <v-icon color="white" size="30">mdi-account-group</v-icon>
              </v-avatar>
              
              <div class="text-h4 font-weight-bold text-purple mb-1">
                <span v-if="loading">--</span>
                <span v-else>{{ stats.clientesRegistrados }}</span>
              </div>
              
              <div class="text-subtitle-1 text-medium-emphasis">
                Clientes Registrados
              </div>
              
              <v-btn
                @click="navegarA('/clientes')"
                size="small"
                color="purple"
                variant="text"
                class="mt-2"
              >
                Gestionar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Estadística 3: Ventas Hoy -->
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="4" rounded="lg" hover class="h-100">
            <v-card-text class="pa-6 text-center">
              <v-avatar size="60" color="green" class="mb-3">
                <v-icon color="white" size="30">mdi-cart-check</v-icon>
              </v-avatar>
              
              <div class="text-h4 font-weight-bold text-green mb-1">
                <span v-if="loading">--</span>
                <span v-else>{{ stats.ventasHoy }}</span>
              </div>
              
              <div class="text-subtitle-1 text-medium-emphasis">
                Ventas de Hoy
              </div>
              
              <v-btn
                @click="navegarA('/carrito')"
                size="small"
                color="green"
                variant="text"
                class="mt-2"
              >
                Ver Carrito
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Estadística 4: Ingresos -->
        <v-col cols="12" sm="6" md="3">
          <v-card elevation="4" rounded="lg" hover class="h-100">
            <v-card-text class="pa-6 text-center">
              <v-avatar size="60" color="orange" class="mb-3">
                <v-icon color="white" size="30">mdi-currency-usd</v-icon>
              </v-avatar>
              
              <div class="text-h4 font-weight-bold text-orange mb-1">
                <span v-if="loading">--</span>
                <span v-else>${{ (stats.ingresosDia / 1000).toFixed(0) }}K</span>
              </div>
              
              <div class="text-subtitle-1 text-medium-emphasis">
                Ingresos del Día
              </div>
              
              <v-chip
                color="orange"
                variant="tonal"
                size="small"
                class="mt-2"
              >
                ${{ stats.ingresosDia.toLocaleString('es-AR') }}
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- ACCIONES RÁPIDAS -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-card-title class="pa-6 bg-grey-lighten-4">
              <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
              Acciones Rápidas
            </v-card-title>
            
            <v-card-text class="pa-6">
              <v-row>
                
                <!-- Acción: Ver productos -->
                <v-col cols="12" sm="6" md="3">
                  <v-card 
                    @click="navegarA('/productos')"
                    variant="tonal" 
                    color="blue"
                    rounded="lg"
                    hover
                    class="cursor-pointer h-100"
                  >
                    <v-card-text class="pa-4 text-center">
                      <v-icon size="40" color="blue" class="mb-2">mdi-eye</v-icon>
                      <div class="text-subtitle-1 font-weight-medium">
                        Explorar Productos
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Ver catálogo completo
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Acción: Registrar cliente -->
                <v-col cols="12" sm="6" md="3">
                  <v-card 
                    @click="navegarA('/clientes')"
                    variant="tonal" 
                    color="purple"
                    rounded="lg"
                    hover
                    class="cursor-pointer h-100"
                  >
                    <v-card-text class="pa-4 text-center">
                      <v-icon size="40" color="purple" class="mb-2">mdi-account-plus</v-icon>
                      <div class="text-subtitle-1 font-weight-medium">
                        Nuevo Cliente
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Registro rápido
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Acción: Ver carrito -->
                <v-col cols="12" sm="6" md="3">
                  <v-card 
                    @click="navegarA('/carrito')"
                    variant="tonal" 
                    color="green"
                    rounded="lg"
                    hover
                    class="cursor-pointer h-100"
                  >
                    <v-card-text class="pa-4 text-center">
                      <v-icon size="40" color="green" class="mb-2">mdi-cart</v-icon>
                      <div class="text-subtitle-1 font-weight-medium">
                        Ver Carrito
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Revisar compras
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Acción: Configuración -->
                <v-col cols="12" sm="6" md="3">
                  <v-card 
                    variant="tonal" 
                    color="grey"
                    rounded="lg"
                    hover
                    class="cursor-pointer h-100"
                    @click="emit('notification', 'Configuración próximamente', 'info')"
                  >
                    <v-card-text class="pa-4 text-center">
                      <v-icon size="40" color="grey-darken-1" class="mb-2">mdi-cog</v-icon>
                      <div class="text-subtitle-1 font-weight-medium">
                        Configuración
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Ajustes del sistema
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- INFORMACIÓN DEL SISTEMA -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-card elevation="1" rounded="lg" variant="tonal" color="info">
            <v-card-text class="pa-4">
              <div class="d-flex align-center justify-space-between flex-wrap ga-4">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="info">mdi-information</v-icon>
                  <div>
                    <div class="text-subtitle-2 font-weight-medium">
                      Sistema TiendaVue - Práctico Unificado 2025
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Vue 3 + Vue Router + Vuetify • Implementación completa de criterios
                    </div>
                  </div>
                </div>
                
                <!-- Version -->
                <div class="text-caption text-medium-emphasis">
                  Última actualización: {{ new Date().toLocaleString('es-AR') }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>

    <!-- Skeleton loader mientras carga -->
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
        <div class="text-h6">Cargando dashboard...</div>
      </div>
    </v-overlay>

  </div>
</template>

<style scoped>
/* Estilos específicos para la vista de inicio */

.cursor-pointer {
  cursor: pointer;
}

.v-card[hover]:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

/* Animación para las estadísticas */
.text-h4 {
  transition: all 0.3s ease;
}

/* Gradiente personalizado para hero */
.v-card[gradient] {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
}

/* Responsividad para móviles */
@media (max-width: 600px) {
  .text-h3 {
    font-size: 2rem !important;
  }
  
  .v-avatar {
    margin-bottom: 1rem;
  }
}
</style>