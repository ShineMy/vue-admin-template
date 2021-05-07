import { getAccountsInfo, createAccount } from '@/api/account'

const getDefaultState = () => {
  return {
    accountsInfoList: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_ACCOUNTSINFOLIST: (state, accountsInfoList) => {
    state.accountsInfoList = accountsInfoList
  }
}

const actions = {
  async getAccountsInfo({ commit }, username) {
    try {
      let accountsInfoList = await getAccountsInfo({username})
      commit('SET_ACCOUNTSINFOLIST', accountsInfoList)
    } catch (error) {
      throw(error);
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

