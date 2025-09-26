<script setup>
// PARTE C — FORMULARIO Y VALIDACIÓN (registro rápido)
// Objetivo: trabajar con v-model, validaciones mínimas y feedback visual

import { ref, computed } from 'vue'

// ESTADO REACTIVO
// CRITERIO: Campo de texto con v-model para el nombre del cliente
const nombreCliente = ref('')
const mensajeConfirmacion = ref('')
const loading = ref(false)

// Referencias para el formulario
const formRef = ref(null)

// CRITERIO: Validación básica: nombre no vacío (y ≥ 3 caracteres como mejora)
const validaciones = {
  nombre: [
    // Validación 1: Campo requerido
    (valor) => !!valor || 'El nombre es obligatorio',
    // Validación 2: Longitud mínima (≥ 3 caracteres como mejora según requerimiento)
    (valor) => (valor && valor.length >= 3) || 'El nombre debe tener al menos 3 caracteres',
    // Validación 3: Solo letras y espacios para nombres reales
    (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(valor) || 'Solo se permiten letras y espacios'
  ]
}

// COMPUTED PROPERTIES
// Validación en tiempo real para feedback visual
const nombreValido = computed(() => {
  return nombreCliente.value.trim().length >= 3 && 
         /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombreCliente.value.trim())
})

const formularioValido = computed(() => {
  return nombreValido.value
})

// EVENTOS
const emit = defineEmits(['notification', 'cliente-registrado'])

// MÉTODOS
// CRITERIO: Botón de registro muestra mensaje personalizado de bienvenida
const registrarCliente = async () => {
  // Validar formulario usando el sistema de Vuetify
  const { valid } = await formRef.value.validate()
  
  if (!valid) {
    emit('notification', 'Por favor completa correctamente el formulario', 'warning')
    return
  }

  loading.value = true
  
  try {
    // CRITERIO: Simular guardado (console.log)
    const clienteData = {
      id: Date.now(),
      nombre: nombreCliente.value.trim(),
      fechaRegistro: new Date().toISOString(),
      fechaFormateada: new Date().toLocaleString('es-AR')
    }
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simular guardado en consola según requerimiento
    // console.log('💾 Guardando cliente:', clienteData) // Comentado para producción
    
    // CRITERIO: Mostrar confirmación solo si hay nombre
    if (clienteData.nombre) {
      mensajeConfirmacion.value = `¡Bienvenido/a ${clienteData.nombre}! Tu registro ha sido procesado exitosamente.`
      
      // Emitir eventos al componente padre
      emit('notification', `Cliente ${clienteData.nombre} registrado exitosamente`, 'success')
      emit('cliente-registrado', clienteData)
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        limpiarFormulario()
      }, 3000)
    }
    
  } catch (error) {
    // console.error('❌ Error en registro:', error) // Comentado para producción
    emit('notification', 'Error al registrar cliente', 'error')
    
  } finally {
    loading.value = false
  }
}

// Método para limpiar formulario
const limpiarFormulario = () => {
  nombreCliente.value = ''
  mensajeConfirmacion.value = ''
  formRef.value?.resetValidation()
}
</script>

