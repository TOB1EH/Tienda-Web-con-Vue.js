<script setup>
// VISTA DE CLIENTES - RUTA /clientes
// Integra tanto el registro rápido como el registro completo con validación

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Importar los componentes de registro que creamos
import RegistroRapido from '../components/RegistroRapido.vue'

const router = useRouter()

// Estado de la vista
const loading = ref(true)
const vistaActual = ref('rapido') // 'rapido', 'lista', 'estadisticas'
const clientesRegistrados = ref([])

// Eventos emitidos al padre
const emit = defineEmits(['notification'])

// Manejar el registro de cliente desde los componentes hijos
const manejarClienteRegistrado = (clienteData) => {
  clientesRegistrados.value.push({
    ...clienteData,
    timestamp: Date.now()
  })
  
  // console.log('👤 Cliente registrado en vista:', clienteData) // Comentado para producción
  emit('notification', `Cliente ${clienteData.nombre} agregado al sistema`, 'success')
}

// Eliminar cliente de la lista
const eliminarCliente = (clienteId) => {
  const index = clientesRegistrados.value.findIndex(c => c.id === clienteId)
  if (index > -1) {
    const cliente = clientesRegistrados.value[index]
    clientesRegistrados.value.splice(index, 1)
    emit('notification', `Cliente ${cliente.nombre} eliminado`, 'info')
  }
}

// Computed properties para estadísticas
const estadisticas = computed(() => {
  const hoy = new Date().toDateString()
  const semanaAtras = Date.now() - (7 * 24 * 60 * 60 * 1000)
  
  return {
    total: clientesRegistrados.value.length,
    hoy: clientesRegistrados.value.filter(c => 
      new Date(c.fechaRegistro).toDateString() === hoy
    ).length,
    estaSemana: clientesRegistrados.value.filter(c => 
      new Date(c.fechaRegistro).getTime() > semanaAtras
    ).length,
    promedioDiario: clientesRegistrados.value.length > 0 
      ? Math.ceil(clientesRegistrados.value.length / 30) 
      : 0
  }
})

// Función para exportar datos (simulada)
const exportarClientes = () => {
  if (clientesRegistrados.value.length === 0) {
    emit('notification', 'No hay clientes para exportar', 'warning')
    return
  }
  
  // Simular exportación a CSV
  const csv = [
    'ID,Nombre,Fecha Registro',
    ...clientesRegistrados.value.map(c => 
      `${c.id},"${c.nombre}","${new Date(c.fechaRegistro).toLocaleString('es-AR')}"`
    )
  ].join('\n')
  
  // En una app real, esto descargaría el archivo
  // console.log('📁 CSV generado:', csv) // Comentado para producción
  emit('notification', 'Lista de clientes exportada exitosamente', 'success')
}

// Función para vaciar todos los clientes
const vaciarLista = () => {
  if (clientesRegistrados.value.length === 0) return
  
  if (confirm(`¿Estás seguro de eliminar todos los ${clientesRegistrados.value.length} clientes?`)) {
    clientesRegistrados.value = []
    emit('notification', 'Lista de clientes vaciada', 'info')
  }
}

// Simular carga inicial
onMounted(() => {
  // Agregar algunos clientes de ejemplo
  clientesRegistrados.value = [
    {
      id: 1,
      nombre: 'Juan Carlos Pérez',
      fechaRegistro: new Date('2024-01-15T10:30:00').toISOString(),
      timestamp: Date.now() - 86400000 // 1 día atrás
    },
    {
      id: 2,
      nombre: 'María Elena González',
      fechaRegistro: new Date('2024-01-16T14:45:00').toISOString(),
      timestamp: Date.now() - 43200000 // 12 horas atrás
    },
    {
      id: 3,
      nombre: 'Roberto Silva Martinez',
      fechaRegistro: new Date('2024-01-17T09:15:00').toISOString(),
      timestamp: Date.now() - 21600000 // 6 horas atrás
    },
    {
      id: 4,
      nombre: 'Ana Lucía Rodríguez',
      fechaRegistro: new Date().toISOString(), // Hoy
      timestamp: Date.now() - 3600000 // 1 hora atrás
    }
  ]

  loading.value = false
  emit('notification', 'Vista de clientes cargada correctamente', 'success')
})

