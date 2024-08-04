import 'libs/sentry'
import { isApp, appDownloadUrl, appVersion } from 'src/libs/util'
import { h5Origin, appOrigin, cashierOrigin, loginOrigin, creditServerOrigin } from 'src/libs/domain'

const isAppYN =  isApp? 'y' : "n"
const _appVersion = appVersion.replace(/\./g, '')
window.aixuedai = {
    "appDownloadUrl": appDownloadUrl,
    "returnUrl": appDownloadUrl,
    "isUavoApp":isAppYN,
    "webCashUrl": cashierOrigin,
    "appUrl": appOrigin,
    "isApp": isAppYN,
    "h5WebUrl": h5Origin,
    "authWebHost": loginOrigin,
    "appVersion": _appVersion,
    "apiGateway": creditServerOrigin,
    "userId": "",
    // 无效字段
    "activityWebH5": "",
    "microWebH5": "",
    "microWebService": "",
    "heizuWebUrl": ""
    // "applyTabUrl": "https://m.aiyoumi.com",
    // "alias": "",
    // "debug": "",
    // "staticUrl": "https://m-static.zhaojiling.com/build/activity/",
}