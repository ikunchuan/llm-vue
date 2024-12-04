<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            <span>用户行为监控管理</span>
        </div>

        <!-- <div class="echart" ref="mychart" id="mychart"
            :style="{ float: 'left', width: '100%', height: '200px' }"
        ></div>
        <div class="echart" ref="mybing" id="mybing"
            :style="{ float: 'left', width: '100%', height: '200px' }"
        ></div> -->
        <!-- 这里可以放置用户行为监控内容 -->
        <!-- <p>显示用户行为监控内容</p> -->
        <!-- 查询字段选择：让用户选择查询的字段 -->
        <el-select v-model="selectedField" placeholder="选择查询字段" style="width: 180px;">
                    <el-option label="用户名" value="userName"></el-option>
                    
            
        </el-select>&nbsp;

        <!-- 输入框：输入查询内容 -->
        <el-input v-model="queryStr" style="width: 220px" placeholder="请输入查询内容" />&nbsp;                
        <el-button type="primary"  @click="queryInfo">查询</el-button>
                


    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="userName" label="用户名" width="120" />
            <el-table-column prop="userSex" label="性别" width="100" >
                <template #default="scope">
                    {{ scope.row.userSex==1?'男':'女' }}
                </template>
            </el-table-column>
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

        <br />

        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[2, 3, 4, 5]"
            :background="true" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            <!-- 用户观看课程分布 -->
            <div class="echart" ref="mybing" id="mybing"
            :style="{ float: 'left', width: '100%', height: '400px' }"
        ></div>
        <!-- 各社区评论每天参与人数 -->
        <div class="echart" ref="myxian" id="myxian"
            :style="{ float: 'right', width: '100%', height: '400px' }"
        ></div>
        <!-- 收藏竞赛人数 -->
        <div class="echart" ref="myzhu" id="myzhu"
            :style="{ float: 'right', width: '100%', height: '400px' }"
        ></div>
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
            form: {},
            formLabelWidth: "140px", 
            queryData: [],
            title: "",
            btnName: "",
            imageUrl: ""
        };
    },
    mounted() {
        this.mybing();
        this.myxian();
        this.myzhu();
        this.getPageData(this.currentPage, this.pageSize);
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
                    this.tableData = this.pageInfo.records;
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
        mybing() {
            const option = {
                title: { text: 'Customized Pie', left: 'center' },
                tooltip: { trigger: 'item' },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            { value: 335, name: 'Direct' },
                            { value: 310, name: 'Email' },
                            { value: 274, name: 'Union Ads' },
                            { value: 235, name: 'Video Ads' },
                            { value: 400, name: 'Search Engine' }
                        ],
                        roseType: 'radius',
                    }
                ]
            };
            const mybing = echarts.init(this.$refs.mybing);
            mybing.setOption(option);
            window.addEventListener("resize", () => mybing.resize());
        },
        myxian() {
            const option = {
                title: {
                    text: 'Stacked Line'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                    saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    name: 'Email',
                    type: 'line',
                    stack: 'Total',
                    data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                    name: 'Union Ads',
                    type: 'line',
                    stack: 'Total',
                    data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                    name: 'Video Ads',
                    type: 'line',
                    stack: 'Total',
                    data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                    name: 'Direct',
                    type: 'line',
                    stack: 'Total',
                    data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                    name: 'Search Engine',
                    type: 'line',
                    stack: 'Total',
                    data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
                };
                const myxian = echarts.init(this.$refs.myxian);
                myxian.setOption(option);
                window.addEventListener("resize", () => myxian.resize());
        },
        myzhu(){
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                        alignWithLabel: true
                    }
                    }
                ],
                yAxis: [
                    {
                    type: 'value'
                    }
                ],
                series: [
                    {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: [10, 52, 200, 334, 390, 330, 220]
                    }
                ]
                };
                const myzhu = echarts.init(this.$refs.myzhu);
                myzhu.setOption(option);
                window.addEventListener("resize", () => myzhu.resize());
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
