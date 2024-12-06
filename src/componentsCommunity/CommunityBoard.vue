<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ 社区模块管理 }}</div><br>

            <div class="header-actions">
                <!-- 查询字段选择：让用户选择查询的字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                    <el-option label="社区类别" value="1"></el-option>
                    <el-option label="社区名" value="2"></el-option>
                    <el-option label="社区描述" value="3"></el-option>
                    <el-option label="创建者" value="4"></el-option>
                </el-select>&nbsp;

                <!-- 输入框：输入查询内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp;


                <!-- <el-input v-model="queryStr" style="width: 220px" placeholder="请输入课程名称" />&nbsp; -->
                <el-button type="primary" @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>


            </div>

        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="categoryName" label="社区类别" width="90" />
            <el-table-column prop="communityName" label="社区名" width="100" />
            <el-table-column prop="communityDescription" label="社区描述" width="100" />
            <el-table-column prop="userName" label="创建者" width="100" />

            <el-table-column prop="updatedTime" label="更新时间" width="200">
                <template v-slot:default="{ row }">
                    <span>{{ formatDate(row.updatedTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="createdTime" label="创建时间" width="200">
                <template v-slot:default="{ row }">
                    <span>{{ formatDate(row.createdTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" min-width="180">

                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.communityId)">
                        详情
                    </el-button>
                    <el-button link type="primary" size="small" @click="singleDelete(scope.row.communityId)">
                        删除
                    </el-button>
                    <el-button link type="primary" size="small" @click="openUpdateDialog(scope.row)">
                        编辑
                    </el-button>
                    <el-button link type="primary" size="small" @click="fetchCommunityUsers(scope.row.communityId)">
                        所有用户
                    </el-button>
                </template>

            </el-table-column>
        </el-table>

        <br />

        <!-- 分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 20]"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />

    </el-card>


    <!-- 对话框:添加,修改功能 -->
    <!-- 修改抽屉 -->
    <el-drawer v-model="dialogFormVisible" :title="title" size="35%" direction="rtl">
        <el-form :model="form" label-width="120px">
            <el-form-item label="类别">
                <el-select v-model="form.categoryName" placeholder="--请选择类别--">
                    <el-option v-for="cat in catIdAndName" :key="cat.categoryId" :label="cat.categoryName" :value="cat.categoryId" />
                </el-select>
            </el-form-item>

            <el-form-item label="社区名">
                <el-input v-model="form.communityName" />
            </el-form-item>

            <el-form-item label="社区描述">
                <el-input v-model="form.communityDescription" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
        </template>
    </el-drawer>

    <!-- 详情抽屉 -->
    <!-- 详情抽屉 -->
    <el-drawer v-model="dialogDetailVisible" title="社区详情" size="35%" direction="rtl">
        <div class="scrollable">
            <el-descriptions :column="1" border>
                <el-descriptions-item label="社区名">{{ form.communityName }}</el-descriptions-item>
                <el-descriptions-item label="社区描述">{{ form.communityDescription }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{ formatDate(form.updatedTime) }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ formatDate(form.createdTime) }}</el-descriptions-item>
            </el-descriptions>
        </div>
        <template #footer>
            <el-button @click="closeDialog(form)">关闭</el-button>
        </template>
    </el-drawer>

    <!-- 用户信息抽屉 -->
    <el-drawer v-model="dialogUserInfoVisible" title="用户详情" size="35%" direction="rtl">
        <el-table :data="communityUsers" style="width: 100%">
            <el-table-column prop="userName" label="用户名" />
            <el-table-column prop="postCount" label="发帖数量" />
        </el-table>
    </el-drawer>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { handleCurrentChange } from 'element-plus/es/components/tree/src/model/util.mjs';
import { Plus } from '@element-plus/icons-vue';
export default {
    data() {
        return {
            dialogUserInfoVisible: false,//用户抽屉
            dialogDetailVisible: false,   //详细对话框
            dialogFormVisible: false,  //对话框是否展示,默认为不展示

            queryStr: "",                   //查询条件
            multipleSelection: [],       //多选删除
            tableData: [],    //社区信息数据
            userData: [],        //用户信息数据
            communityUsers: [], // 存储用户列表


            queryData: [],
            pageInfo: {},       //分页信息对象

            users: {},
            form: {},                       //对话框表单数据
            formLabelWidth: "150px",    //对话框label宽度
            title: "",                           //对话框标题
            btnName: "",                     //对话框按钮文字
            imageUrl: "",                     //图片URL
            catIdAndName: [],        //全部类别id和名称
            selectedField: "",          // 选择的查询字段
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

        fetchCommunityUsers(communityId) {
            this.$http.get(`/v1/cmns/cmnpostuser/${communityId}`)
                .then((response) => {
                    if (response.data && response.data.length) {
                        this.communityUsers = response.data;
                        this.dialogUserInfoVisible = true;
                    } else {
                        ElMessage.warning('该社区暂无用户数据');
                    }
                })
                .catch((error) => {
                    console.error("获取用户列表失败:", error);
                    ElMessage.error('获取用户数据失败，请稍后重试');
                });
        },

        // 处理时间格式化
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-
                    ${String(date.getMonth() + 1).padStart(2, '0')}-
                    ${String(date.getDate()).padStart(2, '0')} 
                    ${String(date.getHours()).padStart(2, '0')}:
                    ${String(date.getMinutes()).padStart(2, '0')}:
                    ${String(date.getSeconds()).padStart(2, '0')}`;
        },

        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize, this.searchField, this.queryStr);
            console.log("size:", pageSize);
        },
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize, this.searchField, this.queryStr);
            console.log("num:", pageNum);
        },
        getPageData(num, size, searchField, searchKeyword) {
            // 构建查询条件对象，假设你希望根据 communityName 和 userName 搜索
            let communitySearch = {
                communityName: searchField === 'communityName' ? searchKeyword : '',
                communityDescription: searchField === 'communityDescription' ? searchKeyword : '',
                userName: searchField === 'userName' ? searchKeyword : '',
                categoryName: searchField === 'categoryName' ? searchKeyword : ''
            };

            // 发送POST请求到后端
            this.$http.post("/v1/cmns/search?pageNum=" + num + "&pageSize=" + size, communitySearch)
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

        openUserDialog(cmnid) {
            var _this = this
            this.$http.get("/ucmns/v1/ucmn/user/" + cmnid).then(function (response) {
                console.log(response.data);
                _this.users = response.data
            })

            this.dialogUserInfoVisible = true;
            console.log("打开用户详细页面")
        },

        resetForm() {
            this.form = {
                categoryId: null,            // 类别
                communityName: '',           // 社区名
                communityDescription: '',    // 社区描述
                communityUnderview: null,    // 社区概览字段
                createdBy: null,             // 创建者
            };
        },

        closeDialog(dialogType) {
            if (dialogType === 'form') this.dialogFormVisible = false;
            if (dialogType === 'detail') this.dialogDetailVisible = false;
            if (dialogType === 'user') this.dialogUserInfoVisible = false;
            this.resetForm();
            console.log(`${dialogType} 抽屉已关闭`);
        },

        openDetailDialog(cmnid) {
            var _this = this
            this.$http.get("v1/cmns/cmn/" + cmnid).then(function (response) {
                console.log(response.data);
                _this.form = response.data
            })

            this.dialogDetailVisible = true;
        },

        // openAddDialog() {
        //     this.btnName = "添加";
        //     this.title = "添加社区信息";
        //     this.resetForm(); // 清空表单
        //     this.dialogFormVisible = true;
        //     console.log("openAddDialog....");
        // }
        openAddDialog() {
            this.btnName = "添加";
            this.title = "添加社区信息";
            this.resetForm(); // 清空表单
            this.dialogFormVisible = true; // 打开对话框
            console.log("openAddDialog....");
        },
        
        //打开修改对话框,修改数据回显
        openUpdateDialog(row) {
            this.btnName = "修改";
            this.title = "修改社区信息";
            this.form = { ...row }; // 深拷贝数据，防止直接修改表格数据
            this.dialogFormVisible = true;
        },
        updateCmn() {
            this.$http.put("/v1/cmns/cmn", this.form)
                .then(response => {
                    if (response.data === 1) {
                        ElMessage.success("社区信息修改成功");
                        this.dialogFormVisible = false; // 关闭对话框
                        this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新表格数据
                    } else {
                        ElMessage.warning("社区信息修改失败");
                    }
                })
                .catch(error => {
                    console.error("修改失败:", error);
                    ElMessage.error("修改社区信息失败，请稍后重试");
                });
        },

        addCmn() {           // 添加功能
            this.form.communityUnderview = 1;
            this.form.createdBy = 1;
            this.$http.post("v1/cmns/cmn", this.form).then((response) => {
                console.log(response.data);
                if (response.data == 1) {
                    ElMessage.success('社区添加成功');
                    // 关闭对话框
                    this.dialogFormVisible = false;

                    // 重新获取当前页数据
                    this.getPageData(this.currentPage, this.pageSize, '', '');
                } else {
                    ElMessage.warning('社区添加失败');
                }
            }).catch((error) => {
                console.error("添加失败:", error);
                ElMessage.error('添加数据失败，请稍后重试');
            });
            // 重置表单
            this.resetForm();
        },



        //--------------------------------------------------------
        btnAddUpdate() {
            if (this.btnName == "添加") {
                this.addCmn()
                console.log("添加操作......")
                console.log(this.form)
            }
            if (this.btnName == "修改") {
                this.updateCmn()
                console.log(this.form)
                console.log("修改操作......")
            }
            this.closeDialog(); // 关闭抽屉
            ElMessage.success(`${this.btnName}成功`);
            this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据

        },

        singleDelete(cmnid) {
            console.log("singleDelete().....")
            ElMessageBox.confirm(
                '您确定要删除本条数据吗?',
                'Warning',
                {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            )
                .then(() => {
                    var _this = this;
                    this.$http.delete("v1/cmns/cmn/" + cmnid).then(function (response) {
                        console.log(response.data);
                    })
                    if (response.data == 1) {
                        ElMessage({
                            type: 'success',
                            message: '删除成功',
                        })
                        this.getPageData(this.currentPage, this.pageSize, '') // 刷新数据
                    } else {
                        ElMessage({
                            type: 'warning',
                            message: '删除失败',
                        })
                    }
                })
                .catch(() => {
                    ElMessage.error('请求失败，请重试');
                })
        },

        multiDelete() {
            console.log("multiDelete()...")
            ElMessageBox.confirm(
                '您确定要删除当前选中的多条数据吗?',
                'Warning',
                {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            )
                .then(() => {
                    var _this = this;
                    var num = 0;
                    this.multipleSelection.forEach(item => {
                        var _this = this;
                        var cmnid = item.communityId
                        this.$http.delete("v1/cmns/cmn/" + cmnid).then(function (response) {
                            console.log(response.data);
                            if (response.data == 1) {
                                num = num + 1
                            }
                        })
                    })
                    ElMessage({
                        type: 'success',
                        message: '你成功删除' + num + '条记录',
                    })
                    this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据
                })
                .catch(() => {
                    ElMessage.error('请求失败，请重试');
                })

        },

        queryInfo() {
            console.log("查询内容:", this.queryStr);
            // 检查当前页码,如果未定义则使用默认值1
            let num = this.currentPage || 1;
            // 检查每页大小,如果未定义则使用默认值3 
            let size = this.pageSize || 3;

            // 构建查询参数
            let field = '';
            let keyword = this.queryStr || '';

            // 根据选择的查询字段设置field
            switch (this.selectedField) {
                case '1':
                    field = 'categoryName';
                    break;
                case '2':
                    field = 'communityName';
                    break;
                case '3':
                    field = 'communityDescription';
                    break;
                case '4':
                    field = 'userName';
                    break;
                default:
                    field = '';
            }
            // 调用getPageData并传入所有参数
            this.getPageData(num, size, field, keyword);
        },

        handleSelectionChange(val) {            //多行选择
            this.multipleSelection = val;
            console.log(this.multipleSelection);

        }
    },
    components: {
        Plus
    },

    mounted() {
        // 初始化页面时调用getPageData,使用默认参数
        this.currentPage = 1;  // 设置默认页码为1
        this.pageSize = 5;     // 设置默认每页显示3条
        this.getPageData(this.currentPage, this.pageSize, '', '');  // field和keyword传空字符串
        

        this.$http.get("cat/v1/all").then((response) => {
            console.log(response.data);
            this.catIdAndName = response.data;
            console.log(this.catIdAndName)
        })

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



<style scoped>
.card {
    width: 100%;
    margin: 20px 0;
}

.card-header {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.header-actions {
    display: flex;
    align-items: center;
}

.header-actions .el-input {
    margin-right: 10px;
}

.button {
    margin-left: 10px;
}

.dialog-footer {
    text-align: center;
}
/* 滚动条 */
.scrollable {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
}

</style>