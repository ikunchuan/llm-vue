import {createStore} from 'vuex'

//创建一个新的store实例
const store = createStore({
    state () {
      return {
        username:'Messi',
        count: 0
      }
    },
    mutations: {
      increment (state) {
        state.count++
      }
    }
  })

export default store