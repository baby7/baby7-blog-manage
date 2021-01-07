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

export function setPassword(oldPassword, password, username) {
  return request({
    url: '/user/change/password?oldPassword=' + oldPassword + "&password=" + password + "&username=" + username,
    method: 'post'
  })
}

export function setInfo(name, avatar, username) {
  return request({
    url: '/user/change/info?name=' + name + "&avatar=" + avatar + "&username=" + username,
    method: 'post'
  })
}
