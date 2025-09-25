<script setup>
// Importamos las funciones necesarias de Vue
// ref: para variables reactivas
// computed: para validaciones y estados calculados
// watch: para reaccionar a cambios en variables específicas
import { ref, computed, watch } from 'vue'

// Estado del formulario
const nombreCliente = ref('')
const emailCliente = ref('')
const telefonoCliente = ref('')
const mensajeConfirmacion = ref('')
const mensajeError = ref('')

// Estado para controlar si el formulario ha sido enviado (para mostrar validaciones)
const formularioEnviado = ref(false)

// Computed properties para validaciones individuales
// Estas se recalculan automáticamente cuando cambian los campos correspondientes

// Validación del nombre: debe tener al menos 3 caracteres
const nombreValido = computed(() => {
  return nombreCliente.value.trim().length >= 3
})

// Validación del email: debe tener formato válido
const emailValido = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailCliente.value.trim() === '' || emailRegex.test(emailCliente.value.trim())
})

// Validación del teléfono: debe ser solo números y tener al menos 8 dígitos
const telefonoValido = computed(() => {
  const telefonoLimpio = telefonoCliente.value.replace(/\D/g, '')
  return telefonoCliente.value.trim() === '' || telefonoLimpio.length >= 8
})

// Computed property para determinar si todo el formulario es válido
const formularioValido = computed(() => {
  return nombreValido.value && 
         emailValido.value && 
         telefonoValido.value &&
         nombreCliente.value.trim() !== ''
})

// Computed properties para mensajes de error específicos
const errorNombre = computed(() => {
  if (!formularioEnviado.value && nombreCliente.value === '') return ''
  if (nombreCliente.value.trim() === '') return 'El nombre es obligatorio'
  if (!nombreValido.value) return 'El nombre debe tener al menos 3 caracteres'
  return ''
})

const errorEmail = computed(() => {
  if (!formularioEnviado.value && emailCliente.value === '') return ''
  if (emailCliente.value.trim() !== '' && !emailValido.value) {
    return 'El formato del email no es válido'
  }
  return ''
})

const errorTelefono = computed(() => {
  if (!formularioEnviado.value && telefonoCliente.value === '') return ''
  if (telefonoCliente.value.trim() !== '' && !telefonoValido.value) {
    return 'El teléfono debe tener al menos 8 dígitos'
  }
  return ''
})

// Computed properties para clases CSS dinámicas de los inputs
const claseInputNombre = computed(() => {
  if (nombreCliente.value === '' && !formularioEnviado.value) return 'form-input'
  return nombreValido.value && nombreCliente.value.trim() !== '' 
    ? 'form-input input-valid' 
    : 'form-input input-error'
})

const claseInputEmail = computed(() => {
  if (emailCliente.value === '') return 'form-input'
  return emailValido.value 
    ? 'form-input input-valid' 
    : 'form-input input-error'
})

const claseInputTelefono = computed(() => {
  if (telefonoCliente.value === '') return 'form-input'
  return telefonoValido.value 
    ? 'form-input input-valid' 
    : 'form-input input-error'
})

// Watcher para limpiar mensajes de error cuando el usuario corrige los datos
watch([nombreValido, emailValido, telefonoValido], () => {
  if (mensajeError.value && formularioValido.value) {
    mensajeError.value = ''
  }
})

// Función para formatear el teléfono mientras el usuario escribe
const formatearTelefono = () => {
  // Removemos todo lo que no sea número
  let telefono = telefonoCliente.value.replace(/\D/g, '')
  
  // Limitamos a 15 dígitos (estándar internacional)
  telefono = telefono.substring(0, 15)
  
  // Aplicamos formato argentino: +54 9 11 1234-5678
  if (telefono.length >= 10) {
    telefono = telefono.replace(/(\d{2})(\d{1})(\d{2})(\d{4})(\d{4})/, '+54 $2 $3 $4-$5')
  } else if (telefono.length >= 8) {
    telefono = telefono.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3')
  } else if (telefono.length >= 4) {
    telefono = telefono.replace(/(\d{4})(\d+)/, '$1-$2')
  }
  
  telefonoCliente.value = telefono
}

