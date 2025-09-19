<!--

PRÁCTTCO 1: Registro Rápido de Clientes

Este componente Vue.js implementa un formulario simple para registrar clientes rápidamente
usando las tecnicas fundamenales de Vue 3 y Composition API.

-->

<script setup>

/**
 *  Importaciones necesarias
 *
 * ref: Crea variables reactivas para valores primitivos (string, number, boolean).
 * Esto es por que JavaScript no pueda detectar cambios en esos valores primitivos nativamente.
 * Vue envuelve esos valores en un objeto reactivo.
 *
 * Documentacion oficial: https://vuejs.org/api/reactivity-core.html#ref
 * */
import { ref, Transition } from 'vue';

/**
 * Estado Reactivo de un Componente
 *
 * En <>script setup</> todas las variables declaradas estan automaticamente disponibles
 * en el template del componente, ya que estas son reactivas y no es necesario retornarlas.
 *
 * Reactivo: significa que Vue "escucha" los cambios en esas variables y actualiza
 * automaticamente el DOM cuando esas variables cambian, es decir, si una variable cambia
 * Vue automaticamente actualiza cualquier parte del <template> que dependa de esa variable.
 * */

// Variable reactiva para almacenar el nombre que escribe el usuario.
const nombreCliente = ref('');

// Variable reactiva para mostrar mensaje de confirmacion.
const mensajeConfirmacion = ref('');

/**
 * ¿Estas son realmente variables? tecnicamente no, son constantes que contiene una referencia
 * a un objeto reactivo, pero se comportan como variables. El desglose es el siguiente:
 *
 * - const: La referencia a la variable no cambia, es decir, no puedes reasignar 'nombreCliente' a otro valor.
 * - nombreCliente: Es el nombre de la variable
 * - ref(''): Crea un objeto reactivo que contiene el valor inicial (una cadena vacia en este caso).
 *
 * -------------------------------------------------------------
 * Lo que realmente sucede internamente:
 * const nombreCliente = ref('')
 *
 * Es equivalente a:
 * const nombreCliente = {
 *  value: '',
 *      + métodos internos de Vue para reactividad
 *      + proxies para detectar cambios
 *      + sistema de dependencias
 * }
 * -------------------------------------------------------------
 */

 /**
  * Funciones del componente
  *
  * Las funciones declaradas en <>script setup</> tambien estan automaticamente
  * disponibles en el template del componente para  usar en eventos (@click, @submit, etc.)
 */

 /**
  * Funcion que se ejecuta cuando se envia el formulario.
  * Valida que el nombre no este vacio, simula el guardado y muestra un mensaje de confirmacion.
 */
const registrarCliente = () => {

    // Obtener el valor usando .value y eliminamos espacios en blanco al inicio y final.
    // ¿Por qué .value? Porque ref() encapsula el valor en un objeto proxy
    // En el template Vue lo desenvuelve automáticamente, pero en JavaScript necesitamos .value
    const nombre = nombreCliente.value.trim()

    // Validacion: verificar que hay un nombre valido
    if (!nombre) {
        alert('Por favor ingrese un nombre válido')
        return
    }

    // SIMULACION DE GUARDADO -- NO VALIDO EN PRODUCCION
    // Guardado en base de datos
    // En una aplicación real, aquí se hace una petición HTTP al backend
    console.log('Guardando cliente:', {
        id: Date.now(), // ID simulado con timestamp
        nombre: nombre,
        fechaRegistro: new Date().toISOString(), // Fecha actual en formato ISO
    })

    // Mostrar mensaje personalizado de bienvenida
    mensajeConfirmacion.value = `¡Bienvenido/a ${nombre}! Cliente registrado exitosamente.`

    // Limpiar el formulario para el siguiente cliente
    nombreCliente.value = ''

    // Ocultar mensaje después de 3 segundos para mejor UX
    setTimeout(() => {
      mensajeConfirmacion.value = ''
    }, 3000)
}

</script>

