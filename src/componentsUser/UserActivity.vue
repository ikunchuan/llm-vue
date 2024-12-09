<template>
    <div class="activity-chart">
      <!-- ECharts 图表的容器 -->
      <div ref="stackedLineChart" class="stacked-line-chart"></div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  import { ElMessage } from 'element-plus';
  
  export default {
    data() {
      return {
        stackedLineChart: null, // 用于存储 ECharts 图表实例
      };
    },
    mounted() {
      this.initStackedLineChart(); // 初始化 ECharts 图表
      this.setChartOptions(); // 设置图表选项
      // 假设您需要调用 getUserTotalCount 方法
      this.getUserTotalCount(); 
    },
    methods: {
      // 初始化 ECharts 图表
      initStackedLineChart() {
        this.stackedLineChart = echarts.init(this.$refs.stackedLineChart);
      },
      // 设置图表选项
      setChartOptions() {
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
        this.stackedLineChart.setOption(option); // 设置图表选项
      },
      // 示例方法：获取用户总数
      getUserTotalCount() {
        // 这里是模拟的逻辑，您需要根据实际情况实现
        ElMessage.success('getUserTotalCount 方法被调用');
        // 假设您从后端获取用户总数
        // this.userTotalCount = response.data;
      }
    },
    beforeDestroy() {
      if (this.stackedLineChart) {
        this.stackedLineChart.dispose(); // 销毁图表实例
      }
    }
  };
  </script>
  
  <style scoped>
  .activity-chart {
    width: 100%;
    height: 500px; /* 图表容器高度 */
  }
  .stacked-line-chart {
    width: 100%;
    height: 100%; /* 图表填满容器 */
  }
  </style>