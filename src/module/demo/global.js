/* global sessionStorage */
import { entireSupport } from 'src/libs/util'

const install = function(Vue, config = {}) {
    Vue.config.devtools = process.env.NODE_ENV !== 'production'
    Vue.prototype.isApp = (aixuedai.isUavoApp === 'y')
    Vue.prototype.entireSupport = entireSupport
}

export {
    install
}
