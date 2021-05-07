import request from '@/utils/request'

export function getAccountsInfo(data) {
  return request({
    url: '/getAccountsInfo',
    method: 'post',
    data
  })
}

export function createAccount(data) {
  return request({
    url: '/createAccount',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/updateAccount',
    method: 'post',
    data
  })
}

export function deleteAccount(data) {
  return request({
    url: '/deleteAccount',
    method: 'post',
    data
  })
}