<template>
    <el-card style="max-width: 100%">
        <template #header>

            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <!-- 查询字段选择：让用户选择查询的字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                    <el-option label="用户名" value="userName"></el-option>
                    <el-option label="用户性别" value="userSex"></el-option>
            
                </el-select>&nbsp;

                <!-- 输入框：输入查询内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp;
                <el-button type="primary"  @click="queryInfo">查询</el-button>
            </div>

        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="userName" label="用户名" width="120" />
            <el-table-column prop="userSex" label="性别" width="100" >
                <template #default="scope">
                    {{ scope.row.userSex==1?'男':'女' }}
                </template>
            </el-table-column>
            <el-table-column prop="userLocal" label="地区" width="120" />
            <el-table-column prop="userAge" label="年龄" width="120" />
            <el-table-column prop="userPassword" label="密码" width="120" />
            <el-table-column prop="userPhone" label="联系方式" width="120" />
            <el-table-column prop="userEmail" label="邮箱" width="120" />
            <el-table-column prop="userProfilePicture" label="用户头像" width="120" />
            <el-table-column prop="userBio" label="用户描述" width="120" />
            <el-table-column prop="updatedTime" label="更新时间" width="100">
                <template #default="{ row }">
                    <span>{{ formatDate(row.updatedTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="createdTime" label="创建时间" width="100" >
                <template #default="{ row }">
                    <span>{{ formatDate(row.createdTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" min-width="160">

                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.userId)">
                        详情
                    </el-button>
                    
                </template>

            </el-table-column>
        </el-table>

        <br />

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[2, 3, 4, 5]"
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

            <el-form-item label="地区" :label-width="formLabelWidth">
                <el-form-item :label="form.userLocal"></el-form-item>
            </el-form-item>

            <el-form-item label="年龄" :label-width="formLabelWidth">
                <el-form-item :label="form.userAge"></el-form-item>
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
            <el-form-item label="更新时间：" :label-width="formLabelWidth">
                <el-form-item :label="form.updatedTime" />
            </el-form-item>

            <el-form-item label="创建时间：" :label-width="formLabelWidth">
                <el-form-item :label="form.createdTime" />
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
            loading:true,
            dialogDetailVisible: false,   //详细对话框

            name: '用户信息',
            queryStr: "",                   //查询条件
            selectedField: "",  // 选择的查询字段

            currentPage: 1,
            pageSize: 5,
            pageInfo: {},

            tableData: [],    //用户信息数据
            form: {},                       //对话框表单数据
            formLabelWidth: "140px",    //对话框label宽度

            queryData: [],
            pageInfo: {},       //分页信息对象
            pageSize: 3,        //当前页条数
            pageNum: 1,     //当前页号
            
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

        //选择每一页显示的记录数
        handleSizeChange(pageSize) {
            console.log("当前页大小: ", pageSize);
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
        },
        //切换页号时得到当时页号
        handleCurrentChange(pageNum) {
            console.log("当前页码: ", pageNum);
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
        },

        getPageData(num, size) {
            this.$http.get('/api/uis/v1/ui/search', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    console.log(response.data);
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;
                    if (response) {
                        this.loading = false;
                    }
                });
                
        },


        closeDialog() {
            this.form = []
            console.log("closeDialog.....")
        },

       //打开详情页
        openDetailDialog(userid) {
            var _this = this
            this.$http.get("/api/uis/v1/ui/" + userid).then(function (response) {
                console.log(response.data);
                _this.form = response.data
            })

            this.dialogDetailVisible = true;
        },
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },

        

        

        queryInfo() {
    // 如果选择了查询字段和输入了查询条件
    if (this.queryStr.trim().length > 0 && this.selectedField) {
        let queryValue = this.queryStr.trim();

        // 如果查询字段是 'userSex'，则将 '男' 转换为 1, '女' 转换为 0
        if (this.selectedField === 'userSex') {
            if (queryValue === '男') {
                queryValue = 1;  // '男' 对应 1
            } else if (queryValue === '女') {
                queryValue = 0;  // '女' 对应 0
            } else {
                // 如果输入的不是 '男' 或 '女'，则不进行查询
                ElMessage.error('请输入正确的性别（男/女）');
                return;
            }
        }

        // 过滤数据
        this.tableData = this.pageInfo.records.filter(item => {
            // 根据选择的字段进行匹配
            if (item[this.selectedField] && item[this.selectedField].toString().includes(queryValue)) {
                return true;  // 匹配成功
            }
            return false;  // 不匹配
        });
    } else {
        // 如果没有选择字段或者没有输入查询内容，恢复原数据
        this.tableData = this.pageInfo.records;
    }
}


    }, 
    mounted() {
        this.getPageData(this.currentPage, this.pageSize);
        
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