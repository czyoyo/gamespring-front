<template>
  <div class="chat-room">
    <div class="messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" class="message-item">
        <strong v-if="message.type === 'system'">
          <text>{{ message.content }}</text>
        </strong>
        <strong v-else>
          <text>{{ message.sender?.username }}: </text>
          <text>{{ message.content }}</text>
        </strong>
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="newMessage" type="text" placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
    <div>
      <h2>Users</h2>
      <ul>
        <li v-for="user in roomUsers" :key="user.id">
          {{ user }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.chat-room {
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import socket from '../services/socket';

export default {
  setup() {
    const store = useStore();
    const messages = ref([]);
    const newMessage = ref('');
    const roomUsers = ref([]);
    const messagesContainer = ref(null);

    onMounted(() => {
      // 소켓 연결
      socket.connectSocket(store.state.token);
      const socketInstance = socket.getSocket();

      // 이전 채팅 내용 불러오기
      store.dispatch('fetchMessages', '1').then((res) => {
        console.log("이전 채팅 내용 불러오기", res);
        messages.value = res;
      });

      // 방 입장 시 서버에 알림
      socketInstance.emit('enter', {roomId: '1'});

      // 입장 이벤트 수신
      socketInstance.on('userEntered', (message) => {
        messages.value.push(message);
      });
      // 메시지 수신
      socketInstance.on('message', (message) => {
        messages.value.push(message);
      });
      // 퇴장 이벤트 수신
      socketInstance.on('userLeft', (message) => {
        messages.value.push(message);
      });
      // 방에 있는 유저 목록 수신
      socketInstance.on('roomUsers', (users) => {
        roomUsers.value = users;
      });
    });

    onUnmounted(() => {
      const socketInstance = socket.getSocket();
      socketInstance.off('message');
      socketInstance.off('userEntered');
      socketInstance.off('userLeft');
      socketInstance.off('roomUsers');
      socket.disconnectSocket(); // 소켓 연결 해제
    });

    // 자동 스크롤을 위한 watcher
    watch(messages, () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });

    const sendMessage = () => {
      const socketInstance = socket.getSocket();
      if (newMessage.value.trim()) {
        socketInstance.emit('message', {
          content: newMessage.value,
          roomId: '1'
        });
        newMessage.value = '';
      }
    };

    return {messages, newMessage, sendMessage, roomUsers};
  }
}
</script>
