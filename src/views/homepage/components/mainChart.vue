<template>
  <div class="mainChart" :style="{height, width}"></div>
</template>

<script>
  import * as echarts from 'echarts'

  export default {
    props: {
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '500px'
      },
      chartType: {
        type: String,
        default: '数据曲线'
      },
      currentVideo: {
        type: Object,
        default: function() {
          return {}
        }
      },
      currentFans: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        chart: null,
        seriesData: [{
          name: '播放',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '点赞',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '评论',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '分享',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '粉丝',
          type: 'line',
          showSymbol: false,
          yAxisIndex: 1,
          data: []
        }],
        diffData: [{
          name: '播放',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '点赞',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '评论',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '分享',
          type: 'line',
          showSymbol: false,
          data: []
        },
        {
          name: '粉丝',
          type: 'line',
          showSymbol: false,
          yAxisIndex: 1,
          data: []
        }]
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.initChart()
      })
    },
    watch: {
      chartType: {
        handler(newVal) {
          if (newVal === '数据曲线') {
            this.setOptions(this.seriesData)
          } else if (newVal === '增量曲线') {
            this.setOptions(this.diffData)
          }
        }
      },
      currentVideo: {
        handler(video) {
          this.videoDataHandle(video)
        },
        deep: true
      },
      currentFans: {
        handler(fans) {
          this.fansDataHandle(fans)
        },
        deep: true
      },
      seriesData: {
        handler(val) {
          this.diffDataHandle(val)
          if (this.chartType === '数据曲线') {
            this.setOptions(this.seriesData)
          } else if (this.chartType === '增量曲线') {
            this.setOptions(this.diffData)
          }
        },
        deep: true
      }
    },
    methods: {
      sort(arr) {
        arr.sort(function(a, b) {
          let timestamp_a = new Date(a).getTime()
          let timestamp_b = new Date(b).getTime()
          return timestamp_a - timestamp_b
        })
        return arr
      },
      videoDataHandle(video) {
        let videoData = {
          played: [],
          likes: [],
          comment: [],
          share: []
        }
        if (video) {
          let daily = video.dailyData
          let dailyKeys = this.sort(Object.keys(daily))
          for (let i = 0; i < dailyKeys.length; i ++) {
            let currentTime = dailyKeys[i]
            let currentData = daily[currentTime]
            videoData.played.push([currentTime, currentData.played])
            videoData.likes.push([currentTime, currentData.likes])
            videoData.comment.push([currentTime, currentData.comment])
            videoData.share.push([currentTime, currentData.share])
          }
        }
        
        this.$set(this.seriesData[0], 'data', videoData.played)
        this.$set(this.seriesData[1], 'data', videoData.likes)
        this.$set(this.seriesData[2], 'data', videoData.comment)
        this.$set(this.seriesData[3], 'data', videoData.share)
      },
      fansDataHandle(fans) {
        let fansData = []
        if (fans) {
          for (let dailyKey in fans) {
            let dailyData = fans[dailyKey]
            fansData.push([dailyKey, dailyData])
          }
        }
        this.$set(this.seriesData[4], 'data', fansData)
      },
      diffDataHandle(seriesData) {
        for (let i = 0; i < seriesData.length; i ++) {
          let attrArr = seriesData[i].data;
          let tempArr = [];
          for (let j = 1; j < attrArr.length; j ++) {
            let dailyData = attrArr[j];
            let lastDailyData = attrArr[j - 1];
            let currentTime = dailyData[0];
            let currentData = dailyData[1];
            let lastData = lastDailyData[1];
            let diffData = currentData - lastData;
            tempArr.push([currentTime, diffData]);
          }
          this.$set(this.diffData[i], 'data', tempArr);
        }
      },
      initChart() {
        this.chart = echarts.init(this.$el)
        this.setOptions(this.seriesData)
      },
      setOptions(seriesData = []) {
        this.chart.setOption({
          title: {
            text: this.chartType,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
            }
          },
          legend: {
            data: ['播放', '点赞', '评论', '分享', '粉丝']
          },
          
          toolbox: {
            feature: {
              magicType: {show: true, type: ['line', 'bar']},
              // restore: {show: true},
              saveAsImage: {show: true}
            },
            right: '4%'
          },
          xAxis: {
            type: 'time',
            boundaryGap: false,
            // minInterval: 3600 * 24 * 1000
          },
          yAxis: [{
            type: 'value',
            name: '视频数据'
          }, {
            type: 'value',
            name: '账号粉丝'
          }],
          dataZoom: [{
              type: 'inside',
              start: 0,
              end: 100
          }, {
              start: 0,
              end: 100
          }],
          series: seriesData
        })
      }
    }
  }

</script>
