<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <!-- 查询字段选择：让用户选择查询的字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                    <el-option label="课程名称" value="courseName"></el-option>
                    <el-option label="课程简介" value="courseDescription"></el-option>
                    <el-option label="难度级别" value="courseDifficultyLevel"></el-option>
                    <el-option label="课程评分" value="courseRating"></el-option>
                </el-select>&nbsp;

                <!-- 输入框：输入查询内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp;

                <!-- <el-input v-model="queryStr" style="width: 220px" placeholder="请输入课程名称" />&nbsp; -->
                
                <el-button type="primary"  @click="queryInfo">查询</el-button>
                <el-button class="button" type="success"  @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning"  @click="multipleDelete">多选删除</el-button>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="categoryId" label="类别" width="70" />

            <!-- <el-table-column prop="courseName" label="课程名称" width="100" />
            <el-table-column prop="courseDescription" label="课程简介" width="100" /> -->

            <!-- 课程名称列 -->
            <el-table-column prop="courseName" label="课程名称" width="100">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.courseName }}</div>
                </template>
            </el-table-column>
            
            <!-- 课程简介列 -->
            <el-table-column prop="courseDescription" label="课程简介" width="100">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.courseDescription }}</div>
                </template>
            </el-table-column>

            <el-table-column prop="courseDifficultyLevel" label="难度级别" width="100" />
            <el-table-column prop="courseRating" label="评分" width="70" />

            <el-table-column prop="updatedTime" label="更新时间" width="100">
                <template #default="{ row }">
                    <span>{{ formatDate(row.updatedTime) }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="createdTime" label="创建时间" width="100" >
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
        <el-pagination 
        ref="pagination" 
        v-model:current-page="currentPage" 
        v-model:page-size="pageSize" 
        :page-sizes="[3, 5, 10, 20]"
            layout="total, sizes, prev, pager, next, jumper" 
            :total="pageInfo.total" 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </el-card>

    <!-- 编辑、添加对话框
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
    </el-dialog> -->
    <el-drawer v-model="dialogFormVisible" :title="title" size="40%" direction="rtl">
        <el-form :model="form" label-width="150px">
            <!-- <el-form-item label="类别">
                <el-select v-model="form.categoryId" placeholder="请选择类别">
                    <el-option v-for="cat in catInfoData" :key="cat.categoryId" :label="cat.catName" :value="cat.categoryId" />
                </el-select>
            </el-form-item> -->

            <el-form-item label="类别" :label-width="formLabelWidth">
                <el-select v-model="form.categoryId" placeholder="-- 请选择类别 --">
                    <el-option v-for="cat in catIdAndName" :key="cat.categoryId" :label="cat.categoryName"
                        :value="cat.categoryId" />
                </el-select>
            </el-form-item>

            <el-form-item label="课程名称">
                <el-input v-model="form.courseName" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="课程简介">
                <el-input v-model="form.courseDescription" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="课程难度">
                <el-select v-model="form.courseDifficultyLevel" placeholder="请选择难度级别">
                    <el-option label="初级" value="初级" />
                    <el-option label="中级" value="中级" />
                    <el-option label="高级" value="高级" />
                </el-select>
            </el-form-item>

            <el-form-item label="课程评分">
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
            <div class="drawer-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
            </div>
        </template>
    </el-drawer>


    <!-- 详情对话框 -->
    <el-drawer v-model="dialogDetailVisible" :title="'课程信息详情'" size="35%" direction="rtl">
        <el-descriptions :column="1" border>
            <el-descriptions-item label="课程名称">
                <span>{{ form.courseName }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="课程简介">
                <span>{{ form.courseDescription }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="难度级别">
                <span>{{ form.courseDifficultyLevel }}</span>
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
                <el-button @click="dialogDetailVisible = false">关闭</el-button>
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
            queryStr: "",
            selectedField: "",  // 选择的查询字段

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
        // handleSizeChange(pageSize) {
        //     console.log("当前页大小: ", pageSize);
        //     this.pageSize = pageSize;
        //     this.getPageData(this.currentPage, this.pageSize);
        // },

        // handleCurrentChange(pageNum) {
        //     console.log("当前页码: ", pageNum);
        //     this.currentPage = pageNum;
        //     this.getPageData(this.currentPage, this.pageSize);
        // },

        // getPageData(num, size) {
        //     this.$http.get('/crs/v1/page', { params: { pageNum: num, pageSize: size } })
        //         .then((response) => {
        //             console.log(response.data);
        //             this.pageInfo = response.data;
        //             this.tableData = this.pageInfo.records;
        //         });
        // },
        // queryInfo() {
        //     if (this.queryStr.trim().length > 0) {
        //         this.tableData = this.pageInfo.records.filter(item =>
        //             item.courseName && item.courseName.match(this.queryStr.trim())
        //         );
        //     } else {
        //         this.tableData = this.pageInfo.records;// 恢复原数据
        //     }
        // },
        //         // 查询方法，根据选择的字段和输入的查询内容进行查询
        //         queryInfo() {
        //     // 如果选择了查询字段和输入了查询条件
        //     if (this.queryStr.trim().length > 0 && this.selectedField) {
        //         this.tableData = this.pageInfo.records.filter(item => {
        //             // 根据选择的字段进行匹配
        //             if (item[this.selectedField] && item[this.selectedField].includes(this.queryStr.trim())) {
        //                 return true;  // 匹配成功
        //             }
        //             return false;  // 不匹配
        //         });
        //     } else {
        //         // 如果没有选择字段或者没有输入查询内容，恢复原数据
        //         this.tableData = this.pageInfo.records;
        //     }
        // },

        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize);
        },

        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize);
        },

        getPageData(num, size) {
            this.$http.get('/crs/v1/page', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;
                });
        },

        queryInfo() {
            // 查询时，检查输入的查询内容和字段选择
            if (!this.queryStr.trim()) {
                ElMessage({ message: '请输入查询内容', type: 'warning' });
                return;
            }

            if (!this.selectedField) {
                ElMessage({ message: '请选择查询字段', type: 'warning' });
                return;
            }

            // 根据选择的字段和查询内容过滤数据
            this.tableData = this.pageInfo.records.filter(item => {
                if (item[this.selectedField] && item[this.selectedField].includes(this.queryStr.trim())) {
                    return true;
                }
                return false;
            });

            // 重置分页至第一页
            this.currentPage = 1;

            // 更新总页数
            this.pageInfo.total = this.tableData.length;

            // 使用 $nextTick 确保 DOM 已经更新
            this.$nextTick(() => {
                if (this.$refs.pagination) {
                    this.$refs.pagination.setTotal(this.pageInfo.total);
                }
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


        // 打开编辑对话框
        openUpdateDialog(row) {
            this.title = '编辑课程信息';
            this.btnName = '编辑';
            this.form = { ...row }; // 填充表单数据
            this.dialogFormVisible = true;
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

        //在页面加载时获取所有分类，给到添加和编辑题目的分类下拉框
        this.$http.get('/cat/v1/all').then((response) => {
            this.catIdAndName = response.data;
            console.log(this.catIdAndName);
        });
    },
};
</script>

<style scoped>

        /* 为课程名称和简介添加滚动条 */
        .course-detail-text {
            max-height: 150px;  /* 设置最大高度，超出部分滚动 */
            overflow-y: auto;   /* 启用垂直滚动条 */
            white-space: normal; /* 允许换行 */
            padding: 5px;       /* 可选：为文本加一些内边距，使内容看起来更舒适 */
        }

        .truncate-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.5;
            height: 1.5em; /* 根据需要设置行高 */
        }
        
        .course-name, .course-description {
            max-height: 150px; /* 更大的高度限制 */
            overflow-y: auto; /* 显示垂直滚动条 */
            word-wrap: break-word; /* 自动换行 */
            white-space: normal; /* 允许换行 */
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
