<template>
    <div class="user-list">
        <el-card class="user-list-card">
            <div slot="header" class="card-header">
                
                <div class="query">
                    <el-input v-model="queryStr" placeholder="Please input" style="flex: 1;"/> 
                    <el-button class="button" type="primary" round @click="queryInfo">查询</el-button>
                </div>
                <span>用户信息管理</span>
                
            </div>

            <!-- 用户列表 -->
            <el-table :data="users" style="width: 100%">
                <el-table-column prop="user_name" label="用户名" width="180"></el-table-column>
                <el-table-column prop="user_sex" label="性别" width="100" >
                    <template #default="scope">
                        {{ scope.row.stu_sex==1?'男':'女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="user_password" label="密码" width="180"></el-table-column>
                <el-table-column prop="user_phone" label="联系方式" width="180"></el-table-column>
                <el-table-column prop="user_profilePicture" label="用户头像" width="180"></el-table-column>
                <el-table-column prop="user_bio" label="用户描述" width="180"></el-table-column>
                <el-table-column prop="user_email" label="邮箱" width="180"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.stuid)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>

    <!----详情对话框----->
<el-dialog v-model="dialogDetailVisible" :title="学生详细信息记录表" width="500">
    <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-form-item :label="form.user_name" ></el-form-item>
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth">
            {{ form.user_sex==1?'男':'女' }}
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
            <el-form-item :label="form.user_password" ></el-form-item>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
            <el-form-item :label="form.user_phone"  ></el-form-item>
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
            <el-form-item :label="form.user_profilePicture"  ></el-form-item>
        </el-form-item>
        <el-form-item label="用户描述" :label-width="formLabelWidth">
            <el-form-item :label="form.user_bio"  ></el-form-item>
        </el-form-item>
        <el-form-item label="Email" :label-width="formLabelWidth">
            <el-form-item :label="form.user_email"  ></el-form-item>
        </el-form-item>
    </el-form>
    <template #footer>
    <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        
    </div>
    </template>
</el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogDetailVisible:false,//详细对话框显示
            dialogFormVisible:false,//对话框是否显示
            queryStr:"",//查询条件
            tableData: [],//学生信息数据
            queryData:[],
            pageInfo:{},  //分页对象
            pageSize:3,   //当前页条数
            currentPage:1,//当前页号
            form:{},//对话框表单数据
            formLabelWidth:"140px",//对话框label宽度
            title:"",//对话框标题
            btnName:"",//对话框按钮文字
            clsInfoData:[]  //加载到下拉框的班级信息
        };
    },
    methods: {
        handleSizeChange(pageSize){   //选择每个页面显示的记录数
            this.pageSize=pageSize
            this.getPageData(this.currentPage,this.pageSize)
            console.log("size:",pageSize);

        },
        handleCurrentChange(pageNum){   //切换页号时得到当时页号
            this.currentPage=pageNum
            this.getPageData(this.currentPage,this.pageSize)
            console.log("num:",pageNum);

        },
        getPageData(num,size){         //得到分页数据
            this.$http.get("/uis/v1/ui",{params:{pageNum:num,pageSize:size}}).then((response)=>{
                this.pageInfo=response.data
                this.tableData=this.pageInfo.list
                console.log(this.tableData);
                
            })
        },
        //详情显示
        openDetailDialog(userid){
            var _this=this
            this.$http.get("/uis/v1/ui"+userid).then(function(response){
            console.log(response.data);
            _this.form=response.data
        })



            this.dialogDetailVisible=true
        },
        //查询
        queryInfo(){
            if(this.queryStr.trim().length>0){
                this.tableData=this.tableData.filter(item=>(item.user_name).match(this.queryStr.trim()))
            }else{
                this.tableData=this.queryData
            }
            console.log("queryInfo().....");
        },
    },
    mounted() {
        this.getPageData(1,3)
        // var _this=this;
        // this.$http.get("/stu/v1/stus").then(function(response){
        //     console.log(response.data);
        //     _this.tableData=response.data;
        //     _this.queryData=response.data;
        // })
        this.$http.get("/uis/v1/ui").then((response)=>{
            this.clsInfoData=response.data
            console.log(this.clsInfoData);
            

        })
    }
};
</script>

<style scoped>
.user-list-card {
    padding: 20px;
}

.card-header {
    font-size: 20px;
    font-weight: bold;
}

.el-table .cell {
    text-align: center;
}

.el-button {
    margin-right: 10px;
}
.query {
    text-align: left;
}

</style>
