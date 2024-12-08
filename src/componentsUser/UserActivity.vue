<template>
    <div class="activity-chart">
        <div ref="stackedLineChart" class="stacked-line-chart"></div>
    </div>
    </template>
    
    <script>
    import * as echarts from 'echarts';
    import { ElMessage } from 'element-plus';
    
    export default {
        data() {
        return {
            stackedLineChart: null,
        };
        },
        mounted() {
        this.initStackedLineChart();
        this.fetchChartData();
        },
        methods: {
        initStackedLineChart() {
            this.stackedLineChart = echarts.init(this.$refs.stackedLineChart);
        },
        async fetchChartData() {
            try {
            const response = await this.$http.get('uis/v1/ui/dateusercount');
            const data = response.data;
            this.updateChartData(data);
            } catch (error) {
            ElMessage.error('获取数据失败，请稍后重试');
            }
        },
        updateChartData(data) {
            const days = data.map(item => item.clickDate); // 假设日期在 'date' 字段
            const seriesData = Object.keys(data[0]).filter(key => key !== 'clickDate').map(key => {
            return {
                name: key,
                type: 'line',
                stack: 'Total',
                data: data.map(item => item[key])
            };
            });
            const option = {
            title: {
                text: 'Stacked Line'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: seriesData.map(s => s.courseName)
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
                data: days
            },
            yAxis: {
                type: 'value'
            },
            series: seriesData
            };
            this.stackedLineChart.setOption(option);
        }
        },
        beforeDestroy() {
        if (this.stackedLineChart) {
            this.stackedLineChart.dispose();
        }
        }
    };
    </script>
    
    <style scoped>
    .activity-chart {
        width: 100%;
        height: 500px;
    }
    .stacked-line-chart {
        width: 100%;
        height: 100%;
    }
    </style>