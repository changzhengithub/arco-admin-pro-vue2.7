/**
 * @description 公共函数
 * @author changz
 * @import import { deepClone } from '@/utils/util'
 * 
 * */

/**
 * @description 深拷贝
 * @param {Any} [target] - 拷贝数据
 * @author changz
 * */
export function deepClone(target) {
  // 引用类型
  if (typeof target === 'object' && target !== null) {
    let targeClone = Array.isArray(target) ? [] : {}
    for (const key in target) {
      targeClone[key] = deepClone(target[key])
    }
    return targeClone
  } else {
    return target
  }
}