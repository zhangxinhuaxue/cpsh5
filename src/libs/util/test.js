/*
 * @Author: xxxx
 * @Date: 2019-01-08 21:28:18
 * @LastEditTime: 2019-08-21 10:33:25
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 */
export const testTelphone = (value) => {
    let regPhone = /^1\d{10}$/
    return regPhone.test(value)
}
export const testPwd = (value) => {
    // let regPassword = /^[A-Za-z0-9]{8,16}$/
    let regPassword = /^(?=.*\d)(?=.*[A-Za-z]).{8,16}$/g
    return regPassword.test(value)
}
export const testNumPwd = (value) => {
    // 兼容原来6位密码的用户
    let regPassword = /^\d{6}$/g
    return regPassword.test(value)
}
export const testImgCode = (value) => {
    let regImgCode = /^[A-Za-z\d]{4}$/
    return regImgCode.test(value)
}

export const testVcode = (value) => {
    let regVcode = /^\d{6}$/
    return regVcode.test(value)
}

export const testIdNum = (value) => {
    let redIdNum = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return redIdNum.test(value)
}

export const testQQ = (value) => {
    let regQQ = /^[0-9]{5,15}$/
    return regQQ.test(value)
}
export const testEmail = (value) => {
    let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    return regEmail.test(value)
}
export const testChinese = (value) => {
    let regChinese = /^[\u4e00-\u9fa5]+$/
    return regChinese.test(value)
}
export const testName = (value) => {
    let regName = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,30}$/
    return regName.test(value)
}
