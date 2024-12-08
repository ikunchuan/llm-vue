<!-- <template>
    <div class="cash-flow-statement">
      <div class="header">
        <h1>现金流量分析</h1>
      </div>
      <div class="stats">
        <div class="stat-row">
          <div class="stat-item" v-for="item in firstRow" :key="item.title">
            <h2>{{ item.title }}</h2>
            <p>{{ item.value }}</p>
          </div>
        </div>
        <div class="stat-row">
          <div class="stat-item" v-for="item in secondRow" :key="item.title">
            <h2>{{ item.title }}</h2>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>
      <div class="charts">
        <div ref="barChart" class="chart bar-chart"></div>
        <div ref="candlestickChart" class="chart candlestick-chart"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        firstRow: [
          { title: '经营活动现金流入', value: '6.2亿' },
          { title: '经营活动现金流出', value: '5.1亿' },
          { title: '经营活动净现金流量', value: '5.08亿' },
        ],
        secondRow: [
          { title: '投资活动现金流入', value: '3.823亿' },
          { title: '投资活动净现金流量', value: '2.5亿' },
          { title: '融资活动净现金流量', value: '3.8亿' },
        ],
      };
    },
    mounted() {
      this.initBarChart();
      this.initCandlestickChart();
    },
    methods: {
      initBarChart() {
        const barChart = echarts.init(this.$refs.barChart);
        const option = {
          title: {
            text: '现金流量分析',
          },
          tooltip: {},
          legend: {
            data: ['现金流入', '现金流出'],
          },
          xAxis: {
            data: ['经营活动', '投资活动', '融资活动'],
          },
          yAxis: {},
          series: [
            {
              name: '现金流入',
              type: 'bar',
              data: [616.2, 3.823, 0], // 假设融资活动现金流入为0
            },
            {
              name: '现金流出',
              type: 'bar',
              data: [564.1, 0, 0], // 假设投资和融资活动现金流出为0
            },
          ],
        };
      },
      initCandlestickChart() {
        const candlestickChart = echarts.init(this.$refs.candlestickChart);
        const option = {
        title: {
          text: 'K线图示例',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        xAxis: {
          type: 'category',
          data: ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '价格',
            type: 'candlestick',
            data: [
              // K线图数据，这里需要替换为实际数据
            ],
          },
        ],
      };
      },
    },
  };
  </script>
  
  <style scoped>
  .cash-flow-statement {
    padding: 20px;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
  }
  .stat-row {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 20px;
  }
  .stat-item {
    text-align: center;
    flex: 1;
    margin: 0 10px;
  }
  .charts {
    display: flex;
    justify-content: space-around;
  }
  .chart {
    width: 45%;
    height: 400px;
  }
  </style> -->



  <template>
    <div class="cash-flow-statement">
      <div class="header">
        <h1>现金流量分析</h1>
      </div>
      <div class="stats">
        <div class="stat-item" v-for="item in cashFlowData" :key="item.title">
          <h2>{{ item.title }}</h2>
          <p>{{ item.value }}</p>
        </div>
      </div>
      <div class="charts">
        <div ref="cashFlowChart" class="chart"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    data() {
      return {
        cashFlowData: [
          { title: '经营活动现金流入', value: '616.2亿' },
          { title: '经营活动现金流出', value: '564.1亿' },
          { title: '经营活动净现金流量', value: '52.08亿' },
          { title: '投资活动现金流入', value: '3.823亿' },
          { title: '投资活动净现金流量', value: '待定' },
          { title: '融资活动净现金流量', value: '待定' },
        ],
      };
    },
    mounted() {
      this.initChart();
    },
    methods: {
      initChart() {
        const cashFlowChart = echarts.init(this.$refs.cashFlowChart);
  
        const option = {
          title: {
            text: '现金流量分析',
          },
          tooltip: {},
          legend: {
            data:['现金流入', '现金流出'],
          },
          xAxis: {
            data: ['经营活动', '投资活动', '融资活动'],
          },
          yAxis: {},
          series: [
            {
              name: '现金流入',
              type: 'bar',
              data: [616.2, 3.823, 0], // 假设融资活动现金流入为0
            },
            {
              name: '现金流出',
              type: 'bar',
              data: [564.1, 0, 0], // 假设投资和融资活动现金流出为0
            },
          ],
        };
  
        cashFlowChart.setOption(option);
      },
    },
  };
  </script>
  
  <style scoped>
  .cash-flow-statement {
    padding: 20px;
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
    justify-content: center;
  }
  .chart {
    width: 80%;
    height: 400px;
  }
  </style>