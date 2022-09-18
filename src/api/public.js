/**
 * @description 全局公共 Api
 * @author changz
 * */

import request from '@/utils/request'

const api = {
  updatePwd: '/api/user/updatePwd' // 修改密码
}

// 修改密码
export function updatePwdApi(parameter) {
  return request({
    url: api.updatePwd,
    method: 'post',
    data: parameter
  })
}