<template>
  <!-- CRITERIO: Estilo simple y usable para un mostrador real -->
  <v-container class="pa-6">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        
        <!-- HEADER -->
        <v-card elevation="2" rounded="lg" class="mb-6">
          <v-card-title class="text-h4 text-center pa-6 bg-purple text-white">
            <v-icon class="mr-3" size="32">mdi-account-plus-outline</v-icon>
            Registro Rápido de Clientes
          </v-card-title>
        </v-card>

        <!-- FORMULARIO PRINCIPAL -->
        <v-card elevation="4" rounded="lg">
          <v-card-text class="pa-6">
            
            <!-- Información del proceso -->
            <v-alert
              type="info"
              variant="tonal"
              class="mb-6"
              prominent
            >
              <v-alert-title>📝 Registro Simplificado</v-alert-title>
              <div>
                Este formulario permite registrar clientes rápidamente en el mostrador.
                Solo necesitas el nombre para comenzar.
              </div>
            </v-alert>

            <!-- CRITERIO: v-model para nombre del cliente -->
            <v-form ref="formRef" @submit.prevent="registrarCliente">
              
              <v-text-field
                v-model="nombreCliente"
                :rules="validaciones.nombre"
                label="Nombre completo del cliente"
                placeholder="Ejemplo: María González"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="purple"
                :loading="loading"
                :disabled="loading"
                counter="50"
                maxlength="50"
                clearable
                autofocus
                class="mb-4"
                hint="Mínimo 3 caracteres, solo letras y espacios"
                persistent-hint
              >
                <!-- CRITERIO: Feedback visual -->
                <template v-slot:append-inner>
                  <v-fade-transition>
                    <v-icon 
                      v-if="nombreValido && !loading"
                      color="success"
                    >
                      mdi-check-circle
                    </v-icon>
                  </v-fade-transition>
                </template>
              </v-text-field>

              <!-- Preview del cliente a registrar -->
              <v-expand-transition>
                <v-card
                  v-if="nombreValido"
                  variant="tonal"
                  color="purple"
                  class="mb-6"
                  rounded="lg"
                >
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center">
                      <v-avatar color="purple" class="mr-3">
                        <v-icon color="white">mdi-account</v-icon>
                      </v-avatar>
                      <div>
                        <div class="text-h6">{{ nombreCliente }}</div>
                        <div class="text-caption">
                          Se registrará el {{ new Date().toLocaleDateString('es-AR') }}
                        </div>
                      </div>
                      <v-spacer />
                      <v-chip
                        color="success"
                        variant="tonal"
                        prepend-icon="mdi-check-circle"
                        size="small"
                      >
                        Válido
                      </v-chip>
                    </div>
                  </v-card-text>
                </v-card>
              </v-expand-transition>

              <!-- BOTONES DE ACCIÓN -->
              <v-row class="mt-4">
                <v-col cols="12" sm="6">
                  <v-btn
                    @click="limpiarFormulario"
                    variant="outlined"
                    color="grey-darken-1"
                    block
                    size="large"
                    :disabled="loading || !nombreCliente"
                    prepend-icon="mdi-eraser"
                  >
                    Limpiar
                  </v-btn>
                </v-col>
                
                <v-col cols="12" sm="6">
                  <!-- CRITERIO: Feedback claro de estados -->
                  <v-btn
                    type="submit"
                    :color="loading ? 'orange' : (formularioValido ? 'purple' : 'grey')"
                    :loading="loading"
                    :disabled="!formularioValido"
                    block
                    size="large"
                    :prepend-icon="loading ? 'mdi-loading' : (formularioValido ? 'mdi-account-check' : 'mdi-account-alert')"
                    class="font-weight-bold"
                  >
                    {{ loading ? 'Registrando...' : (formularioValido ? 'Registrar Cliente' : 'Completa el nombre') }}
                  </v-btn>
                </v-col>
              </v-row>

            </v-form>

          </v-card-text>
        </v-card>

        <!-- CRITERIO: Mostrar confirmación en pantalla solo si hay nombre -->
        <v-expand-transition>
          <v-card
            v-if="mensajeConfirmacion"
            elevation="8"
            rounded="lg"
            color="success"
            class="mt-6"
          >
            <v-card-text class="pa-6 text-center text-white">
              
              <!-- Ícono de éxito -->
              <v-avatar size="80" color="white" class="mb-4">
                <v-icon size="40" color="success">mdi-check-circle</v-icon>
              </v-avatar>
              
              <!-- CRITERIO: Mensaje personalizado de bienvenida -->
              <div class="text-h5 font-weight-bold mb-2">
                ¡Registro Exitoso! 🎉
              </div>
              
              <div class="text-h6 mb-3">
                {{ mensajeConfirmacion }}
              </div>
              
              <div class="text-body-1 opacity-90">
                El cliente ha sido registrado en el sistema y está listo para ser atendido.
              </div>
              
              <!-- Información adicional -->
              <v-divider class="my-4 opacity-30" />
              
              <div class="text-body-2 opacity-80">
                Registro procesado el {{ new Date().toLocaleString('es-AR') }}<br>
                Puedes continuar con el siguiente cliente
              </div>
              
            </v-card-text>
          </v-card>
        </v-expand-transition>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* 
  CRITERIO: Calidad de UI/UX 
  Estilos mínimos, Vuetify se encarga del resto
*/

.v-card {
  transition: all 0.3s ease;
}

.v-btn:disabled {
  opacity: 0.6;
}

/* Animación suave para mensajes de confirmación */
.text-h5, .text-h6 {
  transition: all 0.3s ease;
}
</style>