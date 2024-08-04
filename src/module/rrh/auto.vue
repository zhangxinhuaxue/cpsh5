<template>
    <div class="mui-page view">
        <!-- <hybrid-header :config="barConfig"></hybrid-header> -->
        <SyhResult v-if="isShowSyh" :isShowSyh.sync="isShowSyh" positionCode="auto" title="您暂不符合借款条件"  subTitle="已为您匹配成功如下借款产品，同时申请3个以上通过率99%" />
        <error v-else-if="errorInfo" :conf="errorInfo"></error>
        <!-- 借款弹窗 -->
        <com-popup :isPop="showAuth" class="auth-popup">
            <template slot="content">
                <authpopup :cycleId="cycleId"></authpopup>
            </template>
        </com-popup>
    </div>
</template>

<script>
import { AXD, isZjl, isMjb, setSessionStorage, isAym } from 'src/libs/util'
import { getCreditInfo, isExistPhoneBook, authFindCycle, isExistRepay, loanPassCardCheck } from 'store/modules/rrh'
import { newUserSupplement } from 'store/modules/userInfo'
import error from './common/error.vue'
import comPopup from 'components/popup/index'
import authpopup from 'src/module/rrh/authGuide/popuptwo.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('rrh')
import SyhResult from '@/module/syh/common/result.vue'
import { resetHeader } from 'components/header/resetHeader'

