import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Chat from '../views/Chat.vue';
import Users from '../views/Users.vue';
import store from '../store';
import defaultPage from "../views/Default.vue";

const routes = [
  { path: '/', component: Home },
  {path: '/default', component: defaultPage, meta: { requiresAuth: true }},
  { path: '/chat', component: Chat, meta: { requiresAuth: true } },
  { path: '/users', component: Users, meta: { requiresAuth: true } },
  { path: '/dm/:id', component: () => import('../components/DirectMessage.vue'), meta: { requiresAuth: true } },
  { path: '/signup', component: () => import('../components/SignupForm.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
