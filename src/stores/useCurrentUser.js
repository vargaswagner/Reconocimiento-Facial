// stores/store.js
import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('CurrentUserStore', {
  state: () => {
    return {
      currentUser: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null, // Aquí definimos la variable global currentUser
    }
  },

  getters: {
    valores: state => state.currentUser,
  },
  actions: {
    // 👉 Set the currentUser
    setCurrentUser(userData) {
      localStorage.setItem('userData', JSON.stringify(userData))
      this.currentUser = userData
    },
  },
})
