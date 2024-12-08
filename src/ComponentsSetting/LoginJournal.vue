<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <!-- 查询字段选择：让用户选择查询的字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                    <el-option label="管理员姓名" value="courseName"></el-option>
                
                </el-select>&nbsp;

                <!-- 输入框：输入查询内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp; 
                
                <el-button type="primary"  @click="queryInfo">查询</el-button>
                <!-- <el-button class="button" type="success"  @click="openAddDialog">添加</el-button> -->
               
            </div>
        </template>


        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"  v-loading="loading">
            <el-table-column fixed type="selection" width="55" />
            <el-table-column prop="categoryId" label="类别" width="70" />

            <!-- 课程名称列 -->
            <el-table-column prop="courseName" label="管理员姓名" width="100">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.userName }}</div>
                </template>
            </el-table-column>
            
            <!-- 课程简介列 -->
            <el-table-column prop="courseDescription" label="密码" width="100">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.password }}</div>
                </template>
            </el-table-column>
     <!-- 课程简介列 -->
     <el-table-column prop="courseDescription" label="登陆板块" width="100">
                <template #default="{ row }">
                    <div class="truncate-text">{{ row.loginboard }}</div>
                </template>
            </el-table-column>
          

            <el-table-column prop="updatedTime" label="登录时间" width="100">
                <template #default="{ row }">
                    <span>{{ formatDate(row.loginTime) }}</span>
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


</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
    data() {
        return {
            loading:true,
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
            this.$http.get('/admin/user/login', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    this.pageInfo = response.data;
                    this.tableData = this.pageInfo.records;
                    if (response) {
                        this.loading = false;
                    }

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


        handleSelectionChange(val) {
            this.multipleSelection = val;
        },





        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },


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
