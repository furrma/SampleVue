/**
 * 指定した要素全てが配列に含まれているかどうかを判定します。
 * @param {*} arr
 * @param {*} target
 * @returns
 */
export default function includesAll (arr, target) {
  return target.every(t => arr.includes(t))
}
