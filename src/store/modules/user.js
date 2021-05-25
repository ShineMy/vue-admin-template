import { getPublicKey, login, regist, getInfo } from '@/api/user'
import { passwordEncrypt, getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import firebase from 'firebase/app'
import 'firebase/auth'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    roles: [],
    accounts: [],
    warning: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ACCOUNTS: (state, accounts) => {
    state.accounts = accounts
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_WARNING: (state, warning) => {
    state.warning = warning
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const publicKey = await getPublicKey()
    const passwordHash = passwordEncrypt(password, publicKey)
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: passwordHash }).then(response => {
        const { token } = response
        return firebase.auth().signInWithCustomToken(token)
      }).then(() => {
        return firebase.auth().currentUser.getIdToken()
      }).then((idToken) => {
        commit('SET_TOKEN', idToken)
        setToken(idToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user regist
  async regist({ commit }, userInfo) {
    const { username, password } = userInfo
    const publicKey = await getPublicKey()
    const passwordHash = passwordEncrypt(password, publicKey)
    return new Promise((resolve, reject) => {
      regist({ username: username.trim(), password: passwordHash }).then(response => {
        const { token } = response
        return firebase.auth().signInWithCustomToken(token)
      }).then(() => {
        return firebase.auth().currentUser.getIdToken()
      }).then((idToken) => {
        commit('SET_TOKEN', idToken)
        setToken(idToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, accounts, warning } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_ACCOUNTS', accounts)
        commit('SET_WARNING', warning)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

