import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* 引入emementui */
import ElementUI from 'element-ui'; 
import 'element-ui/lib/theme-chalk/index.css'; 
Vue.use(ElementUI);
/* 引入axios */
import axios from 'axios' 
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
//支持跨域访问配置 
axios.defaults.withCredentials = true
Vue.config.productionTip = false

//全局前置守卫 
router.beforeEach((to, from, next) => {
	//to即将要进入的目标 路由对象,from 当前导航正要离开的路由,next 钩子函数
	console.log("从这个路由：" + from.path + "@" + from.name + "@到to" + to.path + "@" + to.name)
	if (to.path == "/usermenu") {
		console.log("走的usermenu");
		//查询菜单
		axios.get('http://localhost:/menu/selectMenuByUsername', {
			params: {
				username: 'lisi'
			}
		}).then((res) => {
			//1.获取菜单资源
			let array = res.data.result;
			//2.把菜单转换成路由
			let arrayRouters = setRouter(array);
			//转换的结果有问题
			console.log("打印结果：" + arrayRouters);
			//3. 赋值给指定的路由的嵌套路由children
			router.options.routes[1].children = arrayRouters;
			//4.把路由对象加入到路由的处理器中
			router.addRoutes(router.options.routes);
		});
	} else {
		console.log("/////")
	}
	//判断to.name是否为空
		if(to.name){
		}else{
			//重新走test
			router.replace({path:'/usermenu'})
		}
	setTimeout(()=>{
		next();
	},600)
	
});

//定义的方法
export const setRouter = (array) => {
	//定义转换的结果
	let newRouters = [];
	//遍历数组
	for (let i = 0; i < array.length; i++) {
		/*二级菜单*/
		var children = [];
		//判断二级菜单是否为空，不为空的情况判断是否是数组
		if (array[i].menus && array[i].menus instanceof Array) {
			//递归处理
			children = setRouter(array[i].menus);
		}
		//创建新的路由对象
		let newRouter = {
			path: array[i].path,
			name: array[i].name,
			children: children,
			iconCls:array[i].iconCls
		}
		console.log(newRouter);
		//获取的名称就是 views视图文件下面 PerRole.vue的文件名称PerRole 或者PerUser.vue名称：PerUser 其它同样
		let componentName = array[i].component;
		newRouter.component = () => import( /* webpackChunkName: "about" */ './views/' + componentName + '.vue');
		//存入
		newRouters.push(newRouter);
	}
	return newRouters;
};


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
