<template>
	<div>
			<el-row>
				<el-col :span="8">
				角色名称:<el-input v-model="searchParms.nameZh" placeholder="请输入搜索的名称" style="width: 60%;"></el-input>
				</el-col>
				<el-col :span="1">
					<el-button type="primary" size="mini" icon="el-icon-serach" @click="handleSearch()">搜索</el-button>	
				</el-col>
				<el-col :span="6">
					<el-button type="primary" size="mini" icon="el-icon-edit" @click="handleRole()">添加角色</el-button>
					<el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDeletes()">批量删除</el-button>
				</el-col>
			</el-row>
		 <el-table :data="tableData" @selection-change="selectionChange">
			 <!--全选反选的列-->
			 <el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="序号" prop="id"> </el-table-column>
		  <el-table-column label="名称" prop="nameZh" > </el-table-column>
		  <el-table-column label="职位权限" prop="mnames" > </el-table-column>
		    <el-table-column label="操作">
		      <template slot-scope="scope">
				   <el-button type="success" size="mini" icon="el-icon-edit" @click="handleMenu(scope.row)">授权角色菜单</el-button>
		        <el-button type="info" size="mini" icon="el-icon-edit" @click="handleRoleUpdate(scope.row)">编辑</el-button>
		        <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleShowRole(scope.row)">详情</el-button>
		        <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		  <!--细讲分页-->
		  <el-pagination
		    background
		    layout="prev,pager,next,jumper,total,sizes"
		    :total="total"
		    :current-page="current"
		    :page-size="size"
		    :page-sizes="sizes"
		    @current-change="handleCurrentChange"
		    @size-change="handleSizeChange">
		  </el-pagination>
		   <!--//////////////////////////////////授权menu资源开始//////////////////////////////////////-->
		  	 
		  	 <el-dialog
		  	   title="menu资源授权"
		  	   :visible.sync="menuDialogVisible"
		  	   width="60%"
		  	   center>
		  	  <!--树形控件-->
		  	 	 <el-tree
		  	 	   :data="treeData"
		  	 	   :props="defaultProps"
		  	 	   node-key="id"
		  	 	   ref="tree"
		  	 	   :default-checked-keys="treeKeyNodes"
		  	 	  :default-expanded-keys="treeKeyNodes"
		  	 	   show-checkbox>
		  	 	 </el-tree>

		  	 <span slot="footer" class="dialog-footer">
		  		 <el-button type="primary" @click="handleSaveMenus()">确 定</el-button>
		  	     <el-button @click="menuDialogVisible = false">取 消</el-button>
		  	   </span>
		  	 </el-dialog>
		  	 
			  <!--//////////////////////////////////授权menu资源结束//////////////////////////////////////-->
			  
		  	 <!--////////////////////////////////////添加角色对话框开始////////////////////////////////////////////-->
		  	 <el-dialog :visible.sync="insertRoleDialog" title="角色添加" center>
		  	 	<!--ref代表的是form引用-->
		  	 	<el-form ref="insertRoles" :model="insertRoles"  label-width="100px">
		  	 		
		  	 		<el-form-item label="角色别名" prop="name">
		  	 			<el-input type="text" v-model="insertRoles.name" placeholder="请输入角色别名" clearable></el-input>
		  	 		</el-form-item>
		  	 	    
		  	 		
		  	 		<!--用户电话-->
		  	 		<el-form-item label="角色名称" prop="nameZh">
		  	 			<el-input type="text" v-model="insertRoles.nameZh" placeholder="请输入角色名称" clearable></el-input>
		  	 		</el-form-item>
		  	 		<!--提交按钮-->
		  	 		<el-form-item>
		  	 			<el-button type="primary" size="mini" @click="handleInsertRole('insertRoles')">保存</el-button>
		  	 			<el-button type="info" size="mini" @click="resetForm('insertRoles')">重置</el-button>
		  	 		</el-form-item>
		  	 	</el-form>
		  	 </el-dialog>
			 <!--////////////////////////////////////添加角色对话框开始////////////////////////////////////////////-->
		  	
			<!--////////////////////////////////////编辑角色对话框开始////////////////////////////////////////////-->
					<el-dialog :visible.sync="UpdateRoleDialog" title="角色修改" center>
						<!--ref代表的是form引用-->
						<el-form ref="UpdateRoles" :model="UpdateRoles" label-width="100px">
							
							<el-form-item label="角色别名" prop="name">
								<el-input type="text" v-model="UpdateRoles.name" placeholder="请输入角色别名" clearable></el-input>
							</el-form-item>
							
							
							<!--用户电话-->
							<el-form-item label="角色名称" prop="nameZh">
								<el-input type="text" v-model="UpdateRoles.nameZh" placeholder="请输入角色名称" clearable></el-input>
							</el-form-item>
							<!--提交按钮-->
							<el-form-item>
								<el-button type="primary" size="mini" @click="handleUpdateRole('UpdateRoles')">保存</el-button>
								<el-button type="info" size="mini" @click="resetForm('UpdateRoles')">重置</el-button>
							</el-form-item>
							</el-form>
					</el-dialog>
					<!--////////////////////////////////////编辑角色对话框结束////////////////////////////////////////////-->
					
					<!--////////////////////////////////////角色详情对话框开始////////////////////////////////////////////-->
							<el-dialog :visible.sync="ShowRoleDialog" title="角色修改" center>
								<!--ref代表的是form引用-->
								<el-form ref="ShowRoles" :model="ShowRoles" label-width="100px">
									
									<el-form-item label="角色别名" prop="name">
										<el-input type="text" v-model="ShowRoles.name" placeholder="请输入角色别名" clearable></el-input>
									</el-form-item>
									
									
								
									<el-form-item label="角色名称" prop="nameZh">
										<el-input type="text" v-model="ShowRoles.nameZh" placeholder="请输入角色名称" clearable></el-input>
									</el-form-item>
									</el-form>
							</el-dialog>
							<!--////////////////////////////////////角色详情对话框结束////////////////////////////////////////////-->
	</div>