// Función para formatear tiempo transcurrido
const tiempoTranscurrido = (timestamp) => {
  const ahora = Date.now()
  const diferencia = ahora - timestamp
  
  const minutos = Math.floor(diferencia / (1000 * 60))
  const horas = Math.floor(diferencia / (1000 * 60 * 60))
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  
  if (dias > 0) return `${dias}d`
  if (horas > 0) return `${horas}h`
  return `${minutos}m`
}
</script>

<template>
  <div>
    <!-- HEADER DE LA VISTA -->
    <v-container class="pa-6">
      <v-row>
        <v-col cols="12">
          
          <!-- Título principal -->
          <v-card elevation="4" rounded="lg" class="mb-6">
            <v-card-title class="text-h4 text-center pa-6 bg-purple text-white">
              <v-icon class="mr-3" size="32">mdi-account-group</v-icon>
              Gestión de Clientes
            </v-card-title>
            
<!--             <v-card-subtitle class="text-center pb-4">
              Registro y administración de clientes del sistema
            </v-card-subtitle> -->
            
            <!-- Estadísticas rápidas en el header -->
            <v-card-text class="pa-4 pt-0">
              <v-row class="text-center">
                <v-col cols="3">
                  <div class="text-h6 font-weight-bold text-purple">{{ estadisticas.total }}</div>
                  <div class="text-caption">Total</div>
                </v-col>
                <v-col cols="3">
                  <div class="text-h6 font-weight-bold text-green">{{ estadisticas.hoy }}</div>
                  <div class="text-caption">Hoy</div>
                </v-col>
                <v-col cols="3">
                  <div class="text-h6 font-weight-bold text-blue">{{ estadisticas.estaSemana }}</div>
                  <div class="text-caption">Esta Semana</div>
                </v-col>
                <v-col cols="3">
                  <div class="text-h6 font-weight-bold text-orange">{{ estadisticas.promedioDiario }}</div>
                  <div class="text-caption">Promedio/Día</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Navegación entre tipos de registro -->
          <v-card elevation="2" rounded="lg" class="mb-6">
            <v-tabs
              v-model="vistaActual"
              bg-color="purple"
              color="white"
              show-arrows
            >
              <v-tab value="rapido" prepend-icon="mdi-lightning-bolt">
                Registro Rápido
              </v-tab>
              <v-tab value="lista" prepend-icon="mdi-format-list-bulleted">
                Lista de Clientes ({{ clientesRegistrados.length }})
              </v-tab>
              <v-tab value="estadisticas" prepend-icon="mdi-chart-bar">
                Estadísticas y Reportes
              </v-tab>
            </v-tabs>
          </v-card>

        </v-col>
      </v-row>

      <!-- CONTENIDO DINÁMICO -->
      <v-row>
        <v-col cols="12">
          
          <v-window v-model="vistaActual">
            
            <!-- TAB 1: REGISTRO RÁPIDO -->
            <v-window-item value="rapido">
              <v-card elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert type="info" variant="tonal" class="mb-4" prominent>
                    <v-alert-title>⚡ Registro Rápido de Clientes</v-alert-title>
                    <div>
                      Registra clientes de forma rápida con la información mínima necesaria.
                      Ideal para el mostrador cuando hay clientes esperando.
                    </div>
                  </v-alert>

                  <!-- Componente de registro rápido -->
                  <RegistroRapido 
                    @notification="(message, type) => emit('notification', message, type)"
                    @cliente-registrado="manejarClienteRegistrado"
                  />

                  <!-- Estadísticas rápidas después del registro -->
                  <v-card elevation="2" rounded="lg" class="mt-6">
                    <v-card-title class="pa-4 bg-grey-lighten-4">
                      <v-icon class="mr-2">mdi-chart-box</v-icon>
                      Resumen de Registros
                    </v-card-title>
                    <v-card-text class="pa-4">
                      <v-row>
                        <v-col cols="12" sm="6" md="3">
                          <div class="text-center">
                            <v-chip color="purple" size="large" class="mb-2">
                              {{ estadisticas.total }}
                            </v-chip>
                            <div class="text-body-2">Clientes Totales</div>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <div class="text-center">
                            <v-chip color="green" size="large" class="mb-2">
                              {{ estadisticas.hoy }}
                            </v-chip>
                            <div class="text-body-2">Registrados Hoy</div>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <div class="text-center">
                            <v-chip color="blue" size="large" class="mb-2">
                              {{ estadisticas.estaSemana }}
                            </v-chip>
                            <div class="text-body-2">Esta Semana</div>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                          <div class="text-center">
                            <v-btn
                              @click="vistaActual = 'lista'"
                              color="purple"
                              variant="outlined"
                              size="small"
                              prepend-icon="mdi-eye"
                            >
                              Ver Lista
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- TAB 2: LISTA DE CLIENTES -->
            <v-window-item value="lista">
              <v-card elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert
                    type="success"
                    variant="tonal"
                    class="mb-4"
                    prominent
                  >
                    <v-alert-title>📋 Clientes Registrados</v-alert-title>
                    <div>
                      Visualiza y gestiona todos los clientes registrados en el sistema.
                      Total de clientes: {{ clientesRegistrados.length }}
                    </div>
                  </v-alert>

                  <!-- Acciones de la lista -->
                  <v-card elevation="2" rounded="lg" class="mb-4">
                    <v-card-text class="pa-4">
                      <div class="d-flex justify-space-between align-center flex-wrap ga-2">
                        <div class="text-subtitle-1 font-weight-medium">
                          Gestión de Lista ({{ clientesRegistrados.length }} clientes)
                        </div>
                        <div class="d-flex ga-2 flex-wrap">
                          <v-btn
                            @click="exportarClientes"
                            color="blue"
                            variant="outlined"
                            size="small"
                            prepend-icon="mdi-download"
                          >
                            Exportar CSV
                          </v-btn>
                          <v-btn
                            @click="vaciarLista"
                            color="error"
                            variant="text"
                            size="small"
                            prepend-icon="mdi-delete-sweep"
                            :disabled="clientesRegistrados.length === 0"
                          >
                            Vaciar Lista
                          </v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>

                  <!-- Lista de clientes -->
                  <v-card elevation="4" rounded="lg" v-if="clientesRegistrados.length > 0">
                    <v-card-title class="pa-4 bg-grey-lighten-4">
                      <v-icon class="mr-2">mdi-account-multiple</v-icon>
                      Clientes Activos ({{ clientesRegistrados.length }})
                    </v-card-title>

                    <v-list>
                      <template v-for="(cliente, index) in clientesRegistrados" :key="cliente.id">
                        
                        <v-list-item class="pa-4">
                          
                          <template v-slot:prepend>
                            <v-avatar color="purple" class="mr-4">
                              <v-icon color="white">mdi-account</v-icon>
                            </v-avatar>
                          </template>

                          <v-list-item-title class="text-h6 mb-2">
                            {{ cliente.nombre }}
                          </v-list-item-title>
                          
                          <v-list-item-subtitle>
                            <div class="d-flex align-center flex-wrap ga-2">
                              <v-chip
                                color="info"
                                variant="tonal"
                                size="small"
                                prepend-icon="mdi-identifier"
                              >
                                ID: {{ cliente.id }}
                              </v-chip>
                              
                              <v-chip
                                color="success"
                                variant="tonal"
                                size="small"
                                prepend-icon="mdi-calendar"
                              >
                                {{ new Date(cliente.fechaRegistro).toLocaleDateString('es-AR', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) }}
                              </v-chip>

                              <v-chip
                                color="grey"
                                variant="text"
                                size="small"
                                prepend-icon="mdi-clock"
                              >
                                hace {{ tiempoTranscurrido(cliente.timestamp) }}
                              </v-chip>
                            </div>
                          </v-list-item-subtitle>

                          <template v-slot:append>
                            <div class="d-flex flex-column align-end ga-2">

                              <!-- Acciones -->
                              <div class="d-flex ga-1">
                                <v-btn
                                  icon
                                  size="small"
                                  color="primary"
                                  variant="text"
                                  @click="emit('notification', 'Función de edición próximamente', 'info')"
                                  title="Editar cliente"
                                >
                                  <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                                
                                <v-btn
                                  icon
                                  size="small"
                                  color="info"
                                  variant="text"
                                  @click="emit('notification', `Detalles de ${cliente.nombre}`, 'info')"
                                  title="Ver detalles"
                                >
                                  <v-icon>mdi-eye</v-icon>
                                </v-btn>
                                
                                <v-btn
                                  icon
                                  size="small"
                                  color="error"
                                  variant="text"
                                  @click="eliminarCliente(cliente.id)"
                                  title="Eliminar cliente"
                                >
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
                              </div>

                            </div>
                          </template>

                        </v-list-item>

                        <v-divider v-if="index < clientesRegistrados.length - 1" />

                      </template>
                    </v-list>
                  </v-card>

                  <!-- Estado vacío de clientes -->
                  <v-card v-else elevation="2" rounded="lg" class="text-center pa-8">
                    <v-avatar size="120" color="grey-lighten-3" class="mb-4">
                      <v-icon size="60" color="grey-lighten-1">mdi-account-off</v-icon>
                    </v-avatar>
                    
                    <div class="text-h5 text-medium-emphasis mb-3">
                      No hay clientes registrados
                    </div>
                    
                    <div class="text-body-1 text-medium-emphasis mb-4">
                      Comienza agregando clientes usando el registro rápido.<br>
                      Los clientes aparecerán aquí una vez registrados.
                    </div>
                    
                    <v-btn
                      @click="vistaActual = 'rapido'"
                      color="purple"
                      prepend-icon="mdi-account-plus"
                      size="large"
                    >
                      Registrar Primer Cliente
                    </v-btn>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- TAB 3: ESTADÍSTICAS Y REPORTES -->
            <v-window-item value="estadisticas">
              <v-card elevation="0" rounded="lg">
                <v-card-text>
                  <v-alert
                    type="warning"
                    variant="tonal"
                    class="mb-4"
                    prominent
                  >
                    <v-alert-title>📊 Estadísticas y Reportes</v-alert-title>
                    <div>
                      Análisis detallado y métricas de los clientes registrados en el sistema.
                    </div>
                  </v-alert>

                  <!-- Grid de estadísticas detalladas -->
                  <v-row class="mb-6">
                    
                    <!-- Stat 1: Total Clientes -->
                    <v-col cols="12" sm="6" md="3">
                      <v-card elevation="4" rounded="lg" class="h-100 text-center">
                        <v-card-text class="pa-6">
                          <v-avatar size="60" color="purple" class="mb-3">
                            <v-icon size="30" color="white">mdi-account-group</v-icon>
                          </v-avatar>
                          
                          <div class="text-h3 font-weight-bold text-purple mb-1">
                            {{ estadisticas.total }}
                          </div>
                          
                          <div class="text-subtitle-1 mb-2">
                            Total Clientes
                          </div>

                          <v-chip
                            color="purple"
                            variant="tonal"
                            size="small"
                          >
                            Base de datos
                          </v-chip>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Stat 2: Registros Hoy -->
                    <v-col cols="12" sm="6" md="3">
                      <v-card elevation="4" rounded="lg" class="h-100 text-center">
                        <v-card-text class="pa-6">
                          <v-avatar size="60" color="green" class="mb-3">
                            <v-icon size="30" color="white">mdi-calendar-today</v-icon>
                          </v-avatar>
                          
                          <div class="text-h3 font-weight-bold text-green mb-1">
                            {{ estadisticas.hoy }}
                          </div>
                          
                          <div class="text-subtitle-1 mb-2">
                            Registros Hoy
                          </div>

                          <v-chip
                            :color="estadisticas.hoy > 0 ? 'green' : 'grey'"
                            variant="tonal"
                            size="small"
                          >
                            {{ new Date().toLocaleDateString('es-AR', { weekday: 'long' }) }}
                          </v-chip>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Stat 3: Esta Semana -->
                    <v-col cols="12" sm="6" md="3">
                      <v-card elevation="4" rounded="lg" class="h-100 text-center">
                        <v-card-text class="pa-6">
                          <v-avatar size="60" color="blue" class="mb-3">
                            <v-icon size="30" color="white">mdi-calendar-week</v-icon>
                          </v-avatar>
                          
                          <div class="text-h3 font-weight-bold text-blue mb-1">
                            {{ estadisticas.estaSemana }}
                          </div>
                          
                          <div class="text-subtitle-1 mb-2">
                            Esta Semana
                          </div>

                          <v-chip
                            color="blue"
                            variant="tonal"
                            size="small"
                          >
                            Últimos 7 días
                          </v-chip>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <!-- Stat 4: Promedio Diario -->
                    <v-col cols="12" sm="6" md="3">
                      <v-card elevation="4" rounded="lg" class="h-100 text-center">
                        <v-card-text class="pa-6">
                          <v-avatar size="60" color="orange" class="mb-3">
                            <v-icon size="30" color="white">mdi-chart-line</v-icon>
                          </v-avatar>
                          
                          <div class="text-h3 font-weight-bold text-orange mb-1">
                            {{ estadisticas.promedioDiario }}
                          </div>
                          
                          <div class="text-subtitle-1 mb-2">
                            Promedio/Día
                          </div>

                          <v-chip
                            color="orange"
                            variant="tonal"
                            size="small"
                          >
                            Últimos 30 días
                          </v-chip>
                        </v-card-text>
                      </v-card>
                    </v-col>

                  </v-row>

                  <!-- Resumen por períodos -->
                  <v-row class="mb-6">
                    <v-col cols="12">
                      <v-card elevation="4" rounded="lg">
                        <v-card-title class="pa-4 bg-grey-lighten-4">
                          <v-icon class="mr-2">mdi-calendar-range</v-icon>
                          Resumen por Períodos
                        </v-card-title>
                        
                        <v-card-text class="pa-6">
                          <v-row class="text-center">
                            <v-col cols="12" md="4">
                              <div class="mb-4">
                                <div class="text-h5 font-weight-bold text-success">
                                  {{ Math.round((estadisticas.hoy / estadisticas.total) * 100) || 0 }}%
                                </div>
                                <div class="text-body-1">Registros de Hoy</div>
                                <v-progress-linear
                                  :model-value="(estadisticas.hoy / estadisticas.total) * 100"
                                  color="success"
                                  height="8"
                                  rounded
                                  class="mt-2"
                                />
                              </div>
                            </v-col>
                            
                            <v-col cols="12" md="4">
                              <div class="mb-4">
                                <div class="text-h5 font-weight-bold text-info">
                                  {{ Math.round((estadisticas.estaSemana / estadisticas.total) * 100) || 0 }}%
                                </div>
                                <div class="text-body-1">Esta Semana</div>
                                <v-progress-linear
                                  :model-value="(estadisticas.estaSemana / estadisticas.total) * 100"
                                  color="info"
                                  height="8"
                                  rounded
                                  class="mt-2"
                                />
                              </div>
                            </v-col>
                            
                            <v-col cols="12" md="4">
                              <div class="mb-4">
                                <div class="text-h5 font-weight-bold text-warning">
                                  {{ estadisticas.total > 0 ? Math.round(estadisticas.total / 30) : 0 }}
                                </div>
                                <div class="text-body-1">Crecimiento Mensual</div>
                                <v-progress-linear
                                  :model-value="75"
                                  color="warning"
                                  height="8"
                                  rounded
                                  class="mt-2"
                                />
                              </div>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Gráfico placeholder -->
                  <v-row>
                    <v-col cols="12">
                      <v-card elevation="4" rounded="lg">
                        <v-card-title class="pa-4 bg-grey-lighten-4">
                          <v-icon class="mr-2">mdi-chart-bar</v-icon>
                          Registros por Día (Últimos 7 días)
                        </v-card-title>
                        
                        <v-card-text class="pa-6 text-center">
                          <v-avatar size="100" color="grey-lighten-3" class="mb-4">
                            <v-icon size="50" color="grey-lighten-1">mdi-chart-bar</v-icon>
                          </v-avatar>
                          
                          <div class="text-h6 text-medium-emphasis mb-2">
                            Gráfico Interactivo en Desarrollo
                          </div>
                          
                          <div class="text-body-2 text-medium-emphasis mb-4">
                            Próximamente: Gráficos con Chart.js o similar para mostrar tendencias de registro
                          </div>

                          <v-btn
                            color="purple"
                            variant="outlined"
                            prepend-icon="mdi-chart-line"
                            disabled
                          >
                            Ver Gráfico Detallado
                          </v-btn>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-window-item>

          </v-window>
          
        </v-col>
      </v-row>

      <!-- ACCIONES GLOBALES -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-card elevation="2" rounded="lg">
            <v-card-title class="pa-4 bg-grey-lighten-4">
              <v-icon class="mr-2">mdi-cog</v-icon>
              Acciones de Gestión
            </v-card-title>
            
            <v-card-text class="pa-4">
              <div class="d-flex justify-center flex-wrap ga-4">
                
                <v-btn
                  @click="vistaActual = 'rapido'"
                  color="purple"
                  size="large"
                  prepend-icon="mdi-account-plus"
                >
                  Nuevo Cliente
                </v-btn>
                
                <v-btn
                  @click="exportarClientes"
                  color="blue"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-download"
                  :disabled="clientesRegistrados.length === 0"
                >
                  Exportar Lista
                </v-btn>
                
                <v-btn
                  @click="emit('notification', 'Importación de clientes próximamente', 'info')"
                  color="green"
                  variant="outlined"
                  size="large"
                  prepend-icon="mdi-upload"
                >
                  Importar Clientes
                </v-btn>
                
                <v-btn
                  @click="router.push('/')"
                  variant="text"
                  size="large"
                  prepend-icon="mdi-home"
                >
                  Volver al Inicio
                </v-btn>

              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- DEBUG INFO
      <v-row class="mt-6">
        <v-col cols="12">
          <v-expansion-panels variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-bug</v-icon>
                Debug: Vista de Clientes (Parte D)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact">
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>✅ Componente cargado correctamente</v-list-item-title>
                    <v-list-item-subtitle>Estado: {{ loading ? 'Cargando...' : 'Listo' }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>✅ Navegación por pestañas</v-list-item-title>
                    <v-list-item-subtitle>Vista actual: {{ vistaActual }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>✅ Gestión de clientes</v-list-item-title>
                    <v-list-item-subtitle>Registrados: {{ clientesRegistrados.length }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>✅ Estadísticas calculadas</v-list-item-title>
                    <v-list-item-subtitle>Total: {{ estadisticas.total }}, Hoy: {{ estadisticas.hoy }}, Semana: {{ estadisticas.estaSemana }}</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="success">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>✅ Funciones implementadas</v-list-item-title>
                    <v-list-item-subtitle>Registro, eliminación, exportación, navegación</v-list-item-subtitle>
                  </v-list-item>

                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon color="warning">mdi-alert-circle</v-icon>
                    </template>
                    <v-list-item-title>⚠️ Funcionalidades pendientes</v-list-item-title>
                    <v-list-item-subtitle>Edición de clientes, importación, gráficos detallados</v-list-item-subtitle>
                  </v-list-item>

                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    -->
    </v-container>
  </div>
</template>
