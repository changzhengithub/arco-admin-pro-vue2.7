import request from '@/utils/request'

const api = {
  roleList: '/api/role/list', // 角色列表
  roleSave: '/api/role/save', // 新增/修改角色
  roleDel: '/api/role/del', // 删除角色
  roleInfo: '/api/role/info', // 角色详情
  changeDefaultRole: '/api/role/changeDefaultRole', // 修改默认角色
  changeMember: '/api/role/changeMember', // 新增/移除成员
  changePerm: '/api/role/changePerm' // 修改角色权限
}

// 角色列表
export function roleListApi(parameter) {
  return request({
    url: api.roleList,
    method: 'get',
    params: parameter
  })
}

// 新增/修改角色
export function roleSaveApi(parameter) {
  return request({
    url: api.roleSave,
    method: 'post',
    data: parameter
  })
}

// 修改默认角色
export function changeDefaultRoleApi(parameter) {
  return request({
    url: api.changeDefaultRole,
    method: 'post',
    data: parameter
  })
}


// 删除角色
export function roleDelApi(parameter) {
  return request({
    url: api.roleDel,
    method: 'get',
    params: parameter
  })
}

// 角色详情
export function roleInfoApi(parameter) {
  return request({
    url: api.roleInfo,
    method: 'get',
    params: parameter
  })
}

// 新增/移除成员
export function changeMemberApi(parameter) {
  return request({
    url: api.changeMember,
    method: 'post',
    data: parameter
  })
}

// 修改角色权限
export function changePermApi(parameter) {
  return request({
    url: api.changePerm,
    method: 'post',
    data: parameter
  })
}