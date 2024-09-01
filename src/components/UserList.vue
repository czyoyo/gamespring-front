<template>
  <div class="user-list">
    <h2>Users</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        {{user.username}}
        <button @click="startDM(user)">DM</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const users = ref([]);

    onMounted(async () => {
      users.value = await store.dispatch('fetchUsers');
    });

    const startDM = (user) => {
      router.push(`/dm/${user.username}`);
    };

    return { users, startDM };
  }
}
</script>
