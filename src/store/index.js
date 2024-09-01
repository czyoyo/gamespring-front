import { createStore } from 'vuex';
import api from '../services/api';

export default createStore({
  state: {
    user: null,
    users: [],
    token: null,
    isLoggedIn: false
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      state.isLoggedIn = true;
    },
    removeToken(state) {
      state.token = null;
      state.isLoggedIn = false;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setUser(state, user) {
      state.user = user;
    },
  },


  actions: {

    async login({ commit }, credentials) { // commit 은 mutation 을 호출
      const response = await api.login(credentials);
      await commit('setToken', response.data.data.token);
      localStorage.setItem('token', response.data.data.token);
      console.log("로그인 성공 토큰", response.data.data.token)
    },


    async signup(_, userData) {
      await api.signup(userData);
    },


    async logout({ commit }) {
      await api.logout();
      commit('setUser', null);
      commit('removeToken')
      commit('setUsers', []);
      localStorage.removeItem('token');
    },


    async fetchUsers({commit}) {
      const response = await api.getUsers();
      commit('setUsers', response.data.data);
      return response.data.data;
    },

    // 현재 사용자 정보 state에 저장
    async fetchUser({commit}) {
      const response = await api.getUser();
      console.log("유저 정보 가져옴", response.data.data)
      commit('setUser', response.data.data);
      return response.data.data;
    },

    async fetchMessages(_, roomId) {
      const response = await api.getMessages(roomId);
      return response.data.data;
    }


  },
});
