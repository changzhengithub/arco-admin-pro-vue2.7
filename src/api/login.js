import request from '@/utils/request'

const api = {
  login: '/api/auth/login', // 登录
  logout: '/api/auth/logout', // 退出登录
  info: '/api/user/info' // 获取用户信息
}

// 登录
export function loginApi(parameter) {
  return request({
    url: api.login,
    method: 'post',
    data: parameter
  })
}

// 获取用户信息
export function infoApi(parameter) {
  return request({
    url: api.info,
    method: 'get',
    params: parameter
  })
}

// 退出登录
export function logoutApi(parameter) {
  return request({
    url: api.logout,
    method: 'get',
    params: parameter
  })
}