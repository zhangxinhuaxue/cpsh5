import qs from 'qs'
import { _get, _post, _getPromise, _postPromise, formatRet } from './base'
import { logServerOrigin } from 'src/libs/domain'

/* ================基础接口================= */
// 获取H5下载条内容
export const getDownLoad = (callback) => {
    return _get('/common/getH5DownloadText', null, callback)
}

// 发送短信验证码H5
export const sendCodeMsg = (param, callback) => {
    return _post('/common/sendCodeMsg', param, (data) => {
        callback(formatRet(data))
    })
}

// 校验短信验证码H5
export const checkSmsCode = (param, callback) => {
    return _post('/common/smsCode/check', param, (data) => {
        callback(formatRet(data))
    })
}

// 发送短信验证码APP
export const sendCodeMsgApp = (param, callback) => {
    return _post('/app/common/smsCode', param, (data) => {
        callback(formatRet(data))
    })
}

// 校验短信验证码APP
export const checkSmsCodeApp = (param, callback) => {
    return _post('/app/common/smsCode/check', param, (data) => {
        callback(formatRet(data))
    })
}

// 日志发送
export const log = (param, callback) => {
    return _post('https://m.aiyoumi.com/common/log/l.gif', param, (data) => {
        callback(formatRet(data))
    })
}

/* ================省市区接口================= */
export const getLocationFomApp = () => _getPromise('/app/sys/getLocation', null, { showLoading: false })

// 获取省
export const getProvinces = (callback) => {
    return _get('/common/provinces', null, (data) => {
        callback(formatRet(data))
    })
}

// 获取市
export const getCitys = (param, callback) => {
    return _get('/common/citys', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取区
export const getDistricts = (param, callback) => {
    return _get('/common/districts', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取街道
export const getStreets = (param, callback) => {
    return _get('/common/streets', param, (data) => {
        callback(formatRet(data))
    })
}

/* ================注册接口================= */

// 判断手机号是否存在
export const getCellphoneExists = (param, callback) => {
    return _get('/common/checkPhone', param, callback)
}

// 注册
export const reg = (param, callback) => {
    return _post('/common/reg', param, callback)
}

// 获取学校列表
export const getSchools = (param, callback) => {
    return _post('/common/schools', param, (data) => {
        callback(formatRet(data))
    })
}

// 判断用户卡是否存在
export const getUserCardExists = (param, callback) => {
    return _post('/mall/validateCard', param, callback)
}

// 生成短链接
export const getShortUrl = (param, callback) => {
    return _get('/common/getShortUrl', param, callback)
}

// 微信接口签名
export const wxSign = (param, callback) => {
    return _post('/common/wxSign', param, callback)
}

/* ================活动接口================= */

// 根据alias获取CMS全部数据
export const renderData = (param, callback) => {
    return _get(
        '/cms/renderData',
        {
            alias: param.alias
        },
        (data) => {
            callback(formatRet(data, '/cms/renderData'))
        }
    )
}

// Promise 根据alias获取CMS全部数据
export const renderDataCms = (param, showLoadingObj) => {
    return _postPromise('/cms/renderData', param, !showLoadingObj ? { showLoading: false } : showLoadingObj)
}

// 获取CMS模块的数据
export const renderDataForBlockType = (param, callback) => {
    return _get(param.type + '/renderDataForBlockType', param, (data) => {
        callback(formatRet(data, param.type + '/renderDataForBlockType'))
    })
}

/* ================类目页接口================= */

// 类目页接口测试
export const getCategoryList = (param, callback) => {
    return _get('/common/category', param, callback)
}

// 修改推荐码
export const commitInviteCode = (param, callback) => {
    let prefix = param.isApp ? '/app/user' : '/h5'
    return _post(prefix + '/updVCode', param, (data) => {
        callback(formatRet(data))
    })
}

// 获取推荐码
export const getInviteCodeInit = (param, callback) => {
    let prefix = param.isApp ? '/app/user' : '/h5'
    return _post(prefix + '/canUpdVCode', null, (data) => {
        callback(formatRet(data))
    })
}

// mycoupon
export const getCouponList = (param) => {
    // return _get('/coupon/couponList', param, (data) => {
    //     callback(formatRet(data))
    // })
    return _getPromise('/coupon/couponList', param, { showLoading: true })
}

// topProduct
export const topProduct = (param) => {
    return _getPromise('/plist/recommend', param, { showLoading: false })
}

export const getShareChannel = (param) => {
    return _getPromise('/shareChannel/getChannel', param, { showLoading: false })
}

// 旧手动埋点
export const saveAym = (param, callback) => {
    return _post('/aym', { param }, () => {
        callback && callback()
    })
}

// 新手动埋点支持app发送
export const accessLogRequest = (param, isNeedBack, showLoading) => {
    let url = logServerOrigin + '/access/log'
    if (navigator.sendBeacon && !isNeedBack) {
        const blob = new Blob([qs.stringify(param)], {
            type: 'application/x-www-form-urlencoded'
        })
        return navigator.sendBeacon(url, blob)
    } else {
        return _postPromise(url, param, { showLoading: showLoading })
    }
}

// 上传base64图片到服务器，返回图片链接地址
export const uploadBase64 = (param) => {
    let postUrl = window.aixuedai.isUavoApp === 'y' ? '/app/common/uploadBase64' : '/common/uploadBase64'
    return _postPromise(postUrl, param, { showLoading: true })
}

// 获取服务器时间
export const getSystime = (param) => {
    if (window.aixuedai.isUavoApp === 'y') {
        return _getPromise('/app/common/getNow', param)
    } else {
        return _getPromise('/common/getNow', param)
    }
}

const gatewayDomain = window.aixuedai.apiGateway + '/yuny'
// const gatewayDomain = ''
// 查询是否领取了浏览任务
export const checkByOutCode = (param) => {
    return _postPromise(gatewayDomain + '/score/task/checkByOutCode', param, { showLoading: true })
}

// 完成浏览任务
export const completeByOutCode = (param) => {
    return _postPromise(gatewayDomain + '/score/task/completeByOutCode', param, { showLoading: true })
}

// 此方法用于<<爱又米APP>>内的召集令业务登录
// 前后端分离-- nginx 转发到aiyoumi
export const aymZjlLogin = (param) => {
    return _getPromise('/login/h5/zhaojiling', param, { showLoading: false })
}