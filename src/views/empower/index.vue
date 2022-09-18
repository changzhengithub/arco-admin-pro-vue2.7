<template>
  <div class="empower">
    <div class="empower-login">
      <div class="login-banner">
        <div class="banner-title">综合管理平台</div>
        <img src="@/assets/images/empower/login01.jpg" />
      </div>

      <div class="login-content">
        <div class="content-form">
          <div class="form-title">登录</div>
          <div class="form-tip">请使用您本人的账号密码登录</div>
          <div class="form-wrap">
            <div class="wrap-item">
              <icon-user class="item-icon" />
              <input v-model="username" type="text" placeholder="请输入账号" />
            </div>
            <div class="wrap-item">
              <icon-lock class="item-icon" />
              <input v-model="password" :type="pwdType ? 'password' : 'text'" placeholder="请输入密码" @keyup.enter="loginSubmit" />

              <icon-eye-invisible class="item-pwd" v-if="pwdType" @click="pwdType = !pwdType" />
              <icon-eye class="item-pwd" v-else @click="pwdType = !pwdType" />
            </div>
            <div class="wrap-forgot">
              <a-tooltip content="请联系管理员重置密码" position="right" mini>
                <span style="cursor: pointer">忘记密码？</span>
              </a-tooltip>
            </div>
            <div class="wrap-submit">
              <a-button type="primary" size="large" style="height: 40px" long :loading="submitLoad" @click="loginSubmit">登录</a-button>
            </div>
            <div class="wrap-no">
              <a-tooltip content="请联系管理员申请账号" position="top" mini>
                <span style="cursor: pointer">没有账号？</span>
              </a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, getCurrentInstance, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Empower',
  components: {},
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties

    const store = useStore()
    const router = useRouter()

    const state = reactive({
      username: '', // 用户名
      password: '', // 密码
      resetPwd: '', // 重置密码
      newPwd: '', // 确认密码
      isResetPwd: false, // 重置密码
      submitLoad: false, // 提交加载

      pwdType: true, // 密码类型
      resetPwdType: true,
      comfirmPwdType: true
    })

    // 登录
    const loginSubmit = () => {
      if (!state.username) {
        global.$message.warning('请输入账号！')
        return
      }
      if (!state.password) {
        global.$message.warning('请输入密码！')
        return
      }
      loginRequest(state.username, state.password)
    }

    // 登录请求
    const loginRequest = (username, password) => {
      const params = {
        username,
        password
      }
      state.submitLoad = true
      store.dispatch('Login', params)
        .then(res => {
          state.submitLoad = false
          if (res.code !== 200) {
            global.$notification.error({
              title: '错误',
              content: res.msg
            })
            return false
          }
          global.$message.success('登录成功!')
          // 跳转到首页
          router.push({ path: '/' })
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
      loginSubmit
    }
  }
})
</script>
<style lang="less" scoped>
.empower {
  position: relative;
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
  min-height: 100vh;
  background-color: rgb(69, 136, 250);
  // background: url('../../assets/images/login-bg.jpg') 0 0 no-repeat;
  // background-size: 100% 100%;

  .empower-login {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 9;
    height: 560px;
    transform: translate(-50%, -50%);
    .flex_vertical_center_horizontal_between();

    .login-banner {
      position: relative;
      width: 800px;
      height: 100%;
      margin-right: 35px;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

      .banner-title {
        position: absolute;
        top: 30px;
        left: 30px;
        z-index: 9;
        font-size: 30px;
        color: #fff;
        text-align: left;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 15px;
      }
    }

    .login-content {
      position: relative;
      width: 340px;
      height: 100%;
      border-radius: 15px;
      background-color: #fff;
      overflow: hidden;
      .content-form {
        position: absolute;
        top: 60px;
        left: 0;
        z-index: 9;
        width: 100%;
        // height: 400px;
        padding: 20px 25px;
        text-align: left;
        background-color: #fff;

        .form-title {
          font-size: 32px;
          color: #165dff;
          margin-bottom: 10px;
        }
        .form-tip {
          width: 100%;
          font-size: 16px;
          color: rgba(0, 0, 0, 0.5);
          margin-bottom: 20px;
        }
        .form-wrap {
          width: 100%;
          .wrap-item {
            .flex_vertical_center();
            width: 100%;
            height: 52px;
            padding: 15px 10px 0 5px;
            margin-bottom: 15px;
            border-bottom: 1px solid #ccc;

            .item-icon {
              font-size: 20px;
              color: #999;
            }
            .item-pwd {
              font-size: 16px;
              color: #999;
              cursor: pointer;
            }

            input {
              flex: 1;
              height: 100%;
              padding: 0 10px;
              border: none;
              outline: none;

              &::placeholder {
                color: #ccc;
                font-size: 14px;
              }
            }
            .verify-img {
              height: 100%;
              img {
                height: 100%;
              }
            }
          }
          .wrap-forgot {
            width: 100%;
            font-size: 14px;
            color: #165dff;
            text-align: left;
          }
          .wrap-submit {
            margin-top: 30px;
          }
          .wrap-no {
            width: 100%;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
            text-align: center;
            margin-top: 40px;
          }
        }
      }
    }
  }
}

/* 右滑动画 */
.slider-enter-active,
.slider-leave-active {
  transition: all 1s;
}
.slider-enter-from {
  transform: translateX(100%);
  opacity: 1;
}
.slider-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 左滑动画 */
.slidel-enter-active,
.slidel-leave-active {
  transition: all 1s;
}
.slidel-enter-from {
  transform: translateX(-100%);
  opacity: 1;
}
.slidel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
