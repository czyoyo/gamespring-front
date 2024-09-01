<template>
  <form @submit.prevent="login">
    <input v-model="username" type="text" placeholder="Username" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <button type="submit">로그인</button>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const username = ref('');
    const password = ref('');

    const login = async () => {
      try {
        await store.dispatch('login', { username: username.value, password: password.value });
        await store.dispatch('fetchUser').then(() => {});
        await router.push('/default');
      } catch (error) {
        console.error('Login failed:', error);
        // 에러 처리 로직 (예: 사용자에게 알림)
      }
    };

    return { username, password, login };
  }
}
</script>
