<template>
    <div class="traffic-analysis">
      <div class="header">
        <h1>网站流量分析</h1>
      </div>
      <div class="content">
        <div class="stats">
          <div class="stat-item" v-for="item in stats" :key="item.title">
            <h2>{{ item.title }}</h2>
            <p>{{ item.value }}</p>
          </div>
        </div>
        <div class="charts">
          <div ref="dailyLoginChart" class="chart"></div>
          <div ref="userDistributionChart" class="chart"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        stats: [
          { title: '今日访问量', value: 304 },
          { title: '昨日访问量', value: 2044 },
          { title: '本月访问量', value: 909 },
          { title: '总访问量', value: 980 },
        ],
        dailyLoginData: [120, 200, 150, 80, 70, 110, 130],
        userDistributionData: [
          { value: 1048, name: '直接访问' },
          { value: 735, name: '邮件营销' },
          { value: 580, name: '联盟广告' },
          { value: 484, name: '视频广告' },
          { value: 300, name: '搜索引擎' },
        ],
      };
    },
    mounted() {
      this.initCharts();
    },
    methods: {
      initCharts() {
        const dailyLoginChart = echarts.init(this.$refs.dailyLoginChart);
        const userDistributionChart = echarts.init(this.$refs.userDistributionChart);
  
        const dailyLoginOption = {
          title: {
            text: '日登陆人数',
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
              data: this.dailyLoginData,
              type: 'bar',
            },
          ],
        };
  
        const userDistributionOption = {
          title: {
            text: '用户来源分布',
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: this.userDistributionData,
            },
          ],
        };
  
        dailyLoginChart.setOption(dailyLoginOption);
        userDistributionChart.setOption(userDistributionOption);
      },
    },
  };
  </script>
  
  <style scoped>
  .traffic-analysis {
    padding: 20px;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .stats {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .stat-item {
    flex: 1;
    min-width: 150px;
    text-align: center;
  }
  .charts {
    flex: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .chart {
    flex: 1;
    height: 300px;
  }
  </style>