<template>
  <a-modal :visible="true" title="权限配置" :width="800" title-align="start" :ok-loading="submitLoad" @ok="confirmAdd" @cancel="closeDialog" unmountOnClose>
    <a-tabs v-model:active-key="tabActiveKey">
      <a-tab-pane :title="item.title" v-for="(item, moduleIndex) in permissionList" :key="moduleIndex">
        <div class="permission-table">
          <div class="table-header">
            <div class="header-module">模块名称</div>
            <div class="header-control">权限控制</div>
          </div>
          <div class="table-body">
            <div class="body-row" v-for="(page, index) in item.pageList" :key="index">
              <div class="row-module ellipsis">
                <a-checkbox v-model="page.isCheck" :indeterminate="page.indeterminate" @change="value => pageCheck(value, moduleIndex, index)">{{ page.title }}</a-checkbox>
              </div>
              <div class="row-control">
                <a-space wrap v-if="page.operateList.length">
                  <a-checkbox v-model="operate.isCheck" v-for="(operate, i) in page.operateList" :key="i" @change="value => operateCheck(value, moduleIndex, index)">
                    {{ operate.title }}
                  </a-checkbox>
                </a-space>
                <a-tag v-else color="orange" :style="{ 'margin-bottom': '10px' }">无子权限</a-tag>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script>
/**
 * @description 权限配置
 * @author changz
 * */
import { defineComponent, onMounted, reactive, toRefs, getCurrentInstance } from 'vue'
import permissionList from '@/utils/permission.json'
// import storage from 'store'
// import mittBus from '@/utils/event-bus'

import { changePermApi } from '@/api/role'

export default defineComponent({
  name: 'SetPermission',
  components: {},
  props: {
    id: {
      type: [Number, String]
    },
    menu_perm: {
      type: Array
    },
    operate_perm: {
      type: Array
    }
  },
  emits: ['CLOSE_EVENT'],
  setup(props, { emit }) {
    const global = getCurrentInstance().appContext.config.globalProperties

    const state = reactive({
      // 权限列表全在permission.json.js中进行控制
      permissionList,
      tabActiveKey: 0,
      submitLoad: false // 提交中
    })

    onMounted(() => {
      getPermission()
    })

    const getPermission = () => {
      const { menu_perm, operate_perm } = toRefs(props)
      state.permissionList.forEach(item => {
        item.pageList.forEach(page => {
          const permList = page.permList.map(el => el.perm)
          if (menu_perm.value.includes(permList[0])) {
            page.isCheck = true
          } else {
            page.isCheck = false
          }
          if (page.operateList.length) {
            page.operateList.forEach(ele => {
              if (operate_perm.value.includes(ele.perm)) {
                ele.isCheck = true
              } else {
                ele.isCheck = false
              }
            })
          }
        })
      })
    }

    // 页面权限
    const pageCheck = (value, moduleIndex, index) => {
      state.permissionList[moduleIndex].pageList[index].operateList.forEach(item => {
        item.isCheck = value
      })
    }
    // 操作权限
    const operateCheck = (value, moduleIndex, index) => {
      const hasSelect = state.permissionList[moduleIndex].pageList[index].operateList.some(item => item.isCheck)
      if (hasSelect) state.permissionList[moduleIndex].pageList[index].isCheck = true
    }

    // 关闭对话框
    const closeDialog = () => {
      emit('CLOSE_EVENT')
    }

    // 确认保存
    const confirmAdd = () => {
      const menuPermList = []
      const operate_perm = []

      state.permissionList.forEach(item => {
        item.pageList.forEach(page => {
          if (page.isCheck) {
            const permList = page.permList.map(el => el.perm)
            // 获取所有页面权限
            menuPermList.push(...page.permList)
            // 获取所有操作权限
            const checkList = page.operateList.filter(i => i.isCheck)
            const operateList = checkList.map(i => {
              return {
                perm: i.perm,
                parent_perm: permList[0],
                title: i.title
              }
            })
            operate_perm.push(...operateList)
          }
        })
      })

      // 根据perm去重
      // 因为父级权限不在权限点控制内容，在permission.json中的permList进行了重复添加，
      // 所以获取的所有页面权限要去重
      const uniqueMap = new Map()
      const menu_perm = menuPermList.filter(item => !uniqueMap.has(item.perm) && uniqueMap.set(item.perm, 1))

      // console.log(menu_perm)
      // console.log(operate_perm)

      const params = {
        id: props.id,
        menu_perm,
        operate_perm
      }
      state.submitLoad = true
      changePermApi(params)
        .then(res => {
          state.submitLoad = false
          if (res.code !== 200) {
            global.$notification.error({
              title: '错误',
              content: res.msg
            })
            return
          }
          global.$message.success('操作成功')
          emit('CLOSE_EVENT', true)

          // 刷新左侧列表
          // mittBus.emit('REFRESH_MENU_EVENT')
        })
        .catch(err => {
          state.submitLoad = false
          global.$notification.error({
            title: '错误',
            content: err.message
          })
        })
    }

    return {
      ...toRefs(state),
      pageCheck,
      operateCheck,
      closeDialog,
      confirmAdd
    }
  }
})
</script>

<style lang="less" scoped>
.permission-table {
  width: 100%;
  border: 1px solid #ddd;
  .table-header {
    .flex_vertical_center();
    width: 100%;
    border-bottom: 1px solid #ddd;
    .header-module {
      position: relative;
      width: 20%;
      padding: 10px 20px 10px 25px;
      &::after {
        .position_vertical_center();
        right: 0;
        content: '';
        height: 20px;
        border-left: 1px solid #ddd;
      }
    }
    .header-control {
      width: 80%;
      padding: 10px 20px 10px 25px;
    }
  }
  .table-body {
    width: 100%;
    .body-row {
      .flex_vertical_center();
      width: 100%;
      border-bottom: 1px solid #ddd;
      &:last-of-type {
        border-bottom: none;
      }
      .row-module {
        position: relative;
        width: 20%;
        padding: 10px 20px;
        &::after {
          .position_vertical_center();
          right: 0;
          content: '';
          height: 20px;
          border-left: 1px solid #ddd;
        }
      }
      .row-control {
        width: 80%;
        padding: 15px 20px 5px 20px;
      }
    }
  }
}
</style>