<template>
    <el-card class="card">
        <template #header>

            <div slot="header" class="card-header">{{ name }}</div><br>

            <!-- 搜索框 -->
            <div class="header-actions">
                
                <!-- 输入框 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入竞赛名称" />&nbsp;
                <!-- 功能按钮 -->
                <el-button type="primary" @click="queryInfo">查询</el-button>
                <el-button class="button" type="success" @click="openAddDialog">添加</el-button>
                <el-button class="button" type="warning" @click="multipleDelete">多选删除</el-button>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column fixed type="selection" width="55" />
            
            <el-table-column prop="competitionName" label="竞赛名称" width="120" />
            <el-table-column prop="categoryName"  label="竞赛类别" width="120" />
            <el-table-column prop="levelName" label="竞赛等级" width="120" />
            <el-table-column label="竞赛图片链接" width="180" >
            <template #default="{ row }">
                <a :href="row.competitionImgUrl" target="_blank" rel="noopener noreferrer">{{ row.competitionImgUrl }}</a>
            </template>
            </el-table-column>
            <el-table-column prop="competitionStatus" label="竞赛状态" width="120" />
            <el-table-column prop="isActive" label="是否激活" width="100"/>
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
            <el-table-column  fixed="right" label="操作" min-width="180">
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
        <el-form-item label="类别" :label-width="formLabelWidth">
                <el-select v-model="form.categoryId" placeholder="-- 请选择类别 --">
                    <el-option v-for="cat in catIdAndName" :key="cat.categoryId" :label="cat.categoryName"
                        :value="cat.categoryId" />
                </el-select>
            </el-form-item>
        
        <el-form-item label="竞赛名称" :label-width="formLabelWidth">
            <el-input v-model="form.competitionName" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛等级" :label-width="formLabelWidth">
            <el-select v-model="form.levelName">
                <el-option label="国际级" value="国际级" />
                <el-option label="国家级A类" value="国家级A类" />
                <el-option label="国家级B类" value="国家级B类" />
                <el-option label="省级A类" value="省级A类" />
            </el-select>
        </el-form-item>

        <el-form-item label="竞赛图片链接" :label-width="formLabelWidth">
            <el-input v-model="form.competitionImgUrl" autocomplete="off" />
        </el-form-item>

        <el-form-item label="竞赛状态" :label-width="formLabelWidth">
            <el-select v-model="form.competitionStatus">
                <el-option label="未开始" value="未开始" />
                <el-option label="进行中" value="进行中" />
                <el-option label="已结束" value="已结束" />
            </el-select>
        </el-form-item>

        <el-form-item label="是否激活" :label-width="formLabelWidth">
            <el-select v-model="form.isActive">
                <el-option label="停用" value="停用" />
                <el-option label="激活" value="激活" />
            </el-select>
        </el-form-item>
    </el-form>

    <template #footer>
        <div style="flex: auto; text-align: right;">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="btnAddUpdate">{{ btnName }}</el-button>
        </div>
    </template>
