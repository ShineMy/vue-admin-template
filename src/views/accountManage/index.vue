<template>
  <div class="accountManage-container">
    <el-card class="box-card">
      <el-button type="primary" style="margin-bottom: 20px" @click="handleCreate">
        <svg-icon icon-class="add-account" class="add-account-icon" />
        <span class="add-account-txt">添加账号</span>
      </el-button>

      <el-table :data="accountsData" v-loading="tableLoading" border show-summary :summary-method="getSummaries" style="width: 100%">
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="账号"></el-table-column>
        <el-table-column prop="describe" label="简介"></el-table-column>
        <el-table-column label="粉丝" width="150">
          <template slot-scope="scope">
            <div>{{getCurrentFans(scope.row.fans)}}</div>
          </template>
        </el-table-column>
        
        <el-table-column type="expand" align="center" label="时间轴" width="100">
          <template slot-scope="scope">
            <div class="timeline-container">
              <el-timeline>
                <el-timeline-item
                  v-for="(currentFans, currentTime, index) in scope.row.fans"
                  :key="index"
                  :timestamp="currentTime"
                  type="primary"
                  size="large">
                  <div class="fans">粉丝数：{{currentFans}}</div>
                </el-timeline-item>
              </el-timeline>
            </div>
            <el-button icon="el-icon-plus" size="small" class="addBtn" @click="handleCreateDaily(scope.row.name)" plain>添加</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="videos" label="视频" width="150"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="handleEdit(scope.$index, scope.row)" style="margin-right: 10px">编辑</el-button>
            <template>
              <el-popconfirm title="确定删除该账号吗？" icon="el-icon-warning" icon-color="red" @onConfirm="deleteAccount(scope.$index, scope.row)">
                <el-button size="mini" type="danger" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="账号信息" :visible.sync="accountDialogVisible" @closed="dialogClose">
        <el-form ref="accountForm" :rules="accountRules" :model="accountForm" label-width="80px">
          <el-form-item label="账号名称" prop="name" required>
            <el-input v-model="accountForm.name" :disabled="nameDisabled"></el-input>
          </el-form-item>
          <el-form-item label="账号简介" prop="describe" required>
            <el-input v-model="accountForm.describe"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accountDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="createData" v-if="dialogMode === 'create'">确 定</el-button>
          <el-button type="success" :loading="btnLoading" @click="editData" v-if="dialogMode === 'edit'">保 存</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加时间&粉丝数" :visible.sync="dailyDialogVisible" width="500px" @closed="dailyDialogClose">
        <el-form ref="dailyForm" :model="dailyForm" :rules="dailyRules" label-width="80px">
          <el-form-item label="时间" prop="currentDate" required>
            <el-date-picker
              v-model="dailyForm.currentDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="粉丝" prop="fans" required>
            <el-input v-model.number="dailyForm.fans"></el-input>
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
  import { mapGetters } from 'vuex'
  import { createAccount, updateAccount, deleteAccount } from '@/api/account'
  import { createDailyFans } from '@/api/daily'

  export default {
    name: 'AccountManage',
    data() {
      return {
        accountsData: [],
        btnLoading: false,
        tableLoading: false,
        accountDialogVisible: false,
        dailyDialogVisible: false,
        dialogMode: 'create', // edit
        nameDisabled: false,
        currentAccount: '',
        accountForm: {
          name: '',
          describe: ''
        },
        dailyForm: {
          currentDate: '',
          fans: 0
        },
        accountRules: {
          name: [{ required: true, trigger: 'blur', message: '该字段不能为空' }],
          describe: [{ required: true, trigger: 'blur', message: '该字段不能为空' }]
        },
        dailyRules: {
          currentDate: [{required: true, trigger: 'blur', message: '该字段不能为空'}]
        }
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'accountsInfoList'
      ])
    },
    async created() {
      this.tableLoading = true;
      await this.$store.dispatch('account/getAccountsInfo', this.name);
      this.tableLoading = false;
    },
    watch: {
      accountsInfoList: function() {
        this.initData();
      }
    },
    methods: {
      initData() {
        if (this.accountsInfoList.length > 0) {
          let accountsInfoList = this.accountsInfoList;
          let accountsDataArr = [];
          for(let i = 0; i < accountsInfoList.length; i++) {
            let accountInfo = accountsInfoList[i];
            if (accountInfo) {
              let name = Object.keys(accountInfo)[0];
              let { describe, fans, videos = [] } = accountInfo[name];
              let accountData = { name, describe, fans, videos: videos.length || 0 };
              accountsDataArr.push(accountData);
            }
          }
          this.accountsData = accountsDataArr;
        }
      },
      getCurrentFans(fansObj) {
        if (fansObj) {
          let daysKey = Object.keys(fansObj);
          let lastDayKey = daysKey[daysKey.length - 1];
          return fansObj[lastDayKey];
        } else {
          return 0;
        }
      },
      getSummaries(param) {
        let { columns, data } = param;
        let sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 3) {
            let fansTotal = 0;
            for (let i = 0; i < data.length; i ++) {
              let {fans} = data[i];
              if (fans) {
                let fansKeys = Object.keys(fans);
                let fansKeysLength = fansKeys.length;
                let lastFans = fans[fansKeys[fansKeysLength - 1]];
                fansTotal += lastFans;
              }
            }
            sums[index] = fansTotal;
            return;
          }
          if (index = 5) {
            let videosTotal = 0;
            for (let i = 0; i < data.length; i ++) {
              let {videos} = data[i];
              if (videos) {
                videosTotal += videos;
              }
            }
            sums[index] = videosTotal;
            return;
          }
        });

        return sums;
      },
      dialogClose() {
        this.$refs.accountForm.clearValidate()
        this.$refs.accountForm.resetFields()
        this.nameDisabled = false
      },
      dailyDialogClose() {
        this.$refs.dailyForm.clearValidate()
        this.$refs.dailyForm.resetFields()
      },
      handleCreate() {
        this.dialogMode = 'create';
        this.accountDialogVisible = true;
      },
      createData() {
        this.$refs.accountForm.validate(async valid => {
          if (valid) {
            this.btnLoading = true;
            try {
              await createAccount(Object.assign(this.accountForm, {username: this.name}));
              this.$message.success('创建成功');
              this.tableLoading = true;
              await this.$store.dispatch('account/getAccountsInfo', this.name);
              this.tableLoading = false;
              this.btnLoading = false;
            } catch (error) {
              this.btnLoading = false;
              throw(error)
            }
            let that = this;
            setTimeout(() => {
              that.accountDialogVisible = false;
            }, 500);
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleEdit(index, row) {
        let { name, describe } = row;
        this.accountForm = Object.assign({}, { name, describe });
        this.dialogMode = 'edit';
        this.nameDisabled = true;
        this.accountDialogVisible = true;
      },
      editData() {
        this.$refs.accountForm.validate(async valid => {
          if (valid) {
            this.btnLoading = true;
            try {
              await updateAccount(this.accountForm);
              this.$message.success('保存成功');
              this.tableLoading = true;
              await this.$store.dispatch('account/getAccountsInfo', this.name);
              this.tableLoading = false;
              this.btnLoading = false;
            } catch (error) {
              this.btnLoading = false;
              throw(error)
            }
            let that = this;
            setTimeout(() => {
              that.accountDialogVisible = false;
            }, 500);
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      async deleteAccount(index, row) {
        let { name } = row;
        try {
          await deleteAccount({name, username: this.name});
          this.$message.success('删除成功');
          this.tableLoading = true;
          let that = this;
          setTimeout(() => {
            that.$store.dispatch('account/getAccountsInfo', that.name).then(function() {
              that.tableLoading = false;
            })
          }, 500);
        } catch (error) {
          throw(error)
        }
      },
      handleCreateDaily(name) {
        this.currentAccount = name;
        this.dailyDialogVisible = true;
      },
      createDaily() {
        this.$refs.dailyForm.validate(async valid => {
          if (valid) {
            this.btnLoading = true;
            try {
              await createDailyFans(Object.assign({account: this.currentAccount}, {dailyInfo: this.dailyForm}));
              this.$message.success('添加成功');
              this.tableLoading = true;
              await this.$store.dispatch('account/getAccountsInfo', this.name);
              this.tableLoading = false;
              this.btnLoading = false;
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
  .accountManage {
    &-container {
      padding: 30px;

      .add-account-icon,
      .add-account-txt {
        vertical-align: middle;
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
