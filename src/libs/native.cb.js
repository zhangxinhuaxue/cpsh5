// 登录回调
window.onAxdLogin = (uid, sign) => {
    if (uid != 'null') {
        axdApp.refresh()
    }
}

// 返回方法
window.back = (href) => {
    var getAxd = window.navigator.userAgent
    if (getAxd.indexOf('axd') > 0) {
        axdApp.back()
    } else {
        document.location.href = href
    }
}

// 认证
window.onAxdBasicInfoAdd = (status) => {
    if (status == 'success') {
        axdApp.refresh()
    } else if (status == 'cancel') {
        axdApp.close()
    }
}
