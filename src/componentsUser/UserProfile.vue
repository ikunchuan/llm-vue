

<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            <span>用户行为监控管理</span>
        </div>

        
        <!-- 用户总数显示 -->
        <div class="user-total-count">
            <div class="label">
                <i class="el-icon-user-solid"></i>
                <span>用户总数</span>
            </div>
            <div class="count">
                {{ userTotalCount }}
            </div>
        </div>

        
        <!-- 用户性别分布饼图 -->
        <div class="echart" ref="myPieChart" :style="{ width: '45%', height: '400px',float:'left' }"></div>
        <!-- 用户年龄分布饼图 -->
        <div class="echart" ref="myAgeChart" :style="{ width: '45%', height: '400px',float:'right' }"></div>
        <!-- 用户地区分布饼图 -->
        <div class="echart" ref="myRegionChart" :style="{ width: '45%', height: '400px',float:'left' }"></div>
    </el-card>
</template>

        
        



<script>
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';

export default {
    data() {
        return {
            queryStr: "",
            selectedField: "",
            currentPage: 1,
            pageSize: 5,
            pageInfo: {},
            tableData: [],
            sexDistributionData: [], // 用于存储性别分布数据
            userTotalCount: 0, // 存储用户总数
            ageDistributionData: [], // 用于存储年龄分布数据
            regionDistributionData: [], // 用于存储地区分布数据
        };
    },
    mounted() {
        
        this.getUserTotalCount(); // 获取用户总数

        this.getUserData();//获取用户性别数据
        this.initPieChart();//初始化用户性别数据

        this.getAgeDistributionData(); // 获取用户年龄分布数据
        this.initAgeChart(); // 初始化用户年龄分布图表

        this.getRegionDistributionData(); // 获取用户地区分布数据
        this.initRegionChart(); // 初始化用户地区分布图表
    },
    methods: {
        
        formatDate(value) {
            if (!value) return '-';
            const date = new Date(value);
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        },
        //获取用户总数
        getUserTotalCount() {
            this.$http.get('/uis/v1/ui/user-total-count').then(response => {
                this.userTotalCount = response.data; // 存储用户总数
            }).catch(error => {
                ElMessage.error('获取用户总数失败，请稍后重试');
            });
        },
        //获取性别数量
        getUserData() {
            this.$http.get('/uis/v1/ui/sex-distribution').then(response => {
                this.sexDistributionData = response.data; // 存储性别分布数据
                this.updatePieChart(); // 更新性别分布图表
            }).catch(error => {
                ElMessage.error('数据加载失败，请稍后重试');
            });
        },

        //用户性别分布饼图
        initPieChart() {
    this.myPieChart = echarts.init(this.$refs.myPieChart);
    const pieOption = {
        title: {
                    text: '用户性别分布',
                    left: 'center'
                },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [{
            name: '用户性别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16, // 调整为更合理的大小
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [] // 初始数据为空
        }]
    };
    this.myPieChart.setOption(pieOption);
},
updatePieChart() {
    const pieData = this.sexDistributionData.map(item => ({
        value: item.count,
        name: item.user_sex === 1 ? '男' : '女'
    }));
    const pieOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {//标签位置
            top: '5%',
            left: 'left'
        },
        series: [{
            name: '用户性别',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center'//ni
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: pieData
        }]
    };
    this.myPieChart.setOption(pieOption);
},
        // 获取用户年龄分布数据
        getAgeDistributionData() {
            this.$http.get('/uis/v1/ui/userageall').then(response => {
                this.ageDistributionData = response.data;
                this.updateAgeChart(); // 更新年龄分布图表
            }).catch(error => {
                ElMessage.error('获取用户年龄分布数据失败，请稍后重试');
            });
        },
        // 用户年龄分布饼图
initAgeChart() {
    this.myAgeChart = echarts.init(this.$refs.myAgeChart);
    const ageOption = {
        title: {
                text: '用户年龄分布',
                left: 'center'
                },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'left'
        },
        series: [{
            name: '年龄分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [] // 初始数据为空
        }]
    };
    this.myAgeChart.setOption(ageOption);
},
updateAgeChart() {
    const ageData = this.ageDistributionData.map(item => ({
        value: item.ageCount,
        name: item.userAge
    }));
    const ageOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'left'
        },
        series: [{
            name: '年龄分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: ageData
        }]
    };
    this.myAgeChart.setOption(ageOption);
},
        // 获取用户地区分布数据
        getRegionDistributionData() {
            this.$http.get('/uis/v1/ui/cityuserall').then(response => {
                this.regionDistributionData = response.data;
                this.updateRegionChart(); // 更新地区分布图表
            }).catch(error => {
                ElMessage.error('获取用户地区分布数据失败，请稍后重试');
            });
        },

        // 用户地区分布饼图
initRegionChart() {
    this.myRegionChart = echarts.init(this.$refs.myRegionChart);
    const regionOption = {
        title: {
                text: '用户地区分布',
                left: 'center'
                },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [{
            name: '地区分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'left'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [] // 初始数据为空
        }]
    };
    this.myRegionChart.setOption(regionOption);
},
updateRegionChart() {
    const regionData = this.regionDistributionData.map(item => ({
        value: item.userNum,
        name: item.userLocal
    }));
    const regionOption = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'left'
        },
        series: [{
            name: '地区分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
                borderRadius: 10
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: regionData
        }]
    };
    this.myRegionChart.setOption(regionOption);
},
my1() {
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
}
    },
    beforeDestroy() {
        this.myPieChart.dispose();
        this.myAgeChart.dispose();
        this.myRegionChart.dispose();
    }
    
}
</script>

<style scoped>

.card {
    padding: 20px;
    border-radius: 8px; /* 圆角边框 */
    box-shadow: 0 2px 12px rgba(0,0,0,0.1); /* 阴影效果 */
}

.card-header {
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #ebeef5; /* 分隔线 */
    padding-bottom: 10px;
    margin-bottom: 20px;
}

.user-total-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
}

.user-total-count .label {
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* 增加间距 */
    color: #606266; /* 次要文字颜色 */
}

.user-total-count .label i {
    font-size: 28px; /* 增大图标大小 */
    margin-right: 12px; /* 增加图标右边距 */
    color: #409EFF; /* 主题色 */
}

.user-total-count .label span {
    font-size: 20px; /* 增大标签文字大小 */
    font-weight: 1000; /* 增加标签文字粗细 */
}

.user-total-count .count {
    font-weight: 600; /* 增加数量文字粗细 */
    font-size: 32px; /* 增大数量文字大小 */
    color: #409EFF; /* 主题色 */
}
.echarts-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.echart {
    flex: 1;
    margin-right: 20px;
}

.echart:last-child {
    margin-right: 0;
}
</style>
