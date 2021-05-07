import request from '@/utils/request'

export function getVideos(data) {
  return request({
    url: '/getVideos',
    method: 'post',
    data
  })
}

export function createVideo(data) {
  return request({
    url: '/createVideo',
    method: 'post',
    data
  })
}

export function updateVideo(data) {
  return request({
    url: '/updateVideo',
    method: 'post',
    data
  })
}

export function deleteVideo(data) {
  return request({
    url: '/deleteVideo',
    method: 'post',
    data
  })
}