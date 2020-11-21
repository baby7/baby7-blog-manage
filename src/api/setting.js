import request from '@/router/axios'

export function getSetting() {
  return request({
    url: '/setting/info/get',
    method: 'get'
  })
}

export function getBlogger() {
  return request({
    url: '/setting/info/getBlogger',
    method: 'get'
  })
}

export function putSetting(obj) {
  return request({
    url: '/setting/change',
    method: 'put',
    data: obj
  })
}

export function setBlogger(obj) {
  return request({
    url: '/setting/change/setBlogger',
    method: 'post',
    data: obj
  })
}

export function getMetric() {
  return request({
    url: '/setting/change/getMetric',
    method: 'get'
  })
}
