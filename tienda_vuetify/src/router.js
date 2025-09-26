import { createRouter, createWebHistory } from 'vue-router'

// Importación de componentes reales de las vistas
import InicioView from './views/InicioView.vue'
import ProductosView from './views/ProductosView.vue'
import ProductoDetalleView from './views/ProductoDetalleView.vue'
import ClientesView from './views/ClientesView.vue'
import CarritoView from './views/CarritoView.vue'

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: InicioView
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductosView
  },
  {
    path: '/productos/:id',
    name: 'ProductoDetalle',
    component: ProductoDetalleView,
    props: true // Pasar el id como prop
  },
  {
    path: '/carrito',
    name: 'Carrito',
    component: CarritoView
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: ClientesView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Restaurar scroll position en navegación (ayuda con estados "atascados")
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  }
})

export default router
