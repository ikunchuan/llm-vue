<template>
    <div class="performance-monitor">
      <div class="header">
        <h1>网站性能监控</h1>
      </div>
      <div class="stats">
        <div class="stat-item" v-for="item in stats" :key="item.title">
          <h2>{{ item.title }}</h2>
          <p>{{ item.value }}</p>
        </div>
      </div>
      <div class="charts">
        <div ref="responseTimeChart" class="chart"></div>
        <div ref="errorRateChart" class="chart"></div>
        <div ref="systemLoadChart" class="chart"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        stats: [
          { title: '平均响应时间', value: '250ms' },
          { title: '错误率', value: '0.5%' },
          { title: '系统负载', value: '45%' },
        ],
        responseTimeData: [210, 220, 230, 240, 250, 260, 270],
        errorRateData: [0.4, 0.5, 0.6, 0.5, 0.4, 0.3, 0.2],
        systemLoadData: [40, 45, 50, 55, 60, 65, 70],
      };
    },
    mounted() {
      this.initCharts();
    },
    methods: {
      initCharts() {
        const responseTimeChart = echarts.init(this.$refs.responseTimeChart);
        const errorRateChart = echarts.init(this.$refs.errorRateChart);
        const systemLoadChart = echarts.init(this.$refs.systemLoadChart);
        const responseTimeOption = {
        title: {
          text: '响应时间（ms）',
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.responseTimeData,
            type: 'line',
          },
        ],
      };

      const errorRateOption = {
        title: {
          text: '错误率',
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        yAxis: {
          type: 'value',
          max: 1,
        },
        series: [
          {
            data: this.errorRateData,
            type: 'line',
          },
        ],
      };

      const systemLoadOption = {
        title: {
          text: '系统负载',
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
        yAxis: {
          type: 'value',
          max: 100,
        },
        series: [
          {
            data: this.systemLoadData,
            type: 'line',
          },
        ],
      };

      responseTimeChart.setOption(responseTimeOption);
      errorRateChart.setOption(errorRateOption);
      systemLoadChart.setOption(systemLoadOption);
      },
    },
  };
  </script>
  
  <style scoped>
  .performance-monitor {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
  .stat-item {
    text-align: center;
    flex: 1;
  }
  .charts {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .chart {
    flex: 1;
    min-height: 300px;
    margin-bottom: 20px;
  }
  </style>