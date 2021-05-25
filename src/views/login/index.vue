<template>
  <div class="login-container">
    <div class="logo-container">
      <img class="logoImg" src="@/assets/common/headLogo.png" alt="logo-Lingodeer">
      <h1 class="logoTxt">TikTok Analytics</h1>
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ formTitle }}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item class="no-style">
        <el-link :underline="false" type="primary" @click="changeMode">{{ formLink }}</el-link>
        <el-checkbox v-model="loginForm.remember" class="remember">记住账号</el-checkbox>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ formBtn }}</el-button>

    </el-form>
    <div class="footer-container">
      <p class="footerTxt">Copyright © 2021 LingoDeer. All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import { validUsername, validPassword } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      const validResult = validUsername(value)
      if (validResult) {
        callback(new Error(validResult))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      const validResult = validPassword(value)
      if (validResult) {
        callback(new Error(validResult))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        remember: true
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      formTitle: '用户登录',
      formLink: '用户注册',
      formBtn: '登录',
      mode: 'login'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.getUsername()
  },
  methods: {
    getUsername() {
      const username = localStorage.getItem('username')
      if (username) {
        this.loginForm.username = username
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      if (this.loginForm.remember) {
        localStorage.setItem('username', this.loginForm.username)
      } else {
        localStorage.removeItem('username')
      }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const dispatchUrl = this.mode === 'login' ? 'user/login' : 'user/regist'
          this.loading = true
          this.$store.dispatch(dispatchUrl, this.loginForm).then(() => {
            this.$message.success('登录成功！')
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeMode() {
      this.$refs.loginForm.resetFields()
      if (this.mode === 'login') {
        this.mode = 'regist'
        this.formTitle = '用户注册'
        this.formLink = '用户登录'
        this.formBtn = '注册并登录'
      } else if (this.mode === 'regist') {
        this.mode = 'login'
        this.formTitle = '用户登录'
        this.formLink = '用户注册'
        this.formBtn = '登录'
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    &.no-style {
      border: unset;
      background: unset;
      border-radius: unset;
      color: unset;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  align-items: center;

  .logo-container {
    position: fixed;
    left: 10px;
    top: 10px;
    height: 40px;
    .logoImg {
      float: left;
      width: 40px;
    }
    .logoTxt {
      float: left;
      line-height: 50px;
      margin: 0;
      margin-left: 20px;
      color: #fff;
      font-size: 18px;
      font-family: fantasy;
      text-shadow: 0px 0px 8px #76a4dd;
    }
  }

  .footer-container {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 20px;
    .footerTxt {
      font-size: 14px;
      color: white;
      margin: 0;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 0 35px;
    margin: 0 auto;
    overflow: hidden;
  }

  .remember {
    float: right;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
