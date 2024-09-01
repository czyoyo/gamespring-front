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
  flex: 1; /* Available space */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
  max-height: 80vh; /* Maximum height of the messages container */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Ensure messages are aligned to the bottom */
}

.message-item {
  margin-bottom: 0.5rem; /* Space between messages */
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
import {ref, onMounted, onUnmounted, watch} from 'vue';
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

      // 이전 채팅 내용 불러오기
      store.dispatch('fetchMessages', { roomId: '1' }).then((res) => {
        console.log("이전 채팅 내용", res)
        messages.value = res;
      });


      if(socket.connected) {
        // 방 입장 시 서버에 알림
        console.log("방 입장")
        socket.emit('enter', { roomId: '1' });
      }

      socket.on('userEntered', (message) => {
        console.log("유저 입장", message)
        // console.log("메시지", messages)
        messages.value.push(message);
      });

      // 소켓 연결 시 메시지 수신 준비 message 이벤트 수신
      socket.on('message', (message) => {
        console.log("메시지 수신", message)
        messages.value.push(message);
      });

      socket.on('userLeft', (message) => {
        console.log("유저 퇴장", message)
        messages.value.push(message);
      })

      socket.on('roomUsers', (users) => {
        console.log("방 유저", users)
        roomUsers.value = users;
      })

    });

    onUnmounted(() => {
      socket.off('message');
      socket.off('userEntered');
      socket.off('userLeft');
      socket.off('roomUsers');
    })

    // 자동 스크롤을 위한 watcher
    watch(messages, () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    });

    const sendMessage = () => {
      console.log("메시지 전송")
      console.log(newMessage.value)
      if (newMessage.value.trim()) {
        console.log("트림 완료")
        socket.emit('message', {
          content: newMessage.value,
          roomId: '1'
        });
        newMessage.value = '';
      }
    };

    return { messages, newMessage, sendMessage, roomUsers };
  }
}
</script>
