/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  if (str.length === 0) {
    return '用户名不能为空'
  } else if (str.length < 5) {
    return '用户名至少5位'
  } else {
    return false
  }
}

export function validPassword(str) {
  if (str.length === 0) {
    return '密码不能为空'
  } else if (str.length < 6) {
    return '密码至少6位'
  } else {
    return false
  }
}
