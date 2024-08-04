<!--
 * @Author: sunxj
 * @Date: 2019-06-26 17:01:00
 * @LastEditTime: 2019-12-18 10:15:56
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 -->
<template>
    <m-page > 
        <!-- 非授信准入 -->
        <SyhResult v-if="code === '10020'" positionCode="noCredit" title="暂时不符合条件"   :subTitle="queryMsg" /> 
        <template v-else>
        <div v-if="currentData" class="message-mian">
            <div class="message__hd" :class="'message-ico_' + currentData.type"></div>
            <p class="message__bd">{{msg}}</p>
            <p v-if="desc" class="message__desc">{{desc}}</p>
            <m-button
                v-if="currentData.btnText"
                class="mt60"
                @click.native="goLink(currentData.link)">{{currentData.btnText}}</m-button>
        </div> 
        </template>
    </m-page>
</template>
<script>
import {
    getResult
} from 'src/store/modules/credit-system'
// import errorPage from '../common/error'
import { setHeader, resetHeader } from '../common/setHeader'
import { AXD, isSupportLocalStorage, appDownloadUrl, setLocalStorage } from 'libs/util'
import { basicCreditMixn } from '../common/mixins'
import SyhResult from '@/module/syh/common/result.vue'

export default {
    name: 'basicResult',
    mixins: [basicCreditMixn],
    components: { 
        SyhResult
    },
    data() {
        return {
            platform: this.$route.params.platform,
            creditOrderId: this.$route.query.creditOrderId,
            queryMsg: this.$route.query.msg,
            status: '',
            msg: '',
            desc: '',
            // currentData: null,
            error: false,
            code: this.$route.query.code, 
            amountUrl: `${window.location.origin}/pages/credit-system/amount`,
            currentTime: 0,
            timer: null,
            mark: '',
            loopCreditMark: 'credittanchuang',
            msgObj: {
                '10': {
                    type: 'wait'
                },
                '99': {
                    type: 'close',
                    btnText: '返回',
                    link: ''
                },
                // 风控提交成功 - 审核中
                '0': {
                    type: 'wait',
                    btnText: '返回',
                    link: ''
                },
                // 审核中
                '2': {
                    type: 'wait',
                    btnText: '返回',
                    link: ''
                },
                // msg = '提交成功，资料在审核中'
                // desc = '您的资料已提交，最长3个工作日可查看结果'

                // 驳回
                '4': {
                    type: 'reject',
                    btnText: '前往基础授信',
                    link: '/pages/credit-system/basic/aiyoumi'
                },
                // msg = '申请失败被驳回，请重新提交'
                // 授信驳回,联系人校验不通过
                '6': {
                    type: 'reject',
                    btnText: '前往基础授信',
                    link: '/pages/credit-system/basic/aiyoumi?resetItem=8'
                },
                // msg = '您所填写的联系人无效，请修改后提交'
                // 关闭
                '5': {
                    type: 'close',
                    btnText: '20000额度点击领取', // 跳转至随意花
                    link: 'cmsUrl'
                },
                // msg = '很抱歉，您当前的授信评估暂未通过，请于XX后再次申请'

                // 通过
                '3': {
                    type: 'pass',
                    btnText: '前往取现', // 跳转至产品列表页/pages/rrh/index；如3秒内用户无操作，默认跳转至产品列表页
                    link: 'goRrhUrl'
                }
                // msg = '恭喜您获得*元授信额度，前往取现GO'
            }
        }
    },
    computed: {
        currentData() {
            if (!this.status) {
                return null
            }
            return this.msgObj[this.status]
        },
        isSuning() {
            return this.platform === 'suning'
        }
    },
    // components: {
    //     errorPage
    // },
    watch: {
        currentTime(newVal) {
            this.msg = `请等待${newVal}秒`
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'setNativeRefreshEnable',
                    params: {
                        enable: false
                    },
                    callback: function(data) {}
                })
            }
        })
    },
    created() {
        this.init()
    },
    mounted() {
        setHeader({
            leftbuttonVisible: false
        })
    },
    methods: {
        init() {
            // 认证未完成，不需要重新提交，直接失败结果
            if (!this.creditOrderId) {
                this.status = '99'
                this.msg = this.queryMsg
                return
            }
            // 认证成功，有授信工单号，取授信结果
            this.status = '10'
            this.desc = '您的授信申请正在审核中，请耐心等待，暂时不要离开'
            this.countdown(5).then(({status = '99', loopCreditFlatform = '', msg = '', desc = ''}) => {
                this.status = status
                // status为7时跳转到‘学历信息认证页’
                if (this.status === '7') {
                    AXD.util.goEducation({
                        source: 'edu',
                        backUrl: encodeURIComponent(window.location.origin + '/pages/credit-system/result')
                    })
                    return
                }
                this.msg = msg
                this.desc = desc
                if(this.status === '3') {
                    setTimeout(() => {
                        window.location.replace(`${window.location.origin}/pages/rrh/index?mark=dtsx`)
                    }, 3000)
                }
                // if (loopCreditFlatform) {
                //     this.loopCredit(loopCreditFlatform)
                // }
            }).catch((res) => {
                this.$_toast(res.resultDes)
            })
        },
        countdown(totalTime) {
            this.currentTime = totalTime
            return new Promise((resolve) => {
                this.timer = setInterval(() => {
                    // 间隔2秒调用判断status为7时，关闭定时任务
                    if (this.currentTime % 2 === 0) {
                        this.getResultData().then(res => {
                            if (res.status === '7') {
                                clearInterval(this.timer)
                                resolve(res)
                            }
                        }, res => {})
                    }
                    this.currentTime -= 1
                    if (this.currentTime <= 0) {
                        clearInterval(this.timer)
                        this.getResultData().then(res => {
                            resolve(res)
                        }, res => {})
                    }
                }, 1000)
            })
        },
        getResultData() {
            return new Promise((resolve, reject) => {
                getResult({
                    creditOrderId: this.creditOrderId
                }).then(res => {
                    if (res.success) {
                        resolve(res.result)
                    } else {
                        reject(res)
                    }
                })
            })
        },
        // loopCredit(platform) {
        //     this.$createDialog({
        //         content: '您的资料不全，补充后最多可达5W额度',
        //         confirmBtn: '立即补充资料获得额度',
        //         onConfirm: () => {
        //             this.platform = platform
        //             this.mark = this.loopCreditMark
        //             setLocalStorage('amountUrl', this.amountUrl)
        //             this.goBasicCredit()
        //         }
        //     }).show()
        // },
        goLink(linkUrl) {
            // 跳转提额
            resetHeader()            
            //  审核失败跳转到指定URL
            if (linkUrl === 'cmsUrl') {
                // 爱又米APP应访问m域名，防止唤起召集令APP
                const origin = window.location.origin.replace('//app', '//m')
                const cmsUrl = `${origin}/cms/renderPage?alias=jiekuan&mark=shouxinguanbi`
                window.location.replace(cmsUrl)
                return
            }
            // 前往取现
            if (linkUrl === 'goRrhUrl') {
                const rrhUrl = `${window.location.origin}/pages/rrh/index?mark=dtsx`
                window.location.replace(rrhUrl)
                return
            }

            if(linkUrl) {
                window.location.replace(linkUrl)
            } else if (isSupportLocalStorage() && localStorage.getItem('amountUrl')) {
                let url = decodeURIComponent(localStorage.getItem('amountUrl'))
                let sep = (url.indexOf('?') !== -1) ? '&' : '?'
                // 结果状态带回第三方
                url = `${url}${sep}status=${this.status}`
                window.location.replace(url)
            } else {
                if (this.isApp) {
                    axdApp.close()
                } else {
                    window.location.replace(appDownloadUrl)
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.message-mian {
    background-color: #fff;
    padding: px2rem(40);
    height: 100%;
}
.message__hd {
    margin: 0 auto;
    width: px2rem(140);
    height: px2rem(140);
    background-size: cover;
    background-repeat: no-repeat;
}

.message-ico_pass {
    background-image: url('../assets/images/pass.png');
}
.message-ico_wait {
    background-image: url('../assets/images/authing.png');
}
.message-ico_reject {
    background-image: url('../assets/images/reject.png');
}
.message-ico_close {
    background-image: url('../assets/images/close.png');
}
.message__bd {
    text-align: center;
    font-size: px2rem(36);
    // margin-bottom: px2rem(60);
}
.message__desc {
    font-size: $auiFontSizeLevel5;
    color: $auiTextColorAssistant;
    text-align: center;
}
.mt60 {
    margin-top: px2rem(60);
}

.mt80 {
    margin-top: px2rem(80);
}
</style>