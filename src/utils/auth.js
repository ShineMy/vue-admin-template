import Cookies from 'js-cookie'
import JSencrypt from 'jsencrypt'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function passwordEncrypt(password, publicKey) {
  const encrypt = new JSencrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(password)
}
