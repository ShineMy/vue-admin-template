const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  accounts: state => state.user.accounts,

  accountsInfoList: state => state.account.accountsInfoList,

  permission_routes: state => state.permission.routes
}
export default getters
