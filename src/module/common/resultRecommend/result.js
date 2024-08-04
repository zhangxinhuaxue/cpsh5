/**
 *
 * @author:      sunxj
 * @dateTime:    2017-07-20 16:26:14
 * @description:
 */
import Vue from 'vue'
import { getPayReusltConfig } from 'src/store/modules/trade/payResult'
import {
    renderDataForWhite
    // getPaymentIsWhite
} from 'store/modules/bill'
import auiMsg from 'src/module/common/msg/index.vue'
import resultRec from 'src/module/common/resultRecommend/rec.vue'
import lazyload from 'src/libs/lazyload'
// import lazyajax from 'src/libs/lazyajax'

Vue.use(lazyload)
// Vue.use(lazyajax)

let resultMixin = {
    name: '',
    data() {
        return {
            isWhite: false,
            isWhiteUrl: '',
            isWhiteBtn: '',
            showLoadding: false,
            config: {
                showInfo: true,
                display: false,
                // useHeight: true,
                // tradeId: '',
                recTitle: '',
                btn: {},
                h5Btn: {},
                share: {},
                isShowRecommend: 'y',
                templateId: [],
                popup: {},
                useHeight: false,
                fromPath: ''
            }
        }
    },
    methods: {
        getPayReusltConfig(params) {
            getPayReusltConfig(params).then(res => {
                // this.showLoadding = true
                if (!res.success) {
                    if (this.isGetPayInfo) {
                        this.initPayInfo()
                    }
                    return
                }
                const { type, params = {} } = res.result || {}
                if (type === '1' && params.oidBiz) {
                    // 招财金卡跳取现详情
                    this.$router.push({
                        name: 'rrhIndex'
                        // query: {
                        //     oidBiz: params.oidBiz
                        // }
                    })
                }
            })
        },
        getCmsData() {
            let params = {
                alias: 'BILL_WHITE',
                blockType: 'extend',
                blockName: 'billWhite',
                renderPlatform: this.isApp ? 'app' : 'h5',
                type: '/cms'
            }

            renderDataForWhite(params).then(res => {
                if (res.result && res.result.objList) {
                    /* 专享优惠数据, 弹窗数据, 活动数据 */
                    let resJson = JSON.parse(res.result.objList)
                    this.isWhiteUrl = resJson.returnUrl
                    this.isWhiteBtn = resJson.btn
                }
            })
        },
        marketInit(params) {
            this.getPayReusltConfig(params)
        }
    },
    components: {
        auiMsg,
        resultRec
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.config.fromPath = from.path
        })
    }
}

export { resultMixin }
