<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入竞赛名称" />&nbsp;
                <el-button type="primary" @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="competitionName" label="竞赛名称" width="80" />
            
            <el-table-column prop="startDate" label="竞赛开始日期" width="180" >
                <template #default="{ row }">
                    <span>{{ formatDate(row.startDate) }}</span>
                </template>
            </el-table-column>
        
            <el-table-column prop="endDate" label="竞赛结束日期" width="180" >
                <template #default="{ row }">
                    <span>{{ formatDate(row.endDate) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="竞赛官方网站链接" width="150" >
            <template #default="{ row }">
                <a :href="row.competitionUrl" target="_blank" rel="noopener noreferrer">{{ row.competitionUrl }}</a>
            </template>
            </el-table-column>

            <el-table-column prop="competitionSchedule"  label="竞赛日程安排" width="120" />

            <el-table-column prop="registrationDeadline" label="报名截止日期" width="180" >
                <template #default="{ row }">
                    <span>{{ formatDate(row.registrationDeadline) }}</span>
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
                    <el-button link size="small" type="primary"@click="openDetailDialog(scope.row.competitionId)">详情</el-button>
                    <el-button link size="small" type="primary"@click="singleDelete(scope.row.competitionId)">删除</el-button>
                    <el-button link size="small" type="primary"@click="openUpdateDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </el-card>

    <!-- 编辑、添加对话框 -->
    <el-drawer v-model="dialogFormVisible" :title="title" size="50%">
    <el-form :model="form">

        <el-form-item label="竞赛名称" :label-width="formLabelWidth">
            <el-input v-model="form.competitionName" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛详情" :label-width="formLabelWidth">
            <el-input v-model="form.competitionDescription" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛主办方" :label-width="formLabelWidth">
            <el-input v-model="form.competitionOrganizer" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛开始日期" :label-width="formLabelWidth">
            <el-input v-model="form.startDate" autocomplete="off" />
            <!-- 如果你需要格式化日期显示，可以考虑使用 computed 属性或者 methods 来处理 -->
        </el-form-item>

        <el-form-item label="竞赛结束日期" :label-width="formLabelWidth">
            <el-input v-model="form.endDate" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛官方网站链接" :label-width="formLabelWidth">
            <el-input v-model="form.competitionUrl" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛日程安排" :label-width="formLabelWidth">
            <el-input v-model="form.competitionSchedule" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="报名截止日期" :label-width="formLabelWidth">
            <el-input v-model="form.registrationDeadline" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="作品提交指南" :label-width="formLabelWidth">
            <el-input v-model="form.registrationGuide" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="优秀案例展示" :label-width="formLabelWidth">
            <el-input v-model="form.outstandingCases" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛参赛资格要求" :label-width="formLabelWidth">
            <el-input v-model="form.eligibilityCriteria" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="评审标准" :label-width="formLabelWidth">
            <el-input v-model="form.judgingCriteria" type="textarea" autocomplete="off" />
        </el-form-item>

        <el-form-item label="奖品详情" :label-width="formLabelWidth">
            <el-input v-model="form.prizeDetails" type="textarea" autocomplete="off" />
        </el-form-item>

    </el-form>

    <template #footer>
        <div style="flex: auto; text-align: right;">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
        </div>
    </template>
</el-drawer>
<!-- 详情竞赛信息对话框 -->
<el-drawer
    v-model="dialogDetailVisible"
    title="竞赛信息详情"
    size="50%"
        :before-close="handleClose">
        <el-form :model="form" label-position="left">
        <el-descriptions direction="vertical" title="竞赛详细信息" column="3" border>
            <el-descriptions-item label="竞赛ID">{{ form.competitionId }}</el-descriptions-item>
            <el-descriptions-item label="竞赛名称">{{ form.competitionName }}</el-descriptions-item>
            <el-descriptions-item label="竞赛详情">{{ form.competitionDescription }}</el-descriptions-item>
            <el-descriptions-item label="竞赛主办方">{{ form.competitionOrganizer }}</el-descriptions-item>
            <el-descriptions-item label="竞赛开始日期">{{ form.startDate }}</el-descriptions-item>
            <el-descriptions-item label="竞赛结束日期">{{ form.endDate }}</el-descriptions-item>
            <el-descriptions-item label="竞赛官方网站链接"> <a :href="form.competitionUrl" target="_blank">{{ form.competitionUrl }}</a></el-descriptions-item>
            <el-descriptions-item label="竞赛日程安排">{{ form.competitionSchedule }}</el-descriptions-item>
            <el-descriptions-item label="报名截止日期">{{ form.registrationDeadline }}</el-descriptions-item>
        </el-descriptions>
    
        <el-descriptions direction="vertical" column="3" :style="blockMargin">
            <el-descriptions-item label="作品提交指南">{{ form.registrationGuide }}</el-descriptions-item>
            <el-descriptions-item label="优秀案例展示">{{ form.outstandingCases }}</el-descriptions-item>
            <el-descriptions-item label="竞赛参赛资格要求">{{ form.eligibilityCriteria }}</el-descriptions-item>
            <el-descriptions-item label="评审标准">{{ form.judgingCriteria }}</el-descriptions-item>
            <el-descriptions-item label="奖品详情">{{ form.prizeDetails }}</el-descriptions-item>
            <el-descriptions-item label="更新时间">{{ form.updatedTime }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ form.createdTime }}</el-descriptions-item>
        </el-descriptions>
        </el-form>
    
        <template #footer>
        <div class="drawer-footer">
            <el-button @click="handleClose">关闭</el-button>
        </div>
        </template>
    </el-drawer>
</template>


<script >
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    data() {
        return {
            name: '竞赛详情信息',
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
            this.$http.get('http://localhost:10086/comdetail/v1/v1', { params: { pageNum: num, pageSize: size } })
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
        
    
        //// 添加竞赛信息
        addQuestion() {
            
             // 确保所有必填字段都已填写
            if (!this.form.competitionDescription || !this.form.competitionOrganizer || !this.form.startDate||  !this.form.endDate||  !this.form.competitionUrl||  !this.form.competitionSchedule||  !this.form.startDate||  !this.form.registrationDeadline||  !this.form.registrationGuide||  !this.form.outstandingCases||  !this.form.eligibilityCriteria||  !this.form.judgingCriteria||  !this.form.prizeDetails) {
                ElMessage({ message: '请填写完整的竞赛信息！', type: "warning" });
                return;
            }

            
           // 发送 POST 请求以添加竞赛信息
            this.$http.post('http://localhost:10086/comdetail/v1/detail', this.form).then((response) => {
                if (response.data == 1) {
                    ElMessage({ message: '信息添加成功！', type: "success" });
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
            if (!this.form.competitionDescription || !this.form.competitionOrganizer || !this.form.competitionUrl || !this.form.competitionSchedule || !this.form.registrationGuide || !this.form.outstandingCases  || !this.form.eligibilityCriteria  || !this.form.judgingCriteria  ) {
                ElMessage({ message: '请填写完整的竞赛信息！', type: "warning" });
                return;
            }
            this.$http.put(`http://localhost:10086/comdetail/v1/detail`, this.form).then((response) => {
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
            this.$http.get(`http://localhost:10086/comdetail/v1/detail/${competitionId}`).then((response) => {
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
       // 删除单个竞赛信息
        singleDelete(competitionId) {
            ElMessageBox.confirm('是否删除该竞赛信息?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.$http.delete(`http://localhost:10086/comdetail/v1/detail/${competitionId}`).then((response) => {
                    if (response.data == 1) {
                        ElMessage({ message: '删除成功', type: "success" });
                        this.getPageData(this.currentPage, this.pageSize); // 刷新数据
                    } else {
                        ElMessage({ message: '删除失败', type: "error" });
                    }
                }).catch(() => {
                    ElMessage({ message: '请求失败，请重试', type: "error" });
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
                    this.$http.post(`http://localhost:10086/comdetail/v1/detail/${ids}`,).then((response) => {
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
            if (!this.pageInfo.records) {
                ElMessage({ message: '请先加载数据', type: "warning" });
                return;
            }
            if (this.queryStr.trim().length > 0) {
                this.tableData = this.pageInfo.records.filter(item =>
                    item.competitionName && item.competitionName.toString().includes(this.queryStr.trim())
                );
            } else {
                this.tableData = this.pageInfo.records;
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
    
    <style scoped>
    .el-descriptions {
    margin-top: 20px;
    }
    .drawer-footer {
    text-align: right;
    padding: 10px;
    }
    </style>