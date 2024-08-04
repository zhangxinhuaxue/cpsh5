import {
    getDecryptedPsw
} from 'libs/util'
import { getCookie } from 'src/libs/util'

const isPU = () => {
    let cookieStr = getCookie('partnerAuth')
    if (cookieStr) {
        let partnerAuth = JSON.parse(getDecryptedPsw(cookieStr))
        return partnerAuth.partnerInfo && partnerAuth.channel == 'pu'
    }
}

const isPUChanel = () => {
    let cookieStr = getCookie('partnerAuth')
    if (cookieStr) {
        let partnerAuth = JSON.parse(getDecryptedPsw(cookieStr))
        return partnerAuth.channel == 'pu'
    }
}

export { isPU, isPUChanel }
