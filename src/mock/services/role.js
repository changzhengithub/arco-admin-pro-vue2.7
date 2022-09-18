import Mock from 'mockjs'
import { builder, getBody } from '../util'

// 账号和密码
const username = ['admin', 'super']
const password = ['123456', 'admin']

const login = (options) => {
  const body = getBody(options)
  if (!username.includes(body.username) || !password.includes(body.password)) {
    return builder({ isLogin: true }, '账户或密码错误', 401)
  }

  const userInfo = {
    id: 1,
    name: Mock.mock('@name'),
    role: 1,
    username: 'admin',
    password: '',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    status: 1,
    telephone: '',
    lastLoginIp: '27.154.74.117',
    lastLoginTime: 1534837621348,
    creatorId: 'admin',
    createTime: 1497160610259,
    deleted: 0,
    roleId: 'admin',
    lang: 'zh-CN',
    menu_perm: [],
    operate_perm: []
  }

  return builder({
    userInfo,
    token: '4291d7da9005377ec9aec4a71ea837f'
  }, '', 200, { 'Custom-Header': Mock.mock('@guid') })
}

const logout = () => {
  return builder({}, '[测试接口] 注销成功', 200)
}

const info = () => {
  const userInfo = {
    id: 1,
    name: '超级管理员',
    role: 1,
    username: 'admin',
    password: '',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    status: 1,
    telephone: '',
    lastLoginIp: '27.154.74.117',
    lastLoginTime: 1534837621348,
    creatorId: 'admin',
    createTime: 1497160610259,
    merchantCode: 'TLif2btpzg079h15bk',
    deleted: 0,
    roleId: 'admin',
    menu_perm: [],
    operate_perm: []
  }

  return builder(userInfo, '获取用户信息', 200)
}

Mock.mock(/\/api\/auth\/login/, 'post', login)
Mock.mock(/\/api\/auth\/logout/, 'post', logout)
Mock.mock(/\/api\/user\/info/, 'get', info)