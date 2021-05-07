import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import firebase from 'firebase/app'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// firebase
const firebaseConfig = {
  apiKey: 'AIzaSyCVWKOg1oassmhyY4XvwxaH-DWd1hTUu7Q',
  authDomain: 'tiktok-analytics-lingodeer.firebaseapp.com',
  databaseURL: 'https://tiktok-analytics-lingodeer-default-rtdb.firebaseio.com',
  projectId: 'tiktok-analytics-lingodeer',
  storageBucket: 'tiktok-analytics-lingodeer.appspot.com',
  messagingSenderId: '595711197612',
  appId: '1:595711197612:web:3f4fd73523d9526b353a09'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
