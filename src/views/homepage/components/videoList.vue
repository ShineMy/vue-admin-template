<template>
  <div class="videoList" :style="{height, width}">
    <div class="videoList-titleWrap">
      <div class="videoList-title">视频</div>
      <div class="">
        <el-button-group>
          <el-tooltip content="按照发布时间排序" placement="top">
            <el-button type="warning" size="mini" @click="sort"><i class="el-icon-sort" style="font-weight:bold"></i></el-button>
          </el-tooltip>
          <el-tooltip content="全部视频的数据汇总" placement="top">
            <el-button type="warning" size="mini" @click="showAll">All</el-button>
          </el-tooltip>
        </el-button-group>
      </div>
    </div>
    <div class="videoList-container" ref="videoWrap">
      <div class="defaultTips" v-if="tipsShow">当前账号暂无视频</div>
      <el-card class="box-card" :body-style="{ padding: '10px' }" shadow="hover" v-for="video in videoData" :key="video.title">
        <div class="videoList-item" @click="videoClickHandle(video)">
          <div class="video-title" :title="video.title">{{ video.title }}</div>
          <div class="video-createTime">{{ video.createTime }}</div>
          <div class="video-duration">{{ formatDuration(video.duration) }}</div>
          <div class="video-total">
            <div class="played iconGroup">
              <svg-icon icon-class="play-circle" class="icon"></svg-icon>
              <span class="played-num nums">{{ formatNums(video.played) }}</span>
            </div>
            <div class="likes iconGroup">
              <svg-icon icon-class="heart" class="icon"></svg-icon>
              <span class="likes-num nums">{{ formatNums(video.likes) }}</span>
            </div>
            <div class="comment iconGroup">
              <svg-icon icon-class="comment" class="icon"></svg-icon>
              <span class="comment-num nums">{{ formatNums(video.comment) }}</span>
            </div>
            <div class="share iconGroup">
              <svg-icon icon-class="share" class="icon"></svg-icon>
              <span class="share-num nums">{{ formatNums(video.share) }}</span>
            </div>
          </div>
        </div>
        <div class="videoList-link">
          <a class="video-url" :href="video.url" target="_blank">
            <i class="el-icon-arrow-right video-url-icon"></i>
          </a>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { Loading } from 'element-ui'
  import { formatDuration, formatNums } from '@/utils'
  import { getVideos } from '@/api/video'

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
      currentAccount: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        videoData: [],
        tipsShow: false,
        defaultDailyData: {
          played: 0,
          likes: 0,
          comment: 0,
          share: 0
        }
      }
    },
    watch: {
      currentAccount: function(account) {
        if (account != '当前账号') {
          this.initData(account)
        }
      }
    },
    methods: {
      async initData(account) {
        let videoWrapLoading = Loading.service({target: this.$refs.videoWrap, fullscreen: false})
        let videoList = await getVideos({ account })
        let videosDataArr = []
        if (videoList.length > 0) {
          for(let i = 0; i < videoList.length; i++) {
            let videoInfo = videoList[i]
            if (videoInfo) {
              let videoID = Object.keys(videoInfo)[0]
              let { title, createTime, duration, url, dailyData } = videoInfo[videoID]
              let { played, likes, comment, share } = dailyData ? dailyData[Object.keys(dailyData)[Object.keys(dailyData).length - 1]] : this.defaultDailyData
              let videoData = { title, createTime, url, dailyData, duration, videoID, played, likes, comment, share }
              videosDataArr.push(videoData)
            }
          }
        }
        this.videoData = videosDataArr
        this.$emit('change-video', videosDataArr[0] || null)
        this.tipsShow = videosDataArr.length ? false : true
        this.$nextTick(function() {
          videoWrapLoading.close()
        })
      },
      sort() {
        this.videoData.sort(function(a, b) {
          let timestamp_a = new Date(a.createTime).getTime()
          let timestamp_b = new Date(b.createTime).getTime()
          return timestamp_b - timestamp_a
        })
      },
      showAll() {
        let videoData = JSON.parse(JSON.stringify(this.videoData))
        let allDailyData = {}
        for (let i = 0; i < videoData.length; i ++) {
          let dailyData = videoData[i].dailyData
          for (let currentTime in dailyData) {
            let currentDailyData = dailyData[currentTime]
            if (!allDailyData[currentTime]) {
              allDailyData[currentTime] = currentDailyData
            } else {
              allDailyData[currentTime].played += currentDailyData.played
              allDailyData[currentTime].likes += currentDailyData.likes
              allDailyData[currentTime].comment += currentDailyData.comment
              allDailyData[currentTime].share += currentDailyData.share
            }
          }
        }
        let allVideoData = {
          dailyData: allDailyData,
          title: '全部视频'
        }
        this.$emit('change-video', allVideoData)
      },
      videoClickHandle(video) {
        this.$emit('change-video', video)
      },
      formatDuration: duration => formatDuration(duration),
      formatNums: num => formatNums(num)
    }
  }
</script>

<style lang="scss" scoped>
  .videoList {
    &-titleWrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 30px;
      margin: 10px;
      .videoList-title {
        font-size: 18px;
        font-weight: bold;
      }
    }
    &-container {
      height: calc(100% - 50px);
      overflow: auto;
      padding: 10px;
      .defaultTips {
        font-size: 16px;
        color: #666666;
      }
      .box-card {
        margin-bottom: 10px;
        background-color: #FDF6EC;
        border: 1px solid #FAECD8;
        position: relative;
        .el-card__body {
          padding: 0;
        }
        &:hover {
          cursor: pointer;
        }
        .videoList-item {
          width: 80%;
          height: 75px;
          display: inline-block;
          .video-title {
            font-size: 18px;
            line-height: 26px;
            color: #303133;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .video-createTime {
            display: inline-block;
            font-size: 14px;
            color: #909399;
            vertical-align: top;
          }
          .video-duration {
            display: inline-block;
            font-size: 14px;
            color: #666666;
            font-weight: bold;
            vertical-align: top;
            margin-left: 20px;
          }
          .video-total {
            max-width: 400px;
            margin-top: 8px;
            .iconGroup {
              display: inline-block;
              width: 25%;
              text-align: left;
              .nums {
                vertical-align: middle;
                margin-left: 8px;
                font-size: 16px;
                font-weight: bold;
                line-height: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              }
              .icon {
                vertical-align: middle;
                font-size: 20px;
                color: #E6A23C;
              }
            }
          }
        }
        .videoList-link {
          display: inline-block;
          width: 110px;
          height: 95px;
          position: absolute;
          top: 0;
          right: 0;
          background-color: #FAECD8;
          &:hover {
            background-color: #f8e6cd;
          }
          .video-url {
            display: block;
            width: 100%;
            height: 100%;
            text-align: center;
            &-icon {
              font-size: 60px;
              font-weight: 1000;
              line-height: 95px;
              color: #E6A23C;
            }
          }
        }
      }
    }
  }
</style>
