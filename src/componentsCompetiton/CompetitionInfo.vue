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
            
            <el-table-column prop="competitionName" label="竞赛名称" width="120" />
            <el-table-column prop="categoryId"  label="竞赛类别ID" width="120" />
            <el-table-column prop="levelId" label="竞赛等级ID" width="120" />
            <el-table-column prop="competitionImgUrl" label="竞赛图片链接" width="150" />
            <el-table-column prop="competitionStatus" label="竞赛状态" width="120" />
            <el-table-column prop="status" label="是否激活" width="100">
                <template #default="scope">
                    {{ scope.row.status == 0 ? '激活' : '停用' }}
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
                    <el-button link size="small" @click="openDetailDialog(scope.row.competitionId)">详情</el-button>
                    <el-button link size="small" @click="singleDelete(scope.row.competitionIdId)">删除</el-button>
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
                <el-select v-model="form.categoryId" placeholder="-- 请选择类别 --">
                    <el-option v-for="cat in catInfoData" :key="cat.categoryId" :label="cat.catName"
                        :value="cat.categoryId" />
                </el-select>
            </el-form-item>

            <el-form-item label="竞赛ID" :label-width="formLabelWidth">
                <el-input v-model="form.competitionId" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="竞赛名称" :label-width="formLabelWidth">
                <el-input v-model="form.competitionName" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="竞赛类别ID" :label-width="formLabelWidth">
                <el-input v-model="form.categoryId" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="竞赛等级ID" :label-width="formLabelWidth">
                <el-input v-model="form.levelId" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="竞赛图片链接" :label-width="formLabelWidth">
                <el-input v-model="form.competitionImgUrl" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="竞赛状态" :label-width="formLabelWidth">
                <el-input v-model="form.competitionStatus" type="textarea" autocomplete="off" />
            </el-form-item>

            <el-form-item label="是否激活" :label-width="formLabelWidth">
                <el-input v-model="form.status" type="textarea" autocomplete="off"/>             
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
    <el-dialog v-model="dialogDetailVisible" title="竞赛信息详情" width="800">
        <el-form :model="form">
            <el-form-item label="竞赛ID" :label-width="formLabelWidth">
                <el-form-item :label="form.competitionId"  />
            </el-form-item>

            <el-form-item label="竞赛名称" :label-width="formLabelWidth">
                <el-form-item :label="form.competitionName" />
            </el-form-item>

            <el-form-item label="竞赛类别ID" :label-width="formLabelWidth">
                <el-form-item :label="form.categoryId"  />
            </el-form-item>

            <el-form-item label="竞赛等级ID" :label-width="formLabelWidth">
                <el-form-item :label="form.levelId"  />
            </el-form-item>
            
            <el-form-item label="竞赛图片链接" :label-width="formLabelWidth">
                <el-form-item :label="form.competitionImgUrl"  />
            </el-form-item>
            
            <el-form-item label="竞赛状态" :label-width="formLabelWidth">
                <el-form-item :label="form.competitionStatus" />
            </el-form-item>
            
            <el-form-item label="是否激活" :label-width="formLabelWidth">
                <el-form-item :label="form.status"  />
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
            name: '竞赛信息',
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
                { categoryId: 1, catName: '1' },
                { categoryId: 2, catName: '2' },
                { categoryId: 3, catName: '3' },
            ],
        };
    },
    methods: {
        // 处理时间格式化
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
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
            this.$http.get('http://localhost:10086/comp/v1/v1', { params: { pageNum: num, pageSize: size } })
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
            // 确保所有必填字段都已填写
            if (!this.form.competitionName || !this.form.competitionImgUrl || !this.form.competitionStatus || !this.form.categoryId || !this.form.levelId) {
                ElMessage({ message: '请填写完整的竞赛信息！', type: "warning" });
                return;
            }
            // 发送 POST 请求以添加竞赛信息
            this.$http.post('http://localhost:10086/comp/v1/compe', this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '竞赛信息添加成功！', type: "success" });
                    this.getPageData(this.currentPage, this.pageSize); // 刷新数据
                    this.dialogFormVisible = false; // 关闭对话框
                } else {
                    ElMessage({ message: '信息添加失败！', type: "error" });
                }
            }).catch((err) => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },

        // 打开编辑对话框
        openUpdateDialog(row) {
            this.title = '竞赛信息';
            this.btnName = '编辑';
            this.form = { ...row }; // 填充表单数据
            this.dialogFormVisible = true;
        },
         // 编辑修改信息
            updateQuestion() {
            if (!this.form.competitionName || !this.form.competitionImgUrl || !this.form.competitionStatus || !this.form.competitionId || !this.form.categoryId || !this.form.levelId ) {
                ElMessage({ message: '请填写完整的竞赛信息！', type: "warning" });
                return;
            }
            this.$http.put(`http://localhost:10086/comp/v1/compe`, this.form).then((response) => {
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


                    // 打开详情页
        openDetailDialog(competitionId) {
            this.$http.get(`http://localhost:10086/comp/v1/compe/${competitionId}`).then((response) => {
                console.log(response.data); // 检查返回的数据
                if (response.data) {
                    this.form = response.data;
                    // 格式化更新时间
                    this.form.updatedTime = this.formatDate(this.form.updatedTime);
                    this.form.createdTime = this.formatDate(this.form.createdTime); // 如果创建时间也需要格式化
                    this.dialogDetailVisible = true;
                } else {
                    ElMessage({ message: '未找到对应的竞赛信息', type: "warning" });
                }
            }).catch(() => {
                ElMessage({ message: '请求失败，请重试', type: "error" });
            });
        },
        // 删除单个题目
        singleDelete(competitionId) {
            ElMessageBox.confirm('确定删除这条记录吗?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.$http.delete(`http://localhost:10086/comp/v1/compe/${competitionId}`).then((response) => {
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
                    const ids = this.multipleSelection.map(item => item.competitionId);
                    this.$http.delete(`http://localhost:10086/comp/v1/compe/${ids}`,).then((response) => {
                        if (response.data == 1) {
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
                this.tableData = this.pageInfo.records.filter(item =>
                    item.competitionId && item.competitionId.match(this.queryStr.trim())
                );
            } else {
                this.tableData = this.pageInfo.records;  // 恢复原数据
            }
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
    },
    mounted() {
        this.getPageData(this.currentPage, this.pageSize);
    },
};
</script>