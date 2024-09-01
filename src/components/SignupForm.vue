<template>
  <form @submit.prevent="signup">
    <input v-model="username" type="text" placeholder="Username" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <button type="submit">Sign up</button>
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

    const signup = async () => {
      try {
        await store.dispatch('signup', { username: username.value, password: password.value });
        await router.push('/'); // Redirect to home page
      } catch (error) {
        console.error('Signup failed:', error);
        // 에러 처리 로직
      }
    };

    return { username, password, signup };
  }
}
</script>
