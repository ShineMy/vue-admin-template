<template>
  <div :style="{height, width}"></div>
</template>

<script>
  import * as echarts from 'echarts'
  import { parseTime } from '@/utils'

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
          type: 'bar',
          data: []
        },
        {
          name: '点赞',
          type: 'bar',
          data: []
        },
        {
          name: '评论',
          type: 'bar',
          data: []
        },
        {
          name: '分享',
          type: 'bar',
          data: []
        },
        {
          name: '粉丝',
          type: 'line',
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
          this.setOptions(val)
        },
        deep: true
      }
    },
    methods: {
      videoDataHandle(video) {
        let videoData = {
          played: [],
          likes: [],
          comment: [],
          share: []
        }
        if (video) {
          let daily = video.dailyData
          for (let currentTime in daily) {
            let currentData = daily[currentTime]
            videoData.played.push([parseTime(currentTime), currentData.played])
            videoData.likes.push([parseTime(currentTime), currentData.likes])
            videoData.comment.push([parseTime(currentTime), currentData.comment])
            videoData.share.push([parseTime(currentTime), currentData.share])
          }
        }
        // if (video) {
        //   let daily = video.dailyData
        //   let firstDay = Object.keys(daily)[0]
        //   let oneDay = 24 * 3600 * 1000
        //   let currentDate = new Date(parseTime(new Date())).getTime()
        //   let now = new Date(firstDay).getTime()
          
        //   while(now <= currentDate) {
        //     let nowDay = now
        //     let nowDayData = daily[parseTime(nowDay)]
        //     if (nowDayData) {
        //       videoData.played.push([parseTime(nowDay), nowDayData.played])
        //       videoData.likes.push([parseTime(nowDay), nowDayData.likes])
        //       videoData.comment.push([parseTime(nowDay), nowDayData.comment])
        //       videoData.share.push([parseTime(nowDay), nowDayData.share])
        //     } else {
        //       videoData.played.push([parseTime(nowDay), 0])
        //       videoData.likes.push([parseTime(nowDay), 0])
        //       videoData.comment.push([parseTime(nowDay), 0])
        //       videoData.share.push([parseTime(nowDay), 0])
        //     }
        //     now = now + oneDay
        //   }
        // }
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
      initChart() {
        this.chart = echarts.init(this.$el)
        this.setOptions(this.seriesData)
      },
      setOptions(seriesData = []) {
        this.chart.setOption({
          title: {
            text: '增长曲线',
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
          grid: {
            left: '3%',
            right: '4%',
            containLabel: true
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
