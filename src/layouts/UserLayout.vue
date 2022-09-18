<template>
  <div class="user">
    <div class="user-container">
      <router-view />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { Message } from '@arco-design/web-vue'

export default defineComponent({
  name: 'UserLayout',
  components: {},
  setup() {
    const collapsed = ref(false)
    const onCollapse = () => {
      collapsed.value = !collapsed.value
    }
    return {
      collapsed,
      onCollapse,
      onClickMenuItem(key) {
        Message.info({ content: `You select ${key}`, showIcon: true })
      }
    }
  }
})
</script>
<style lang="less" scoped>
.basic {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  :deep(.arco-layout-sider) .logo {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    padding: 0 10px;
    overflow: hidden;

    // border-bottom: 1px solid #e8e8e8;
    box-shadow: 1px 1px 1px #ccc;
    transition: all 0.3s;
    img {
      width: 30px;
      height: 30px;
    }
    .logo-title {
      font-size: 16px;
      font-weight: 600;
      margin-left: 10px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  :deep(.arco-layout-header) {
    height: 64px;
    line-height: 64px;
    background: var(--color-bg-3);
  }

  .basic-layout {
    padding: 0 24px 24px 24px;
    // min-height: calc(100vh- 64px);
    background-color: #f2f2f2;

    :deep(.arco-layout-content) {
      width: 100%;
      min-height: 500px;
      padding: 24px;
      font-size: 14px;
      background-color: #fff;
    }
  }
}
</style>
