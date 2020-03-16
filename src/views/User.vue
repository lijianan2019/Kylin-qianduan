<template>
	<div>
		<h1>欢迎进入视图界面</h1>

		<el-row>
			<el-col :span="24">
				<el-button type="primary" size="mini" icon="el-icon-edit" @click="handleOpenUserInsertDialog()">添加用户</el-button>
				<el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeletes()">批量删除</el-button>

			</el-col>
		</el-row>
		<!-- 搜索框 -->
		<el-row>
			<el-col :span="6">
				用户电话:<el-input v-model="searchParam.phone" style="width: 60%;" placeholder="请输入电话号码"></el-input>
			</el-col>
			<el-col :span="6">
				用户名称:<el-input v-model="searchParam.name" style="width: 60%;" placeholder="请输入名称"></el-input>
			</el-col>
			<el-col :span="6">
				<el-button type="primary" size="medium" icon="el-icon-search" @click="initData()">搜索</el-button>
			</el-col>
		</el-row>
		<!--表格-->
		<el-table :data="tableData" @selection-change="selectionChange">

			</el-table-column>
			<!--全选反选的列-->
			<el-table-column type="selection" width="55"></el-table-column>

			<el-table-column prop="id" label="ID"></el-table-column>
			<!--特殊处理某个字段 template模板 slot-scope="scope" -->
			<el-table-column label="头像">
				<template slot-scope="scope">
					<el-image style="width: 60px; height: 60px" :src="scope.row.userface"></el-image>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="姓名"></el-table-column>
			
			<el-table-column prop="sex" label="性别">
				<template slot-scope="scope">
					<span v-if="scope.row.sex==1">男</span>
					<span v-else>女</span>
				</template>
				
			</el-table-column>	
			
			<el-table-column prop="phone" label="电话"></el-table-column>
			<el-table-column label="用户所在的地址">
				<template slot-scope="scope">
					{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.districtName}}
				</template>

			</el-table-column>
			<el-table-column prop="rnameZhs" label="用户角色"></el-table-column>
			<!--没有prop属性-->
			<el-table-column label="操作">
				<!--模板 会暴露scope-->
				<template slot-scope="scope">
					<el-button type="success" size="mini" icon="el-icon-edit" @click="handleRoles(scope.row)">授权角色</el-button>
					<el-button type="info" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdits(scope.row)">详情</el-button>
					<el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>

		</el-table>
		<!--细讲分页-->
		<el-pagination background layout="prev,pager,next,jumper,total,sizes" :total="total" :current-page="current"
		 :page-size="size" :page-sizes="sizes" @current-change="handleCurrentChange" @size-change="handleSizeChange">
		</el-pagination>



		<!--////////////////////////////////////添加用户对话框开始////////////////////////////////////////////-->
		<el-dialog :visible.sync="insertUserDialog" title="用户添加" center>
			<!--ref代表的是form引用-->
			<el-form ref="insertUserForm" :model="insertUserForm" :rules="insertUserFormRules" label-width="100px">
				<!--el-form-item-->
				<el-form-item label="用户名称" prop="name">
					<el-input type="text" v-model="insertUserForm.name" placeholder="请输入用户名" clearable></el-input>
				</el-form-item>
				<el-form-item label="用户头像">
					<el-upload class="avatar-uploader" action="http://localhost:/upload" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :show-file-list="false">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<!--用户电话-->
				<el-form-item label="用户电话" prop="phone">
					<el-input type="text" v-model="insertUserForm.phone" placeholder="请输入电话" clearable></el-input>
				</el-form-item>
				<!--用户地址-->
				<el-form-item label="用户地址" prop="address">
					<!--
					<el-input type="text" v-model="insertUserForm.address" placeholder="请输入用户名" clearable></el-input>
				   -->
					<el-cascader :options="options" style="width: 100%;" @change="change"></el-cascader>
				</el-form-item>
				<!--用户性别-->
				<el-form-item label="用户性别" prop="sex">
					<el-radio-group v-model="insertUserForm.sex">
						<el-radio :label="1">男</el-radio>
						<el-radio :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<!--提交按钮-->
				<el-form-item>
					<el-button type="primary" size="mini" @click="handleInsertForm('insertUserForm')">保存</el-button>
					<el-button type="info" size="mini" @click="resetForm('insertUserForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--////////////////////////////////////添加用户对话框结束////////////////////////////////////////////-->

		<!--//////////////////////////////用户角色授权对话框//////////////////////////-->

		<el-dialog :visible.sync="roleDialog" title="用户角色授权" center>
			<!--ref代表的是form引用-->
			<el-form ref="roleForm" :model="roleForm" label-width="100px">
				<el-form-item label="角色列表">
					<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
					<div style="margin: 15px 0;"></div>
					<el-checkbox-group v-model="checkedRoles" @change="handleCheckedRoleChange">
						<el-checkbox v-for="role in roles" :label="role.id">{{role.nameZh}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<!--提交按钮-->

				<el-form-item>
					<el-button type="primary" size="mini" @click="handleRoleForm()">保存</el-button>
					<el-button type="info" size="mini" @click="resetCheckedRoel('roleForm')">重置</el-button>
				</el-form-item>

			</el-form>
		</el-dialog>
		<!--//////////////////////////////用户角色授权//////////////////////////-->

		<!--////////////////////////////////////编辑用户对话框开始////////////////////////////////////////////-->
		<el-dialog :visible.sync="editUserDialog" title="用户修改" center>
			<!--ref代表的是form引用-->
			<el-form ref="editUserForm" :model="editUserForm" label-width="100px">
				<!--el-form-item-->
				<el-form-item label="用户名称" prop="name">
					<el-input type="text" v-model="editUserForm.name" placeholder="请输入用户名" clearable></el-input>
				</el-form-item>
				<el-form-item label="用户头像">
					<el-upload class="avatar-uploader" action="http://localhost:/upload" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :show-file-list="false">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<!--用户电话-->
				<el-form-item label="用户电话" prop="phone">
					<el-input type="text" v-model="editUserForm.phone" placeholder="请输入电话" clearable></el-input>
				</el-form-item>

				<!--用户地址-->
				<el-form-item label="用户地址">
					<el-cascader v-model="values" :options="options" style="width: 100%;" @change="cascaderUpdateChange"></el-cascader>
				</el-form-item>

				<!--用户性别-->
				<el-form-item label="用户性别" prop="sex">
					<el-radio-group v-model="editUserForm.sex">
						<el-radio :label="1">男</el-radio>
						<el-radio :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<!--提交按钮-->
				<el-form-item>
					<el-button type="primary" size="mini" @click="handleEditForm()">保存</el-button>
					<el-button type="info" size="mini" @click="resetForm('editUserForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--////////////////////////////////////编辑用户对话框结束////////////////////////////////////////////-->

		<!--////////////////////////////////////详情用户对话框开始////////////////////////////////////////////-->
		<el-dialog :visible.sync="editUserDialogs" title="详情" center>
			<!--ref代表的是form引用-->
			<el-form ref="editUserForm" :model="editUserForm" label-width="100px">
				<!--el-form-item-->
				<el-form-item label="用户名称" prop="name">
					<el-input type="text" v-model="editUserForm.name" placeholder="请输入用户名" clearable></el-input>
				</el-form-item>
				<el-form-item label="用户头像">
					<el-upload class="avatar-uploader" action="http://localhost:/upload" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :show-file-list="false">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<!--用户电话-->
				<el-form-item label="用户电话" prop="phone">
					<el-input type="text" v-model="editUserForm.phone" placeholder="请输入电话" clearable></el-input>
				</el-form-item>

				<!--用户地址-->
				<el-form-item label="用户地址">
					<el-cascader v-model="values" :options="options" style="width: 100%;" @change="cascaderUpdateChange"></el-cascader>
				</el-form-item>

				<!--用户性别-->
				<el-form-item label="用户性别" prop="sex">
					<el-radio-group v-model="editUserForm.sex">
						<el-radio :label="1">男</el-radio>
						<el-radio :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
				searchParam: { //搜索的数据
					phone: '',
					name: ''
				},
				values: [], //三级联动回显的数据
				uid: 0, //用户的id
				roles: [], //角色数组
				checkedRoles: [], //默认回显的数据
				checkAll: false, //默认不全选
				isIndeterminate: true, //设置 indeterminate 状态，只负责样式控制
				roleDialog: false, //角色的对话框，默认不显示
				roleForm: {}, //角色表单
				options: [], //三级联动的数据
				imageUrl: '', //头像上传成功的地址
				tableData: [], //表格显示的数据
				selection: [], //记录全选/反选的结果
				total: 0, //总记录数
				size: 3, //每页显示的条目数  默认值
				current: 1, //当前页
				sizes: [3, 5, 8], //每页显示的条目数的数组,
				insertUserDialog: false, //添加对话框是否可见的标识，默认为false
				insertUserForm: { //添加存放的数据
					name: 'lisxwu',
					sex: 1,
					phone: '18622101513',
					address: '内蒙古呼和浩特',
					userface: "",
					province: 0,
					city: 0,
					district: 0,
				},
				insertUserFormRules: { //添加的字段的验证
					name: [{
							required: true,
							message: '请输入用户名称',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 15,
							message: '长度在 5 到 15个字符',
							trigger: 'blur'
						}
					],
					phone: [{
						required: true,
						message: '请输入用户名称',
						trigger: 'blur'
					}]
				},
				editUserDialog: false, //编辑对话框
				editUserForm: { //修改的数据存放
					id: '',
					name: '',
					sex: 0,
					phone: '',
					address: '',
					userface: "",
					province: 0,
					city: 0,
					district: 0,
				},
				editUserDialogs: false, //编辑详情对话框
			}
		},
		created() {
			this.initData(); //初始化数据的方法
			this.initCascader(); //初始化三级联动的数据
			this.initRoles(); //初始化角色
		},
		methods: {
			initRoles() { //用户授权的权限信息查询
				this.axios.get('http://localhost:/role/list').then((res) => {
					this.roles = res.data.result;
				})
			},
			initCascader() { //地区查询，三级联动数据
				this.axios.get('http://localhost:/nation/list').then((res) => {
					console.log(res)
					this.options = res.data.result;
				});
			},
			initData() {
				//axios的请求方式  用户列表分页查询
				this.axios.get('http://localhost:/user/list', {
					params: {
						current: this.current,
						size: this.size,
						phone: this.searchParam.phone,
						name: this.searchParam.name
					}
				}).then((response) => {
					console.log(response + "response");
					//赋值结果
					this.tableData = response.data.result.records;
					console.log(this.tableData[0].sex + "====");
					//分页的赋值
					this.total = response.data.result.total;
				});
			},
			//批量删除的事件
			handleDeletes() {
				//获取选中结果的id，通过map遍历，join方法拼接
				let ids = this.selection.map((row) => {
					return row.id;
				}).join(",");

				//判断
				if (ids != null && ids.length > 0) {
					//删除的确认框
					this.$confirm('你确定要删除选中的数据?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						center: true
					}).then(() => {

						//输出拼接后的结果
						this.axios.get('http://localhost:/user/delete', {
							params: {
								ids: ids
							}
						}).then((response) => {
							if (response.data.result) {
								this.$message({
									showClose: true,
									message: '删除数据成功',
									type: 'success'
								});
								//重新加载数据
								this.initData();
							} else {
								this.$message({
									showClose: true,
									message: '删除失败了',
									type: 'error'
								});

							}

						});

					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});

				} else {
					this.$message({
						showClose: true,
						message: '请选择要删除的数据',
						type: 'success'
					});
				}



			},
			//单个删除事件
			handleDelete(row) {
				//console.log(row);
				let id = row.id;
				this.axios.get('http://localhost:/user/delete', {
					params: {
						ids: id
					}
				}).then((response) => {
					if (response.data.result) {
						this.$message({
							showClose: true,
							message: '删除数据成功',
							type: 'success'
						});
						//重新加载数据
						this.initData();
					} else {
						this.$message({
							showClose: true,
							message: '删除失败了',
							type: 'error'
						});

					}
				});
			},
			//checkbox框每次改变触发的事件
			selectionChange(val) {
				//全选 checkbox框每次改变触发的事件，都会把选中的结果传递过来，赋值给定义的selection数组
				this.selection = val;
			},
			handleCurrentChange(val) {
				this.current = val; //记录改变的当前页
				this.initData();
			},
			handleSizeChange(val) {
				this.size = val; //记录改变每页显示的条目数
				this.initData();
			},
			handleOpenUserInsertDialog() {
				this.insertUserDialog = true; //显示用户添加对话框
			},
			resetForm(formName) { //表单重置
				//重置表单
				this.$refs[formName].resetFields();
			},
			resetCheckedRoel(formName) {
				this.$refs[formName].resetFields();
			},
			handleInsertForm(formName) { //添加事件
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log("表单提交");
						//保存
						this.axios.post('http://localhost:/user/insert', this.insertUserForm).then((res) => {

							if (res.data.result) {
								//消息提示

								//关闭对话框
								this.insertUserDialog = false;
								//重置表单
								//重新加载数据
								this.initData();
								this.$message({
									type: 'success',
									message: '用户添加成功'
								});
							} else {
								this.$message({
									type: 'info',
									message: '用户添加失败'
								});
							}


						});



					} else {
						console.log("表单验证失败");
						return false;
					}
				});
			},
			handleAvatarSuccess(res, file) { //头像上传成功后触发的事件
				//console.log(res);
				//console.log(file);
				this.imageUrl = URL.createObjectURL(file.raw); //给头像上传成功后的地址赋值
				if (this.editUserDialog) {
					this.editUserForm.userface = res.result; //修改用户数据中的图片地址赋值
				} else if (this.insertUserDialog) {
					//注意：不像前面写res.data.result 
					this.insertUserForm.userface = res.result; //添加的用户数据中的图片地址赋值
				}
			},
			beforeAvatarUpload(file) { //图像上传之前的设置
				/*
			        const isJPG = file.type === 'image/jpeg';
			        const isLt2M = file.size / 1024 / 1024 < 2;
			
			        if (!isJPG) {
			          this.$message.error('上传头像图片只能是 JPG 格式!');
			        }
			        if (!isLt2M) {
			          this.$message.error('上传头像图片大小不能超过 2MB!');
			        }
			        return isJPG && isLt2M;
					*/
			},
			change(val) { //添加用户时三级联动赋值
				if (val != null && val.length > 0) {
					//省赋值
					this.insertUserForm.province = val[0];
					//市赋值
					this.insertUserForm.city = val[1];
					//区赋值
					this.insertUserForm.district = val[2];
				}

			},
			handleRoles(row) { //打开用户授权对话框
				this.checkedRoles = []; //还原数据
				this.uid = row.id; //记录用户的id值
				console.log(row)
				console.log(row.ids);
				if (row.ids != null && row.ids != '') {
					//默认被选中的数据 //回显的数据
					this.checkedRoles = row.ids.split(",").map((x) => {
						if (!isNaN(x)) {
							return parseInt(x); //数字转换的过程
						}
					});

					console.log("-------" + this.checkedRoles);
				}
				this.roleDialog = true;
			},
			handleRoleForm() {
				console.log("用户id：" + this.uid + "@@角色列表的id集合：" + this.checkedRoles);
				//获取授权的角色ids值
				let rids = this.checkedRoles.map((rid) => {
					return rid;
				}).join(",");

				//发送请求 进行保存处理
				this.axios.get('http://localhost:/user_role/insert', {
					params: {
						uid: this.uid,
						rids: rids
					}
				}).then((res) => {
					this.roleDialog = false;
					this.initData(); //初始化数据
				});

			},
			handleCheckAllChange(val) { //全选事件
				if (val) { //为true代表全选
					//遍历所有的角色
					if (this.roles != null && this.roles.length > 0) {
						//把所有的角色的id存入到checkRoles 选中的数组中
						this.roles.map((role) => {
							let id = role.id;
							this.checkedRoles.push(id);
						})
					}
				} else {
					//否则全不选
					this.checkedRoles = [];
				}
				//改变样式控制
				this.isIndeterminate = false;
			},
			handleCheckedRoleChange(value) {
				//记录组中选中角色的数组的长度
				let checkedCount = value.length;
				//如果长度相同，让checkAll变成true 
				this.checkAll = checkedCount === this.roles.length;
				//控制样式
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
			},
			handleEdit(row) { //打开对话框
				this.editUserDialog = true;

				this.editUserForm = row;

				this.values = [];
				//省市区
				if (row.province) {
					this.values.push(row.province);
					this.values.push(row.city);
					this.values.push(row.district);
				}

				console.log(this.editUserForm.id);
				this.imageUrl = row.userface;

			},
			cascaderUpdateChange(val) {
				//判断是否为null
				if (val != null && val.length > 0) {
					//省赋值
					this.editUserForm.province = val[0];
					//市赋值
					this.editUserForm.city = val[1];
					//区赋值
					this.editUserForm.district = val[2];
				}

			},
			handleEditForm() { //编辑方法
				this.axios.post('http://localhost:/user/update', this.editUserForm).then((res) => {
					if (res.data.result) {
						//消息提示
						this.$message({
							message: '恭喜你，用户编辑成功',
							type: 'success'
						});
						//关闭对话框
						this.editUserDialog = false;
						//重置表单
						//重新加载数据
						this.initData();
					} else {
						//消息提示
						this.$message.error('用户更新失败了！');
					}
				});
			},
			handleEdits(row) { //打开详情对话框
				this.editUserDialogs = true;

				this.editUserForm = row;

				this.values = [];
				//省市区
				if (row.province) {
					this.values.push(row.province);
					this.values.push(row.city);
					this.values.push(row.district);
				}

				console.log(this.editUserForm.id);
				this.imageUrl = row.userface;

			}
		}
	}
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 100px;
		height: 100px;
		line-height: 100px;
		text-align: center;
	}

	.avatar {
		width: 100px;
		height: 100px;
		display: block;
	}
</style>