</el-drawer>

    <!-- 详情对话框 -->
    <el-drawer v-model="dialogDetailVisible" title="竞赛信息详情" size="50%">
    <el-descriptions :column="2" border>
        <el-descriptions-item label="竞赛ID">
            {{ form.competitionId }}
        </el-descriptions-item>

        <el-descriptions-item label="竞赛名称">
            {{ form.competitionName }}
        </el-descriptions-item>

        <el-descriptions-item label="竞赛类别">
            {{ isCorrectId() }}
        </el-descriptions-item>

        <el-descriptions-item label="竞赛等级">
            {{ form.levelName }}
        </el-descriptions-item>

        <el-descriptions-item label="竞赛图片链接"> 
            <a :href="form.competitionImgUrl" target="_blank">{{ form.competitionImgUrl }}</a></el-descriptions-item>
    
        <el-descriptions-item label="竞赛状态">
            {{ form.competitionStatus }}
        </el-descriptions-item>

        <el-descriptions-item label="是否激活">
        <el-tag :type="form.isActive === '激活' ? 'success' : 'info'">{{ form.isActive }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="更新时间">
            {{ formatDate(form.updatedTime) }}
        </el-descriptions-item>

        <el-descriptions-item label="创建时间">
            {{ formatDate(form.createdTime) }}
        </el-descriptions-item>
    </el-descriptions>

    <template #footer>
        <div style="text-align: right; margin-top: 20px">
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
            name: '竞赛信息',
            queryStr: "",

            currentPage: 1,
            pageSize: 5,
            pageInfo: {},

            tableData: [],
            form: {},
            formLabelWidth: '150px',

            dialogFormVisible: false,
            dialogDetailVisible: false, queryStr: "",
            searchParams: {}, // 用于存储查询参数
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
        //详情类别表信息展示
        isCorrectId() {
            return this.catIdAndName.filter(item => item.categoryId === this.form.categoryId)[0].categoryName
        },

        

        // 处理时间格式化
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },

        // 分页大小变化
        handleSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.getPageData(this.currentPage, this.pageSize, 'competitionName', this.queryStr);
            },

        // 页码变化
        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize, 'competitionName', this.queryStr);
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
            if (!this.form.competitionName || !this.form.competitionImgUrl || !this.form.competitionStatus  || !this.form.levelName) {
                ElMessage({ message: '请填写完整的竞赛信息！', type: "warning" });
                return;
            }
            // 发送 POST 请求以添加竞赛信息
            this.$http.post('comp/v1/compe', this.form).then((response) => {
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
            if (!this.form.competitionName || !this.form.competitionImgUrl || !this.form.competitionStatus || !this.form.categoryName || !this.form.levelName ) {
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
         // 删除单条数据
            singleDelete(competitionId) {
            ElMessageBox.confirm('是否删除该竞赛信息?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.$http.delete(`http://localhost:10086/comp/v1/compe/${competitionId}`).then((response) => {
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

        //批量删除
        multipleDelete() {
            if (this.multipleSelection.length > 0) {
                ElMessageBox.confirm('是否删除选中的所有数据?', '批量删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning",
                }).then(() => {
                    const ids = this.multipleSelection.map(item => item.competitionId);
                    this.$http.delete(`/comp/v1/compe`, { data: ids }).then((response) => {
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
        
                // 获取分页数据
        getPageData(num, size, searchField, searchKeyword) {
            // 构建查询条件对象
            let questionSearch = {
                categoryName: searchField === 'categoryName' ? searchKeyword : '',
                questionLevel: searchField === 'categoryId' ? searchKeyword : '',
                questionTitle: searchField === 'competitionName' ? searchKeyword : '',
                questionText: searchField === 'isActive' ? searchKeyword : ''
            };
            
            console.log("请求分页参数: ", num, size, searchField, searchKeyword);
            
            this.$http.post('/comp/v1/search', questionSearch, { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    console.log(response.data);  // 检查后端返回的数据
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.list;
                    this.catInfoData = this.pageInfo.list.map(item => ({
                        categoryId: item.categoryId,
                        categoryName: item.categoryName,
                    }));
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
        
        //查询功能
        queryInfo() {
            if (this.queryStr.trim().length > 0) {
                this.tableData = this.tableData.filter(item =>
                    item.competitionName && item.competitionName.toString().includes(this.queryStr.trim())
                );
            } else {
                this.getPageData(this.currentPage, this.pageSize, 'competitionName', this.queryStr);
            }
        },
               //处理多选框
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection);
        },
    },
    mounted() {
    this.getPageData(this.currentPage, this.pageSize, 'competitionName', this.queryStr);

    // 获取所有分类
    this.$http.get('/cat/v1/all').then((response) => {
        this.catIdAndName = response.data;
        console.log(this.catIdAndName);
        });
    },
};
</script>
