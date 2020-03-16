import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {	//声明定义的状态
	  user:{username:'admin'}
  },
  
  mutations: {	//可以改变状态的异步操作的方法
	  //第一个参数，暴露给你的state,第二个参数就是传递提交的参数
	  login(state,obj){
	    //转换对象
		state.user=obj;
	  }
  },
  actions: { //最终执行的动作，调用mutations
	/* incrementAsync ({ commit },obj) {
		 console.log("@@@@@@@@@@@@@@@action");
	     setTimeout(() => {
	       commit('login',obj)
	     }, 1000)
	   }
	   */
  },
  modules: {
  }
})
