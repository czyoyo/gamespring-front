<template>
  <div class="direct-message">
    <h2>DM</h2>
    <div class="messages">
      <div v-for="message in messages" :key="message.id">
        <strong>{{ message.sender.username }}:</strong> {{ message.content }}
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="newMessage" type="text" placeholder="Type a message...">
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import socket from '../services/socket';

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const messages = ref([]);
    const newMessage = ref('');
    const recipientId = computed(() => route.params.id);
    const roomId = ref('');


    onMounted(async () => {

      console.log("룸 아이디", roomId.value);

      if(socket.connected) {
        socket.emit('enter', { roomId: roomId.value });
      }


      // 메시지 수신 준비
      socket.on('privateMessage', (message) => {
        console.log("Message received", message);
        messages.value.push(message);
      });

      // 방에서 나가기
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        socket.emit('leave', { roomId: recipientId.value });
      });

    });

    const sendMessage = () => {
      if (newMessage.value.trim()) {
        console.log("Sending private message");
        socket.emit('privateMessage', {
          content: newMessage.value,
          receiverId: recipientId.value
        });
        console.log("Message sent");
        newMessage.value = '';
      }
    };

    return { messages, newMessage, sendMessage };
  }
}
</script>
