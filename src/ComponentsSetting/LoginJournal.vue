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

        <el-table :data="tableData" style="width: 100%" >
            <el-table-column prop="userName" label="管理员姓名" width="120" />
            <el-table-column prop="loginboard" label="登录板块" width="120" />
            <el-table-column prop="loginTime" label="登录时间" width="180">
                <template #default="{ row }">
                    <span>{{ formatDate(row.loginTime) }}</span>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination ref="pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
            searchField: '',
            searchKeyword: '',
        };
    },
    methods: {
        handleSizeChange(pageSize) {
            this.pageSize = pageSize;
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        handleCurrentChange(pageNum) {
            this.currentPage = pageNum;
            this.getPageData(this.currentPage, this.pageSize, this.selectedField, this.queryStr);
        },

        getPageData(num, size, searchField, searchKeyword) {

            if (this.selectedField === 'loginboard') {
                if (searchKeyword == '第一板块') {
                    searchKeyword = 1
                } else if (searchKeyword == '第二板块') {
                    searchKeyword = 2
                }else if (searchKeyword == '第三板块') {
                    searchKeyword = 3
                }
            }

            // 构建查询条件对象
            let userInfoSearch = {
                userName: searchField === 'userName' ? searchKeyword : '',
                userSex: searchField === 'loginboard' ? searchKeyword : ''
            };

            // 发送POST请求到后端
            this.$http.post("/api/admin/user/login/logs?pageNum=" + num + "&pageSize=" + size, userInfoSearch)
                .then(response => {
                    const data =response.data;
                    // this.pageInfo = response.data;
                    // this.tableData = this.pageInfo.list;
                    this.pageInfo.total = data.total;
                    this.tableData = data.list;
                    console.log("查询结果:", this.tableData);
                })
                .catch(error => {
                    console.error("查询出错:", error);
                    ElMessage({
                        type: 'error',
                        message: '查询失败'
                    });
                });

        },

        queryInfo() {
            console.log("查询内容:", this.queryStr);
            // 检查当前页码,如果未定义则使用默认值1
            let num = this.currentPage || 1;
            // 检查每页大小,如果未定义则使用默认值5
            let size = this.pageSize || 5;

            // 构建查询参数
            let field = this.selectedField || '';
            let keyword = this.queryStr || '';

            // 调用getPageData并传入所有参数
            this.getPageData(num, size, field, keyword);
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