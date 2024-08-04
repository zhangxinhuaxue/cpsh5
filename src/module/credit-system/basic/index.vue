<template>
    <m-page  v-if="result">
        <hybrid-header :config="barConfig" slot="header"></hybrid-header>

        <m-cell class="guide-tip">
            <div slot="title">
                <strong>还差一步</strong>
                <p>补充以下信息即可<b>获取额度</b></p>
            </div>
            <div slot="value" class="guide-img"></div>
        </m-cell>
        <auth-group :styleList="result.styleList" :resetItem="resetItem" :channel="result.channel" :ocrIsFirst="result.ocrIsFirst"  @goAuth="basicJump"></auth-group>
        <credit-contract :platform="platform" @changeChecked="changeChecked" :creditAuthContract="creditAuthContract"></credit-contract>
        <basic-footer :disabled="disabled" :checked="checked" :platform="platform" :cbBackUrl="cbBackUrl"></basic-footer>
    </m-page>
</template>
<script>
import { getUrl, getContractStatus } from 'src/store/modules/credit-system'
import { notice, getLocalUrl } from '../common/index'
import { authOrigin } from 'src/libs/domain'
import { AXD, appDownloadUrl, getCookie } from 'src/libs/util'
import authGroup from './blocks/auth-group.vue'
import creditContract from './blocks/credit-contract.vue'
import basicFooter from './blocks/footer.vue'
import { isApp } from 'src/libs/util'

window.closeWindow = () => {
    if(isApp && window.document.referrer.indexOf('auth')) {
        axdApp.send({
            module: 'webview',
            method: 'close'
        })
    } else {
        window.history.back()
    }
}

export default {
    name: 'credit-entry',
    data() {
        let { cbBackUrl, needNotice, authOrderId, resetItem } = this.$route.query
        let { platform = 'aiyoumi'  } = this.$route.params

        return {
            creditAuthContract: {
                tempSigned: true,
                tempNo: ''
            },
            needNotice,
            cbBackUrl,
            platform,
            authOrderId,
            // resetItem代表需要重新填写，进屋默认为空
            resetItem,
            from: this.isApp ? (/android/gi.test(navigator.userAgent) ? 'android' : 'ios') : 'h5',
            result: null,
            creditItem: '',
            checked: false,
            barConfig: {
                leftAction: 'closeWindow',
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: 'closeWindow'
                }
            }
        }
    },
    computed: {
        authItem() {
            return {
                1001: '1',
                10: '5',
                1002: '2',
                2: '8',
                3: '3',
                4: '6',
                5: '7',
                6: '4',
                7: 'creditBasicAddress',
                8: 'creditBasicContacts'
            }[this.creditItem]
        },
        isAllAuth() {
            if (!this.result) {
                return false
            }
            return this.result.styleList.every((item) => item.status === '1')
        },
        disabled() {
            return !this.isAllAuth || (this.isAllAuth && !this.checked)
        }
    },
    components: {
        authGroup,
        creditContract,
        basicFooter
    },
    mounted() {
        this.getContractStatus()
        // 需要通知
        if (this.needNotice) {
            this.goNotice()
        } else {
            this.init()
        }
    },
    methods: {
        getContractStatus() {
            getContractStatus({}).then((res) => {
                console.log(res.data)
                // 是否需要签约中互金协会征信授权书
                this.creditAuthContract = {
                    tempSigned: res.data.tempSigned,
                    tempNo: res.data.tempNo || ''
                }
            })
        },
        // code在app下
        init() {
            getUrl({
                backUrl: this.cbBackUrl,
                from: this.from,
                platform: this.platform,
                channel: getCookie('credit-channel')
            }).then((res) => {
                if (res.success) {
                    let result = res.result
                    let { step, channel, style } = result
                    // TODO: 服务端已写死style=card，后面相关flow的流程都可以删掉了
                    if (style === 'flow') {
                        this.log({type:'logic', name:'credit_init_flow', desc:'授信聚合页flow流程进入'})
                        this.creditItem = step
                        this.basicJump(step, channel, style)
                        return
                    }
                    this.result = result
                } else {
                    let code = res.code || ''
                    if (code === '10002') {
                        AXD.util.login()
                        return
                    }
                    this.$router.replace({
                        name: 'creditBasicCardResult',
                        params: {
                            platform: this.platform
                        },
                        query: {
                            msg: res.resultDes,
                            code
                        }
                    })
                }
            })
        },
        goNotice() {
            this.log({type: 'logic', name: 'credit_notice_need', desc: '授信聚合页需要通知认证结果'})
            if (this.authOrderId) {
            // 通知认证结果
                notice(this.authOrderId, (res) => {
                    if (res.success) {
                        this.init()
                    } else {
                        if (res.code === '-999') {
                            // 用户直接返回的情况
                            this.goBack()
                        } else {
                            this.$_toast(res.resultDes, () => {
                                this.goBack()
                            })
                        }
                    }
                })
            } else {
                this.goBack()
            }
        },
        basicJump(type, channel, style) {
            this.log({type:'logic', name:`credit_step_${type}`, desc:'授信业务流程选择'})
            this.creditItem = type
            // 1001：ocr 10:身份证照片补录 1002:刷脸 2:银行卡 3:学信网 4:公积金 5:社保 6:运营商验证 7:居住地址 8:联系人
            switch (type) {
                case '1001':
                case '10':
                case '1002':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    this.goUrl(this.authItem, channel)
                    break
                case '7':
                case '8':
                    this.goRouter(this.authItem, style)
                    break
                default:
                    this.goBack()
            }
        },
        goUrl(authItem, channel) {
            let backUrl = authItem === '2' ? getLocalUrl(['needNotice=1']) : getLocalUrl() // needNotice 是否回调请求通知
            let jumpUrl = `${authOrigin}/views/entry?backUrl=${backUrl}&channel=${channel}&authItem=${authItem}&reset=${this.resetItem===authItem ? 'true' : ''}`
            this.resetReplace(jumpUrl)
        },
        goRouter(name, style) {
            let type = (style === 'flow') ? 'replace' : 'push'
            this.$router[type]({
                name,
                query: {
                    backUrl: getLocalUrl(),
                    platform: this.platform,
                    reset: this.resetItem===this.creditItem ? 'true' : '',
                    style
                }
            })
        },
        goBack() {
            if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'close'
                })
            } else {
                window.location.replace(appDownloadUrl)
            }
        },
        changeChecked(val) {
            this.checked = val
        }
    },
    beforeRouteEnter(to, from, next) {
        document.title = '补充个人信息'
        next()
        // next(vm => {
        //     if (from.name === 'creditBasicAddress' || from.name === 'creditBasicContacts') {
        //         vm.init()
        //     }
        // })
    }
}
</script>

<style lang="scss" scoped>

.guide-tip {
    line-height: 1.8;
    font-size: px2rem(28);
    height: auto;
    padding: px2rem(32);
    color: #666666;
    strong {
        font-size: px2rem(46);
        color: #1A1A1A;
    }
    b{
        color: #1A1A1A;
        font-weight: bold;
    }
}
.guide-img {
    width: px2rem(210);
    height: px2rem(180);
    background: url('../assets/images/guide-back2.png') no-repeat right;
    background-size: contain;
}
</style>

