<template>
	<el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="80px" class="login">
		<h3 class="login_title">登录界面</h3>
		<!--el-from-item 用户名-->
		<el-form-item label="用户名" prop="username">
			<el-input v-model="loginForm.username"></el-input>
		</el-form-item>

		<!--el-from-item 用户密码-->
		<el-form-item label="用户密码" prop="password">
			<el-input v-model="loginForm.password" show-password></el-input>
		</el-form-item>

		<!--el-from-item 记住密码-->
		<el-form-item>
			<el-checkbox label="记住密码"></el-checkbox>
		</el-form-item>
		<!--el-from-item 按钮-->
		<el-form-item>
			<el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
			<el-button @click="resetForm('loginForm')">重置</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				loginForm: {
					username: 'lisi',
					password: '123'
				},
				loginRules: {
					username: [{
						required: true,
						message: '请输入登录名称',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '请输入登录密码',
							trigger: 'blur'
						},
						{
							min: 3,
							max: 12,
							message: '长度在3到12 个字符',
							trigger: 'blur'
						}
					],
				}
			}
		},
		methods: {
			submitForm(formName) {
				//表单验证
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//发送登录请求
						this.axios.post('http://localhost:/user/login',this.loginForm).then((res)=>{
							//判断登录结果
							if(res.data.code==10001){
								this.username=res.data.result.username;
								//提交的方式 触发的是 mutations方法
								this.$store.commit('login',res.data.result);
								//跳转
								this.$router.replace({path:"/usermenu"});
							}else{
								console.log("登录失败");
							}
							
						});
						
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>

<style>
	.login {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 180px auto;
		width: 350px;
		padding: 35px 35px 15px 35px;
		background: #fff;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
	}

	.login_title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #505458;
	}
</style>
