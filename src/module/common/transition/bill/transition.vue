<template>
    <div class="aui-page">
        <hybrid-header v-if="isApp" :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <result :status="status" :during="during" :polling="polling" type="换绑卡" :subDes="des" @timeout="timeoutHandler"></result>
        </div>
    </div>
</template>
<script>
import result from '../result.vue'
import {
    queryRepayChangeBank,
    sign
} from 'store/modules/rrh'
export default {
    name: 'billTransition',
    data() {
        return {
            loanId: '',
            bankCardId: '',
            during: 8,
            polling: 2000,
            des: '',
            status: 'waiting',
            interval: null,
            succTo: '',
            failTo: '',
            mark: this.$route.query.mark,
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
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        /**
         * 初始化
         */
        init() {
            let userOpInfo = JSON.parse(window.sessionStorage.getItem('userOpInfo'))
            if (userOpInfo) {
                this.loanId = userOpInfo.loanId
                this.oidBiz = userOpInfo.oidBiz
                this.bankCardId = userOpInfo.bankCardId
                this.succTo = userOpInfo.succTo
                this.failTo = userOpInfo.failTo
            }
            this.interval = setInterval(() => {
                this.queryResult()
            }, this.polling)
        },
        /**
         * 查询换绑卡结果
         */
        queryResult(type) {
            queryRepayChangeBank({
                loanId: this.loanId,
                bankCardId: this.bankCardId,
                showLoading: false
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    switch (result.bindStatus + '') {
                        case '1': // 成功
                            this.successHandler(() => {
                                if (result.payAgreement) {
                                    this.toSign({
                                        bankCard: result.bankCard,
                                        bankName: result.bankName,
                                        name: result.name,
                                        personCard: result.personCard,
                                        telphone: result.telphone,
                                        loanId: this.loanId,
                                        oidBiz: this.oidBiz
                                    })
                                } else {
                                    this.nextTo(this.succTo)
                                }
                            })
                            break
                        case '2': // 失败
                            this.failHandler('fail', '很抱歉，还款卡变更失败', () => {
                                this.nextTo(this.failTo)
                            })
                            break
                        case '3': // 处理中
                            if (type === 'timeout') {
                                this.status = 'timeout'
                                this.failHandler('timeout', '很抱歉，还款卡变更失败', () => {
                                    this.nextTo(this.failTo)
                                })
                            }
                            break
                        case '4': // 未绑卡
                            this.successHandler(() => {
                                if (result.bindUrl) {
                                    window.location.href = result.bindUrl
                                } else {
                                    this.nextTo(this.failTo)
                                }
                            })
                            break
                        default:
                            if (type === 'timeout') {
                                this.status = 'timeout'
                                this.failHandler('timeout', '很抱歉，还款卡变更失败', () => {
                                    this.nextTo(this.failTo, 'n')
                                })
                            }
                            break
                    }
                }
            })
        },
        /**
         * 成功以后的处理
         */
        successHandler(callback) {
            this.status = 'success'
            this.clearInterval()
            this.des = ''
            this.nextHandler(callback)
        },
        /**
         * 失败以后的处理逻辑
         */
        failHandler(status, des, callback) {
            this.status = status
            this.clearInterval()
            this.des = des || ''
            this.nextHandler(callback)
        },
        /**
         * 超时以后的处理逻辑
         */
        timeoutHandler() {
            clearInterval(this.interval)
            this.queryResult('timeout')
        },
        /**
         * 下一步操作
         */
        nextHandler(callback) {
            setTimeout(callback.bind(this), 2000)
        },
        /**
         * 清除 interval
         */
        clearInterval() {
            clearInterval(this.interval)
            this.during = 0
        },
        /**
         * 成功/失败以后跳转页面
         */
        nextTo(page) {
            let query = {
                mark: this.mark
            }
            if (page === 'rrhChangeCard') {
                query.loanId = this.loanId
                query.oidBiz = this.oidBiz
            }
            this.$router.replace({
                name: page,
                query: query
            })
        },
        /**
         * 换绑卡操作完成以后， 如果需要签约， 去签约
         */
        toSign(signInfo) {
            switch (this.oidBiz) {
                case '202061':
                    sign({
                        loanId: this.loanId,
                        productType: 'qdh',
                        showLoading: false,
                        bankCardId: this.bankCardId,
                        returnUrl: window.location.origin + '/pages/loan/transition?mark=1'
                    }).then(res => {
                        if (res.success) {
                            let result = res.result
                            if (result.url) {
                                window.sessionStorage.setItem('userOpInfo', JSON.stringify({
                                    loanId: this.loanId,
                                    oidBiz: this.oidBiz,
                                    type: 'sign',
                                    productType: 'qdh',
                                    succTo: 'rrhBill',
                                    failTo: 'rrhBankChange'
                                }))
                                window.location.href = result.url
                            } else {
                                this.nextTo(this.failTo)
                            }
                        } else {
                            this.nextTo(this.failTo)
                        }
                    })
                    break
                default:
                    window.sessionStorage.setItem('signInfo', JSON.stringify(signInfo))
                    this.$router.replace({
                        name: 'rrhSign'
                    })
                    break
            }
        }
    },
    components: {
        result
    }

}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-page {
    background-color: #ffffff;
}
</style>