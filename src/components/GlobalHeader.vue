<template>
  <div class="global-header">
    <div class="header-left">
      <a-button shape="round" @click="toggleCollapse">
        <icon-menu-unfold v-if="collapsed" />
        <icon-menu-fold v-else />
      </a-button>
      <!-- <a-breadcrumb :style="{ marginLeft: '20px' }">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item>List</a-breadcrumb-item>
        <a-breadcrumb-item>App</a-breadcrumb-item>
      </a-breadcrumb> -->
    </div>
    <div class="header-right">
      <a-dropdown trigger="hover" position="br">
        <div class="right-info">
          <a-avatar :size="36">
            <img :src="userInfo.avatar" alt="头像" />
          </a-avatar>
          <div class="info-detail">
            <div class="detail-name">{{ userInfo.name }}</div>
            <div class="detail-unit" v-if="userInfo.organization_name">{{ userInfo.organization_name }}</div>
          </div>
        </div>
        <template #content>
          <a-doption v-if="userInfo.is_admin != 1" style="width: 110px" @click="openPersonalInfo">
            <template #icon>
              <icon-user />
            </template>
            个人信息
          </a-doption>
          <a-doption @click="modifyPwd">
            <template #icon>
              <icon-sync />
            </template>
            修改密码
          </a-doption>
          <a-doption @click="logoutSubmit">
            <template #icon>
              <icon-export />
            </template>
            退出登录
          </a-doption>
        </template>
      </a-dropdown>
    </div>

    <!-- 修改密码 -->
    <a-modal
      :visible="modifyPwdDialog.visible"
      title="修改密码"
      title-align="start"
      :width="500"
      :ok-loading="modifyPwdDialog.confirmLoad"
      @ok="confirmModifyPwd"
      @cancel="closeModifyPwd"
      unmountOnClose
    >
      <a-form ref="formRef" :model="pwdFormData" :rules="formRules" :label-col-props="{ span: 5 }" :wrapper-col-props="{ span: 18 }">
        <a-form-item field="old_pwd" label="旧密码">
          <a-input-password v-model="pwdFormData.old_pwd" placeholder="请输入旧密码" allow-clear />
        </a-form-item>
        <a-form-item field="new_pwd" label="新密码">
          <a-input-password v-model="pwdFormData.new_pwd" placeholder="请输入新密码" allow-clear />
        </a-form-item>
        <a-form-item field="confirm_pwd" label="确认密码">
          <a-input-password v-model="pwdFormData.confirm_pwd" placeholder="请输入确认密码" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, computed, reactive, toRefs, ref } from 'vue'
import storage from 'store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import { updatePwdApi } from '@/api/public'

export default defineComponent({
  name: 'GlobalHeader',
  emits: ['COLLAPSE_EVENT'],
  setup(props, context) {
    const global = getCurrentInstance().appContext.config.globalProperties
    const store = useStore()
    const router = useRouter()

    const formRef = ref(null)

    const state = reactive({
      userInfo: computed(() => store.state.info), // 个人信息
      collapsed: false, // 是否折叠
      memberDetail: {
        visible: false,
        id: ''
      },

      modifyPwdDialog: {
        visible: false,
        confirmLoad: false
      },
      pwdFormData: {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      },
      formRules: {
        old_pwd: [{ required: true, message: '请输入旧密码' }],
        new_pwd: [{ required: true, message: '请输入新密码' }],
        confirm_pwd: [{ required: true, message: '请输入确认密码' }]
      }
    })

    // 折叠展开导航栏
    const toggleCollapse = () => {
      state.collapsed = !state.collapsed
      context.emit('COLLAPSE_EVENT')
    }

    // 个人信息
    const openPersonalInfo = () => {
      router.push({
        name: 'Mine'
      })
    }

    // 修改密码
    const modifyPwd = () => {
      state.modifyPwdDialog.visible = true
      state.pwdFormData = {
        old_pwd: '',
        new_pwd: '',
        confirm_pwd: ''
      }
    }
    const closeModifyPwd = () => {
      state.modifyPwdDialog.visible = false
    }

    // 确认修改密码
    const confirmModifyPwd = () => {
      formRef.value.validate(errors => {
        if (!errors) {
          const { old_pwd, new_pwd, confirm_pwd } = state.pwdFormData
          if (new_pwd !== confirm_pwd) {
            global.$message.warning('两次密码必须一样!')
            return
          }
          const params = {
            old_pwd,
            new_pwd
          }
          state.modifyPwdDialog.confirmLoad = true
          updatePwdApi(params)
            .then(res => {
              if (res.code !== 200) {
                state.modifyPwdDialog.confirmLoad = false
                global.$notification.error({
                  title: '错误',
                  content: res.msg
                })
                return
              }
              global.$message.success('操作成功，请重新登录！')
              storage.clearAll()
              setTimeout(() => {
                window.location.href = '/'
              }, 500)
            })
            .catch(err => {
              state.modifyPwdDialog.confirmLoad = false
              global.$notification.error({
                title: '错误',
                content: err.message
              })
            })
        } else {
          const errInfo = Object.values(errors)
          errInfo.forEach((item, index) => {
            if (index === 0) global.$message.warning(item.message)
          })
        }
      })
    }

    // 退出登录
    const logoutSubmit = () => {
      global.$modal.warning({
        title: '提示',
        content: '确定要退出登录？',
        closable: true,
        onOk: () => {
          store
            .dispatch('Logout')
            .then((res) => {
              global.$message.success(res.message)
              setTimeout(() => {
                window.location.reload()
              }, 1000)
            })
            .catch((err) => {
              global.$notification.error({
                title: '错误',
                content: err.message
              })
            })
        }
      })
    }
    return {
      formRef,
      ...toRefs(state),
      openPersonalInfo,
      toggleCollapse,
      logoutSubmit,
      modifyPwd,
      closeModifyPwd,
      confirmModifyPwd
    }
  }
})
</script>

<style lang="less" scoped>
.global-header {
  .flex_vertical_center_horizontal_between();
  width: 100%;
  height: 100%;
  padding: 0 24px;

  .header-right {
    height: 100%;
    .right-info {
      height: 100%;
      .flex_vertical_center();

      .info-detail {
        .flex_direction_vertical_center();
        padding-left: 10px;
        text-align: left;
        cursor: pointer;
        .detail-name {
          height: 20px;
          line-height: 20px;
          margin-bottom: 2px;
          font-size: 14px;
          color: #333;
        }
        .detail-unit {
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          color: #999;
          // border: 1px solid #165DFF;
        }
      }
    }
  }
}
</style>