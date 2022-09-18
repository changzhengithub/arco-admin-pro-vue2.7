<template>
  <a-card :bordered="false">
    <a-table
      :columns="tableColumn"
      :loading="tableLoad"
      :data="tableData"
      :pagination="pagination"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <!-- 操作 -->
      <template #operate="{ record, index }">
        <a-link @click="openPermission(record)">配置权限</a-link>
        <a-popconfirm content="确认删除该角色吗?" @before-ok="done => delRole(done, index)">
          <a-link status="danger">删除</a-link>
        </a-popconfirm>
      </template>
    </a-table>
    <!-- 配置权限 start -->
    <SetPermission
      v-if="permissionDialog.visible"
      :id="permissionDialog.id"
      :menu_perm="permissionDialog.menu_perm"
      :operate_perm="permissionDialog.operate_perm"
      @CLOSE_EVENT="closePermission"
    ></SetPermission>
    <!-- 配置权限 end -->
  </a-card>
</template>

<script>
/**
 * @description 角色管理
 * @author changz
 * */

import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from 'vue'

import getPermisson from '@/composables/permission'

import SetPermission from './components/SetPermission'

import { roleListApi } from '@/api/role'

export default defineComponent({
  name: 'TheTable',
  components: {
    SetPermission
  },
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties
    const state = reactive({
      filterInfo: {
        query_type: 'normal',
        keyword: '', // 搜索词
        team_id: '', // 团队id
        role_id: '', // 角色里的用户id
        page: 1,
        limit: 10
      },
      tableLoad: false, // 加载中
      tableData: [
        {
          id: 101,
          name: '程序员',
          roleList: [],
          desc: '描述1',
          menu_perm: ['org', 'role'],
          operate_perm: []
        },
        {
          id: 102,
          name: '财务',
          roleList: [],
          desc: '描述2',
          menu_perm: ['org', 'role'],
          operate_perm: []
        },
        {
          id: 103,
          name: '会计',
          roleList: [],
          desc: '描述3',
          menu_perm: ['org', 'role'],
          operate_perm: []
        }
      ],
      tableColumn: [
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '描述',
          dataIndex: 'desc',
          width: 120
        },
        {
          title: '人员',
          dataIndex: 'roleList'
        },
        {
          title: '操作',
          slotName: 'operate',
          width: 150,
          align: 'center'
        }
      ],
      // 分页器
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        pageSizeOptions: [10, 20, 30, 40, 50],
        showTotal: true, // 显示总数
        showPageSize: true // 显示条数选择器
      },

      permissionDialog: {
        visible: false,
        id: '',
        menu_perm: [],
        operate_perm: []
      }
    })

    // 获取操作权限
    const { role_per, role_member_per } = getPermisson()

    onMounted(() => {
      // getUserList()
    })

    // 获取成员列表
    const getUserList = () => {
      if (!state.hasRole) return
      state.rowSelection.selectedRowKeys = []
      const { pageSize, current } = state.pagination
      state.filterInfo.page = current
      state.filterInfo.limit = pageSize
      const params = {
        ...state.filterInfo
      }
      state.tableLoad = true
      roleListApi(params)
        .then(res => {
          state.tableLoad = false
          if (res.code !== 200) {
            global.$notification.error({
              title: '错误',
              content: res.msg
            })
            return false
          }
          const data = res.data
          // console.log(data)
          state.tableData = data.list
          state.pagination.total = data.total
        })
        .catch(err => {
          state.tableLoad = false
          global.$notification.error({
            title: '错误',
            content: err.message
          })
        })
    }

    // 配置权限
    const openPermission = (record) => {
      const { id, menu_perm, operate_perm } = record
      state.permissionDialog.visible = true
      state.permissionDialog.menu_perm = id
      state.permissionDialog.menu_perm = menu_perm
      state.permissionDialog.operate_perm = operate_perm
    }
    const closePermission = refresh => {
      state.permissionDialog.visible = false
    }

    // 移除成员
    const delRole = (done, index) => {
      state.tableData.splice(index, 1)
      done()
    }

    // 分页
    const pageChange = page => {
      if (!state.hasRole) return
      state.pagination.current = page
      getUserList()
    }
    const pageSizeChange = pageSize => {
      if (!state.hasRole) return
      state.pagination.pageSize = pageSize
      getUserList()
    }


    return {
      ...toRefs(state),
      role_per,
      role_member_per,
      getUserList,

      openPermission,
      closePermission,

      delRole,
      pageChange,
      pageSizeChange
    }
  }
})
</script>

<style lang="less" scoped>
.role {
  width: 100%;
  background-color: #fff;
}
</style>