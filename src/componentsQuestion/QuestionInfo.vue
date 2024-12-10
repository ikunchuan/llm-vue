<template>

    <el-card class="card">

        <template #header>
            <!-- 标题 -->
            <div slot="header" class="card-header">{{ name }}</div><br>
            <!-- 搜索框 -->
            <div class="header-actions">
                <!-- 选择查询字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;" clearable>
                    <el-option label="题目类别" value="categoryName" />
                    <el-option label="题目难度" value="questionLevel" />
                    <el-option label="题目标题" value="questionTitle" />
                    <el-option label="题目内容" value="questionText" />
                </el-select>&nbsp;
                <!-- 输入框 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" clearable />&nbsp;
                <!-- 功能按钮 -->
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
            <el-table-column prop="questionLevel" label="题目难度" width="150">
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
    <el-drawer v-model="dialogFormVisible" size="35%">
        <template #header>
            <h3>{{ title }}</h3>
        </template>

        <el-form :model="form">
            <el-form-item label="类别" :label-width="formLabelWidth">
                <el-select v-model="form.categoryId" placeholder="-- 请选择类别 --">
                    <el-option v-for="cat in filteredCatIdAndName" :key="cat.categoryId" :label="cat.categoryName"
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
                <el-button @click="closeDrawer">取消</el-button>
                <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
            </div>
        </template>
    </el-drawer>

    <!-- 抽屉：详情 -->
    <el-drawer v-model="dialogDetailVisible" size="35%">
        <el-descriptions title="题目详情信息" :column="2" border>
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
                    <div class="cell-item">题目类别</div>
                </template>
                <div class="question-detail-text">{{ isCorrectId() }}</div>
            </el-descriptions-item>

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
            name: '题目信息',   //主体标题
            queryStr: "",   //查询条件
            selectedField: "",  //选择字段

            currentPage: 1,    //当前页码
            pageSize: 5,    //每页显示的条数
            pageInfo: {},   //分页信息。单条数据用map（就是python中的字典），用`{}`表示空字典

            tableData: [],  //表格数据。多条数据用数组（就是python中的序列），用`[]`表示空数组
            catInfoData: [], //表格的类别信息
            catIdAndName: [], //全部类别id和名称
            queryData: [],      //查询数据

            form: {},           //对话框表单数据
            formLabelWidth: '150px',  //添加修改对话框label宽度

            loading: true,  //加载框
            dialogFormVisible: false, //添加修改对话框可见性
            dialogDetailVisible: false,     //详细对话框可见性
            title: '',  //添加修改对话框标题
            btnName: '', //添加修改对话框按钮名称

            multipleSelection: [],  //选中的数据
        };
    },

    computed: {
        filteredCatIdAndName() {
            return this.catIdAndName.filter(item => item.parentId != null);
        },
    },

    methods: {
        isCorrectId() {
            return this.catIdAndName.filter(item => item.categoryId === this.form.categoryId)[0].categoryName
        },

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

        // 数据量变化
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            console.log("当前页大小: ", this.pageSize);
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        // 页码变化
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            console.log("当前页码: ", this.currentPage);
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        // 获取分页数据
        getPageData(num, size, searchField, searchKeyword) {

            if (this.selectedField === 'questionLevel') {
                if (searchKeyword === '入门') {
                    searchKeyword = 1;
                } else if (searchKeyword === '简单') {
                    searchKeyword = 2;
                } else if (searchKeyword === '中等') {
                    searchKeyword = 3;
                } else if (searchKeyword === '困难') {
                    searchKeyword = 4;
                } else if (searchKeyword === '极难') {
                    searchKeyword = 5;
                }
            }

            // 构建查询条件对象，假设你希望根据 questionTitle 和 categoryName 搜索
            let questionSearch = {
                categoryName: searchField === 'categoryName' ? searchKeyword : '',
                questionLevel: searchField === 'questionLevel' ? searchKeyword : '',
                questionTitle: searchField === 'questionTitle' ? searchKeyword : '',
                questionText: searchField === 'questionText' ? searchKeyword : ''
            };

            console.log("请求分页参数: ", num, size, searchField, searchKeyword);

            //questionSearch是查询对象， { params: { pageNum: num, pageSize: size } }是页面对象。
            //注意：如果Controller的方法的参数前面是查询对象，后面是分页对象，顺序一定要对应，否则会报错。我这里后端是查询对象在前，分页对象在后。
            /*  另外一种形式 
                this.$http.post('/qst/v1/search?pageNum=' + num + '&pageSize=' + size, questionSearch)，
                这样默认就是页面在前，查询在后。
            */
            this.$http.post('/qst/v1/search', questionSearch, { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    console.log(response.data);  // 检查后端返回的数据
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

        // 添加题目信息
        addQuestion() {
            if (!this.form.questionTitle || !this.form.questionText || !this.form.correctAnswer) {
                ElMessage({ message: '请填写完整的题目信息！', type: "warning" });
                return;
            }
            this.$http.post('/qst/v1', this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '题目信息添加成功！', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize, '', ''); // 刷新数据
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
            this.dialogDetailVisible = false;
        },

        // 编辑题目信息
        updateQuestion() {
            if (!this.form.questionTitle || !this.form.questionText || !this.form.correctAnswer) {
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

        //关闭抽屉
        closeDrawer() {
            this.dialogDetailVisible = false;
            this.dialogFormVisible = false;
        },

        //删除单个题目
        singleDelete(questionId) {
            ElMessageBox.confirm('确定删除这条记录吗?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.$http.delete(`/qst/v1/${questionId}`).then((response) => {
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

        //批量删除
        multipleDelete() {
            if (this.multipleSelection.length > 0) {
                ElMessageBox.confirm('是否删除选中的所有数据?', '批量删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning",
                }).then(() => {
                    const ids = this.multipleSelection.map(item => item.questionId);
                    this.$http.delete(`/qst/v1`, { data: ids }).then((response) => {
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

        //查询功能
        queryInfo() {
            if (this.queryStr.trim() === '' || this.selectedField === '') {
                ElMessage({ message: '已为您查询全部数据', type: "warning" });
            }

            console.log("查询内容:", this.queryStr.trim());
            // 检查当前页码,如果未定义则使用默认值1
            let num = this.currentPage || 1;
            // 检查每页大小,如果未定义则使用默认值5
            let size = this.pageSize || 5;

            // 构建查询参数
            let field = this.selectedField || '';
            let keyword = this.queryStr.trim() || '';

            if (this.selectedField === 'questionLevel') {
                if (keyword === '入门') {
                    keyword = 1;
                } else if (keyword === '简单') {
                    keyword = 2;
                } else if (keyword === '中等') {
                    keyword = 3;
                } else if (keyword === '困难') {
                    keyword = 4;
                } else if (keyword === '极难') {
                    keyword = 5;
                }
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
            console.log(this.multipleSelection);
        },
    },

    mounted() {
        //默认查全部数据
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
