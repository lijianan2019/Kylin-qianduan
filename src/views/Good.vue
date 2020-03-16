<template>
	<div>
		<h1>商品管理平台</h1>
		<el-row>
			<el-col :span="24">
				<el-button type="primary" size="mini" icon="el-icon-edit" @click="handleOpenGoodInsertDialog()">添加商品</el-button>
				<el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeletes()">批量删除</el-button>
		
			</el-col>
		</el-row>
		<!-- 搜索框 -->
		<el-row>
			<el-col :span="6">
				商品名称:<el-input v-model="searchParam.name" style="width: 60%;" placeholder="请输入商品名称"></el-input>
			</el-col>
			<el-col :span="6">
				<el-input v-model="searchParam.p1" style="width: 60%;" placeholder="¥"></el-input>
			</el-col>
			<el-col :span="6">
				<el-input v-model="searchParam.p2" style="width: 60%;" placeholder="¥"></el-input>
			</el-col>
			<el-col :span="6">
				<el-button type="primary" size="medium" icon="el-icon-search" @click="initData()">搜索</el-button>
			</el-col>
		</el-row>
		<!--表格-->
		<el-table :data="GoodData" @selection-change="selectionChange">
		
			</el-table-column>
			<!--全选反选的列-->
			<el-table-column type="selection" width="55"></el-table-column>
		
			<el-table-column prop="id" label="ID"></el-table-column>
			<el-table-column prop="name" label="名称"></el-table-column>
			<!--特殊处理某个字段 template模板 slot-scope="scope" -->
			<el-table-column label="图片">
				<template slot-scope="scope">
					<el-image style="width: 60px; height: 60px" :src="scope.row.image"></el-image>
				</template>
			</el-table-column>
			
			<el-table-column prop="price" label="价格"></el-table-column>
			<el-table-column label="产地">
				<template slot-scope="scope">
					{{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.districtName}}
				</template>
		
			</el-table-column>
			<el-table-column prop="sname" label="传销"></el-table-column>
			<el-table-column prop="create" label="创建时间"></el-table-column>
			<!--没有prop属性-->
			<el-table-column label="操作">
				<!--模板 会暴露scope-->
				<template slot-scope="scope">
					<el-button type="info" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button type="primary" size="mini" icon="el-icon-edit" @click="showGoods(scope.row)">详情</el-button>
					<el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		
		</el-table>
		<!--细讲分页-->
		<el-pagination background layout="prev,pager,next,jumper,total,sizes" :total="total" :current-page="current"
		 :page-size="size" :page-sizes="sizes" @current-change="handleCurrentChange" @size-change="handleSizeChange">
		</el-pagination>
		
		
		
		<!--////////////////////////////////////添加商品对话框开始////////////////////////////////////////////-->
		<el-dialog :visible.sync="insertGoodDialog" title="商品添加" center>
			<!--ref代表的是form引用-->
			<el-form ref="insertGoodForm" :model="insertGoodForm" :rules="insertGoodFormRules" label-width="100px">
				<!--el-form-item-->
				<el-form-item label="商品名称" prop="name">
					<el-input type="text" v-model="insertGoodForm.name" placeholder="请输入商品名" clearable></el-input>
				</el-form-item>
				<el-form-item label="图片">
					<el-upload class="avatar-uploader" action="http://localhost:/upload" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :show-file-list="false">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<!--用户电话-->
				<el-form-item label="价格" prop="price">
					<el-input type="text" v-model="insertGoodForm.price" placeholder="请输入价格" clearable></el-input>
				</el-form-item>
				<!--用户地址-->
				<el-form-item label="产地" prop="adress">
					<!--
					<el-input type="text" v-model="insertUserForm.address" placeholder="请输入用户名" clearable></el-input>
				   -->
					<el-cascader :options="options" style="width: 100%;" @change="change"></el-cascader>
				 </el-form-item>
				  <!--<el-form-item label="创建时间" prop="create">
					<el-input type="date" v-model="insertGoodForm.create" placeholder="请输入时间" clearable></el-input>
				</el-form-item> -->
				<el-form-item label="促销">
					<div style="margin: 15px 0;"></div>
						<el-checkbox-group v-model="checkedSales" @change="handleCheckedSalesChange">
						<el-checkbox v-for="sale in sales" :label="sale.id">{{sale.name}}</el-checkbox>
						</el-checkbox-group>
				</el-form-item>
				<!--提交按钮-->
				<el-form-item>
					<el-button type="primary" size="mini" @click="handleInsertForm('insertGoodForm')">保存</el-button>
					<el-button type="info" size="mini" @click="resetForm('insertGoodForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--////////////////////////////////////添加商品对话框结束////////////////////////////////////////////-->
		
		<!--////////////////////////////////////编辑商品对话框开始////////////////////////////////////////////-->
		<el-dialog :visible.sync="updateGoodDialog" title="商品修改" center>
			<!--ref代表的是form引用-->
			<el-form ref="updateGoodForm" :model="updateGoodForm" :rules="updateGoodFormRules" label-width="100px">
				<!--el-form-item-->
				<el-form-item label="商品名称" prop="name">
					<el-input type="text" v-model="updateGoodForm.name" placeholder="请输入商品名" clearable></el-input>
				</el-form-item>
				<el-form-item label="图片">
					<el-upload class="avatar-uploader" action="http://localhost:/upload" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :show-file-list="false">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<!--用户电话-->
				<el-form-item label="价格" prop="price">
					<el-input type="text" v-model="updateGoodForm.price" placeholder="请输入价格" clearable></el-input>
				</el-form-item>
				<!--用户地址-->
				<el-form-item label="产地" prop="adress">
					<!--
					<el-input type="text" v-model="insertUserForm.address" placeholder="请输入用户名" clearable></el-input>
				   -->
					<el-cascader v-model="values" :options="options" style="width: 100%;" @change="cascaderUpdateChange"></el-cascader>
				 </el-form-item>
				  <!--<el-form-item label="创建时间" prop="create">
					<el-input type="date" v-model="insertGoodForm.create" placeholder="请输入时间" clearable></el-input>
				</el-form-item> -->
				<el-form-item label="促销">
					<div style="margin: 15px 0;"></div>
						<el-checkbox-group v-model="checkedSales" @change="handleCheckedSalesChange">
						<el-checkbox v-for="sale in sales" :label="sale.id">{{sale.name}}</el-checkbox>
						</el-checkbox-group>
				</el-form-item>
				<!--提交按钮-->
				<el-form-item>
					<el-button type="primary" size="mini" @click="UpdateGoodsForms('updateGoodForm')">保存</el-button>
					<el-button type="info" size="mini" @click="resetForm('updateGoodForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!--////////////////////////////////////编辑商品对话框结束////////////////////////////////////////////-->
		
		
		<!--////////////////////////////////////商品详情对话框开始////////////////////////////////////////////-->
		<el-dialog :visible.sync="showGoodDialog" title="商品详情" center>
			<!--ref代表的是form引用-->
			<el-form ref="updateGoodForm" :model="updateGoodForm"  label-width="100px">
				<!--el-form-item-->
				<el-form-item label="商品名称" prop="name">
					<el-input type="text" v-model="updateGoodForm.name" placeholder="请输入商品名" clearable></el-input>
				</el-form-item>
				<el-form-item label="图片">
					<el-upload class="avatar-uploader" action="http://localhost:/upload" :on-success="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :show-file-list="false">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<!--用户电话-->
				<el-form-item label="价格" prop="price">
					<el-input type="text" v-model="updateGoodForm.price" placeholder="请输入价格" clearable></el-input>
				</el-form-item>
				<!--用户地址-->
				<el-form-item label="产地" prop="adress">
					<!--
					<el-input type="text" v-model="insertUserForm.address" placeholder="请输入用户名" clearable></el-input>
				   -->
					<el-cascader v-model="values" :options="options" style="width: 100%;" @change="cascaderUpdateChange"></el-cascader>
				 </el-form-item>
				  <!--<el-form-item label="创建时间" prop="create">
					<el-input type="date" v-model="insertGoodForm.create" placeholder="请输入时间" clearable></el-input>
				</el-form-item> -->
				<el-form-item label="促销">
					<div style="margin: 15px 0;"></div>
						<el-checkbox-group v-model="checkedSales" @change="handleCheckedSalesChange">
						<el-checkbox v-for="sale in sales" :label="sale.id">{{sale.name}}</el-checkbox>
						</el-checkbox-group>
				</el-form-item>
				</el-form>
		</el-dialog>
		
		<!--////////////////////////////////////商品详情对话框结束////////////////////////////////////////////-->
	</div>
