/**
 * @title 状态管理器入口
 * @description 入口状态管理器只管理登录和权限状态，其他分别另建，每个大模块只建一个文件
 * @author changz
 */

import { createStore } from 'vuex'
import storage from 'store'
// eslint-disable-next-line
import { loginApi, infoApi, logoutApi } from '@/api/login'
import { asyncRouterMap } from '@/router/router.config'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'

import permissionList from '@/utils/permission.json'

// vuex模块
import publicVuex from './modules/public'

export default createStore({
  state: {
    token: '', // token
    info: {}, // 用户信息
    permission: [], // 权限列表
    menu_perm: [], // 路由权限列表
    operate_perm: [], // 操作权限列表
    routerList: [] // 路由列表
  },
  mutations: {
    // 设置token
    setToken(state, token) {
      state.token = token
    },
    // 设置用户信息
    setInfo(state, info) {
      state.info = info
    },

    // 设置页面权限列表
    setMenuPerm(state, menu_perm) {
      state.menu_perm = menu_perm
    },
    // 设置操作权限列表
    setOperatePerm(state, operate_perm) {
      state.operate_perm = operate_perm
    },

    // 设置路由列表，匹配的所有路由
    setRouterList(state, routerList) {
      state.routerList = routerList
    }
  },
  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo).then(res => {
          const { token, userInfo } = res.data

          // 保存登录信息
          commit('setToken', token)
          commit('setInfo', userInfo)
          storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          storage.set(USER_INFO, userInfo)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        infoApi().then(res => {
          const data = res.data
          // 保存登录信息
          commit('setInfo', data)
          storage.set(USER_INFO, data)
          // 获取权限列表
          const { id, menu_perm, operate_perm } = data

          let menuList = []
          let operateList = []

          // 判断是否为超级管理员，默认显示全部路由
          if (id === 1) {
            menuList = getAllPermList()
            operateList = getAllOperateList()
          } else {
            menuList = menu_perm
            operateList = operate_perm
          }
          commit('setMenuPerm', menuList) // permission.js 判断如果没有权限列表就重新请求
          commit('setOperatePerm', operateList) // 设置操作权限

          if (menuList.length) {
            resolve(menuList)
          } else {
            reject(new Error('角色必须是非空数组!'))
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 根据权限列表过滤对应路由
    FilterRoutes({ commit }, res) {
      const { menu_perm } = res
      return new Promise((resolve, reject) => {
        const routerList = filterAsyncRouter(asyncRouterMap, menu_perm)
        // 判断根路由是否有子路由，重定向到第一个子路由
        redirectToChild(routerList)
        // console.log(routerList)
        if (routerList.length) {
          routerList.push({
            path: '/:catchAll(.*)',
            redirect: '/exception',
            hidden: true
          })
          commit('setRouterList', routerList)
          resolve()
        } else {
          reject(new Error('无法获取该用户角色，请重新登录!'))
        }
      })
    },

    // 登出
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        logoutApi().then(res => {
          commit('setToken', '')
          commit('setInfo', {})
          commit('setMenuPerm', [])
          commit('setOperatePerm', [])
          commit('setRouterList', [])
          storage.clearAll()
          resolve()
        }).catch(error => {
          commit('setToken', '')
          commit('setInfo', {})
          commit('setMenuPerm', [])
          commit('setOperatePerm', [])
          commit('setRouterList', [])
          storage.clearAll()
          reject(error)
        })
      })
    }
  },
  modules: {
    publicVuex
  }
})

/**
 * 根据权限列表过滤路由
 * */
function filterAsyncRouter(routerMap, menu_perm) {
  const routerList = routerMap.filter(route => {
    if (route.name === 'Index') return true
    if (route.meta && route.meta.permission) {
      const { isAuth, permission } = route.meta
      if (!isAuth || menu_perm.includes(permission)) {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, menu_perm)
          // 如果有子路由重定向到第一个
          if (route.children.length) route.redirect = route.children[0].path
        }
        return true
      }
    }
    return false
  })
  return routerList
}

/**
 * 获取到路由后自动重定向第一个子路由
 * */
function redirectToChild(routerList) {
  routerList.forEach(item => {
    if (item.children && item.children.length) {
      item.redirect = item.children[0].path
      redirectToChild(item.children)
    }
  })
}


/**
 * 获取所有权限列表
 * 根据permission.json权限配置JSON表获取
 * */
function getAllPermList() {
  const permList = []
  permissionList.forEach(item => {
    item.pageList.forEach(page => {
      permList.push(...page.permList)
    })
  })
  // 根据perm去重
  const uniqueMap = new Map()
  const permAllList = permList.filter(item => !uniqueMap.has(item.perm) && uniqueMap.set(item.perm, 1))
  const menu_perm = permAllList.map(item => item.perm)
  return menu_perm
}

/**
 * 获取所有操作权限列表
 * 根据permission.json权限配置JSON表获取
 * */
function getAllOperateList() {
  const operateList = []
  permissionList.forEach(item => {
    item.pageList.forEach(page => {
      operateList.push(...page.operateList)
    })
  })
  const operate_perm = operateList.map(item => item.perm)
  return operate_perm
}
