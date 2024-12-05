<template>
    <el-container>

        <el-main>
            <el-card class="card" shadow="hover">


                <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column prop="categoryName" label="社区类别" width="120" />
                    <el-table-column prop="communityName" label="社区名" width="120" />
                    <el-table-column prop="communityDescription" label="社区简介" width="200">
                        <template v-slot:default="{ row }">
                            <span class="ellipsis">{{ row.communityDescription }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" min-width="180">
                        <template #default="scope">
                            <el-button link type="primary" size="small"
                                @click="openDetailDialog(scope.row.communityId)">
                                查看详细
                            </el-button>

                        </template>
                    </el-table-column>
                </el-table>

                <br />

                <!-- 分页 -->
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[3, 5, 10, 20]" layout="total, sizes, prev, pager, next, jumper"
                    :total="pageInfo.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-card>
        </el-main>

        <!-- 抽屉：查看社区申请并审核 -->
        <el-drawer v-model="dialogFormVisible" :direction="direction" size="35%">


            <el-form :model="form">


                <el-form-item label="社区名" :label-width="formLabelWidth">
                    <el-input v-model="form.communityName" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>

                <el-form-item label="社区简介" :label-width="formLabelWidth">
                    <el-input v-model="form.communityDescription" type="textarea" autocomplete="off" autosize="true" />
                </el-form-item>

            </el-form>

            <template #footer>
                <div style="flex: auto">
                    <el-button @click="refuseEvent">拒绝</el-button>
                    <el-button type="primary" @click="agreeEvent">同意</el-button>
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
            postData: [],
            dialogFormVisible: false,
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
            this.form.communityUnderview = 1;
            this.$http.put("/v1/cmns/cmn", this.form).then(function (response) {
                console.log(response.data);

                if (response.data == 1) {
                    ElMessage({
                        message: '同意社区申请',
                        type: 'success',
                    })
                } else {
                    ElMessage({
                        message: '拒绝社区申请',
                        type: 'warning',
                    })
                }

            })

            this.dialogFormVisible = false;
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
                    this.$http.delete("v1/cmns/cmn/" + this.form.communityId).then(function (response) {
                        console.log(response.data);
                    })
                    if (response.data == 1) {
                        ElMessage({
                            type: 'success',
                            message: '已拒绝社区申请',
                        })
                    } else {
                        ElMessage({
                            type: 'warning',
                            message: '修改失败',
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
        getPageData(num, size, searchField, searchKeyword) {
            let communitySearch = {
                communityName: searchField === 'communityName' ? searchKeyword : '',
                userName: searchField === 'userName' ? searchKeyword : '',
                communityType: searchField === 'communityType' ? searchKeyword : ''
            };

            this.$http.post("/v1/cmns/search2?pageNum=" + num + "&pageSize=" + size, communitySearch)
                .then(response => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                })
                .catch(error => {
                    this.$message({
                        type: 'error',
                        message: '查询失败'
                    });
                });
        },

        //打开详情页
        openDetailDialog(cmnid) {
            // 打开详情对话框时，发送请求获取数据
            this.$http.get("/v1/cmns/cmn/" + cmnid).then((response) => {
                if (response.data) {
                    this.form = response.data;  // 设置表单数据
                    this.dialogDetailVisible = true;  // 打开详情对话框
                } else {
                    ElMessage({ message: '', type: "" });
                }
            }).catch(() => {
                ElMessage({ message: '', type: "" });
            });

            this.dialogFormVisible = true;
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