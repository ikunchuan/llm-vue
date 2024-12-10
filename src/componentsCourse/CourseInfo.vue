<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <!-- 查询字段选择：让用户选择查询的字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;" clearable>
                    <el-option label="课程名称" value="courseName" />
                    <el-option label="课程简介" value="courseDescription" />
                    <el-option label="难度级别" value="courseDifficultyLevel" />
                    <el-option label="课程评分" value="courseRating" />
                </el-select>&nbsp;

                <!-- 输入框：输入查询内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" clearable />&nbsp;

                <el-button type="primary" @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>
            </div>
        </template>
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column fixed type="index" label="序号" width="55" />
            <el-table-column prop="categoryName" label="类别" width="150" />

            <!-- 课程名称列 -->
            <el-table-column prop="courseName" label="课程名称" width="200">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.courseName }}</div>
                </template>
            </el-table-column>

            <el-table-column prop="courseDifficultyLevel" label="难度级别" width="100" />
            <el-table-column prop="courseRating" label="评分" width="55" />

            <!-- 课程简介列 -->
            <el-table-column prop="courseDescription" label="课程简介" width="200">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.courseDescription }}</div>
                </template>
            </el-table-column>

            <el-table-column prop="updatedTime" label="更新时间" width="200">
                <template #default="{ row }">
                    <span>{{ formatDate(row.updatedTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="createdTime" label="创建时间" width="200">
                <template #default="{ row }">
                    <span>{{ formatDate(row.createdTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" min-width="180">
                <template #default="scope">
                    <el-button link type="primary" size="small"
                        @click="openDetailDialog(scope.row.courseId)">详情</el-button>
                    <el-button link type="primary" size="small" @click="singleDelete(scope.row.courseId)">删除</el-button>
                    <el-button link type="primary" size="small" @click="openUpdateDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination ref="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-card>

    <!-- 抽屉：添加编辑 -->
    <el-drawer v-model="dialogFormVisible" :title="title" size="35%">
        <el-form :model="form" label-width="150px">

            <el-form-item label="类别" :label-width="formLabelWidth">
                <el-select v-model="form.categoryName" placeholder="-- 请选择类别 --">
                    <el-option v-for="cat in filteredCatIdAndName" :key="cat.categoryId" :label="cat.categoryName"
                        :value="cat.categoryId" />
                </el-select>
            </el-form-item>

            <el-form-item label="课程名称">
                <el-input v-model="form.courseName" type="textarea" autocomplete="off" autosize="true" />
            </el-form-item>

            <el-form-item label="课程难度">
                <el-select v-model="form.courseDifficultyLevel" placeholder="请选择难度级别">
                    <el-option label="初级" value="初级" />
                    <el-option label="中级" value="中级" />
                    <el-option label="高级" value="高级" />
                </el-select>
            </el-form-item>

            <el-form-item label="课程评分">
                <el-input v-model="form.courseRating" type="number" :min="1" :max="5" step="1" autocomplete="off"
                    @input="validateRating" />
            </el-form-item>

            <el-form-item label="课程简介">
                <el-input v-model="form.courseDescription" type="textarea" autocomplete="off" autosize="true" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div style="flex: auto">
                <el-button @click="closeDrawer">取消</el-button>
                <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
            </div>
        </template>
    </el-drawer>


    <!-- 详情抽屉 -->
    <el-drawer v-model="dialogDetailVisible" title="课程详情信息" size="35%">
        <el-descriptions :column="1" border>
            <template #extra>
                <el-button type="primary" @click="openUpdateDialog(form)">编辑</el-button>
            </template>

            <el-descriptions-item label="课程名称">
                <span>{{ form.courseName }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="课程类别">
                <span>{{ isCorrectId() }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="课程简介">
                <span class="course-detail-text">{{ form.courseDescription }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="难度级别">
                <span class="course-detail-text">{{ form.courseDifficultyLevel }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="课程评分">
                <span>{{ form.courseRating }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="更新时间">
                <span>{{ formatDate(form.updatedTime) }}</span>
            </el-descriptions-item>

            <el-descriptions-item label="创建时间">
                <span>{{ formatDate(form.createdTime) }}</span>
            </el-descriptions-item>
        </el-descriptions>

        <template #footer>
            <div class="drawer-footer">
                <el-button @click="closeDrawer">关闭</el-button>
            </div>
        </template>
    </el-drawer>

</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    data() {
        return {

            name: '课程信息',
            queryStr: "",  //查询条件
            selectedField: "",  // 选择的查询字段

            currentPage: 1,
            pageSize: 5,
            pageInfo: {},  //分页信息。单条数据用map（就是python中的字典），用`{}`表示空字典

            tableData: [],  //表格数据
            catInfoData: [], //表格的类别信息
            catIdAndName: [], //全部类别id和名称
            queryData: [],      //查询数据

            form: {},  //对话框表单数据
            formLabelWidth: '150px',

            loading: true,  //加载框
            dialogFormVisible: false,
            dialogDetailVisible: false,
            title: '',
            btnName: '',

            multipleSelection: [],
        };
    },

    computed: {
        filteredCatIdAndName() {
            //编辑添加框回显类别数据的时候，不显示一级类别的数据
            return this.catIdAndName.filter(item => item.parentId != null);
        },
    },

    methods: {
        isCorrectId() { //回显对应ID的类别名称
            return this.catIdAndName.filter(item => item.categoryId === this.form.categoryId)[0].categoryName
        },

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

        //添加评分限制只能是1-5
        validateRating() {
            if (this.form.courseRating < 1) {
                this.form.courseRating = 1;
            } else if (this.form.courseRating > 5) {
                this.form.courseRating = 5;
            }
        },

        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        getPageData(num, size, searchField, searchKeyword) {
            // 构建查询条件对象
            let courseSearch = {
                courseName: searchField === 'courseName' ? searchKeyword : '',
                courseDescription: searchField === 'courseDescription' ? searchKeyword : '',
                courseDifficultyLevel: searchField === 'courseDifficultyLevel' ? searchKeyword : '',
                courseRating: searchField === 'courseRating' ? searchKeyword : ''
            };

            this.$http.post('/crs/search', courseSearch, { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                    this.catInfoData = this.pageInfo.list.map(item => ({
                        categoryId: item.categoryId,
                        categoryName: item.categoryName,
                    }));
                    if (response) {
                        this.loading = false;
                    }
                    console.log(this.catInfoData);
                }).catch(() => {
                    ElMessage({ message: '请求失败，请重试', type: "error" });
                });
        },

        queryInfo() {
            if (this.queryStr.trim() === '' || this.selectedField === '') {
                ElMessage({ message: '已为您查询全部数据', type: "warning" });
            }

            // `.trim()`方法用于删除字符串头尾的空格。
            // `.replace(/\s+/g, "")`去除所有空格。`.replace(/\s+/g, " ").trim()` // 去除多余空格
            console.log("查询内容:", this.queryStr.trim());
            // 检查当前页码,如果未定义则使用默认值1
            let num = this.currentPage || 1;
            // 检查每页大小,如果未定义则使用默认值5
            let size = this.pageSize || 5;

            // 构建查询参数
            let field = this.selectedField || '';
            let keyword = this.queryStr.trim() || '';

            // 调用getPageData并传入所有参数
            this.getPageData(num, size, field, keyword);

            // 使用 $nextTick 确保 DOM 已经更新
            this.$nextTick(() => {
                if (this.$refs.pagination) {
                    this.$refs.pagination.setTotal(this.pageInfo.total);
                }
            });
        },

        btnAddUpdate() {
            if (this.btnName === '添加') {
                this.addCourse();
            } else if (this.btnName === '编辑') {
                this.updateCourse();
            }
        },

        closeDrawer() {
            this.dialogDetailVisible = false;
            this.dialogFormVisible = false;
        },

        openAddDialog() {
            this.title = '添加课程信息';
            this.btnName = '添加';
            this.form = {};
            this.dialogFormVisible = true;
        },

        addCourse() {
            if (!this.form.courseName || !this.form.courseDescription || !this.form.courseDifficultyLevel) {
                ElMessage({ message: '请填写完整的题目信息！', type: "warning" });
                return;
            }
            this.$http.post('/crs/v1', this.form).then((response) => {
                if (response.data === 1) {
                    ElMessage({ message: '课程信息添加成功！', type: 'success' });
                    this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据
                    this.dialogFormVisible = false; // 关闭对话框
                } else {
                    ElMessage({ message: '课程信息添加失败！', type: 'error' });
                }
            }).catch((err) => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        // 打开编辑对话框
        openUpdateDialog(row) {
            this.title = '编辑课程信息';
            this.btnName = '编辑';
            this.form = { ...row }; // 填充表单数据
            this.dialogFormVisible = true;
            this.dialogDetailVisible = false;
        },

        // 编辑课程信息
        updateCourse() {
            if (!this.form.categoryId || !this.form.courseName || !this.form.courseDescription || !this.form.courseDifficultyLevel) {
                ElMessage({ message: '请填写完整的信息！', type: "warning" });
                return;
            }
            this.$http.put(`/crs/v1`, this.form).then((response) => {
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
        openDetailDialog(courseId) {
            // 打开详情对话框时，发送请求获取数据
            this.$http.get(`/crs/v1/${courseId}`).then((response) => {
                if (response.data) {
                    this.form = response.data;  // 设置表单数据
                    this.dialogDetailVisible = true;  // 打开详情对话框
                } else {
                    ElMessage({ message: '未找到对应的课程信息', type: "warning" });
                }
            }).catch(() => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        singleDelete(courseId) {
            ElMessageBox.confirm('确定删除这条记录吗?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                this.$http.delete(`/crs/v1/${courseId}`).then((response) => {
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

        multipleDelete() {
            // 确保有选中的课程
            if (this.multipleSelection.length > 0) {
                // 从选中的课程中提取课程 ID
                const ids = this.multipleSelection.map(item => item.courseId); // 确保 item 中有 courseId

                // 调用接口删除课程
                ElMessageBox.confirm('是否删除选中的所有数据?', '批量删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning",
                }).then(() => {
                    // 发送 DELETE 请求，携带选中的课程 IDs
                    this.$http.delete(`/crs/v1`, { data: ids }).then((response) => {
                        if (response.data > 0) {
                            ElMessage({ message: '批量删除成功', type: "success" });
                            this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据
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

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    },

    mounted() {
        this.getPageData(this.currentPage, this.pageSize, '', '');

        //在页面加载时获取所有分类，给到添加和编辑题目的分类下拉框
        this.$http.get('/cat/v1/all').then((response) => {
            this.catIdAndName = response.data;
            console.log(this.catIdAndName);
        });
    },
};
</script>

<style scoped>
/* 为名称和简介添加滚动条 */
.course-detail-text {
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
</style>