// Función para manejar el registro del cliente
const registrarCliente = () => {
  // Marcamos que el formulario fue enviado para activar todas las validaciones
  formularioEnviado.value = true
  
  // Limpiamos mensajes previos
  mensajeConfirmacion.value = ''
  mensajeError.value = ''
  
  // Verificamos si el formulario es válido
  if (!formularioValido.value) {
    mensajeError.value = 'Por favor corrige los errores antes de continuar'
    return
  }
  
  // Preparamos los datos del cliente
  const datosCliente = {
    id: Date.now(),
    nombre: nombreCliente.value.trim(),
    email: emailCliente.value.trim() || null,
    telefono: telefonoCliente.value.replace(/\D/g, '') || null,
    fechaRegistro: new Date().toISOString()
  }
  
  // Simulamos el guardado en base de datos
  console.log('💾 Registrando cliente con validación:', datosCliente)
  
  // Mostramos mensaje de éxito personalizado
  mensajeConfirmacion.value = `¡Bienvenido/a ${datosCliente.nombre}! Tu registro ha sido procesado exitosamente.`
  
  // Reiniciamos el formulario
  limpiarFormulario()
  
  // Ocultamos el mensaje después de 4 segundos
  setTimeout(() => {
    mensajeConfirmacion.value = ''
  }, 4000)
}

// Función para limpiar el formulario
const limpiarFormulario = () => {
  nombreCliente.value = ''
  emailCliente.value = ''
  telefonoCliente.value = ''
  formularioEnviado.value = false
  mensajeError.value = ''
}

// Función para validar en tiempo real mientras el usuario escribe
const validarEnTiempoReal = (campo) => {
  // Solo validamos en tiempo real después del primer envío
  if (!formularioEnviado.value) return
  
  // Limpiamos errores si el campo ahora es válido
  if (campo === 'nombre' && nombreValido.value) {
    // El error se limpia automáticamente por la computed property
  }
  // Similar para otros campos...
}
</script>

<template>
  <div class="registro-container">
    <!-- Header del componente -->
    <div class="registro-header">
      <h2>👥 Registro de Clientes con Validación</h2>
      <p>Complete los datos del cliente. Los campos marcados con * son obligatorios.</p>
    </div>

    <!-- Formulario de registro -->
    <form @submit.prevent="registrarCliente" novalidate>
      
      <!-- Campo Nombre (obligatorio) -->
      <div class="form-group">
        <label for="nombre" class="form-label required">
          Nombre completo *
        </label>
        <input
          type="text"
          id="nombre"
          v-model="nombreCliente"
          :class="claseInputNombre"
          placeholder="Ingrese el nombre completo del cliente"
          maxlength="100"
          @blur="validarEnTiempoReal('nombre')"
        >
        <!-- Mensaje de error específico para el nombre -->
        <transition name="fade">
          <div v-if="errorNombre" class="error-message">
            {{ errorNombre }}
          </div>
        </transition>
      </div>

      <!-- Campo Email (opcional) -->
      <div class="form-group">
        <label for="email" class="form-label">
          Email (opcional)
        </label>
        <input
          type="email"
          id="email"
          v-model="emailCliente"
          :class="claseInputEmail"
          placeholder="cliente@ejemplo.com"
          maxlength="100"
          @blur="validarEnTiempoReal('email')"
        >
        <!-- Mensaje de error específico para el email -->
        <transition name="fade">
          <div v-if="errorEmail" class="error-message">
            {{ errorEmail }}
          </div>
        </transition>
      </div>

      <!-- Campo Teléfono (opcional) -->
      <div class="form-group">
        <label for="telefono" class="form-label">
          Teléfono (opcional)
        </label>
        <input
          type="tel"
          id="telefono"
          v-model="telefonoCliente"
          :class="claseInputTelefono"
          placeholder="Ej: 11 1234-5678"
          @input="formatearTelefono"
          @blur="validarEnTiempoReal('telefono')"
        >
        <!-- Mensaje de error específico para el teléfono -->
        <transition name="fade">
          <div v-if="errorTelefono" class="error-message">
            {{ errorTelefono }}
          </div>
        </transition>
      </div>

      <!-- Indicador visual de validez del formulario -->
      <div class="form-status">
        <div v-if="formularioValido" class="status-valid">
          ✅ Formulario completo y válido
        </div>
        <div v-else-if="nombreCliente.trim() !== ''" class="status-invalid">
          ⚠️ {{ !nombreValido ? 'Complete el nombre correctamente' : 'Revise los datos ingresados' }}
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="form-actions">
        <button
          type="button"
          @click="limpiarFormulario"
          class="btn btn-outline"
          :disabled="nombreCliente === '' && emailCliente === '' && telefonoCliente === ''"
        >
          Limpiar Formulario
        </button>
        
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!formularioValido"
          :class="{ 'btn-disabled': !formularioValido }"
        >
          {{ formularioValido ? 'Registrar Cliente' : 'Complete los datos requeridos' }}
        </button>
      </div>
    </form>

    <!-- Mensaje de error general -->
    <transition name="fade">
      <div v-if="mensajeError" class="message message-error">
        {{ mensajeError }}
      </div>
    </transition>

    <!-- Mensaje de confirmación -->
    <transition name="fade">
      <div v-if="mensajeConfirmacion" class="message message-success">
        {{ mensajeConfirmacion }}
      </div>
    </transition>

    <!-- Panel de información para el desarrollador -->
    <!--
    <div class="debug-panel">
      <h4>🔧 Panel de Desarrollo (Debug)</h4>
      <div class="debug-info">
        <div class="debug-item">
          <strong>Nombre válido:</strong> 
          <span :class="nombreValido ? 'valid' : 'invalid'">
            {{ nombreValido ? '✅' : '❌' }}
          </span>
        </div>
        <div class="debug-item">
          <strong>Email válido:</strong>
          <span :class="emailValido ? 'valid' : 'invalid'">
            {{ emailValido ? '✅' : '❌' }}
          </span>
        </div>
        <div class="debug-item">
          <strong>Teléfono válido:</strong>
          <span :class="telefonoValido ? 'valid' : 'invalid'">
            {{ telefonoValido ? '✅' : '❌' }}
          </span>
        </div>
        <div class="debug-item">
          <strong>Formulario válido:</strong>
          <span :class="formularioValido ? 'valid' : 'invalid'">
            {{ formularioValido ? '✅' : '❌' }}
          </span>
        </div>
      </div>
    </div>
  -->
  </div>
