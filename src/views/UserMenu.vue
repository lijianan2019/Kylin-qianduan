<template>
	<el-container class="home-container">
		<el-header class="home-header">
		        <i class="home_title" style="margin-right: 15px">快速开发平台</i>
		        <el-dropdown  @command="handleCommand">
		            <span style="margin-right: 50px">{{this.$store.state.user.username}}</span>
		          <el-dropdown-menu slot="dropdown">
		            <el-dropdown-item command="a">个人信息</el-dropdown-item>
					<el-dropdown-item command="b">修改密码</el-dropdown-item>
					<el-dropdown-item command="c">退出</el-dropdown-item>
		          </el-dropdown-menu>
		        </el-dropdown>
	</el-header>
			 
		<el-container >
			<el-aside width="200px" class="home-aside">
				<el-menu router background-color="pink">
					<!--一级菜单-->
					<el-submenu :index="index+''" v-for="(item,index) in this.$router.options.routes[1].children">
						<!--标题-->
						<template slot="title">
							 <i :class="item.iconCls"></i>
							<span>{{item.name}}</span>
						</template>

						<!--菜单项所在的组-->
						<el-menu-item-group>
							<!--菜单项（二级菜单）-->
							<el-menu-item :index="sub.path" v-for="(sub) in item.children">{{sub.name}}</el-menu-item>
						</el-menu-item-group>

					</el-submenu>
				</el-menu>
			</el-aside>
			
			<el-main>
				<!--三级路由-->
				<router-view />
			</el-main>

		</el-container>

	</el-container>
</template>

<script>
	export default{
		methods:{
			handleCommand(command){
				if(command=='a'){
					console.log("个人信息");
				}else if(command=='b'){
					console.log("修改密码");
				}else{
					this.$confirm('你确定要退出吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {
					
						//输出拼接后的结果
						this.axios.get('http://localhost:/user/loginout').then((response) => {
							//清空state数据
							this.$store.state.user={username:''};
							//回到登录页面
							this.$router.replace({path:"/"});
						});
							}).catch(()=>{
									this.$message({
										type: 'info',
										message: '暂不退出'
										
									});
									
							});
				}
			}
		}
	}
</script>

<style>
	
	.home-container {
	  height: 100%;
	  position: absolute;
	  top: 0px;
	  left: 0px;
	  width: 100%;
	}
	
	.home-header {
	  background-color: #00ffff;
	  color: #333;
	  text-align: center;
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  box-sizing: content-box;
	  padding: 0px;
	}
	
	.home_title {
	  color: #ffff00;
	  font-size: 22px;
	  display: inline;
	  margin-left: 8px;
	}
	
	.home-aside {
	  background-color: #ececec;
	}
</style>
