/**
 * render.js
 * 函数式渲染组件
 * */
import { h } from 'vue'

// 动态渲染arco图标
export const arcoIcon = {
  render() {
    return h(this.icon)
  },
  props: {
    icon: {
      type: [Function, Object],
      required: true
    }
  }
}