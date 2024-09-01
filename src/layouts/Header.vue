<template>
  <div id="header">
    <nav v-if="isLoggedIn">
      <router-link to="/chat">Chat</router-link> |
      <router-link to="/users">Users</router-link> |
      <button @click="logout">Logout</button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.state.isLoggedIn);

const logout = async () => {
  await store.dispatch('logout');
  await router.push('/');
};
</script>

<style scoped>
/* Header 스타일 */
</style>