</template>

<script>
	export default{
		data(){
			return {
				
				rid:0,
				treeKeyNodes:[],
				treeData:[],
				defaultProps:{  //树形一二级数据存放
				 children: 'menus',
				 label: 'name'
				},
				menuDialogVisible:false,//授权角色菜单默认对话框状态
				insertRoleDialog:false,  //添加角色默认对话框状态
				UpdateRoleDialog:false,//修改编辑角色对话框默认状态
				ShowRoleDialog:false, //角色详情对话框默认状态
				searchParms:{   //查询搜索存放的数据
					nameZh:''
				},
				tableData:[],
				selection:[],  //记录全选/反选的结果
				total:0, //总记录数
				size:3,  //每页显示的条目数  默认值
				current:1,  //当前页
				sizes:[3,5,8]  ,//每页显示的条目数的数组,
				insertRoles:{  //添加角色的数据声明
					name:'',
					nameZh:''
				},
				UpdateRoles:{		//修改角色的数据声明
					name:'',
					nameZh:''
				},
				ShowRoles:{		//详情数据声明
					name:'',
					nameZh:''
				}	
			}
		},
		created() {
			this.initData();//初始化列表数据
			this.initTreeData();//初始化tree数据
		},
		methods:{
			initTreeData(){
							this.axios.get('http://localhost:/menu/list').then((res)=>{
								this.treeData=res.data.result;
							});
						},
			initData(){
				this.axios.get('http://localhost:/role/select',{
					params:{
					current:this.current,
					size:this.size,
					nameZh:this.searchParms.nameZh,
					}
					}).then((res)=>{
					console.log(res);
					this.tableData=res.data.result.records;
					//分页的赋值
					this.total=res.data.result.total;
				});
			},
			//批量删除的事件
			handleDeletes(){
				//获取选中结果的id，通过map遍历，join方法拼接
				let ids = this.selection.map((row)=>{
					return row.id;
				}).join(",");
				
			//判断
			   if(ids!=null && ids.length>0){
				   //删除的确认框
				  this.$confirm('你确定要删除选中的数据?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning',
				          center: true
				        }).then(() => {
							
				         //输出拼接后的结果
				         this.axios.get('http://localhost:/role/delete',{
				         	params:{
				         		ids:ids
				         	}
				         }).then((response)=>{
				         	if(response.data.result){
				         		 this.$message({
				         		          showClose: true,
				         		          message: '删除数据成功',
				         		          type: 'success'
				         		        });
				         				//重新加载数据
				         				this.initData();
				         	}else{
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
				
			   }else{
				   this.$message({
				            showClose: true,
				            message: '请选择要删除的数据',
				            type: 'success'
				          });
			   }
				
				
				
			},
			//单个删除事件
			handleDelete(row){
				 //console.log(row);
				    let id=row.id;
			this.axios.get('http://localhost:/role/delete',{
				 params:{
				            ids:id
				        }
				 }).then((response)=>{
				     if(response.data.result){
				        this.$message({
				            showClose: true,
				            message: '删除数据成功',
				            type: 'success'
				            });
				            //重新加载数据
				        this.initData();
				         }else{
				                this.$message({
				                 showClose: true,
				                   message: '删除失败了',
				                    type: 'error'
				          });
				
				    }
				});
			},
			//checkbox框每次改变触发的事件
			selectionChange(val){
				//全选 checkbox框每次改变触发的事件，都会把选中的结果传递过来，赋值给定义的selection数组
				this.selection=val;
			},
			handleCurrentChange(val){
				this.current=val;//记录改变的当前页
				this.initData();
			},
			handleSizeChange(val){
				this.size=val;//记录改变每页显示的条目数
				this.initData();
			},
			resetForm(formName){//表单重置
				//重置表单
				this.$refs[formName].resetFields();
			},
			handleSearch(){
				//从第一页开始搜索
				this.current=1;
				//执行查询
				this.initData();
				
			},
			handleMenu(row){  //授权角色菜单事件
				this.rid=row.id;
				this.initTreeData();//初始化tree数据
				//记录id存放
				this.treeKeyNodes=[];
				//判断mids值是否有回显的数据
				if(row.mids!=null){

					//获取本身拥有资源的id
					console.log(row.mids);
					row.mids.split(",").map((mid)=>{
						if(!isNaN(mid)){
							this.treeKeyNodes.push(parseInt(mid));
						}
					})
					console.log(this.treeKeyNodes);
					//把要选中/回显的数据设置到tree上
				}
				//异步处理方法
				this.$nextTick(()=>{
					//DOM更新了
					this.$ref.tree.setCheckedKeys(this.treeKeyNodes);
				});
				//打开对话框
			  this.menuDialogVisible=true;
				
			 //通过方式设置的时候，由于生命周期的问题，导致没有被渲染上
			//  this.$refs.tree.setCheckedKeys([2, 7, 3, 13, 12, 11, 10, 4, 18, 17, 16, 15, 14, 5, 22, 21, 20, 19, 6, 32, 31, 28, 27, 26, 25, 24, 23]);	
			},
			handleSaveMenus(){   //授权角色菜单项，添加menu_role中间表
				//获取选中的tree节点
				let mids= this.$refs.tree.getCheckedKeys();
				console.log(this.rid+"@"+mids);
				//拼接一下
				let mids_str =  mids.map((mid)=>{
						return mid;
					}).join(",");
				console.log(mids_str);
				//发送axios请求
				this.axios.get('http://localhost:/menu_role/insert',{params:{
					rid:this.rid,
					mids:mids_str
				}}).then((res)=>{
					if(res.data.result){
						this.menuDialogVisible=false;
						this.$message({
							type: 'success',
							message: '授权成功'
						});
					}else{
						this.$message({
							type: 'info',
							message: '授权失败'
						});
					}
					
				});
			},
			handleRole(){  //角色添加对话框显示
				this.insertRoleDialog=true;
			},
			handleInsertRole(roles){	//添加角色事件
				this.$refs[roles].validate((flag)=>{
					if(flag){
						console.log("角色添加")
						//添加角色
						this.axios.post("http://localhost:/role/insert",this.insertRoles).then((res)=>{
							console.log(res);
							if(res.data.result){
								//关闭对话框
								this.insertRoleDialog=false;
								//初始化列表数据
								this.initData();
								this.$message({
									type: 'success',
									message: '角色添加成功'
								});
							}else{
								this.$message({
									type: 'info',
									message: '角色添加失败'
								});
							}
						});
					}
					
				});
			},
			handleRoleUpdate(row){	//修改对话框打开事件
				//打开对话框
				this.UpdateRoleDialog=true;
				//回显数据
				this.UpdateRoles=row;
			},
			handleUpdateRole(){	//修改角色
				this.axios.post("http://localhost:/role/update",this.UpdateRoles).then((res)=>{
					if(res.data.result){
							//关闭对话框
							this.UpdateRoleDialog=false;
							//初始化列表数据
							this.initData();
							this.$message({
								type: 'success',
								message: '角色修改成功'
							});
						}else{
							this.$message({
								type: 'info',
								message: '角色修改失败'
							});
						}
					
				});
			},
			handleShowRole(row){
				this.ShowRoleDialog=true;
				this.ShowRoles=row;
			}
			
		}
	}
</script>

<style>
</style>
