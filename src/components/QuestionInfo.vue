<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入题目标题" />&nbsp;
                <el-button type="primary" round @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" round @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" round @click="multipleDelete">多选删除</el-button>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="category_id" label="类别" width="120" />
            <el-table-column prop="question_title" label="题目标题" width="150" />
            <el-table-column prop="question_text" label="题目内容" width="200" />
            <el-table-column prop="correct_answer" label="正确答案" width="120" />
            <el-table-column prop="updated_time" label="更新时间" width="150" />
            <el-table-column prop="created_time" label="创建时间" width="150" />
            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button link size="small" @click="openDetailDialog(scope.row.question_id)">详情</el-button>
                    <el-button link size="small" @click="singleDelete(scope.row.question_id)">删除</el-button>
                    <el-button link size="small" @click="openUpdateDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </el-card>

    <!-- 编辑、添加对话框 -->
    <el-dialog v-model="dialogFormVisible" :title="title" width="500">
        <el-form :model="form">
            <el-form-item label="类别" :label-width="formLabelWidth">
                <el-select v-model="form.category_id" placeholder="请选择类别">
                    <el-option v-for="cat in catInfoData" :key="cat.category_id" :label="cat.cat_name"
                        :value="cat.category_id" />
                </el-select>
            </el-form-item>

            <el-form-item label="题目标题" :label-width="formLabelWidth">
                <el-input v-model="form.question_title" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="题目内容" :label-width="formLabelWidth">
                <el-input v-model="form.question_text" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="正确答案" :label-width="formLabelWidth">
                <el-input v-model="form.correct_answer" autocomplete="off" />
            </el-form-item>

            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="form.re_mark" type="textarea" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogDetailVisible" title="题目信息详情" width="500">
        <el-form :model="form">
            <el-form-item label="题目标题：" :label-width="formLabelWidth">
                <el-form-item :label="form.question_title" />
            </el-form-item>

            <el-form-item label="题目内容：" :label-width="formLabelWidth">
                <el-form-item :label="form.question_text" />
            </el-form-item>

            <el-form-item label="正确答案：" :label-width="formLabelWidth">
                <el-form-item :label="form.correct_answer" />
            </el-form-item>

            <el-form-item label="备注：" :label-width="formLabelWidth">
                <el-form-item :label="form.re_mark" />
            </el-form-item>

            <el-form-item label="更新时间：" :label-width="formLabelWidth">
                <el-form-item :label="form.updated_time" />
            </el-form-item>

            <el-form-item label="创建时间：" :label-width="formLabelWidth">
                <el-form-item :label="form.created_time" />
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

export default {
    data() {
        return {

            name: '题目信息',
            queryStr: "",

            currentPage: 1,
            pageSize: 5,
            pageInfo: {},

            tableData: [],
            form: {},
            formLabelWidth: '150px',

            dialogFormVisible: false,
            dialogDetailVisible: false,
            title: '',
            btnName: '',

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
                    ElMessage({ message: '题目信息添加成功！', type: 'success' });
                    this.getPageData(this.currentPage, this.pageSize);
                    this.dialogFormVisible = false;
                } else {
                    ElMessage({ message: '题目信息添加失败！', type: 'error' });
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
                        ElMessage({ message: '删除成功', type: 'success' });
                        this.getPageData(this.currentPage, this.pageSize);
                    } else {
                        ElMessage({ message: '删除失败', type: 'warning' });
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
                            ElMessage({ message: '批量删除成功', type: 'success' });
                            this.getPageData(this.currentPage, this.pageSize);
                        } else {
                            ElMessage({ message: '批量删除失败', type: 'warning' });
                        }
                    });
                }).catch(() => { });
            } else {
                ElMessage({ message: '请选择要删除的记录', type: 'warning' });
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
                    ElMessage({ message: '更新成功', type: 'success' });
                    this.getPageData(this.currentPage, this.pageSize);
                    this.dialogFormVisible = false;
                } else {
                    ElMessage({ message: '更新失败', type: 'error' });
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
</style>
