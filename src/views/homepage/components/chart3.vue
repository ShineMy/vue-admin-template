<template>
  <div :class="className" :style="{height, width}"></div>
</template>

<script>
  import * as echarts from 'echarts'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart3'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
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
            text: '平均播放时长',
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '10%',
            left: 'center'
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [{
                value: 1000,
                name: '37s'
              },
              {
                value: 2300,
                name: '30s'
              },
              {
                value: 1800,
                name: '20s'
              },
              {
                value: 500,
                name: '10s'
              },
              {
                value: 3700,
                name: '其他'
              }
            ]
          }]
        })
      }
    }
  }

</script>
