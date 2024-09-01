

<template>
  <div class="home">
    <h1>Welcome to Social Chatting</h1>
    <LoginForm v-if="!isLoggedIn" />
    <div v-else>
      <button @click="logout">Logout</button>
    </div>
    <router-link to="/signup">Sign up</router-link>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LoginForm from '../components/LoginForm.vue';

export default {
  components: { LoginForm },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoggedIn = computed(() => store.state.isLoggedIn);

    const logout = async () => {
      await store.dispatch('logout');
      await router.push('/');
    };

    return { isLoggedIn, logout };
  }
}
</script>