</template>

<style scoped>
    .registro-container {
      max-width: 600px;
      margin: 2rem auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    /* Header */
    .registro-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }

    .registro-header h2 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
    }

    .registro-header p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.95rem;
    }

    /* Formulario */
    form {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.95rem;
    }

    .form-label.required::after {
      content: '';
      margin-left: 0.25rem;
    }

    /* Inputs con estados visuales */
    .form-input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s ease;
      box-sizing: border-box;
      background: white;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input.input-valid {
      border-color: #27ae60;
      background-color: #f8fff8;
    }

    .form-input.input-valid:focus {
      border-color: #27ae60;
      box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
    }

    .form-input.input-error {
      border-color: #e74c3c;
      background-color: #fff8f8;
    }

    .form-input.input-error:focus {
      border-color: #e74c3c;
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }

    /* Mensajes de error */
    .error-message {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.3rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .error-message::before {
      content: '⚠️';
      font-size: 0.8rem;
    }

    /* Estado del formulario */
    .form-status {
      margin: 1.5rem 0;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
    }

    .status-valid {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .status-invalid {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* Acciones del formulario */
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
      flex: 1;
      min-width: 160px;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5a6fd8;
      transform: translateY(-2px);
    }

    .btn-primary.btn-disabled {
      background: #bdc3c7;
      color: #7f8c8d;
      cursor: not-allowed;
      transform: none;
    }

    .btn-outline {
      background: transparent;
      color: #7f8c8d;
      border: 2px solid #bdc3c7;
    }

    .btn-outline:hover:not(:disabled) {
      background: #7f8c8d;
      color: white;
      border-color: #7f8c8d;
    }

    .btn:disabled {
      cursor: not-allowed;
      transform: none;
    }

    /* Mensajes de estado */
    .message {
      margin: 1.5rem 2rem;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      text-align: center;
    }

    .message-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* Panel de debug */
    .debug-panel {
      background: #2c3e50;
      color: white;
      padding: 1.5rem;
      margin-top: 2rem;
    }

    .debug-panel h4 {
      margin: 0 0 1rem 0;
      color: #ecf0f1;
      font-size: 1rem;
    }

    .debug-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.75rem;
    }

    .debug-item {
      background: #34495e;
      padding: 0.75rem;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .debug-item strong {
      color: #bdc3c7;
      font-size: 0.85rem;
    }

    .debug-item .valid {
      color: #2ecc71;
    }

    .debug-item .invalid {
      color: #e74c3c;
    }

    /* Animaciones */
    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
      transform: translateY(-10px);
    }

    /* Responsividad */
    @media (max-width: 768px) {
      .registro-container {
        margin: 1rem;
      }

      .registro-header {
        padding: 1.5rem 1rem;
      }

      form {
        padding: 1.5rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        min-width: auto;
      }

      .debug-info {
        grid-template-columns: 1fr;
      }

      .message {
        margin-left: 1rem;
        margin-right: 1rem;
      }
    }

    /* Estados de hover para mejor UX */
    .form-input:hover {
      border-color: #bdc3c7;
    }

    .form-input.input-valid:hover {
      border-color: #27ae60;
    }

    .form-input.input-error:hover {
      border-color: #e74c3c;
    }

    /* Placeholder styling */
    .form-input::placeholder {
      color: #95a5a6;
      opacity: 1;
    }

    /* Focus-visible para accesibilidad */
    .btn:focus-visible {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    .form-input:focus-visible {
      outline: 2px solid #667eea;
      outline-offset: -2px;
    }
</style>