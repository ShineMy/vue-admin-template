<template>
  <div :class="className" :style="{height, width}"></div>
</template>

<script>
  import * as echarts from 'echarts'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart2'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el)
        this.setOptions()
      },
      setOptions() {
        this.chart.setOption({
          title: {
            text: '流量来源',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['本周', '上周']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['邮件营销', '联盟广告', '视频广告', '首页推荐', '搜索引擎', '直接访问']
          },
          series: [{
              name: '本周',
              type: 'bar',
              data: [18203, 23489, 29034, 104970, 131744, 630230]
            },
            {
              name: '上周',
              type: 'bar',
              data: [19325, 23438, 31000, 121594, 134141, 681807]
            }
          ]
        })
      }
    }
  }

</script>
