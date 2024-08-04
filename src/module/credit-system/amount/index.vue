<!--
 * @Author: sunxj
 * @Date: 2019-08-13 15:29:02
 * @LastEditTime: 2019-12-10 11:32:57
 * @LastEditors: sunxj
 * @Description: 授信入口页
 -->
<template>
    <div>
        <!-- 普通提额 / 订单提额 -->
        <component :is="type" :config="amountConfig" @goAmountItem="goAmountItem"></component>
        <!-- <amount-error v-if="isError" :config="errorConfig"></amount-error> -->
        <!-- <m-errpage /> -->
    </div>
</template>
<script>
import { authOrigin } from 'src/libs/domain'
import { getStatus, getNeedDoCreditItem, getSocialResult, getGjjResult, creditIncrease } from 'src/store/modules/credit-system'
import { toCredit } from '../common/perCredit'
// import amountError from '../components/result'
import { getLocalUrl, setEnvCookie } from '../common/index'
import { AXD, setLocalStorage, appDownloadUrl, setCookie, isAndroid, removeLocalStorage } from 'src/libs/util'
import { setHeader, resetHeader } from '../common/setHeader'
import amountBase from './base.vue'
import amountOrder from './order.vue'
import { amountMixin, basicCreditMixn } from '../common/mixins'
import { parseQuery } from 'src/libs/util/util'

// window.amountGoBack = () => {
//     axdApp.send({
//         module: 'webview',
//         method: 'close'
//     })
// }