<template>
    <!--
        TEMPLATE: Define la estructura HTML del componente.

        Aquí usamos la sintaxis de template de Vue que incluye:
            - Interpolación con {{ }} para mostrar datos
            - Directivas como v-model, v-if, @event
            - Binding de atributos con :attribute

        Vue automáticamente enlaza las variables reactivas y funciones declaradas en
        <script setup> con este template.
    -->

    <div class="container">
        <!-- Header informativo -->
        <div>
            <h1>Registro Rápido de Clientes</h1>
            <p>Sistema de Gestion Tienda - Version Estatica</p>
        </div>

        <!--
            Formulario con prevencion del comportamiento por defecto
            @submit.prevent: Escucha el evento submit y previene que se recargue la pagina
            .prevent es un modificador de evento que evita el comportamiento por defecto

            Documentacion oficial: https://vuejs.org/guide/essentials/event-handling.html#event-modifiers
        -->
        <form @submit.prevent="registrarCliente">
            <div class="form-group">
                <label for="nombreCliente">Nombre del Cliente:</label>

                <!--
                  v-model: Crea binding bidireccional entre input y variable
                  Significa que:
                  1. Cuando el usuario escribe, nombreCliente se actualiza automáticamente
                  2. Si nombreCliente cambia por código, el input se actualiza

                  Es equivalente a:
                  :value="nombreCliente" @input="nombreCliente = $event.target.value"

                  Documentación: https://vuejs.org/guide/essentials/forms.html#basic-usage
                -->
                <input
                    type="text"
                    id="nombreCliente"
                    v-model="nombreCliente"
                    placeholder="Escriba el nombre del cliente..."
                    maxlength="50"
                    class="form-input"
                />
            </div>

            <!--
              Botón con estado dinámico
              :disabled: Binding reactivo del atributo disabled
              El botón se deshabilita cuando no hay texto válido (solo espacios o vacío)

              ¿Por qué trim()? Para evitar que espacios en blanco al final o al principio se consideren válidos
            -->
            <button type="submit" class="btn btn-primary":disabled="!nombreCliente.trim()">
                Registrar Cliente
            </button>
        </form>

        <!--
          Mensaje de confirmación condicional
          v-if: Renderiza el elemento solo si la condición es verdadera
          transition: Agrega animaciones suaves al aparecer/desaparecer

          ¿Cuándo usar v-if vs v-show?
          - v-if: Remueve/agrega el elemento del DOM (mejor para cosas que cambian poco)
          - v-show: Solo cambia display:none/block (mejor para toggles frecuentes)

          Documentación: https://vuejs.org/guide/essentials/conditional.html#v-if
        -->
        <transition name="fade">
            <div v-if="mensajeConfirmacion" class="message success">
                {{ mensajeConfirmacion }}
            </div>
        </transition>
    </div>
</template>

<style scoped>
    /*
      ESTILOS: CSS con scope local al componente

      scoped: Estos estilos solo afectan este componente, no otros
      Vue agrega automáticamente atributos únicos para aislar los estilos
      ¿Por qué scoped? Evita conflictos de CSS entre componentes

      Documentación: https://vuejs.org/api/sfc-css-features.html#scoped-css
    */

    /* Contenedor principal con diseño centrado */
    .container {
      max-width: 500px;
      margin: 2rem auto;
      background: white;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      padding: 2rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    /* Header del componente */
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .header h1 {
      color: #333;
      margin: 0;
      font-size: 1.5rem;
    }
    
    .header p {
      color: #666;
      margin: 0.5rem 0 0 0;
      font-size: 0.9rem;
    }
    
    /* Grupos de formulario con espaciado consistente */
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    /* Etiquetas de formulario */
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }
    
    /* Estilos para inputs */
    .form-input {
      width: 100%;
      padding: 0.8rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
      box-sizing: border-box;
    }
    
    /* Estado focus del input (cuando está seleccionado) */
    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    /* Estilos base para botones */
    .btn {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }
    
    /* Variante primaria del botón */
    .btn-primary {
      background: #667eea;
      color: white;
    }
    
    /* Efecto hover del botón primario */
    .btn-primary:hover:not(:disabled) {
      background: #5a6fd8;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
    }
    
    /* Estado deshabilitado del botón */
    .btn:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    /* Estilos para mensajes de confirmación */
    .message {
      margin-top: 1.5rem;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
    }
    
    /* Variante de éxito del mensaje */
    .message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    /* Animaciones de transición */
    .fade-enter-active,
    .fade-leave-active {
      transition: all 0.3s ease;
    }
    
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
      transform: translateY(-10px);
    }
</style>