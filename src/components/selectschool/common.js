export function getData(el, name) {
    const prefix = 'data-'
    return el.getAttribute(prefix + name)
}
export const testChinese = (value) => {
    let regChinese = /^[\u4e00-\u9fa5]+$/
    return regChinese.test(value)
}
// 无痕模式下浏览, 直接使用本地存储会报错, 做一下测试
export function storageTest(storage) {
    let isStorage = Boolean(storage)
    if (isStorage) {
        try {
            storage.setItem('key', 'value')
            storage.removeItem('key')
            return true
        } catch (e) {
            return false
        }
    } else {
        return false
    }
}
