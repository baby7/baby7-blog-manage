import request from '@/router/axios'

export function login(obj) {
  return request({
    url: '/user/info/login',
    method: 'post',
    data: obj
  })
}

export function logout() {
  return request({
    url: '/user/change/logout',
    method: 'post'
  })
}

export function getInfo() {
  return request({
    url: '/user/change/info',
    method: 'get'
  })
}
