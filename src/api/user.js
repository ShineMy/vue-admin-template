import request from '@/utils/request'

export function getPublicKey() {
  return request({
    url: '/getPublicKey',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function regist(data) {
  return request({
    url: '/regist',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/getInfo',
    method: 'get',
    params: { token }
  })
}

export function getUserInfo(username) {
  return request({
    url: '/getUserInfo',
    method: 'get',
    params: { username }
  })
}

export function deleteWarning(data) {
  return request({
    url: '/deleteWarning',
    method: 'post',
    data
  })
}
