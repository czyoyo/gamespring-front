<template>
  <div class="chat">
    <h1>Chat Room</h1>
    <ChatRoom />
  </div>
</template>

<script>
import ChatRoom from '../components/ChatRoom.vue';
import UserList from "../components/UserList.vue";

export default {
  components: {UserList, ChatRoom }
}
</script>
