import _ from 'lodash'
import store from '../../store/index'

/**
 * 権限に従ってメニューのvisible値をセットします
 * @param {}} menu
 * @returns
 */
export default function authorizeMenu (menu) {
  traverse(menu, checkPermissions)
  traverse(menu, checkNoChildren)
  return menu
}

/**
 * 権限に従ってメニューのvisible値をセットします
 * @param {*} menuItem
 * @returns
 */
function checkPermissions (menuItem) {
  if (!_.isPlainObject(menuItem)) {
    return
  }
  const requiredPermissions = menuItem.requiredPermissions || []
  const requireAll = menuItem.requireAll
  if (requireAll === false) {
    menuItem.visible = store.getters['auth/hasAtLeastOnePermission'](requiredPermissions)
  } else {
    menuItem.visible = store.getters['auth/hasPermissions'](requiredPermissions)
  }
}

/**
 * 子要素が全てvisible=falseの場合は親要素もvisible=falseにします
 * 子要素が0の配列が設定されてる場合は設定ミスの可能性があるため処理しません
 * @param {*} menuItem
 * @returns
 */
function checkNoChildren (menuItem) {
  if (!_.isPlainObject(menuItem) || !_.isArray(menuItem.items) || menuItem.items.length === 0) {
    return
  }
  if (menuItem.items.every(x => !x.visible)) {
    menuItem.visible = false
  }
}

/**
 * Objectツリーを再帰的に走査します
 * @param {*} o
 * @param {*} func
 */
function traverse (o, func) {
  for (var i in o) {
    func.apply(this, [o[i]])
    if (o[i] !== null && typeof (o[i]) === 'object') {
      traverse(o[i], func)
    }
  }
}
