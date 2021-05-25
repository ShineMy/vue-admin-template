<template>
  <div class="homepage-container">
    <el-card class="box-card" style="margin-bottom: 30px">
      <div class="userData-container">
        <div class="welcomeTxt" v-html="welcomeTxt"></div>
        <div class="userData">
          <div class="userDataItem accounts">
            <div class="userDataItem-title">账号</div>
            <div class="userDataItem-number">{{userTotalInfo.accounts}}</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="userDataItem videos">
            <div class="userDataItem-title">视频</div>
            <div class="userDataItem-number">{{(userTotalInfo.videos)}}</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="userDataItem played">
            <div class="userDataItem-title">播放</div>
            <div class="userDataItem-number">{{formatNums(userTotalInfo.played)}}</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="userDataItem likes">
            <div class="userDataItem-title">点赞</div>
            <div class="userDataItem-number">{{formatNums(userTotalInfo.likes)}}</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="userDataItem comment">
            <div class="userDataItem-title">评论</div>
            <div class="userDataItem-number">{{formatNums(userTotalInfo.comment)}}</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="userDataItem share">
            <div class="userDataItem-title">分享</div>
            <div class="userDataItem-number">{{formatNums(userTotalInfo.share)}}</div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="userDataItem fans">
            <div class="userDataItem-title">粉丝</div>
            <div class="userDataItem-number">{{formatNums(userTotalInfo.fans)}}</div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card" style="margin-bottom: 30px">
      <div class="mainChart-header" slot="header">
        <div class="header-left">
          <span style="float:left;font-size:14px">TikTok账号：</span>
          <el-dropdown placement="bottom" @command="changeAccount" style="float:left">
            <span class="el-dropdown-link">
              {{currentAccount}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(account, i) in accountsInfoList" :key="i" :command="account">{{ Object.keys(account)[0] }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="videoTitle">{{currentVideo ? currentVideo.title : '&nbsp;'}}</div>
        <div class="header-right">
          <el-radio-group v-model="chartType" size="small">
            <el-radio-button label="数据曲线"></el-radio-button>
            <el-radio-button label="增量曲线"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="mainChart-container">
        <main-chart width="60%" :currentVideo="currentVideo" :currentFans="currentFans" :chartType="chartType"/>
        <video-list width="38%" :currentAccount="currentAccount" @change-video="changeVideo"/>
      </div>
    </el-card>

    <!-- <el-row :gutter="20" style="margin-bottom: 30px">
      <el-col :span="12">
        <el-card class="box-card">
          <chart2></chart2>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <chart4></chart4>
        </el-card>
      </el-col>
    </el-row> -->

    <!-- <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <chart1></chart1>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <chart3></chart3>
        </el-card>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserInfo, deleteWarning } from '@/api/user'
import { Loading } from 'element-ui'
import { formatNums } from '@/utils'
import mainChart from './components/mainChart'
import videoList from './components/videoList'
import chart1 from './components/chart1'
import chart2 from './components/chart2'
import chart3 from './components/chart3'
import chart4 from './components/chart4'

export default {
  name: 'Homepage',
  components: {
    mainChart,
    videoList,
    chart1,
    chart2,
    chart3,
    chart4
  },
  data() {
    return {
      currentAccount: '账号选择',
      chartType: '数据曲线',
      currentFans: {},
      currentVideo: null,
      videosInfoList: [],
      userTotalInfo: {
        accounts: 0,
        videos: 0,
        played: 0,
        likes: 0,
        comment: 0,
        share: 0,
        fans:0
      }
    }
  },
  created() {
    this.initData();
  },
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'warning',
      'accountsInfoList'
    ]),
    welcomeTxt() {
      const currentHour = new Date().getHours()
      let welcomePrefix = '运营人员：'
      if (currentHour >= 0 && currentHour <= 12) {
        welcomePrefix = '上午好，'
      } else {
        welcomePrefix = '下午好，'
      }
      return welcomePrefix + '<span style="color: #FF8600">' + this.name + '</span>'
    }
  },
  methods: {
    changeVideo(video) {
      this.currentVideo = video
    },
    async initData() {
      let loadingInstance = Loading.service({ fullscreen: true })
      if (this.warning) {
        let warningList = this.warning
        let user = this.name
        for (let key in warningList) {
          await this.$notify.error({
              title: '错误',
              message: warningList[key],
              duration: 0,
              onClose: async function() {
                await deleteWarning({user, key})
              }
          });
        }
      }
      try {
        await this.$store.dispatch('account/getAccountsInfo', this.name)
        let userTotalInfo = await getUserInfo(this.name)
        this.userTotalInfo = userTotalInfo
        let firstAccount = this.accountsInfoList[0]
        let firstAccountName = Object.keys(this.accountsInfoList[0])[0]
        this.currentAccount = firstAccountName
        this.currentFans = firstAccount[firstAccountName].fans || {}
        this.$nextTick(function() {
          loadingInstance.close()
        })
      } catch (error) {
        // this.$message.error('初始化失败：' + error)
        this.$message.error('初始化失败，请先添加账号')
        this.$nextTick(function() {
          loadingInstance.close()
        })
      }
    },
    formatNums: num => formatNums(num),
    changeAccount(account) {
      let accountName = Object.keys(account)[0]
      this.currentAccount = accountName
      this.currentFans = account[accountName].fans || {}
    }
  }
}
</script>

<style lang="scss" scoped>
.homepage {
  &-container {
    padding: 30px;
    .userData-container {
      display: flex;
      justify-content: space-between;
      height: 50px;
      .welcomeTxt {
        font-size: 28px;
        line-height: 50px;
        font-weight: bold;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .userData {
        display: flex;
        .userDataItem {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
          // padding: 0 20px;
          min-width: 60px;
          &-title {
            color: rgba(0,0,0,.45);
            font-size: 16px;
          }
          &-number {
            font-size: 14px;
            font-weight: bold;
          }
        }
      }
    }
    .videoTitle {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }
    .mainChart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left {
        width: 240px;
        text-align: left;
      }
      .header-right {
        width: 240px;
        text-align: right;
      }
    }
    .mainChart-container {
      display: flex;
      justify-content: space-between;
    }

    .el-dropdown-link {
      font-weight: bold;
      cursor: pointer;
      color: #409EFF;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
}
</style>