</template>

<script>
	export default{
		data(){
			return{
				searchParam: { //搜索的数据
					name: '',
					p1:0,
					p2:0,
				},
				values: [], //三级联动回显的数据
				uid: 0, //用户的id
				sales: [], //促销类型数组
				checkedSales: [], //默认促销回显的数据
				checkAll: false, //默认不全选
				isIndeterminate: true, //设置 indeterminate 状态，只负责样式控制
				options: [], //三级联动的数据
				imageUrl: '', //头像上传成功的地址
				GoodData: [], //表格显示的数据
				selection: [], //记录全选/反选的结果
				total: 0, //总记录数
				size: 3, //每页显示的条目数  默认值
				current: 1, //当前页
				sizes: [3, 5, 8], //每页显示的条目数的数组,
				insertGoodDialog: false, //添加对话框是否可见的标识，默认为false
				insertGoodForm: { //添加存放的数据
					name: '',
					price:0,
					adress: "河南朝阳",
					image: "",
					province: 0,
					city: 0,
					district: 0,
					create:"",
					sid:"",
				},
				insertGoodFormRules: { //添加的字段的验证
					name: [{
							required: true,
							message: '请输入商品名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 15,
							message: '长度在 1 到 15个字符',
							trigger: 'blur'
						}
					],
					price: [{
						required: true,
						message: '价格不能为空',
						trigger: 'blur'
					}]
				},
				updateGoodDialog: false, //编辑对话框
				updateGoodForm: { //修改的数据存放
					name: '',
					price:0,
					adress: "河南朝阳",
					image: "",
					province: 0,
					city: 0,
					district: 0,
					create:"",
					sid:"",
					
				},
				updateGoodFormRules: { //添加的字段的验证
					name: [{
							required: true,
							message: '请输入商品名称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 15,
							message: '长度在 1 到 15个字符',
							trigger: 'blur'
						}
					],
					price: [{
						required: true,
						message: '价格不能为空',
						trigger: 'blur'
					}]
				},
				showGoodDialog: false, //编辑详情对话框
				}
			},
			created() {
				this.initData(); //初始化数据的方法
				this.initCascader(); //初始化三级联动的数据
				this.initSales();//初始化促销类型
			},
			methods:{
				initData() {
					//axios的请求方式  用户列表分页查询
					this.axios.get('http://localhost:/good/list', {
						params: {
							current: this.current,
							size: this.size,
							p1: this.searchParam.p1,
							name: this.searchParam.name,
							p2:this.searchParam.p2,
						}
					}).then((response) => {
						console.log(response + "response");
						//赋值结果
						this.GoodData = response.data.result.records;
						//分页的赋值
						this.total = response.data.result.total;
					});
				},
				initCascader() { //地区查询，三级联动数据
					this.axios.get('http://localhost:/nation/list').then((res) => {
						console.log(res)
						this.options = res.data.result;
					});
				},
				initSales() { //商品促销类型查询
					this.axios.get('http://localhost:/sales/list').then((res) => {
						this.sales = res.data.result;
					})
				},
				change(val) { //三级联动的改变事件
					if (val != null && val.length > 0) {
						//省赋值
						this.insertGoodForm.province = val[0];
						//市赋值
						this.insertGoodForm.city = val[1];
						//区赋值
						this.insertGoodForm.district = val[2];
					}
				
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
							this.axios.get('http://localhost:/good/delete', {
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
					this.axios.get('http://localhost:/good/delete', {
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
				handleAvatarSuccess(res, file) { //头像上传成功后触发的事件
					//console.log(res);
					//console.log(file);
					this.imageUrl = URL.createObjectURL(file.raw); //给头像上传成功后的地址赋值
					if (this.updateGoodDialog) {
						this.updateGoodForm.image = res.result; //修改用户数据中的图片地址赋值
					} else if (this.insertGoodDialog) {
						//注意：不像前面写res.data.result 
						this.insertGoodForm.image = res.result; //添加的用户数据中的图片地址赋值
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
				handleOpenGoodInsertDialog() {
					this.insertGoodDialog = true; //显示用户添加对话框
					
				},
				handleInsertForm(formName) { //商品添加事件
					this.$refs[formName].validate((valid) => {
						if (valid) {
							console.log("表单提交");
							//保存
							  this.insertGoodForm.sid = this.checkedSales.map((a)=>{
													  return a;
												  }).join(",");
							this.axios.post('http://localhost:/good/insert', this.insertGoodForm).then((res) => {
				
								if (res.data.result) {
									//消息提示
				
									//关闭对话框
									this.insertGoodDialog = false;
									//重置表单
									//重新加载数据
									this.initData();
									this.$message({
										type: 'success',
										message: '商品添加成功'
									});
								} else {
									this.$message({
										type: 'info',
										message: '商品添加失败'
									});
									this.initData();
								}
				
				
							});
				
				
				
						} else {
							console.log("表单验证失败");
							return false;
						}
					});
				},
				handleCheckedSalesChange(value){
					
				},
				resetForm(formName) { //表单重置
					//重置表单
					this.$refs[formName].resetFields();
				},
				cascaderUpdateChange(val) {  //编辑商品地区赋值
					//判断是否为null
					if (val != null && val.length > 0) {
						//省赋值
						this.updateGoodForm.province = val[0];
						//市赋值
						this.updateGoodForm.city = val[1];
						//区赋值
						this.updateGoodForm.district = val[2];
					}
				
				},
				handleEdit(row) { //打开对话框
					this.updateGoodDialog = true;
				
					this.updateGoodForm = row;
				
					this.values = [];
					console.log(row)
					//省市区回显
					if (row.province) {
						this.values.push(row.province);
						this.values.push(row.city);
						this.values.push(row.district);
					}
			
					this.imageUrl = row.image;
					
					//this.checkedSales = []; //还原数据
					//this.uid = row.id; //记录用户的id值
					if (row.sids != null && row.sids != '') {
						//默认被选中的数据 //回显的数据
						this.checkedSales = row.sids.split(",").map((x) => {
							if (!isNaN(x)) {
								return parseInt(x); //数字转换的过程
							}
						});
					
						console.log("-------" + this.checkedSales);
					}
				
				},
				UpdateGoodsForms() { //编辑方法
				this.updateGoodForm.sid = this.checkedSales.map((a)=>{
								  return a;
							  }).join(",");
					this.axios.post('http://localhost:/good/update', this.updateGoodForm).then((res) => {
						if (res.data.result) {
							//消息提示
							this.$message({
								message: '恭喜你，用户编辑成功',
								type: 'success'
							});
							//关闭对话框
							this.updateGoodDialog = false;
							//重置表单
							//重新加载数据
							this.initData();
						} else {
							//消息提示
							this.$message.error('用户更新失败了！');
						}
					});
				},
				showGoods(row) { //详情对话框
					this.showGoodDialog = true;
				
					this.updateGoodForm = row;
				
					this.values = [];
					console.log(row)
					//省市区回显
					if (row.province) {
						this.values.push(row.province);
						this.values.push(row.city);
						this.values.push(row.district);
					}
			
					this.imageUrl = row.image;
					
					//this.checkedSales = []; //还原数据
					//this.uid = row.id; //记录用户的id值
					if (row.sids != null && row.sids != '') {
						//默认被选中的数据 //回显的数据
						this.checkedSales = row.sids.split(",").map((x) => {
							if (!isNaN(x)) {
								return parseInt(x); //数字转换的过程
							}
						});
					
						console.log("-------" + this.checkedSales);
					}
				
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
