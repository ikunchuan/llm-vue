<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            <span>用户行为监控管理</span>
        </div>

        <!-- 查询字段选择 -->
        <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
            <el-option label="用户名" value="userName"></el-option>
        </el-select>&nbsp;

        <!-- 输入框：输入查询内容 -->
        <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp;
        <el-button type="primary" @click="queryInfo">查询</el-button>

        <!-- 用户总数显示 -->
        <div>用户总数: {{ userTotalCount }}</div>

        <!-- 用户数据表格 -->
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="userName" label="用户名" width="120" />
            <el-table-column prop="userSex" label="性别" width="100" >
                <template #default="scope">
                    {{ scope.row.userSex==1?'男':'女' }}
                </template>
            </el-table-column>
            <el-table-column prop="userLocal" label="地区" width="120" />
            <el-table-column prop="userAge" label="年龄" width="120" />
            <el-table-column prop="userPassword" label="密码" width="120" />
            <el-table-column prop="userPhone" label="联系方式" width="120" />
            <el-table-column prop="userEmail" label="邮箱" width="120" />
            <el-table-column prop="userProfilePicture" label="用户头像" width="120" />
            <el-table-column prop="userBio" label="用户描述" width="120" />
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

            <el-table-column fixed="right" label="操作" min-width="160">

                <template #default="scope">
                    <el-button link type="primary" size="small" @click="openDetailDialog(scope.row.userId)">
                        详情
                    </el-button>
                    
                </template>

            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[2, 3, 4, 5]"
            :background="true" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!-- 用户性别分布饼图 -->
        <div class="echart" ref="myPieChart" :style="{ width: '100%', height: '400px' }"></div>
        <!-- 用户完成视频个数图表 -->
        <div class="echart" ref="myVideoChart" :style="{ width: '100%', height: '400px' }"></div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            dialogDetailVisible: false,
            queryStr: "",
            selectedField: "",
            currentPage: 1,
            pageSize: 5,
            pageInfo: {},
            tableData: [],
            sexDistributionData: [], // 用于存储性别分布数据
            userTotalCount: 0, // 存储用户总数
            videoCompletionData: [] // 存储用户完成视频个数数
        };
    },
    mounted() {
        this.getPageData(this.currentPage, this.pageSize);
        this.getUserData();
        this.getUserTotalCount(); // 获取用户总数
        this.initPieChart();
        this.getVideoCompletionData(); // 获取用户完成视频个数数据
        this.initVideoChart();
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
            this.$http.get('/uis/v1/ui', { params: { pageNum: num, pageSize: size } })
                .then((response) => {
                    this.pageInfo = response.data;
                    this.tableData = response.data.records;
                })
                .catch((error) => {
                    ElMessage.error('数据加载失败，请稍后重试');
                });
        },
        openDetailDialog(userid) {
            this.$http.get("/uis/v1/ui/" + userid).then(response => {
                this.form = response.data;
            });
            this.dialogDetailVisible = true;
        },
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },
        queryInfo() {
            if (!this.queryStr.trim() || !this.selectedField) {
                ElMessage.error('请选择查询字段并输入查询条件');
                return;
            }
            let queryValue = this.queryStr.trim();
            if (this.selectedField === 'userSex') {
                queryValue = queryValue === '男' ? 1 : (queryValue === '女' ? 0 : null);
                if (queryValue === null) {
                    ElMessage.error('性别只能是男或女');
                    return;
                }
            }
            this.tableData = this.pageInfo.records.filter(item => item[this.selectedField]?.toString().includes(queryValue));
        },
        getUserTotalCount() {
            this.$http.get('/uis/v1/ui/user-total-count').then(response => {
                this.userTotalCount = response.data; // 存储用户总数
            }).catch(error => {
                ElMessage.error('获取用户总数失败，请稍后重试');
            });
        },
        getUserData() {
            this.$http.get('/uis/v1/ui/sex-distribution').then(response => {
                this.sexDistributionData = response.data; // 存储性别分布数据
                this.updatePieChart(); // 更新性别分布图表
            }).catch(error => {
                ElMessage.error('数据加载失败，请稍后重试');
            });
        },
        initPieChart() {
            this.myPieChart = echarts.init(this.$refs.myPieChart);
            const pieOption = {
                title: {
                    text: '用户分布',
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [{
                    name: '用户性别',
                    type: 'pie',
                    radius: '50%',
                    data: [] // 初始数据为空
                }]
            };
            this.myPieChart.setOption(pieOption);
        },
        updatePieChart() {
            // 由于user_sex是整型，我们需要确保map函数中的比较是基于整数的
            const pieData = this.sexDistributionData.map(item => ({
                value: item.count,
                name: item.user_sex === 1 ? '男' : '女' // 直接使用整型比较
            }));
            const pieOption = {
                series: [{
                    data: pieData
                }]
            };
            this.myPieChart.setOption(pieOption);
        },
        getVideoCompletionData() {
            this.$http.get('/uis/v1/ui/countCourseAll').then(response => {
                this.videoCompletionData = response.data;
                this.updateVideoChart(); // 更新图表
            }).catch(error => {
                ElMessage.error('获取用户完成视频个数数据失败，请稍后重试');
            });
        },
        initVideoChart() {
            this.myVideoChart = echarts.init(this.$refs.myVideoChart);
            const option = {
                title: {
                    text: '用户完成视频个数',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    data: [] // 用户名
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    name: '完成视频个数',
                    type: 'bar',
                    data: [] // 完成视频个数
                }]
            };
            this.myVideoChart.setOption(option);
        },
        updateVideoChart() {
            if (!this.myVideoChart) return;
            const userNames = this.videoCompletionData.map(item => item.user_name);
            const completionCounts = this.videoCompletionData.map(item => item.completed_count);
            const option = {
                xAxis: {
                    data: userNames
                },
                series: [{
                    data: completionCounts
                }]
            };
            this.myVideoChart.setOption(option);
        }
    },
    beforeDestroy() {
        this.myPieChart.dispose();
        if (this.myVideoChart) {
            this.myVideoChart.dispose();
        }
    }
    
}
</script>

<style scoped>
.card {
    padding: 20px;
}

.card-header {
    font-size: 20px;
    font-weight: bold;
}
</style>