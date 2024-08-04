import { cashierOrigin,h5Origin } from '../domain'
import { resetHeader } from '../../components/header/resetHeader'
export const appDownloadUrl = 'https://m.zhaojiling.com/activity/activity-download-main/index?appto=zjl%3A%2F%2F'
export const lovePay = cashierOrigin + '/h5cashier/index'
export const contractPath =  `${h5Origin}/h5/user/contract3.0/viewTemplate/`

export const resetHref = url => {
    resetHeader(() => {
        window.location.href = url
    })
}
export const resetReplace = url => {
    resetHeader(() => {
        window.location.replace(url)
    })
}