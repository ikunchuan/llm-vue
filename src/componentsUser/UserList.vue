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
                <el-button type="primary" @click="queryInfo">查询</el-button>
            </div>

        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="userName" label="用户名" width="120" />
            <el-table-column prop="userSex" label="性别" width="100">
                <template #default="scope">
                    {{ scope.row.userSex == 1 ? '男' : '女' }}
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

            <el-table-column prop="createdTime" label="创建时间" width="100">
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
                {{ form.userSex == 1 ? '男' : '女' }}
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
            loading: true,
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
            pageSize: 5,        //当前页条数
            pageNum: 1,     //当前页号

            title: "",                           //对话框标题
            btnName: "",                     //对话框按钮文字
            // claInfoData: [],                  //加载到下拉框的班级信息
            imageUrl: "",                     //图片URL
            searchField: '',
            searchKeyword: '',
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
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        //切换页号时得到当时页号
        handleCurrentChange(pageNum) {
            console.log("当前页码: ", pageNum);
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        getPageData(num, size, searchField, searchKeyword) {

            if (this.selectedField === 'userSex') {
                if (searchKeyword == '男') {
                    searchKeyword = 1
                } else if (searchKeyword == '女') {
                    searchKeyword = 2
                }
            }

            // 构建查询条件对象
            let userInfoSearch = {
                userName: searchField === 'userName' ? searchKeyword : '',
                userSex: searchField === 'userSex' ? searchKeyword : ''
            };

            // 发送POST请求到后端
            this.$http.post("/uis/v1/ui/search?pageNum=" + num + "&pageSize=" + size, userInfoSearch)
                .then(response => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                    console.log("查询结果:", this.tableData);
                })
                .catch(error => {
                    console.error("查询出错:", error);
                    ElMessage({
                        type: 'error',
                        message: '查询失败'
                    });
                });

        },


        closeDialog() {
            this.form = []
            console.log("closeDialog.....")
        },

        //打开详情页
        openDetailDialog(userid) {
            var _this = this
            this.$http.get("/uis/v1/ui/" + userid).then(function (response) {
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
            console.log("查询内容:", this.queryStr);
            // 检查当前页码,如果未定义则使用默认值1
            let num = this.currentPage || 1;
            // 检查每页大小,如果未定义则使用默认值5
            let size = this.pageSize || 5;

            // 构建查询参数
            let field = this.selectedField || '';
            let keyword = this.queryStr || '';

            // 调用getPageData并传入所有参数
            this.getPageData(num, size, field, keyword);
        },

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