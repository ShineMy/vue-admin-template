<template>
  <div :class="className" :style="{height, width}"></div>
</template>

<script>
  import * as echarts from 'echarts'

  export default {
    props: {
      className: {
        type: String,
        default: 'chart1'
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
            text: '触达观众人数',
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
          series: [{
            name: '触达观众人数',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [{
                value: 335,
                name: '直接访问'
              },
              {
                value: 310,
                name: '邮件营销'
              },
              {
                value: 274,
                name: '联盟广告'
              },
              {
                value: 235,
                name: '视频广告'
              },
              {
                value: 400,
                name: '搜索引擎'
              }
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              color: 'rgba(0, 0, 0, 0.5)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0.3)'
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
          }]
        })
      }
    }
  }

</script>
