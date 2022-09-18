/**
 * @desc 权限路由
 * @desc 走导航的路由都在根路由/里，走BasicLayout基础布局
 * @desc 走导航的可以通过hidden来控制显示隐藏
 * @desc 不走导航的和根路由/放在同级，可以使用其他layout布局
 * @desc 不需要权限验证但需登录的在meta里设置isAuth为false
 * @desc 不需登录的放在基础路由里，并放在权限控制的whiteList白名单里
 * @desc */

import { shallowRef } from 'vue'
import { RouteView, BasicLayout } from '@/layouts'

// 登录
const Empower = () => import(/* webpackChunkName: 'empower' */ '@/views/empower')
const Exception = () => import(/* webpackChunkName: 'exception' */ '@/views/exception')
const Home = () => import(/* webpackChunkName: 'home' */ '@/views/home')
const Role = () => import(/* webpackChunkName: 'role' */ '@/views/role')
const SettingBasic = () => import(/* webpackChunkName: 'setting-basic' */ '@/views/setting-basic')
const Mine = () => import(/* webpackChunkName: 'mine' */ '@/views/mine')
const About = () => import(/* webpackChunkName: 'about' */ '@/views/about')
const Workbench = () => import(/* webpackChunkName: 'workbench' */ '@/views/workbench')

export const asyncRouterMap = [
  {
    path: '/',
    name: 'Index',
    component: shallowRef(BasicLayout),
    hidden: false,
    children: [
      // 工作台
      {
        path: '/workbench',
        name: 'Workbench',
        component: Workbench,
        meta: { title: '工作台', icon: () => (<icon-idcard />), keepAlive: false, isAuth: false, permission: 'workbench' },
        hidden: false
      },
      // 角色管理
      {
        path: '/role',
        name: 'Role',
        component: Role,
        meta: { title: '角色管理', icon: () => (<icon-idcard />), keepAlive: false, isAuth: true, permission: 'role' },
        hidden: false
      },
      // 设置
      {
        path: '/setting',
        name: 'Setting',
        component: shallowRef(RouteView),
        meta: { title: '设置', icon: () => (<icon-settings />), keepAlive: false, isAuth: true, permission: 'setting' },
        hidden: false,
        children: [
          // 基础设置
          {
            path: '/setting/setting-basic',
            name: 'SettingBasic',
            component: SettingBasic,
            meta: { title: '基础设置', icon: () => (<icon-robot-add />), keepAlive: false, isAuth: true, permission: 'setting_basic' },
            hidden: false
          }
        ]
      }
    ]
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
    meta: { title: '我的', icon: '', keepAlive: false, isAuth: true, permission: 'mine' }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: '关于我们', icon: '', keepAlive: false, isAuth: false, permission: 'about' }
  }
]

// 基础路由
export const constantRouterMap = [
  {
    path: '/empower',
    name: 'Empower',
    component: Empower
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  // 异常处理
  {
    path: '/exception',
    name: 'Exception',
    component: Exception
  }
]