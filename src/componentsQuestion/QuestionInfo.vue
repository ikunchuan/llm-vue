<template>
    <el-card class="card">
        <template #header>
            <!-- 标题 -->
            <div slot="header" class="card-header">{{ name }}</div><br>
            <!-- 搜索框 -->
            <div class="header-actions">
                <!-- 选择查询字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                    <el-option label="题目类别" value="1" />
                    <el-option label="题目难度" value="2" />
                    <el-option label="题目标题" value="3" />
                    <el-option label="题目内容" value="4" />
                </el-select>&nbsp;
                <!-- 输入框 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp;
                <!-- 功能按钮 -->
                <el-button type="primary" @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>
            </div>
        </template>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />

            <el-table-column prop="categoryId" label="类别" width="120" />

            <el-table-column prop="questionLevel" label="题目难度" width="120">
                <template #default="scope">
                    {{ formatLevel(scope.row.questionLevel) }}
                </template>
            </el-table-column>

            <el-table-column prop="questionTitle" label="题目标题" width="200">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.questionTitle }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="questionText" label="题目内容" width="200">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.questionText }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="correctAnswer" label="正确答案" width="200">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.correctAnswer }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="reMark" label="备注" width="200">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.reMark }}</span>
                </template>
            </el-table-column>

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
                    <el-button link size="small" type="primary"
                        @click="openDetailDialog(scope.row.questionId)">详情</el-button>
                    <el-button link size="small" type="primary"
                        @click="singleDelete(scope.row.questionId)">删除</el-button>
                    <el-button link size="small" type="primary" @click="openUpdateDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </el-card>

    <!-- 抽屉：添加修改 -->
    <el-drawer v-model="dialogFormVisible" :direction="direction" size="35%">
        <template #header>
            <h3>{{ title }}</h3>
        </template>

        <el-form :model="form">

            <el-form-item label="类别" :label-width="formLabelWidth">
                <el-select v-model="form.categoryId" placeholder="-- 请选择类别 --">
                    <el-option v-for="cat in catInfoData" :key="cat.categoryId" :label="cat.catName"
                        :value="cat.categoryId" />
                </el-select>
            </el-form-item>

            <el-form-item label="题目难度" :label-width="formLabelWidth">
                <el-select v-model="form.questionLevel" placeholder="-- 请选择难度等级 --">
                    <el-option label="入门" value="1" />
                    <el-option label="简单" value="2" />
                    <el-option label="中等" value="3" />
                    <el-option label="困难" value="4" />
                    <el-option label="极难" value="5" />
                </el-select>
            </el-form-item>

            <el-form-item label="题目标题" :label-width="formLabelWidth">
                <el-input v-model="form.questionTitle" type="textarea" autocomplete="off" autosize="true" />
            </el-form-item>

            <el-form-item label="题目内容" :label-width="formLabelWidth">
                <el-input v-model="form.questionText" type="textarea" autocomplete="off" autosize="true" />
            </el-form-item>

            <el-form-item label="正确答案" :label-width="formLabelWidth">
                <el-input v-model="form.correctAnswer" type="textarea" autocomplete="off" autosize="true" />
            </el-form-item>

            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="form.reMark" type="textarea" autosize="true" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div style="flex: auto">
                <el-button @click="closeDetailDrawer">取消</el-button>
                <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
            </div>
        </template>
    </el-drawer>




    <!-- 抽屉：详情 -->
    <el-drawer v-model="dialogDetailVisible" :direction="direction" size="35%">
        <el-descriptions class="margin-top" title="题目详情信息" :column="2" :size="size" border>
            <template #extra>
                <el-button type="primary" @click="openUpdateDialog(form)">编辑</el-button>
            </template>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">题目难度</div>
                </template>
                <el-tag size="defualt">{{ formatLevel(form.questionLevel) }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">题目标题</div>
                </template>
                <div class="question-detail-text">{{ form.questionTitle }}</div>
            </el-descriptions-item>
        </el-descriptions><br>

        <el-descriptions :column="1" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">题目内容</div>
                </template>
                <div class="question-detail-text">{{ form.questionText }}</div>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">正确答案</div>
                </template>
                <div class="question-detail-text">{{ form.correctAnswer }}</div>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">备注</div>
                </template>
                <div class="question-detail-text">{{ form.reMark }}</div>
            </el-descriptions-item>
        </el-descriptions><br>

        <el-descriptions class="margin-top" :column="2" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">更新时间</div>
                </template>
                <span>{{ formatDate(form.updatedTime) }}</span>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">创建时间</div>
                </template>
                <span>{{ formatDate(form.createdTime) }}</span>
            </el-descriptions-item>
        </el-descriptions>

        <template #footer>
            <div style="flex: auto">
                <el-button @click="closeDetailDrawer">取消</el-button>
            </div>
        </template>
    </el-drawer>

</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    data() {
        return {
            name: '题目信息',
            queryStr: "",
            selectedField: "",  //选择字段

            currentPage: 1,
            pageSize: 5,
            pageInfo: {},

            tableData: [],
            queryData: [],
            form: {},

            formLabelWidth: '150px',

            dialogFormVisible: false,
            dialogDetailVisible: false,
            title: '',
            btnName: '',

            multipleSelection: [],
            catInfoData: [
                { categoryId: 1, catName: '计算机科学' },
                { categoryId: 2, catName: '数学' },
                { categoryId: 3, catName: '物理' },],
        };
    },
    methods: {
        //处理难度分级
        formatLevel(questionLevel) {
            if (questionLevel == 1) {
                return '入门';
            } else if (questionLevel == 2) {
                return '简单';
            } else if (questionLevel == 3) {
                return '中等';
            } else if (questionLevel == 4) {
                return '困难';
            } else if (questionLevel == 5) {
                return '极难';
            }
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

        // 分页大小变化
        handleSizeChange(pageSize) {
            console.log("当前页大小: ", pageSize);
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
        },

        // 页码变化
        handleCurrentChange(pageNum) {
            console.log("当前页码: ", pageNum);
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
        },

        // 获取分页数据
        getPageData(num, size) {
            this.$http.get('/qst/v1/page', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    console.log(response.data);  // 检查后端返回的数据
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;
                }).catch(() => {
                    ElMessage({ message: '请求失败，请重试', type: "error" });
                });
        },

        // 添加或编辑按钮点击事件
        btnAddUpdate() {
            if (this.btnName === '添加') {
                this.addQuestion();
            } else if (this.btnName === '编辑') {
                this.updateQuestion();
            }
        },

        // 打开添加对话框
        openAddDialog() {
            this.title = '添加题目信息';
            this.btnName = '添加';
            this.form = {};  // 清空表单数据
            this.dialogFormVisible = true;
        },

        // 添加竞赛信息
        addQuestion() {
            if (!this.form.categoryId || !this.form.questionTitle || !this.form.questionText || !this.form.correctAnswer) {
                ElMessage({ message: '请填写完整的题目信息！', type: "warning" });
                return;
            }
            this.$http.post('/qst/v1', this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '题目信息添加成功！', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize); // 刷新数据
                    this.dialogFormVisible = false; // 关闭对话框
                } else {
                    ElMessage({ message: '题目信息添加失败！', type: "error" });
                }
            }).catch((err) => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        // 打开编辑对话框
        openUpdateDialog(row) {
            this.title = '编辑题目信息';
            this.btnName = '编辑';
            this.form = { ...row }; // 填充表单数据
            this.form.questionLevel = this.formatLevel(row.questionLevel);
            this.dialogFormVisible = true;
        },

        // 编辑题目信息
        updateQuestion() {
            if (!this.form.categoryId || !this.form.questionTitle || !this.form.questionText || !this.form.correctAnswer) {
                ElMessage({ message: '请填写完整的题目信息！', type: "warning" });
                return;
            }
            this.$http.put(`/qst/v1`, this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '更新成功', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize); // 刷新数据
                    this.dialogFormVisible = false; // 关闭对话框
                } else {
                    ElMessage({ message: '更新失败', type: "error" });
                }
            }).catch((err) => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        //打开详情页
        openDetailDialog(questionId) {
            // 打开详情对话框时，发送请求获取数据
            this.$http.get(`/qst/v1/${questionId}`).then((response) => {
                if (response.data) {
                    this.form = response.data;  // 设置表单数据
                    this.dialogDetailVisible = true;  // 打开详情对话框
                } else {
                    ElMessage({ message: '未找到对应的题目信息', type: "warning" });
                }
            }).catch(() => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        //关闭对话框
        closeDrawer() {
            this.dialogDetailVisible = false;
            this.dialogFormVisible = false;
        },
        // 删除单个题目
        singleDelete(questionId) {
            ElMessageBox.confirm('确定删除这条记录吗?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.$http.delete(`/qst/v1/${questionId}`).then((response) => {
                    if (response.data === 1) {
                        ElMessage({ message: '删除成功', type: "success" });
                        this.getPageData(this.currentPage, this.pageSize); // 刷新数据
                    } else {
                        ElMessage({ message: '删除失败', type: "warning" });
                    }
                }).catch(() => {
                    ElMessage({ message: '请求失败，请重试', type: 'error' });
                });
            }).catch(() => { });
        },

        // 批量删除
        multipleDelete() {
            if (this.multipleSelection.length > 0) {
                ElMessageBox.confirm('是否删除选中的所有数据?', '批量删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning",
                }).then(() => {
                    const ids = this.multipleSelection.map(item => item.questionId);
                    // ${ids.join(",")}
                    this.$http.delete(`/qst/v1`, { data: ids }).then((response) => {
                        if (response.data > 0) {
                            ElMessage({ message: '批量删除成功', type: "success" });
                            this.getPageData(this.currentPage, this.pageSize); // 刷新数据
                        } else {
                            ElMessage({ message: '批量删除失败', type: "warning" });
                        }
                    }).catch(() => {
                        ElMessage({ message: '请求失败，请重试', type: "error" });
                    });
                }).catch(() => { });
            } else {
                ElMessage({ message: '请选择要删除的记录', type: "warning" });
            }
        },

        // 查询功能
        queryInfo() {
            if (this.queryStr.trim().length > 0) {
                this.tableData = this.queryData.filter(item =>
                    item.questionTitle.includes(this.queryStr.trim())
                );
            } else {
                this.tableData = [...this.queryData];
            }
            console.log(this.tableData);
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection);
        },
    },

    mounted() {
        this.getPageData(this.currentPage, this.pageSize);
    },
};
</script>

<style scoped>
/* 为课程名称和简介添加滚动条 */
.question-detail-text {
    max-height: 150px;
    /* 设置最大高度，超出部分滚动 */
    overflow-y: auto;
    /* 启用垂直滚动条 */
    white-space: normal;
    /* 允许换行 */
    padding: 5px;
    /* 可选：为文本加一些内边距，使内容看起来更舒适 */
}

.truncate-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    height: 1.5em;
    /* 根据需要设置行高 */
}

.course-name,
.course-description {
    max-height: 150px;
    /* 更大的高度限制 */
    overflow-y: auto;
    /* 显示垂直滚动条 */
    word-wrap: break-word;
    /* 自动换行 */
    white-space: normal;
    /* 允许换行 */
    padding: 5px;
}

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

.cell-item {
    display: flex;
    align-items: center;
}
</style>
