<template>

    <el-card class="card">
        <template #header>
            <!-- 标题 -->
            <div slot="header" class="card-header">{{ name }}</div><br>
            <!-- 搜索框 -->
            <div class="header-actions">
                <!-- 选择查询字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;" clearable>
                    <el-option label="类别名称" value="1" />
                    <el-option label="类别描述" value="2" />
                </el-select>&nbsp;

                <!-- 输入框 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" clearable />&nbsp;

                <!-- 功能按钮 -->
                <el-button type="primary" @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>
            </div>
        </template>

        <!-- 父类别表格 -->
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column fixed type="index" label="序号" width="55" />

            <!-- <el-table-column prop="sortOrder" label="类别排序" width="100">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.sortOrder }}</span>
                </template>
            </el-table-column> -->

            <el-table-column prop="categoryName" label="类别名称" width="120">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.categoryName }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="description" label="类别描述" width="200">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.description }}</span>
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
                        @click="openDetailDialog(scope.row.categoryId)">详情</el-button>
                    <el-button link size="small" type="primary"
                        @click="singleDelete(scope.row.categoryId)">删除</el-button>
                    <el-button link size="small" type="primary" @click="openUpdateDialog(scope.row)">编辑</el-button>
                    <el-button link size="small" type="primary"
                        @click="openChildCard(scope.row.categoryId)">子类别</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </el-card>

    <!-- <transition name="el-fade-in-linear"> -->
    <!-- 子类别卡片 -->
    <el-drawer v-model="childCardVisible" :direction="direction" size="35%">
        <template default>
            <!-- 标题 -->
            <div slot="header" class="card-header">{{ childName }}</div><br>
            <!-- 功能按钮 -->
            <el-button type="primary" @click="queryInfo">查询</el-button>
            <el-button class="button" type="success" @click="openAddDialog">添加</el-button>
            <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>
        </template>

        <el-table :data="childInfoData" style="width: 100%" @selection-change="handleSelectionChange"
            v-loading="loading">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column fixed type="index" label="序号" width="55" />

            <el-table-column prop="sortOrder" label="类别排序" width="100">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.sortOrder }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="categoryName" label="类别名称" width="120">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.categoryName }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="description" label="类别描述" width="200">
                <template #default="scope">
                    <span class="truncate-text">{{ scope.row.description }}</span>
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

            <el-table-column fixed="right" label="操作" min-width="500">
                <template #default="scope">
                    <el-button link size="small" type="primary"
                        @click="openDetailDialog(scope.row.categoryId)">详情</el-button>
                    <el-button link size="small" type="primary"
                        @click="singleDelete(scope.row.categoryId)">删除</el-button>
                    <el-button link size="small" type="primary" @click="openUpdateDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-drawer>
    <!-- </transition> -->

    <!-- 抽屉：添加修改 -->
    <el-drawer v-model="dialogFormVisible" :direction="direction" size="35%">
        <template #header>
            <h3>{{ title }}</h3>
        </template>

        <el-form :model="form">
            <!-- <el-form-item label="类别排序" :label-width="formLabelWidth">
                <el-input v-model="form.sortOrder" type="number" autocomplete="off" autosize="true" />
            </el-form-item> -->

            <el-form-item label="类别名称" :label-width="formLabelWidth">
                <el-input v-model="form.categoryName" type="textarea" autocomplete="off" autosize="true" rows="7" />
            </el-form-item>

            <el-form-item label="类别描述" :label-width="formLabelWidth">
                <el-input v-model="form.questionTitle" type="textarea" autocomplete="off" autosize="true" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div style="flex: auto">
                <el-button @click="closeDrawer">取消</el-button>
                <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
            </div>
        </template>
    </el-drawer>


    <!-- 抽屉：详情-->
    <el-drawer v-model="dialogDetailVisible" :direction="direction" size="35%">
        <el-descriptions class="margin-top" title="类别详情信息" :column="1" :size="size" border>
            <template #extra>
                <el-button type="primary" @click="openUpdateDialog(form)">编辑</el-button>
            </template>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">类别排序</div>
                </template>
                <el-tag size="defualt">{{ form.sortOrder }}</el-tag>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">类别名称</div>
                </template>
                <div class="question-detail-text">{{ form.categoryName }}</div>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">类别描述</div>
                </template>
                <div class="question-detail-text">{{ form.description }}</div>
            </el-descriptions-item>
        </el-descriptions><br>

        <el-descriptions class="margin-top" :column="2" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">更新时间</div>
                </template>
                <div class="question-detail-text">{{ formatDate(form.updatedTime) }}</div>
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">创建时间</div>
                </template>
                <div class="question-detail-text">{{ formatDate(form.createdTime) }}</div>
            </el-descriptions-item>
        </el-descriptions>

        <template #footer>
            <div style="flex: auto">
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
            name: '类别管理', //主体标题
            childName: '二级类别信息', //子标题
            queryStr: "",  //查询条件
            selectedField: "",  //选择字段

            currentPage: 1,
            pageSize: 5,

            pageInfo: {},

            tableData: [],  //表格数据。多条数据用数组（就是python中的序列），用`[]`表示空字典、
            childInfoData: [], //子类别信息
            // catIdAndName: [], //全部类别id和名称
            queryData: [],      //查询数据

            form: {},
            formLabelWidth: '150px',

            loading: true,
            childCardVisible: false,
            dialogFormVisible: false,
            dialogDetailVisible: false,
            title: '',
            btnName: '',

            multipleSelection: [],
        };
    },

    methods: {
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

        // 数据量变化
        handleSizeChange(pageSize) {
            console.log("当前页大小: ", pageSize);
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize, this.searchField, this.queryStr);
        },

        // 页码变化
        handleCurrentChange(pageNum) {
            console.log("当前页码: ", pageNum);
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize, this.searchField, this.queryStr);
        },

        // 获取分页数据
        getPageData(num, size, searchField, searchKeyword) {
            // 构建查询条件对象
            let categorySearch = {
                sortOrder: searchField === 'sortOrder' ? searchKeyword : '',
                categoryName: searchField === 'categoryName' ? searchKeyword : '',
                description: searchField === 'description' ? searchKeyword : ''
            };

            console.log("请求分页参数: ", num, size, searchField, searchKeyword);

            this.$http.post('/cat/v1/search', categorySearch, { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    console.log(response.data);  // 检查后端返回的数据
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                    if (response) {
                        this.loading = false;
                    }
                }).catch(() => {
                    ElMessage({ message: '请求失败，请重试', type: "error" });
                });
        },

        // 添加或编辑按钮点击事件
        btnAddUpdate() {
            if (this.btnName === '添加') {
                this.addCategory();
            } else if (this.btnName === '编辑') {
                this.updateCategory();
            }
        },

        // 打开添加对话框
        openAddDialog() {
            this.title = '添加类别信息';
            this.btnName = '添加';
            this.form = {};  // 清空表单数据
            this.dialogFormVisible = true;
        },

        // 添加类别信息
        addCategory() {
            if (!this.form.categoryId || !this.form.categoryName || !this.form.description || !this.form.sortOrder) {
                ElMessage({ message: '请填写完整的类别信息！', type: "warning" });
                return;
            }
            this.$http.post('/cat/v1', this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '类别信息添加成功！', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据
                    this.dialogFormVisible = false; // 关闭对话框
                } else {
                    ElMessage({ message: '类别信息添加失败！', type: "error" });
                }
            }).catch((err) => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        // 打开编辑对话框
        openUpdateDialog(row) {
            this.title = '编辑类别信息';
            this.btnName = '编辑';
            this.form = { ...row }; // 填充表单数据
            this.dialogFormVisible = true;  //打开添加修改框
            this.dialogDetailVisible = false; //关闭详情框
        },

        // 编辑题目信息
        updateCategory() {
            if (!this.form.categoryId || !this.form.categoryName || !this.form.description || !this.form.sortOrder) {
                ElMessage({ message: '请填写完整的题目信息！', type: "warning" });
                return;
            }
            this.$http.put(`/qst/v1`, this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '更新成功', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据
                    this.dialogFormVisible = false; // 关闭对话框
                } else {
                    ElMessage({ message: '更新失败', type: "error" });
                }
            }).catch((err) => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        // 打开详情框
        openDetailDialog(categoryId) {
            this.$http.get(`/cat/v1/${categoryId}`).then((response) => {
                if (response.data) {
                    this.form = response.data;
                    this.dialogDetailVisible = true;
                } else {
                    ElMessage({ message: '未找到对应的类别信息', type: "warning" });
                }
            }).catch(() => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        openChildCard(categoryId) {
            this.$http.get(`/cat/v1/all`).then((response) => {
                this.childCardData = response.data;
                this.childCardData.forEach(element => {
                    if (element.id == categoryId) {
                        this.childCardTitle = element.name;
                    }
                });
            }).catch(() => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
            this.childCardVisible = !this.childCardVisible; // 切换布尔值
        },

        //关闭抽屉
        closeDrawer() {
            this.dialogDetailVisible = false;
            this.dialogFormVisible = false;
        },
        // 删除单个题目
        singleDelete(categoryId) {
            ElMessageBox.confirm('确定删除这条记录吗?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.$http.delete(`/cat/v1/${categoryId}`).then((response) => {
                    if (response.data === 1) {
                        ElMessage({ message: '删除成功', type: "success" });
                        this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据
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
                    const ids = this.multipleSelection.map(item => item.competitionId);
                    this.$http.post(`/cat/v1`, { data: ids }).then((response) => {
                        if (response.data == 1) {
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

        // 查询功能
        queryInfo() {
            console.log("查询内容:", this.queryStr);
            // 检查当前页码,如果未定义则使用默认值1
            let num = this.currentPage || 1;
            // 检查每页大小,如果未定义则使用默认值3 
            let size = this.pageSize || 5;

            // 构建查询参数
            let field = '';
            let keyword = this.queryStr || '';

            if (this.selectedField === '1') {
                field = 'questionLevel';
            } else if (this.selectedField === '2') {
                field = 'categoryName';
            } else if (this.selectedField === '3') {
                field = 'questionTitle';
            } else {
                field = '';
            }

            // 调用getPageData并传入所有参数
            this.getPageData(num, size, field, keyword);

            // 使用 $nextTick 确保 DOM 已经更新
            this.$nextTick(() => {
                if (this.$refs.pagination) {
                    this.$refs.pagination.setTotal(this.pageInfo.total);
                }
            });
        },
        //处理多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    },
    mounted() {
        this.getPageData(this.currentPage, this.pageSize, '', '');
    },
};
</script>

<style scoped>
/* 为详情添加滚动条 */
.question-detail-text {
    max-height: 150px;
    /* 设置最大高度，超出部分滚动 */
    overflow-y: auto;
    /* 启用垂直滚动条 */
    white-space: normal;
    /* 允许换行 */
    padding: 5px;
    /* 为文本加一些内边距，使内容看起来更舒适 */
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