export default {
    name: 'credit-together',
    mixins: [amountMixin, basicCreditMixn],
    data() {
        let { creditBackUrl = '', platform = 'aiyoumi', creditItem = '', channel = ' ', version = '', env = '' } = this.$route.query
        return {
            creditBackUrl,
            platform,
            creditItem,
            channel,
            version,
            env,
            from: this.isApp ? (/android/gi.test(navigator.userAgent) ? 'android' : 'ios') : 'h5',
            amountConfig: {
                money: '0',
                quickList: [],
                dataList: [],
                taobaoIsFirst: false,
                accountIsNormal: true
            },
            isError: false,
            // query: this.$route.query,
            isOrder: channel === 'order',
            // isSuning: platform === 'suning',
            appUrl: aixuedai.appUrl.replace('aixuedai', 'aiyoumi'),
            type: '',
            mark: '',
            errorConfig: {
                type: 'type-reject',
                msg: '暂时无法提升额度，请继续关注'
            }
        }
    },
    computed: {
        isSuning() {
            return this.platform === 'suning'
        },
        authItem() {
            return {
                2: 8, // 银行卡
                3: 3, // 学信网
                4: 6, // 公积金
                5: 7, // 社保
                6: 4, // 运营商
                9: 9 // 淘宝
            }[this.creditItem]
        },
        uploadDeviceInfoEvent() {
            if (isAndroid) {
                return {
                    2: 'event_bankcard_raise',
                    3: 'event_education_raise',
                    4: 'event_provfund_raise',
                    5: 'event_socialsec_raise',
                    9: 'event_raise'
                }[this.creditItem]
            } else {
                return {
                    2: 'event_raise',
                    3: 'event_raise',
                    4: 'event_raise',
                    5: 'event_raise',
                    9: 'event_raise'
                }[this.creditItem]
            }
        }
    },
    components: {
        amountOrder,
        amountBase
        // mErrpage: Errpage
        // amountError
    },
    created() {
        // channel 存入cookie 基础授信和提交基础授信用
        setCookie('credit-channel', this.channel, 1)
        // 用户组那边要测试在不同测试环境，都使用阿里云1的网关
        setEnvCookie(this.env)
        this.init()
    },
    methods: {
        init() {
            let subObj = {
                version: this.version,
                channel: this.channel,
                platform: this.platform,
                creditItem: this.creditItem,
                from: this.from
            }
            removeLocalStorage('creditStatus')
            getStatus(subObj).then((res) => {
                if (res.success) {
                    let result = res.result
                    const item = result.item
                    if (item) {
                        switch(item) {
                            case 'reject':
                            case 'reopen':
                                this.resetReplace(`${window.location.origin}/pages/credit-system/basic/aiyoumi`)
                                break
                            case 'contact':
                                this.resetReplace(`${window.location.origin}/pages/credit-system/changeContacts`)
                                break
                            case 'close':
                                this.setClosedCredit(result)
                                this.resetReplace(`${window.location.origin}/pages/credit-system/closeGuide`)
                                break
                            case 'edu':
                                AXD.util.goEducation({
                                    source: 'edu',
                                    backUrl: encodeURIComponent(window.location.origin + '/pages/credit-system/result')
                                })
                                break
                            default:
                                // 走具体提额项
                                if (this.isApp) {
                                    this.goAmountItem(item)
                                    return
                                } else {
                                    if (item == '1') {
                                        this.goAmountItem(item)
                                        return
                                    }
                                }
                        }
                    }
                    // 展示聚合页
                    this.initAmount(result)
                    // this.setBack()
                } else {
                    let {code, resultDes} = res
                    if (code === '10002') {
                        AXD.util.login()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        initAmount(config) {
            this.type = this.isOrder ? 'amountOrder' : 'amountBase'
            Object.assign(this.amountConfig, config)
        },
        // setBack() {
        //     if (this.isApp) {
        //         // 设置提额页回退，跳转creditBackUrl 或 关闭当前webview
        //         setHeader({
        //             leftbuttonAction: 'amountGoBack'
        //         })
        //     }
        // },
        goAmountItem(item) {
            // 会员卡提额
            if(item==='vip'){
              const vipUrl = '/activity/activity-vipcard-2022?mark=amount'

            //   if(!this.amountConfig.userVip){
            //     this.resetHref(vipUrl)
            //     return
            //   }

            //   this.$_confirm({
            //     content: '您已是会员，需要继续领取会员额度吗？',
            //     confirmBtn:'去领取',
            //     onConfirm:()=>{
            //       this.resetHref(vipUrl)
            //     }
            //   })
            // 会员卡统-跳转至会员详情页处理
                this.resetHref(vipUrl)
                return
            }
            // 学历提额
            if (item === '3') {
                let backUrl = encodeURIComponent(window.location.origin + '/pages/credit-system/result')
                let source = 'eduIncr'
                this.log({ type: 'button-logic', name:'creditpage-button-increase', desc: '学历去提额按钮', extendData: `${authOrigin}/views/eduenter?source=${source}&backUrl=${backUrl}` })
                AXD.util.goEducation({
                    source,
                    backUrl
                }, false)
                setLocalStorage('amountUrl', getLocalUrl())
                return
            }
            // 公积金提额
            if (item === '4') {
                getGjjResult().then(res => {
                    if(res.success && res.result) {
                        this.log({ type: 'button-logic-link', name:'creditpage-button-accumulationfund', desc: '公积金去提额按钮', extendData: res.result })
                        resetHeader(() => {
                            window.location.href = res.result
                        })
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
                return
            }

            // 社保提额
            if (item === '5') {
                getSocialResult().then(res => {
                    if(res.success && res.result) {
                        this.log({ type: 'button-logic-link', name:'creditpage-button-raise', desc: '社保去提额按钮', extendData: res.result })
                        this.resetHref(res.result)
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
                return
            }

            // 补录提额
            if (item === '13') {
                let jumpUrl = '/pages/credit-system/upamount'
                let backUrl = encodeURIComponent(window.location.href)
                this.log({type: 'button-logic-link', name: 'creditpage-button-raise', desc: '补录去提额按钮', extendData: `${jumpUrl}?backUrl=${backUrl}`})
                this.$router.push({
                    path: jumpUrl,
                    query: {
                        backUrl
                    }
                })
                return
            }
            // 信用提额
            if (item === '15') {
                this.log({ type: 'button-logic', name:'creditpage-button-creditwithdrawal', desc: '信用提额按钮' })

                creditIncrease().then(res => {
                    if(res.success) {
                        this.init()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
                return
            }
            // 若为某一授信项，回调页面为creditBackUrl，授信流程中的跳转为结果页面
            let backUrl = (this.creditItem || item === '1') ? this.creditBackUrl : getLocalUrl()
            setLocalStorage('amountUrl', backUrl)
            this.creditItem = item
            // 上传通讯录
            // this.log({type: 'button-logic-link', name: 'creditpage-button-raise', desc: '点击去提额按钮', extendData: backUrl})
            // if (this.uploadDeviceInfoEvent && this.isApp) {
            //     let env = isAndroid ? 'Android' : 'IOS'
            //     this.getPhoneBook(env).then((res) => {
            //         if (res) {
            //             if (res.code == '-1999') {
            //                 return
            //             }
            //         }
            //         // 授信
            //         this.handleCreditItem(item)
            //     })
            //     return
            // }
            // 授信
            this.handleCreditItem(item)
        },
        handleCreditItem(item) {
            if (item === '1') { // 基础授信
                this.goBasicCredit()
                return
            }
        },
        /**
         * 是否需要上传通讯录
         *
         */
        // getPhoneBook(env) {
        //     return new Promise((resolve, reject) => {
        //         getNeedDoCreditItem({
        //             creditItem: '0',
        //             from: this.from,
        //             platform: this.platform
        //         }).then((res) => {
        //             if (res.success) {
        //                 let result = res.result
        //                 if (result && result.needDo) {
        //                     axdApp.send({
        //                         module: 'tools',
        //                         method: 'uploadDeviceInfo',
        //                         params: {
        //                             event: this.uploadDeviceInfoEvent
        //                         },
        //                         callback: (res) => {
        //                             resolve(res)
        //                         }
        //                     })
        //                     resolve()
        //                 } else {
        //                     resolve()
        //                 }
        //             } else {
        //                 this.$_toast(res.resultDes)
        //             }
        //         })
        //     })
        // },
        // 授信关闭的msg信息保存
        setClosedCredit(res = {}){
            const info  = {
                item: (res && res.item) || '',
                msg:  (res && res.msg) || '',
                tmp:Date.now()
            }
            setLocalStorage('creditStatus',JSON.stringify(info))
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
