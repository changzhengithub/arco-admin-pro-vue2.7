/**
 * 权限配置JSON表
 * @description 用来给每个角色分配权限，对应页面路由权限和操作权限
 * moduleList 为大模块列表，pageList对应着每个模块最后一层子路由的页面，
 * permList 为当前页面到顶层父级所有的权限列表，为了查找父级，显示父级。
 * operateList 为页面中的操作权限，通过判断让元素是否显示
 * 可以通过 v-page/v-permission指令或者$pagePer/$operatePer在js中判断
 * 此表可以是前端来保存，最好是后端来返回，前后端定义好此JSON表字段，后端根据角色动态返回，前端拿到渲染权限配置。
 * */

const permissionList = [
  {
    title: '组织架构',
    pageList: [
      {
        title: '角色管理',
        permList: [
          { title: '角色管理', perm: 'role' }
        ],
        isShow: true,
        isCheck: false,
        operateList: [
          {
            title: '角色管理',
            perm: 'role_per',
            isCheck: false,
            isShow: true
          }
        ]
      }
    ]
  },

  {
    title: '设置',
    pageList: [
      {
        title: '基础设置',
        permList: [
          { title: '基础设置', perm: 'setting_basic' },
          { title: '设置', perm: 'setting' }
        ],
        isShow: true,
        isCheck: false,
        operateList: []
      }
    ]
  },

  {
    title: '系统管理',
    pageList: [
      {
        title: '我的',
        permList: [
          { title: '我的', perm: 'mine' }
        ],
        isShow: true,
        isCheck: false,
        operateList: [
          {
            title: '个人信息',
            perm: 'mine_per',
            isCheck: false,
            isShow: true
          }
        ]
      }
    ]
  }
]

export default permissionList