export default {
    name: 'rrhAuto',
    components:{
        comPopup,
        authpopup,
        error,
        SyhResult
    },
    data() {
        return {
            hasGoldenCard: 'n',
            isShowSyh:false,
            // 循环路由
            showAuth: false,
            // 循环路由传参
            cycleId: '',
            // 资产编号
            oidBiz: this.$route.query.oidBiz || '100000', // 100000是与服务端约定的固定值，链接没配置时用这个标识
            productName: this.$route.query.name,
            // 需要补录taskId
            suppTaskId: '',
            // 是否需要补充通讯录
            isSuppPhoneBook: false,
            // 所有错误信息
            errorContent: {},
            // 当前错误信息
            errorInfo: undefined,
            currentUrl: encodeURIComponent(window.location.href)
            // barConfig: {
            //     h5: {
            //         title: this.$route.query.name
            //     },
            //     app: {
            //         rightBtnShow: false,
            //         title: this.$route.query.name
            //     }
            // }
        }
    },
    created() {
        document.title = this.$route.query.name || ''
        this.getZjlApplyData().then(data => {
            if (data.success && data.result && data.result.blocks) {
                const { blocks } = data.result
                const filterConfigAym = blocks.find(e => e.title === 'filterConfig-aym')
                if(isAym && filterConfigAym) {
                    this.errorContent = JSON.parse(filterConfigAym.objList || '{}')
                } else {
                    // debugger
                    this.errorContent = JSON.parse(blocks.find(e => e.title === 'filterConfig').objList || '{}')
                }
                this.init()
            }
        })
    },
    methods: {
        ...mapActions(['getZjlApplyData']),
        init() {
            getCreditInfo({
                oidBiz: this.oidBiz
            }).then(res => {
                if (res.success) {
                    this.oidBiz = res.result.oidBiz
                    this.suppUserInfoCheck()
                } else {
                    this.log({type: 'logic', name: 'auto_code_'+res.code, desc: res.resultDes})
                    if (res.code === '-1999') { // 未登录
                        AXD.util.login()
                        return false
                    } else if (['2851000', '3006', '3007'].indexOf(res.code) > -1) { // 未实名认证/未授信/授信失败/授信关闭但是关闭时间已过
                        // 统一跳转到授信聚合页，在聚合页做逻辑判断跳转
                        AXD.util.goCredit({
                            creditBackUrl: this.currentUrl,
                            replace: true // 页面replace跳转防止返回空白页
                        })
                        return false
                    }
                    // 常用错误处理读配置信息
                    this.errorInfo = this.errorContent[res.code.toString()] || {}
                    this.errorInfo.content = this.errorInfo.content || res.resultDes
                    this.isShowSyh = true

                    if (res.code === '3001' || res.code === '3004') {
                        // 授信关闭或账户锁定7天内显示具体天数
                        this.errorInfo.content = res.resultDes
                        return false
                    }

                }
            })
        },
        goSuppInfo(taskId) {
            // 用户补充信息,加resetHeader解决线上js报错
            resetHeader(() => {
                AXD.util.goAuthGroup({
                    taskId,
                    callback: this.currentUrl,
                    replace: true
                })
            })
        },
        checkGoldCard() {
            loanPassCardCheck({oidBiz: this.oidBiz}).then(res => {
                if (res.success) {
                    this.hasGoldenCard = res.result.isNeedPassCard ? 'y' : 'n'
                    // 跳转权益购买页
                    if(res.result.isNeedPassCard){
                        if(res.result.rightStatus == '4'){
                            this.$createDialog({
                                type:'confirm',
                                content:'您的悦享权益已失效，您可重新购买权益进行借款申请',
                                confirmBtn:'购买权益',
                                cancelBtn:'联系客服',
                                onCancel:()=>{
                                    this.$router.replace({
                                        path:'/pages/help/contact'
                                    })
                                },
                                onConfirm:()=>{
                                    this.$router.replace({
                                        path: '/pages/rrh/rights',
                                        query: {
                                            oidBiz:this.oidBiz,
                                            name:this.productName,
                                            buyPackageId:res.result.buyPackageId,
                                            totalDiscountAmtWithRight:0,
                                            securityAmt:0,
                                            securityAmtWithRight:0,
                                            hasGoldenCard:'n',
                                            preNeedCard: 'y'
                                        }
                                    })
                                }
                            }).show()
                        }else{
                            this.$router.replace({
                                path:'/pages/rrh/rights',
                                query:{
                                    oidBiz:this.oidBiz,
                                    name:this.productName,
                                    buyPackageId:res.result.buyPackageId,
                                    totalDiscountAmtWithRight:0,
                                    securityAmt:0,
                                    securityAmtWithRight:0,
                                    hasGoldenCard:'n',
                                    preNeedCard: 'y'
                                }
                            })
                        }
                    }else{
                        // 跳转取现页
                        this.$router.replace({
                            name: 'rrhLoan',
                            query: {
                                oidBiz: this.oidBiz,
                                name: this.productName,
                                hasGoldenCard: this.hasGoldenCard,
                                overTime: res.result.endTime
                            }
                        })
                    }
                } else {
                    let tipmsg = ''
                    let url = ''
                    let btnTxt = ''
                    if (res.code === '1001') {
                        btnTxt = '去购买'
                        tipmsg = res.resultDes
                        // url = 'https://m.zhaojiling.com/cms/renderPage?alias=zcjk&mark=lbyyd'
                        url = window.location.origin.replace('//app', '//m') + '/cms/renderPage/?alias=zcjk&mark=lbyyd'
                        window.location.replace(url)
                        return false
                    }
                    else if (res.code === '1002') {
                        btnTxt = '查看订单'
                        tipmsg = res.resultDes || '您有一笔借款订单正在处理中，请等待放款后再申请接口'
                        url = '/pages/rrh/loanRecords' // 跳到取现列表页
                    }
                    else if (res.code === '1003') {
                        btnTxt = '查看订单'
                        tipmsg = res.resultDes || '您有一笔未完成的招财金卡订单，请完成支付后再申请借款'
                        url = '/pages/order/goods' // 跳到商品订单页
                    }
                    else if(res.code === '5005'){
                        this.$_toast({txt:res.resultDes,time:5000,callback:()=>{
                            this.$router.push('/pages/rrh/index')
                        }})
                        return false
                    }
                    else {
                        this.$_toast(res.resultDes)
                        return false
                    }

                    this.$createDialog({
                        type: 'confirm',
                        title: '',
                        content: tipmsg,
                        confirmBtn: {
                            text: btnTxt
                        },
                        onConfirm: () => {
                            // this.$router.push(url)
                            window.location.href = url
                        },
                        onCancel: () => {
                            this.$router.push('/pages/rrh/index')
                        }
                    }).show()
                }
            })
        },
        goLoan() {
            // 循环路由判断
            authFindCycle().then(res => {
                if (res.success && res.result.cycleId) {
                    this.cycleId = res.result.cycleId
                    this.showAuth = true
                    this.log({type: 'logic', name: 'auto_showCycleAuth', desc: '显示循环路由信息'})
                } else {
                    this.checkGoldCard()
                }
            })
        },

        // 是否需要补充信息检查
        suppUserInfoCheck() {
            newUserSupplement({
                oidBiz: this.oidBiz
            }).then(res => {
                if (res.success) {
                    if (res.result && res.result.taskId) {
                        // 需要补充信息
                        this.log({type: 'logic', name: 'auto_needSuppInfo', desc: '需要补充信息'})
                        this.goSuppInfo(res.result.taskId)
                    } else {
                        // 获取定位
                        this.checkNeedLocation().finally(() => {
                            this.goLoan()
                            // 判断是否需要补充通讯录
                            // isExistPhoneBook().then(res => {
                            //     if(res.success) {
                            //         this.goLoan()
                            //     } else {
                            //         this.goSuppPhoneBook(() => {
                            //             this.goLoan()
                            //         })
                            //     }
                            // })
                        })
                    }
                } else {
                    this.errorInfo = {
                        content: res.resultDes
                    }
                }
            })
        },
        // 补充用户通讯录，此方法暂时不用
        goSuppPhoneBook(callback) {
            // 开发环境不校验
            if(window.location.hostname.indexOf('dev.')>-1) {
                callback.call(this)
                return
            }
            let $this = this
            // 获取app版本， 4.4.5 版本及以上才能支持 contactCheck
            let supportContactCheck = isZjl || isMjb || aixuedai.appVersion >= 445
            if (this.isApp) {
                // 先获取权限，再上传用户通讯录
                if (supportContactCheck) {
                    $this.log({type: 'logic', name: 'supportContactCheck', desc: '可以调通讯录'})
                    axdApp.send({
                        module: 'permission',
                        method: 'contactCheck',  // 此方法安卓拟废弃
                        callback: function(ret) {
                            if (ret.data && ret.data.state === '1') {
                                // axdApp.send({
                                //     module: 'tools',
                                //     method: 'uploadDeviceInfo',
                                //     params: {
                                //         event: 'event_withdraw'
                                //     }
                                // })
                                callback.call(this)
                            } else if (ret.data && ret.data.action === 'setting') {
                                $this.log({type: 'logic', name: 'cash-bounced-go', desc: '去开启'})
                            } else if (ret.data && ret.data.action === 'cancel') {
                                $this.log({type: 'logic', name: 'cash-bounced-cancel', desc: '取消'})
                                callback.call(this)
                                $this.$_toast('由于业务升级，需要获取您的通讯录权限，开通通讯录权限可以极大的提高您的取现成功率')
                            }
                        }
                    })
                } else {
                    // 升级APP
                    $this.log({type: 'logic', name: 'unSupportContactCheck', desc: '不能调通讯录'})
                    axdApp.send({
                        module: 'appInfo',
                        method: 'forceUpdate',
                        params: {
                            tipMessage: '您的爱又米APP当前版本较低，不支持获取通讯录授权，请升级APP'
                        }
                    })
                }
            } else {
                window.location.href = aixuedai.appDownloadUrl || 'https://m.zhaojiling.com/activity/activity-download-main/index'
            }
        },
        checkNeedLocation() {
            const $this = this
            return new Promise((resolve, reject) => {
                if(this.isApp) {
                    isExistRepay().then(res => {
                        if (res.result === true) {
                            resolve()
                        } else {
                            AXD.util.getLocationInfo('取现获取定位').then(locationData => {
                                // window.sessionStorage.setItem('cashWithLocationReload', '1')
                                setSessionStorage('autoLocationInfo', locationData)
                                resolve(locationData)
                            }, err => {
                                reject()
                            })
                        }
                    })
                } else {
                    resolve()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
::v-deep .auth-popup .aui-popup_content {
    width: 75%;
    top: 50%;
    bottom: auto;
    margin: -50% auto 0;
    border-radius: 2px;
    z-index: 1000;
}
</style>
