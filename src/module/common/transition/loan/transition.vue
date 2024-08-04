<template>
    <div class="aui-page">
        <hybrid-header v-if="isApp" :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <result :status="status" :during="during" :polling="polling" :type="op" :subDes="des" @timeout="timeoutHandler"></result>
        </div>
    </div>
</template>
<script>
import { isZjl } from 'src/libs/util'
import { querySign, reapyChangeBank } from 'store/modules/rrh'
import changeCardCheck from './changeCardCheck'
import changeCardTimeoutHandler from './changeCardTimeoutHandler'
import signTimeoutHandler from './signTimeoutHandler'
import hybridHeader from 'components/header/hybridheader.vue'
import result from '../result.vue'
export default {
    data() {
        return {
            type: 'openAccount',
            loanId: '',
            productType: '',
            status: 'waiting',
            during: 5,
            polling: 2000,
            des: '',
            interval: null,
            oidBiz: '',
            bankCardId: '',
            period: '',
            // 结果页之前是否经历第三方页面
            mark: this.$route.query.mark,
            // 成功以后跳转的页面
            succTo: '',
            // 失败以后跳转的页面
            failTo: '',
            barConfig: {
                action: '', // 右侧按钮点击事件， 必须是window变量
                leftAction: '',
                h5: {},
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: '',
                    leftbuttonVisible: false,
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#000000', // #ff00000颜色 showType=TEXT
                        text: '' // 展示文字内容 showType=TEXT
                    }
                }
            },
            changeFlag: ''
        }
    },
    mixins: [changeCardCheck, changeCardTimeoutHandler, signTimeoutHandler],
    components: {
        hybridHeader,
        result
    },
    computed: {
        op() {
            let des = ''
            switch (this.type) {
                case 'openAccount':
                    des = '开户'
                    break
                case 'changeCard':
                    des = '换绑卡'
                    break
                case 'sign':
                    des = '签约'
                    break
                default:
                    break
            }
            return des
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            let userOpInfo = JSON.parse(window.sessionStorage.getItem('userOpInfo'))
            if (userOpInfo) {
                this.type = userOpInfo.type
                this.loanId = userOpInfo.loanId
                this.productType = userOpInfo.productType
                this.during = userOpInfo.during || 8
                this.polling = userOpInfo.polling || 2000
                this.oidBiz = userOpInfo.oidBiz
                this.bankCardId = userOpInfo.bankCardId
                this.period = userOpInfo.period
                this.loanProvider = userOpInfo.loanProvider
                this.succTo = userOpInfo.succTo
                this.failTo = userOpInfo.failTo
                this.changeFlag = userOpInfo.changeFlag
            }
            switch (this.type) {
                case 'changeCard':
                    this.changeCardCheck()
                    break
                case 'sign':
                    this.signCheck()
                    break
                default:
                    break
            }
        },
        toPassword() {
            // 召集令取现外放用验证码，召集令APP内部调用用密码
            if (isZjl) {
                this.$router.replace({
                    name: 'commonPwdpage',
                    query: { source: 'rrh', id: this.loanId }
                })
            } else {
                this.$router.replace({
                    name: 'rrhVfCode',
                    query: {
                        key: 'wf',
                        id: this.loanId
                    }
                })
            }
        },
        // 绑卡
        bindCard() {
            reapyChangeBank({
                loanId: this.loanId,
                bankCardId: this.bankCardId
            }).then(res => {
                if (res.success && res.result.bindStatus === '1') {
                    this.$_toast('换绑卡成功', () => {
                        this.$router.back()
                    })
                } else {
                    let dialog = this.$createDialog({
                        content: res.resultDes,
                        confirmBtn: {
                            text: '我知道了'
                        },
                        onConfirm: () => {
                            dialog.hide()
                            this.$router.back()
                        }
                    }).show()
                }
            })
        },
        /**
         * 失败处理
         * @return {[type]} [description]
         */
        failNextHandler() {
            if (this.mark) {
                let query = {
                    mark: this.mark
                }
                if (this.failTo === 'rrhChangeCard') {
                    query.loanId = this.loanId
                    query.oidBiz = this.oidBiz
                }
                this.$router.replace({
                    name: this.failTo,
                    query: query
                })
            } else {
                this.$router.back()
            }
        },
        /**
         * 成功处理
         * @return {[type]} [description]
         */
        successHandler() {
            this.clearInterval()
            this.status = 'success'
            this.des = ''
        },
        /**
         * 失败处理
         * @return {[type]} [description]
         */
        failHandler(des) {
            this.clearInterval()
            this.status = 'fail'
            this.des = des || ''
        },
        /**
         * 超时处理
         * @return {[type]} [description]
         */
        timeoutHandler() {
            clearInterval(this.interval)
            switch (this.type) {
                case 'changeCard':
                    this.changeCardTimeoutHandler()
                    break
                case 'sign':
                    this.signTimeoutHandler()
                    break
                default:
                    break
            }
        },
        clearInterval() {
            clearInterval(this.interval)
            this.during = 0
        },
        /**
         * 下一步操作
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        nextOp(callback) {
            setTimeout(() => {
                callback.call(this)
            }, 2000)
        },
        nextTo(page) {
            if (this.mark) {
                this.$router.replace({
                    name: page
                })
            } else {
                this.$router.back()
            }
        },
        signCheck() {
            let des = this.failTo !== 'rrhIndex' ? '请稍候重试' : '请稍候重试或者选择其他产品'
            this.interval = setInterval(() => {
                querySign({
                    loanId: this.loanId,
                    showLoading: false,
                    bankCardId: this.bankCardId,
                    period: this.period,
                    changeFlag: this.changeFlag
                }).then(res => {
                    if (res.success) {
                        let result = res.result
                        if (result && result.status === '00') {
                            this.successHandler()
                            this.nextOp(() => {
                                if (this.succTo !== 'password' && !this.mark) {
                                    this.bindCard()
                                } else if(this.succTo==='password') {
                                    this.toPassword()
                                } else {
                                    this.$router.replace({
                                        name: this.succTo,
                                        query: {
                                            loanId: this.loanId,
                                            oidBiz: this.oidBiz,
                                            mark: this.mark
                                        }
                                    })
                                }
                            })
                        } else if (result && result.status === '99') {
                            this.clearInterval()
                            this.status = 'fail'
                            this.des = `签约失败，${des}`
                            this.nextOp(this.failNextHandler)
                        }
                    }
                })
            }, this.polling)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-page {
    background-color: #ffffff;
}
</style>
