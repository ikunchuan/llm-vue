<template>
    <el-container>

        <el-main>
            <el-card class="card">
                <div slot="header" class="card-header">
                    <span>违规用户处理</span>
                </div>
                <!-- 这里可以放置违规用户处理的相关内容 -->
                <!-- 用户数据表格 -->
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
                    <!-- <el-table-column prop="updatedTime" label="更新时间" width="100">
                        <template #default="{ row }">
                            <span>{{ formatDate(row.updatedTime) }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createdTime" label="创建时间" width="100" >
                        <template #default="{ row }">
                            <span>{{ formatDate(row.createdTime) }}</span>
                        </template>
                    </el-table-column> -->

                    <el-table-column fixed="right" label="操作" min-width="160">

                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.userId)">
                                详情
                            </el-button>
                            
                        </template>

                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                            :page-sizes="[3, 5, 10, 20]" layout="total, sizes, prev, pager, next, jumper"
                            :total="pageInfo.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                    </el-card>
        </el-main>

        <!-- 抽屉：查看社区申请并审核 -->
        <el-drawer v-model="dialogDetailVisible" :direction="direction" size="35%">


            <el-form :model="form">


                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.userName" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>

                <el-form-item label="性别" :label-width="formLabelWidth">
                    {{ form.userSex==1?'男':'女' }}
                </el-form-item>

                <el-form-item label="地区" :label-width="formLabelWidth">
                    <el-input v-model="form.userLocal" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>
                <el-form-item label="年龄" :label-width="formLabelWidth">
                    <el-input v-model="form.userAge" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>

                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.userPassword" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth">
                    <el-input v-model="form.userPhone" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.userEmail" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>
                <el-form-item label="用户描述" :label-width="formLabelWidth">
                    <el-input v-model="form.userBio" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>

            </el-form>

            <template #footer>
                <div style="flex: auto">
                    <el-button @click="refuseEvent">拒绝</el-button>
                    <el-button type="primary" @click="agreeEvent">解冻</el-button>
                </div>
            </template>
        </el-drawer>
    </el-container>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
    data() {
        return {
            loading:true,
            postData: [],
            dialogDetailVisible: false,
            multipleSelection: [],
            tableData: [],
            pageInfo: {},
            pageSize: 5,
            pageNum: 1,
            form: {},
            formLabelWidth: "150px",
            title: "",
            btnName: "",
            selectedField: "",
        };
    },
    methods: {
        agreeEvent() {
            this.form.userUnderview = 1;
            this.$http.put("uis/v1/ui", this.form).then(function (response) {
                console.log(response.data);

                if (response.data == 1) {
                    ElMessage({
                        message: '同意解冻申请',
                        type: 'success',
                    })
                } else {
                    ElMessage({
                        message: '拒绝解冻申请',
                        type: 'warning',
                    })
                }

            })

            this.dialogDetailVisible = false;
        },

        refuseEvent() {
            ElMessageBox.confirm(
                '您确定要拒绝这个社区申请吗?',
                'Warning',
                {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                }
            )
                .then(() => {
                    var _this = this;
                    this.$http.delete("uis/v1/ui" + this.form.userId).then(function (response) {
                        console.log(response.data);
                    })
                    if (response.data == 1) {
                        ElMessage({
                            type: 'success',
                            message: '已拒绝解冻申请',
                        })
                    } else {
                        ElMessage({
                            type: 'warning',
                            message: '操作失败',
                        })
                    }


                })
                .catch(() => {

                })

            this.dialogFormVisible = false;
        },

        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
        },
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
        },
        getPageData(num, size) {
            this.$http.get('/uis/v1/ui/search2', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    this.pageInfo = response.data;
                    this.tableData = response.data.records;
                    if (response) {
                        this.loading = false;
                    }

                })
                .catch((error) => {
                    ElMessage.error('数据加载失败，请稍后重试');
                });
        },
        openDetailDialog(userid) {
            this.$http.get("/uis/v1/ui/" + userid).then(response => {
                this.form = response.data;
            });
            this.dialogDetailVisible = true;
        },



    },

    mounted() {
        this.getPageData(1, 5)
    }

};
</script>

<style scoped>
.card {
    margin: 20px;
}

.header-actions {
    margin-bottom: 15px;
}

.ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.dialog-footer {
    text-align: right;
}

.el-header {
    font-size: 20px;
    padding: 15px 0;
}
</style>