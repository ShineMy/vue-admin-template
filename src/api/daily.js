import request from '@/utils/request'

export function createDailyFans(data) {
  return request({
    url: '/createDailyFans',
    method: 'post',
    data
  })
}

export function createDailyVideo(data) {
  return request({
    url: '/createDailyVideo',
    method: 'post',
    data
  })
}