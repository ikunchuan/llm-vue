<template>
    <el-card style="max-width: 100%">
        <template #header>

            <div class="card-header">

                <div class="query">
                    <el-input v-model="queryStr" placeholder="请输入" /> &nbsp; &nbsp;
                    <el-button class="button" type="primary" round @click="queryInfo">查询</el-button>
                </div>
                

            </div>

        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="userName" label="用户名" width="120" />
            <el-table-column prop="userSex" label="性别" width="100" >
                <template #default="scope">
                    {{ scope.row.userSex==1?'男':'女' }}
                </template>
            </el-table-column>
            <el-table-column prop="userPassword" label="密码" width="120" />
            <el-table-column prop="userPhone" label="联系方式" width="120" />
            <el-table-column prop="userEmail" label="邮箱" width="120" />
            <el-table-column prop="userProfilePicture" label="用户头像" width="120" />
            <el-table-column prop="userBio" label="用户描述" width="120" />

            <el-table-column fixed="right" label="操作" min-width="160">

                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.userId)">
                        详情
                    </el-button>
                    
                </template>

            </el-table-column>
        </el-table>

        <br />

        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[2, 3, 4, 5]"
            :background="true" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    </el-card>

    
    <!-- 详情对话框 -->

    <el-dialog v-model="dialogDetailVisible" title="用户详细信息显示" width="500">
        <el-form :model="form">
        
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-form-item :label="form.userName"></el-form-item>
            </el-form-item>

            <el-form-item label="性别" :label-width="formLabelWidth">
                {{ form.userSex==1?'男':'女' }}
            </el-form-item>

            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-form-item :label="form.userPassword"></el-form-item>
            </el-form-item>

            <el-form-item label="联系方式" :label-width="formLabelWidth">
                <el-form-item :label="form.userPhone"></el-form-item>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-form-item :label="form.userEmail"></el-form-item>
            </el-form-item>
            <el-form-item label="用户头像" :label-width="formLabelWidth">
                <el-form-item :label="form.userProfilePicture"></el-form-item>
            </el-form-item>
            <el-form-item label="用户描述" :label-width="formLabelWidth">
                <el-form-item :label="form.userBio"></el-form-item>
            </el-form-item>


        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogDetailVisible = false">关闭</el-button>

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
            // cmnsInfoData:[],
            dialogDetailVisible: false,   //详细对话框
            queryStr: "",                   //查询条件

            tableData: [],    //用户信息数据
            queryData: [],
            pageInfo: {},       //分页信息对象
            pageSize: 3,        //当前页条数
            pageNum: 1,     //当前页号
            form: {},                       //对话框表单数据
            formLabelWidth: "140px",    //对话框label宽度
            title: "",                           //对话框标题
            btnName: "",                     //对话框按钮文字
            // claInfoData: [],                  //加载到下拉框的班级信息
            imageUrl: ""                     //图片URL
        };
    },


    methods: {
        // handleSuccess(response) {            //图片上传成功后的回调函数
        //     console.log(response);
        //     // this.imageUrl = response
        //     this.form.stu_image_url = response
        // },

        handleSizeChange(pageSize) {                 //选择每一页显示的记录数
            this.currentSize = pageSize
            this.getPageData(this.currentSize, this.pageSize)
            console.log("size:", pageSize);
        },

        handleCurrentChange(pageNum) {              //切换页号时得到当时页号
            this.currentNum = pageNum
            this.getPageData(this.currentNum, this.pageNum)
            console.log("num:", pageNum);
        },

        getPageData(num, size) {
            this.$http.get("/uis/v1/ui", { params: { pageNum: num, pageSize: size } })
                .then(response => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;

                    // 初始化或保护原始数据缓存
                    if (!this.queryData || this.queryData.length === 0) {
                        this.queryData = [...this.tableData];
                    }

                    console.log("Data loaded successfully:", this.tableData);
                });
        },


        closeDialog() {
            this.form = []
            console.log("closeDialog.....")
        },

        openDetailDialog(userId) {
            var _this = this
            this.$http.get(`/uis/v1/ui/${userId}`).then(function (response) {
                console.log(response.data);
                _this.form = response.data
            })

            this.dialogDetailVisible = true;
        },


        

        

        queryInfo() {
            // 如果选择了查询字段和输入了查询条件
            if (this.queryStr.trim().length > 0 && this.selectedField) {
                this.tableData = this.pageInfo.records.filter(item => {
                    // 根据选择的字段进行匹配
                    if (item[this.selectedField] && item[this.selectedField].includes(this.queryStr.trim())) {
                        return true;  // 匹配成功
                    }
                    return false;  // 不匹配
                });
            } else {
                // 如果没有选择字段或者没有输入查询内容，恢复原数据
                this.tableData = this.pageInfo.records;
            }
        },

    },
    components: {
        Plus
    },

    mounted() {
        this.getPageData(1, 3)

        // this.$http.get("/cmns/v1/cmn").then((response) => {
        //     this.cmnsInfoData = response.data
        //     console.log(this.cmnsInfoData)
        // })

        this.$http.get("/uis/v1/ui").then((response) => {
            this.usersInfoData = response.data;
            console.log('usersInfoData:', this.usersInfoData);
            console.log("huhuhu")
            // 确保这里的 tableData 被正确赋值
            // this.tableData = this.cmnsInfoData;
            // console.log('tableData:', this.tableData);
        });
        
    }

}
</script>



<style>
.card-header {
    display: flex;
    justify-content: space-between;
}

.query {
    display: flex;
    justify-content: space-between;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>