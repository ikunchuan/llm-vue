<template>
    <el-card class="card">
        <template #header>
            <div slot="header" class="card-header">{{ name }}</div><br>
            <div class="header-actions">
                <!-- 查询字段选择：让用户选择查询的字段 -->
                <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                    <el-option label="管理员姓名" value="userName"></el-option>
                    <el-option label="登录板块" value="loginboard"></el-option>
                </el-select>&nbsp;

                <!-- 输入框：输入查询内容 -->
                <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp; 
                
                <el-button type="primary" @click="queryInfo">查询</el-button>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="userName" label="管理员姓名" width="120" />
            <el-table-column prop="loginboard" label="登录板块" width="120" />
            <el-table-column prop="loginTime" label="登录时间" width="180">
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
            :page-sizes="[5, 10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper" 
            :total="pageInfo.total" 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </el-card>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            loading: true,
            name: '登录日志',
            queryStr: "",
            selectedField: "",

            currentPage: 1,
            pageSize: 5,
            pageInfo: {},
            tableData: [],
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
            const params = { pageNum: num, pageSize: size };
            if (this.queryStr && this.selectedField) {
                params[this.selectedField] = this.queryStr;
            }
            this.$http.get('/admin/user/login/logs', { params })
                .then((response) => {
                    this.pageInfo = response.data.data;
                    this.tableData = this.pageInfo.records;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                    ElMessage.error('获取登录日志失败');
                });
        },

        queryInfo() {
            this.getPageData(this.currentPage, this.pageSize);
        },

        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },
    },

    mounted() {
        this.getPageData(this.currentPage, this.pageSize);
    },
};
</script>

<style scoped>
    /* 样式保持不变 */
</style>