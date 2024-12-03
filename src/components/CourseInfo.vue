<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入课程名称" />&nbsp;
                <el-button type="primary" round @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" round @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" round @click="multipleDelete">多选删除</el-button>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="categoryId" label="类别" width="120" />
            <el-table-column prop="courseName" label="课程名称" width="200" />
            <el-table-column prop="courseDescription" label="课程简介" width="500" />
            <el-table-column prop="courseDifficultyLevel" label="难度级别" width="150" />
            <el-table-column prop="courseRating" label="评分" width="150" />

            <el-table-column prop="updatedTime" label="更新时间" width="250">
                <template #default="{ row }">
                    <span>{{ formatDate(row.updatedTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="createdTime" label="创建时间" width="250" >
                <template #default="{ row }">
                    <span>{{ formatDate(row.createdTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button link size="small" @click="openDetailDialog(scope.row.courseId)">详情</el-button>
                    <el-button link size="small" @click="singleDelete(scope.row.courseId)">删除</el-button>
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
                <el-select v-model="form.categoryId" placeholder="请选择类别">
                    <el-option v-for="cat in catInfoData" :key="cat.categoryId" :label="cat.catName"
                        :value="cat.categoryId" />
                </el-select>
            </el-form-item>

            <el-form-item label="课程名称" :label-width="formLabelWidth">
                <el-input v-model="form.courseName" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="课程简介" :label-width="formLabelWidth">
                <el-input v-model="form.courseDescription" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="课程难度" :label-width="formLabelWidth">
                <el-select v-model="form.courseDifficultyLevel" placeholder="请选择难度级别">
                    <el-option label="初级" value="初级" />
                    <el-option label="中级" value="中级" />
                    <el-option label="高级" value="高级" />
                </el-select>
            </el-form-item>

            <el-form-item label="课程评分" :label-width="formLabelWidth">
                <el-input 
                    v-model="form.courseRating" 
                    type="number" 
                    :min="1" 
                    :max="5" 
                    step="1" 
                    autocomplete="off" 
                    @input="validateRating" 
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
                <el-button @click="dialogFormVisible = false">取消</el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogDetailVisible" title="课程信息详情" width="500">
        <el-form :model="form">
            <el-form-item label="课程名称：" :label-width="formLabelWidth">
                <el-form-item :label="form.courseName" />
            </el-form-item>

            <el-form-item label="课程简介：" :label-width="formLabelWidth">
                <el-form-item :label="form.courseDescription" />
            </el-form-item>

            <el-form-item label="难度级别：" :label-width="formLabelWidth">
                <el-form-item :label="form.courseDifficultyLevel" />
            </el-form-item>

            <el-form-item label="课程评分：" :label-width="formLabelWidth">
                <el-form-item :label="form.courseRating" />
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

export default {
    data() {
        return {
            name: '课程信息',
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
                { categoryId: 1, catName: '计算机科学' },
                { categoryId: 2, catName: '数学' },
                { categoryId: 3, catName: '物理' },
            ],
        };
    },
    methods: {
        handleSizeChange(pageSize) {
            console.log("当前页大小: ", pageSize);
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
        },

        handleCurrentChange(pageNum) {
            console.log("当前页码: ", pageNum);
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
        },

        getPageData(num, size) {
            this.$http.get('/crs/v1/page', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    console.log(response.data);
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;
                });
        },


        openAddDialog() {
            this.title = '添加课程信息';
            this.btnName = '添加';
            this.form = {};
            this.dialogFormVisible = true;
        },

        addCourse() {
            this.$http.post('/crs/v1', this.form).then((response) => {
                if (response.data === 1) {
                    ElMessage({ message: '课程信息添加成功！', type: 'success' });
                    this.getPageData(this.currentPage, this.pageSize);
                    this.dialogFormVisible = false;
                } else {
                    ElMessage({ message: '课程信息添加失败！', type: 'error' });
                }
            });
        },

        openDetailDialog(courseId) {
            this.$http.get(`/crs/v1/${courseId}`).then((response) => {
                this.form = response.data;
                this.dialogDetailVisible = true;
            });
        },

        queryInfo() {
            if (this.queryStr.trim().length > 0) {
                this.tableData = this.pageInfo.records.filter(item =>
                    item.courseName && item.courseName.match(this.queryStr.trim())
                );
            } else {
                this.tableData = this.pageInfo.records;
            }
        },

        singleDelete(courseId) {
            ElMessageBox.confirm('确定删除这条记录吗?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http.delete(`/crs/v1/${courseId}`).then((response) => {
                    if (response.data === 1) {
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
                    this.$http.post('/course/v1/delete', this.multipleSelection).then((response) => {
                        if (response.data === 1) {
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
                this.addCourse();
            } else if (this.btnName === '编辑') {
                this.updateCourse();
            }
        },

        updateCourse() {
            this.$http.put(`/crs/v1/${this.form.courseId}`, this.form).then((response) => {
                if (response.data === 1) {
                    ElMessage({ message: '更新成功', type: 'success' });
                    this.getPageData(this.currentPage, this.pageSize);
                    this.dialogFormVisible = false;
                } else {
                    ElMessage({ message: '更新失败', type: 'error' });
                }
            })
        },

        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },

        //添加评分限制只能是1-5
        validateRating() {
            if (this.form.courseRating < 1) {
                this.form.courseRating = 1;
            } else if (this.form.courseRating > 5) {
                this.form.courseRating = 5;
            }
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
