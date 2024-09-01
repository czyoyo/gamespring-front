<template>
  <div class="direct-message">
    <h2>DM</h2>
    <div class="messages" ref="messagesContainer">
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

<style scoped>
.direct-message {
  display: flex;
  flex-direction: column;
  height: 50vh;
  padding: 1rem;
}

.messages {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.message-item {
  margin-bottom: 0.5rem;
}

form {
  display: flex;
  gap: 0.5rem;
}

input {
  flex: 1;
}

button {
  cursor: pointer;
}
</style>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
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
    const messagesContainer = ref(null);

    onMounted(() => {
      socket.connectSocket(store.state.token);
      const socketInstance = socket.getSocket();

      // 이전 채팅 내용 불러오기

      // room id 는 현재 회원 인덱스와 상대방 회원 인덱스를 합쳐 sort 한 값
      console.log("Current user ID:", store.state.user.id);
      console.log("Recipient ID:", recipientId.value);
      const roomId = [store.state.user.id, recipientId.value].sort().join('_');
      console.log("Room ID:", roomId);
      store.dispatch('fetchMessages', roomId).then((fetchedMessages) => {
        messages.value = fetchedMessages;
      });

      if (socketInstance) {
        // DM 메시지 수신
        socketInstance.on('privateMessage', (message) => {
          messages.value.push(message);
        });

      } else {
        console.error("Socket instance is not available");
      }
    });

    onUnmounted(() => {
      const socketInstance = socket.getSocket();
      if (socketInstance) {
        socketInstance.off('privateMessage');
        socketInstance.off('disconnect');
        socket.disconnectSocket();
      }
    });

    // 자동 스크롤을 위한 watcher
    watch(messages, () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });

    const sendMessage = () => {
      const socketInstance = socket.getSocket();
      if (socketInstance && newMessage.value.trim()) {
        console.log("Sending private message");
        socketInstance.emit('privateMessage', {
          content: newMessage.value,
          receiverId: recipientId.value
        });
        console.log("Message sent");
        newMessage.value = '';
      } else {
        console.error("Socket instance is not available or message is empty");
      }
    };

    return { messages, newMessage, sendMessage, messagesContainer };
  }
}
</script>
