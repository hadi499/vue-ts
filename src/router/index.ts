import { createRouter, createWebHistory ,RouteLocationNormalized, NavigationGuardNext,Router } from 'vue-router';
// import type { RouteLocationNormalized, NavigationGuardNext,Router } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Products from '../views/Products.vue';
import CreateProduct from '../views/CreateProduct.vue';
import ProductDetail from '../components/ProductDetail.vue';
import EditProduct from '../views/EditProduct.vue';

import { useAuthStore } from '../stores/auth';

// Definisikan tipe untuk meta route
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
  }
}

// Buat router
const router: Router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresAuth: false },
    },
    {
      path: '/products',
      name: 'products',
      component: Products,
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/products/create',
      name: 'create-product',
      component: CreateProduct,
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id/edit',
      name: 'edit-product',
      component: EditProduct,
      meta: { requiresAuth: true }
    },
  ],
});

// Navigation guard
// _from -> aslinya from -- untuk menghilangkan warning
router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    next('/login');
  } else if (to.path === '/login' && authStore.token) {
    next('/'); // Redirect ke home jika sudah login
  } else {
    next();
  }
});

export default router;