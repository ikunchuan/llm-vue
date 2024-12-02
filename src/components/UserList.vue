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
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="userName" label="用户名" width="180"></el-table-column>
                <el-table-column prop="userSex" label="性别" width="100" >
                    <template #default="scope">
                        {{ scope.row.stu_sex==1?'男':'女' }}
                    </template>
                </el-table-column>
                <el-table-column prop="userPassword" label="密码" width="180"></el-table-column>
                <el-table-column prop="userPhone" label="联系方式" width="180"></el-table-column>
                <el-table-column prop="userProfilePicture" label="用户头像" width="180"></el-table-column>
                <el-table-column prop="userBio" label="用户描述" width="180"></el-table-column>
                <el-table-column prop="userEmail" label="邮箱" width="180"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
            
                        <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.stuid)">详情</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[2, 3, 4, 5]"
            :background="true" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        </el-card>
    </div>

    <!----详情对话框----->
<el-dialog v-model="dialogDetailVisible" :title="学生详细信息记录表" width="500">
    <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-form-item :label="form.userName" ></el-form-item>
        </el-form-item>

        <el-form-item label="性别" :label-width="formLabelWidth">
            {{ form.userSex==1?'男':'女' }}
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
            <el-form-item :label="form.userPassword" ></el-form-item>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
            <el-form-item :label="form.userPhone"  ></el-form-item>
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
            <el-form-item :label="form.userProfilePicture"  ></el-form-item>
        </el-form-item>
        <el-form-item label="用户描述" :label-width="formLabelWidth">
            <el-form-item :label="form.userBio"  ></el-form-item>
        </el-form-item>
        <el-form-item label="Email" :label-width="formLabelWidth">
            <el-form-item :label="form.userEmail"  ></el-form-item>
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
import { ElMessage, ElMessageBox } from 'element-plus';
import { handleCurrentChange } from 'element-plus/es/components/tree/src/model/util.mjs';
import { Plus } from '@element-plus/icons-vue';
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
            pageNum:1,//当前页号
            form:{},//对话框表单数据
            formLabelWidth:"140px",//对话框label宽度
            title:"",//对话框标题
            btnName:"",//对话框按钮文字
            clsInfoData:[]  //加载到下拉框的班级信息
        };
    },
    methods: {
        handleSizeChange(pageSize){   //选择每个页面显示的记录数
            this.currentSize=pageSize;
            this.getPageData(this.currentSize,this.pageSize);
            console.log("size:",pageSize);

        },
        handleCurrentChange(pageNum){   //切换页号时得到当时页号
            this.currentNum=pageNum
            this.getPageData(this.currentNum,this.pageNum)
            console.log("num:",pageNum);

        },
        getPageData(num, size) {
            this.$http.get("/uis/v1/ui", { params: { pageNum: num, pageSize: size } })
                .then(response => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;

                    // // 初始化或保护原始数据缓存
                    // if (!this.queryData || this.queryData.length === 0) {
                    //     this.queryData = [...this.tableData];
                    // }

                    console.log("Data loaded successfully:", this.tableData);
                });
        },
        closeDialog() {
            this.form = []
            console.log("closeDialog.....")
        },

        //详情显示
        openDetailDialog(userId){
            var _this=this
            this.$http.get("/uis/v1/page"+userId).then(function(response){
            console.log(response.data);
            _this.form=response.data
        })
            this.dialogDetailVisible=true
        },
        //查询
        queryInfo() {
            if (!this.queryData || this.queryData.length === 0) {
                console.error("Original data is not cached. Please check data loading logic.");
                return;
            }

            if (this.queryStr.trim().length > 0) {
                this.tableData = this.queryData.filter(item =>
                    item.communityName.includes(this.queryStr.trim())
                );
            } else {
                this.tableData = [...this.queryData];
            }

            console.log("Query executed. Current data:", this.tableData);
        },

    },
    components: {
        Plus
    },
    mounted() {
        this.getPageData(this.pageNum,this.pageSize)
        // var _this=this;
        // this.$http.get("/stu/v1/stus").then(function(response){
        //     console.log(response.data);
        //     _this.tableData=response.data;
        //     _this.queryData=response.data;
        // })
        // this.$http.get("/uis/v1/pages").then((response)=>{
        //     this.userInfoData=response.data
        //     console.log('userInfoData:', this.userInfoData);
            

        // })
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
