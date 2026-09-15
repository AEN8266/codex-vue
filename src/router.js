import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import DashboardView from './DashboardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: App },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
  ],
})

router.beforeEach((to) => {
  if (to.name === 'dashboard' && !sessionStorage.getItem('codex-vue-username')) return { name: 'login' }
})

export default router
