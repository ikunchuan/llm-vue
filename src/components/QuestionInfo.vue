<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            <span>QuestionInfo</span>
        </div>

        <p>QuestionInfo显示内容</p>

        <<<<<<< HEAD=======<el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="categoryId" label="类别" width="120" />
            <el-table-column prop="questionTitle" label="题目标题" width="150" />
            <el-table-column prop="questionText" label="题目内容" width="200" />
            <el-table-column prop="correctAnswer" label="正确答案" width="120" />
            <el-table-column prop="updatedTime" label="更新时间" width="150" />
            <el-table-column prop="createdTime" label="创建时间" width="150" />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button link size="small" @click="openDetailDialog(scope.row.question_id)">详情</el-button>
                    <el-button link size="small" @click="singleDelete(scope.row.question_id)">删除</el-button>
                    <el-button link size="small" @click="openUpdateDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
        return {

            name: "题目信息",
            queryStr: "",

            currentPage: 1,
            pageSize: 5,
            pageInfo: {},

            tableData: [],
            form: {},
            formLabelWidth: "150px",

            dialogFormVisible: false,
            dialogDetailVisible: false,
            title: "",
            btnName: "",

            multipleSelection: [],
            catInfoData: [
                { category_id: 1, cat_name: '数学' },
                { category_id: 2, cat_name: '物理' },
                { category_id: 3, cat_name: '化学' },
            ],
        };
    },
    methods: {
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
        },

        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
        },

        getPageData(num, size) {
            this.$http.get('/qst/v1/page', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                });
        },

        openAddDialog() {
            this.title = '添加题目信息';
            this.btnName = '添加';
            this.form = {};
            this.dialogFormVisible = true;
        },

        addQuestion() {
            this.$http.post('/qst/v1', this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '题目信息添加成功！', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize);
                    this.dialogFormVisible = false;
                } else {
                    ElMessage({ message: '题目信息添加失败！', type: "error" });
                }
            });
        },

        openDetailDialog(questionId) {
            // 获取并显示详情
            this.$http.get(`/qst/v1/${questionId}`).then((response) => {
                this.form = response.data;
                this.dialogDetailVisible = true;
            });
        },

        queryInfo() {
            if (this.queryStr.trim().length > 0) {  //.trim()去掉空格再判断空值
                this.tableData = this.queryData
                this.tableData = this.tableData.filter(  //将值把
                    item => item.stu_name && item.stu_name.match(this.queryStr.trim())
                ) // 确保 stu_name 不为 null
            } else {
                this.tableData = this.queryData
            }
            console.log("queryInfo() ...")
        },

        singleDelete(questionId) {
            ElMessageBox.confirm('确定删除这条记录吗?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http.delete(`/qst/v1/${questionId}`).then((response) => {
                    if (response.data == 1) {
                        ElMessage({ message: '删除成功', type: "success" });
                        this.getPageData(this.currentPage, this.pageSize);
                    } else {
                        ElMessage({ message: '删除失败', type: "warning" });
                    }
                });
            }).catch(() => { });
        },

        multipleDelete() {
            if (this.multipleSelection.length > 0) {
                ElMessageBox.confirm('是否删除选中的所有数据?', '批量删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$http.post('/qst/v1', this.multipleSelection).then((response) => {
                        if (response.data == 1) {
                            ElMessage({ message: '批量删除成功', type: "success" });
                            this.getPageData(this.currentPage, this.pageSize);
                        } else {
                            ElMessage({ message: '批量删除失败', type: "warning" });
                        }
                    });
                }).catch(() => { });
            } else {
                ElMessage({ message: '请选择要删除的记录', type: "warning" });
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        btnAddUpdate() {
            if (this.btnName === '添加') {
                this.addQuestion();
            } else if (this.btnName === '编辑') {
                this.updateQuestion();
            }
        },

        updateQuestion() {
            this.$http.put(`/qst/v1/${this.form.question_id}`, this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '更新成功', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize);
                    this.dialogFormVisible = false;
                } else {
                    ElMessage({ message: '更新失败', type: "error" });
                }
            });
        }
    },

    mounted() {
        this.getPageData(this.currentPage, this.pageSize);


    },
};
</script>

<style scoped>
.card {
    padding: 20px;
}

.card-header {
    font-size: 20px;
    font-weight: bold;
}
</style>
