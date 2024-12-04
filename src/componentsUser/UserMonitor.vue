<template>
    <el-card class="card">
        <div slot="header" class="card-header">
            <span>用户行为监控管理</span>
        </div>
        <div class="echart" ref="mychart" id="mychart"
            :style="{ float: 'left', width: '100%', height: '200px' }"
        ></div>
        <div class="echart" ref="mybing" id="mybing"
            :style="{ float: 'left', width: '100%', height: '200px' }"
        ></div>
        <!-- 这里可以放置用户行为监控内容 -->
        <!-- <p>显示用户行为监控内容</p> -->
    </el-card>
</template>

<script>
import * as echarts from 'echarts';
import { Title } from 'view-ui-plus';

export default {
    data() {
        return {
            // 数据部分可根据需要进行定义
        };
    },
    mounted() {
        // 调用图表初始化方法
        this.initEcharts();
        this.mybing();  // 调用 Pie chart 的方法
    },
    methods: {
        initEcharts() {
            const option = {
                title: {
                    text: "用户行为跟踪"
                },
                tooltip: {},
                legend: {
                    data: ["销量"]
                },
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: "销量",
                    type: "bar", // 类型为柱状图
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };
            const myChart = echarts.init(this.$refs.mychart);  // 初始化图表
            myChart.setOption(option);  // 渲染图表
            // 随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                myChart.resize();
            });
        },
        mybing() {
            const option = {
                // backgroundColor: '#2c343c',
                title: {
                    text: 'Customized Pie',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#ccc'
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
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
                        ].sort(function (a, b) {
                            return a.value - b.value;
                        }),
                        roseType: 'radius',
                        label: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        labelLine: {
                            lineStyle: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            smooth: 0.2,
                            length: 10,
                            length2: 20
                        },
                        itemStyle: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            };

            const mybing = echarts.init(this.$refs.mybing);  // 初始化饼图
            mybing.setOption(option);  // 渲染饼图
            // 随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                mybing.resize();
            });
        }
    }
};
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
