/**
 *
 * @author:      zhouqing
 * @dateTime:    2017-7-3 11:55:02
 * @description:
 */
/* global sessionStorage */
import { Dialog, Toast,Popup, Modal, Page, Tags, CellGroup, Cell, RadioGroup, Radio, Input, Button, Icon ,Picker} from '@fe/buss-ui'
import { getUA, isApp, resetHref, resetReplace } from 'src/libs/util'
import { accessLog } from 'src/libs/accessLog'
import hybridHeader from 'components/header/hybridheader.vue'
import skeleton from 'components/skeleton/index.vue'
const createSkeletonHTML = process.env.NODE_ENV !== 'production' ? require('draw-page-structure/evalDOM') : null

const createSkeleton = () =>
    createSkeletonHTML({
        background: '#ecf0f2',
        animation: 'opacity 1s linear infinite;',
        init: function() {
            let toTop = document.querySelector('.aui-navbar')
            if (toTop) {
                toTop.parentNode.removeChild(toTop)
            }
        }
    }).then((html) => {
        console.log(html.replace(/<style>.*?<\/style>/, ''))
    }).catch((e) => {
        console.error(e)
    })

const install = function(Vue, config = {}) {
    Vue.config.devtools = process.env.NODE_ENV !== 'production'
    Vue.prototype.isApp = isApp
    Vue.prototype.$_isCheck = getUA('appAuth') === 'y'
    Vue.prototype.log = accessLog
    Vue.prototype.resetHref = resetHref
    Vue.prototype.resetReplace = resetReplace
    // Vue.prototype.logUtil = accessLogUtil
    // Vue.config.debug = true
    Vue.prototype.entireSupport = true
    Vue.prototype.createSkeletonHTML = process.env.NODE_ENV !== 'production' ? createSkeleton : () => {}

    Vue.component('hybridHeader', hybridHeader)
    Vue.component('skeleton', skeleton)
    Vue.use(Dialog)
        .use(Toast)
        .use(Popup)
        .use(Modal)
        .use(Page)
        .use(Tags)
        .use(Button)
        .use(CellGroup)
        .use(Cell)
        .use(RadioGroup)
        .use(Radio)
        .use(Input)
        .use(Icon)
        .use(Picker)
}

export default install
export { install }
