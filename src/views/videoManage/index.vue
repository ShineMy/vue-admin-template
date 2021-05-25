<template>
  <div class="videoManage-container">
    <el-card class="box-card">
      <div slot="header">
        <span style="font-size:14px">TikTok账号：</span>
        <el-dropdown placement="bottom" @command="changeAccount">
          <span class="el-dropdown-link">
            {{currentAccount}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(account, i) in accountsInfoList" :key="i" :command="account">{{ Object.keys(account)[0] }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-button type="primary" style="margin-bottom: 20px" @click="handleCreate">
        <svg-icon icon-class="nav-list" class="createVideo-icon" />
        <span class="createVideo-txt">添加视频</span>
      </el-button>

      <el-table :data="videosData" v-loading="tableLoading" border show-summary :summary-method="getSummaries" style="width: 100%">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            <div><el-link type="primary" :href="scope.row.url" target="_blank">{{scope.row.title}}</el-link></div>
          </template>
        </el-table-column>
        <el-table-column label="视频时长" width="100" align="center">
          <template slot-scope="scope">
            <div>{{formatDuration(scope.row.duration)}}</div>
          </template>
        </el-table-column>

        <el-table-column label="当前数据" align="center">
          <template slot-scope="scope">
            <div class="video-total">
              <div class="played iconGroup">
                <svg-icon icon-class="play-circle" class="icon"></svg-icon>
                <span class="played-num nums">{{formatNums(getCurrentTimeData(scope.$index)['played'])}}</span>
              </div>
              <div class="likes iconGroup">
                <svg-icon icon-class="heart" class="icon"></svg-icon>
                <span class="likes-num nums">{{formatNums(getCurrentTimeData(scope.$index)['likes'])}}</span>
              </div>
              <div class="comment iconGroup">
                <svg-icon icon-class="comment" class="icon"></svg-icon>
                <span class="comment-num nums">{{formatNums(getCurrentTimeData(scope.$index)['comment'])}}</span>
              </div>
              <div class="share iconGroup">
                <svg-icon icon-class="share" class="icon"></svg-icon>
                <span class="share-num nums">{{formatNums(getCurrentTimeData(scope.$index)['share'])}}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column type="expand" align="center" label="时间轴" width="100">
          <template slot-scope="scope">
            <div class="timeline-container">
              <el-timeline>
                <el-timeline-item
                  :timestamp="scope.row.createTime"
                  size="large"
                  color="#0bbd87">
                  <div style="font-size: 16px; font-weight: bold;">视频发布</div>
                </el-timeline-item>
                <el-timeline-item
                  v-for="(currentTimeData, currentTime, index) in scope.row.dailyData"
                  :key="index"
                  :timestamp="currentTime">
                  <div class="video-total">
                    <div class="played iconGroup">
                      <svg-icon icon-class="play-circle" class="icon"></svg-icon>
                      <span class="played-num nums">{{formatNums(currentTimeData['played'])}}</span>
                    </div>
                    <div class="likes iconGroup">
                      <svg-icon icon-class="heart" class="icon"></svg-icon>
                      <span class="likes-num nums">{{formatNums(currentTimeData['likes'])}}</span>
                    </div>
                    <div class="comment iconGroup">
                      <svg-icon icon-class="comment" class="icon"></svg-icon>
                      <span class="comment-num nums">{{formatNums(currentTimeData['comment'])}}</span>
                    </div>
                    <div class="share iconGroup">
                      <svg-icon icon-class="share" class="icon"></svg-icon>
                      <span class="share-num nums">{{formatNums(currentTimeData['share'])}}</span>
                    </div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <el-button icon="el-icon-plus" size="small" class="addBtn" @click="handleCreateDaily(scope.row.videoID)" plain>添加</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)" style="margin-right: 10px">编辑</el-button>
            <template>
              <el-popconfirm title="确定删除该条视频吗？" icon="el-icon-warning" icon-color="red" @onConfirm="deleteVideo(scope.$index, scope.row)">
                <el-button size="mini" type="danger" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="视频信息" :visible.sync="videoDialogVisible" @closed="videoDialogClose">
        <el-form ref="videoForm" :model="videoForm" :rules="videoRules" label-width="130px" label-position="left">
          <el-form-item label="发布时间" prop="createTime" required>
            <el-date-picker
              v-model="videoForm.createTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="视频标题" prop="title" required>
            <el-input v-model="videoForm.title"></el-input>
          </el-form-item>
          <el-form-item label="视频链接" prop="url" required>
            <label slot="label">
              视频链接
              <el-tooltip class="item" effect="dark" placement="bottom-start">
                <div slot="content">
                  格式必须为：https://www.tiktok.com/@account/video/videoID
                  <br/>
                  示例：https://www.tiktok.com/@lingodeer.app/video/6959546172788804870
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </label>
            <el-input v-model="videoForm.url"></el-input>
          </el-form-item>
          <el-form-item label="视频时长(单位:s)" prop="duration" required>
            <el-input v-model.number="videoForm.duration"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="videoDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="createVideo" v-if="dialogMode === 'create'">确 定</el-button>
          <el-button type="success" :loading="btnLoading" @click="editVideo" v-if="dialogMode === 'edit'">保 存</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加时间&数据" :visible.sync="dailyDialogVisible" width="500px" @closed="dailyDialogClose">
        <el-form ref="dailyForm" :model="dailyForm" :rules="dailyRules" label-width="80px">
          <el-form-item label="时间" prop="currentDate" required>
            <el-date-picker
              v-model="dailyForm.currentDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="播放" prop="played" required>
            <el-input v-model.number="dailyForm.played"></el-input>
          </el-form-item>
          <el-form-item label="点赞" prop="likes" required>
            <el-input v-model.number="dailyForm.likes"></el-input>
          </el-form-item>
          <el-form-item label="评论" prop="comment" required>
            <el-input v-model.number="dailyForm.comment"></el-input>
          </el-form-item>
          <el-form-item label="分享" prop="share" required>
            <el-input v-model.number="dailyForm.share"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dailyDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="createDaily">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { formatDuration, formatNums } from '@/utils'
  import { mapGetters } from 'vuex'
  import { getVideos, createVideo, updateVideo, deleteVideo } from '@/api/video'
  import { createDailyVideo } from '@/api/daily'

  const DefaultDailyData = {
    "played" : 0,
    "likes" : 0,
    "comment" : 0,
    "share" : 0
  }

  export default {
    name: 'VideoManage',
    data() {
      let urlValidate = (rule, value, callback) => {
        let reg = /^https:\/\/www.tiktok.com\/@[A-Za-z0-9.-_]+\/video\/[0-9]+$/;
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('url格式错误'))
        }
      };
      return {
        currentAccount: '账号选择',
        tableLoading: false,
        videoDialogVisible: false,
        dailyDialogVisible: false,
        btnLoading: false,
        dialogMode: 'create',
        videoID: '',
        videoForm: {
          title: '',
          createTime: '',
          url: '',
          duration: 0
        },
        dailyForm: {
          currentDate: '',
          played : 0,
          likes : 0,
          comment : 0,
          share : 0
        },
        videoRules: {
          title: [{ required: true, trigger: 'blur', message: '该字段不能为空' }],
          createTime: [{ required: true, trigger: 'blur', message: '该字段不能为空' }],
          url: [
            { required: true, trigger: 'blur', message: '该字段不能为空' },
            { type: 'url', trigger: 'blur', message: '请输入正确的url' },
            { validator: urlValidate, trigger: 'blur' }],
          duration: [
            { required: true, trigger: 'blur', message: '该字段不能为空' },
            { type: 'number', trigger: 'blur', message: '请输入数字类型' }]
        },
        dailyRules: {
          currentDate: [{required: true, trigger: 'blur', message: '该字段不能为空'}]
        },
        videosData: [], // 表格Data
        videosInfoList: [] // 后台Data
      }
    },
    async created() {
      this.tableLoading = true;
      try {
        await this.$store.dispatch('account/getAccountsInfo', this.name);
        let firstAccount = Object.keys(this.accountsInfoList[0])[0];
        this.currentAccount = firstAccount;
        this.tableLoading = false;
      } catch (error) {
        this.$message.error('初始化失败，请先添加账号')
        this.tableLoading = false;
      }
    },
    watch: {
      currentAccount: function(account) {
        this.updateVideoList(account);
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'accountsInfoList'
      ]),
    },
    methods: {
      initData() {
        let videosDataArr = [];
        if (this.videosInfoList.length > 0) {
          let videosInfoList = this.videosInfoList;
          for(let i = 0; i < videosInfoList.length; i++) {
            let videoInfo = videosInfoList[i];
            if (videoInfo) {
              let videoID = Object.keys(videoInfo)[0];
              let { title, createTime, duration, url, dailyData } = videoInfo[videoID];
              let videoData = { title, createTime, url, dailyData, duration, videoID };
              videosDataArr.push(videoData);
            }
          }
        }
        this.videosData = videosDataArr;
      },
      async updateVideoList(account) {
        this.tableLoading = true;
        let videosList = await getVideos({ account });
        this.videosInfoList = videosList;
        this.initData();
        this.tableLoading = false;
      },
      getSummaries(param) {
        let { columns, data } = param;
        let sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 2) {
            let durationTotal = 0;
            for (let i = 0; i < data.length; i ++) {
              let {duration} = data[i];
              if (duration) {
                durationTotal += duration;
              }
            }
            sums[index] = formatDuration(durationTotal);
            return;
          }
          if (index = 3) {
            let playedTotal = 0;
            let likesTotal = 0;
            let commentTotal = 0;
            let shareTotal = 0;
            for (let i = 0; i < data.length; i ++) {
              let {dailyData} = data[i];
              if (dailyData) {
                let dailyKeys = Object.keys(dailyData);
                let dailyKeysLength = dailyKeys.length;
                let lastDaily = dailyData[dailyKeys[dailyKeysLength - 1]];
                let { played, likes, comment, share } = lastDaily;
                playedTotal += played;
                likesTotal += likes;
                commentTotal += comment;
                shareTotal += share;
              }
            }
            sums[index] =
            <div class="video-total">
              <div class="played iconGroup">
                <svg-icon icon-class="play-circle" class="icon"></svg-icon>
                <span class="played-num nums">{formatNums(playedTotal)}</span>
              </div>
              <div class="likes iconGroup">
                <svg-icon icon-class="heart" class="icon"></svg-icon>
                <span class="likes-num nums">{formatNums(likesTotal)}</span>
              </div>
              <div class="comment iconGroup">
                <svg-icon icon-class="comment" class="icon"></svg-icon>
                <span class="comment-num nums">{formatNums(commentTotal)}</span>
              </div>
              <div class="share iconGroup">
                <svg-icon icon-class="share" class="icon"></svg-icon>
                <span class="share-num nums">{formatNums(shareTotal)}</span>
              </div>
            </div>;
            return;
          }
        });
        return sums;
      },
      formatDuration: duration => formatDuration(duration),
      formatNums: num => formatNums(num),
      changeAccount(account) {
        this.currentAccount = Object.keys(account)[0];
      },
      getCurrentTimeData(index) {
        let currentDailyData = this.videosData[index];
        let dailyData = currentDailyData.dailyData;
        if (dailyData) {
          let daysKey = Object.keys(dailyData);
          let lastDayKey = daysKey[daysKey.length - 1];
          return dailyData[lastDayKey];
        } else {
          return DefaultDailyData;
        }
      },
      videoDialogClose() {
        this.$refs.videoForm.clearValidate()
        this.$refs.videoForm.resetFields()
      },
      dailyDialogClose() {
        this.$refs.dailyForm.clearValidate()
        this.$refs.dailyForm.resetFields()
      },
      handleCreate() {
        this.dialogMode = 'create';
        this.videoDialogVisible = true;
      },
      createVideo() {
        this.$refs.videoForm.validate(async valid => {
          if (valid) {
            this.btnLoading = true;
            try {
              await createVideo(Object.assign({videoInfo: this.videoForm}, {account: this.currentAccount}));
              this.$message.success('创建成功');
              this.btnLoading = false;
              await this.updateVideoList(this.currentAccount);
            } catch (error) {
              this.btnLoading = false;
              throw(error)
            }
            let that = this;
            setTimeout(() => {
              that.videoDialogVisible = false;
            }, 500);
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleEdit(index, row) {
        let { title, url, duration, createTime, videoID } = row;
        this.videoID = videoID;
        this.videoForm = Object.assign({}, { title, url, duration, createTime });
        this.dialogMode = 'edit';
        this.videoDialogVisible = true;
      },
      editVideo() {
        this.$refs.videoForm.validate(async valid => {
          if (valid) {
            this.btnLoading = true;
            try {
              await updateVideo(Object.assign({videoID: this.videoID}, {videoInfo: this.videoForm, account: this.currentAccount}));
              this.$message.success('保存成功');
              this.btnLoading = false;
              await this.updateVideoList(this.currentAccount);
            } catch (error) {
              this.btnLoading = false;
              throw(error)
            }
            let that = this;
            setTimeout(() => {
              that.videoDialogVisible = false;
            }, 500);
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async deleteVideo(index, row) {
        let videoID = row.videoID;
        try {
          await deleteVideo({account: this.currentAccount, videoID});
          this.$message.success('删除成功');
          this.tableLoading = true;
          await this.updateVideoList(this.currentAccount);
          this.tableLoading = false;
        } catch (error) {
          throw(error)
        }
      },
      handleCreateDaily(videoID) {
        this.videoID = videoID;
        this.dailyDialogVisible = true;
      },
      createDaily() {
        this.$refs.dailyForm.validate(async valid => {
          if (valid) {
            this.btnLoading = true;
            try {
              await createDailyVideo(Object.assign({videoID: this.videoID}, {dailyInfo: this.dailyForm}));
              this.$message.success('添加成功');
              this.btnLoading = false;
              await this.updateVideoList(this.currentAccount);
            } catch (error) {
              this.btnLoading = false;
              throw(error)
            }
            let that = this;
            setTimeout(() => {
              that.dailyDialogVisible = false;
            }, 200);
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }

</script>

<style lang="scss" scoped>
  .videoManage {
    &-container {
      padding: 30px;

      .createVideo-icon,
      .createVideo-txt {
        vertical-align: middle;
      }

      .el-dropdown-link {
        font-weight: bold;
        cursor: pointer;
        color: #409EFF;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }

      .video-total {
        max-width: 400px;
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

      .addBtn {
        width: 100%;
        margin-top: 20px;
        border: 2px dashed #ddd;
        &:hover {
          border-color: #67c23a;
          color: #67c23a;
        }
      }

      .timeline-container {
        margin: 0 auto;
        padding-top: 3px;
        width: 50%;
        max-height: 260px;
        overflow: auto;
      }
    }
  }

</style>
