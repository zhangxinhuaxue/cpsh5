<template>
<div class="aui-page">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div class="tipInfo">
            <div class="text text-type-1">申请提交成功</div>
            <div class="text text-type-2"><span class="symbol">￥</span>{{detail.amtLoan | formatMoneyK}}</div>
            <div class="text text-type-3">预计24小时内到账，请留意短信通知</div>
        </div>
        <m-button @click="clickBtn(cmsButton.btnone.url, cmsButton.btnone.text)">{{cmsButton.btnone.text || ''}}</m-button>
        <div class="btn2" @click="clickBtn(cmsButton.btntwo.url, cmsButton.btntwo.text)">{{cmsButton.btntwo.text || ''}}</div>
        <cms-banner :banners="cmsBanner" event-id="finish-button-banner"></cms-banner>
    </div>
</div>
</template>
<script>
import { isZjl, isAym, formatMoneyK } from 'src/libs/util'
import { getOrderDetail } from 'store/modules/rrh'
import { goHome } from '../common/utils'
import cmsBanner from 'components/banner/index.vue'
import { renderData } from 'src/store/api'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('rrh')
export default {
    data() {
        return {
            buttonResult: {},
            type: this.$route.query.type || 'default',
            loanId: this.$route.query.loanId,
            cycleId: this.$route.query.cycleId,
            oidBiz: '',
            amtLoan: '',
            detail: {},
            cmsButton: {
                btnone: {},
                btntwo: {}
            },
            barConfig: {
                action: 'complete', // 右侧按钮点击事件， 必须是window变量
                app: {
                    leftbuttonVisible: false,
                    rightBtnShow: true,
                    rightBtn: 'close'
                }
            },
            cmsBanner: []
        }
    },
    components: {
        cmsBanner
    },
    watch: {
        '$route' () {
            this.type = this.$route.query.type || 'default'
            this.updateCmsButton()
        }
    },
    beforeMount() {
        window.complete = () => {
            if (this.isApp) {
                axdApp.close()
            } else {
                window.location.href = '/pages/rrh/index'
            }
        }
    },
    created() {
        document.title = ''
        this.init()
    },
    filters: {
        formatMoneyK
    },
    methods: {
        ...mapActions(['getRenderData']),
        init() {
            getOrderDetail({
                loanId: this.loanId
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    if (result) {
                        this.detail = result
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
            this.getRenderData().then(data => {
                if (data.success && data.result && data.result.blocks) {
                    data.result.blocks.forEach(data => {
                        if (data.title === 'button_result') {
                            this.buttonResult = JSON.parse(data.objList)
                            this.updateCmsButton()
                            return
                        }
                        if(isZjl) {
                            if (data.title === 'banner_result_zjl') {
                                this.cmsBanner = data.objListArray
                            }
                        } else if (isAym) {
                            if (data.title === 'banner_result_aym') {
                                this.cmsBanner = data.objListArray
                            }
                        } else {
                            if (data.title === 'banner_result') {
                                this.cmsBanner = data.objListArray
                            }
                        }
                    })
                }
            })
        },
        // 更新按钮配置
        updateCmsButton() {
            this.cmsButton = {
                btnone: {},
                btntwo: {}
            }
            if (this.buttonResult.btnone && this.buttonResult.btnone[this.type]) {
                this.cmsButton.btnone = this.buttonResult.btnone[this.type][isZjl ? 'zjl' : 'aym'] || {}
            }
            if (this.buttonResult.btntwo && this.buttonResult.btntwo[this.type]) {
                this.cmsButton.btntwo = this.buttonResult.btntwo[this.type][isZjl ? 'zjl' : 'aym'] || {}
            }
        },
        // 按钮click
        clickBtn(url, text) {
            if (url) {
                if (url === 'order') {
                    this.log({type: 'button-link', name: 'finish-button-view', desc: text, extendData: window.location.origin + '/pages/rrh/loanRecords/details?loanId=' + this.loanId})
                    this.$router.push({
                        name: 'rrhLoanDetails',
                        query: {
                            loanId: this.loanId
                        }
                    })
                } else if (url === 'authoneTypeSecond') {
                    let authoneSecond = '/pages/rrh/authone?type=second&cycleId=' + this.cycleId
                    this.$router.push(authoneSecond)

                } else if (url === 'authoneTypeView') {
                    let authoneView = '/pages/rrh/authone?type=view&cycleId=' + this.cycleId
                    this.$router.push(authoneView)

                } else {
                    this.log({type: 'button-link', name: 'finish-button-cmsorder', desc: text, extendData: url})
                    window.location.href = url
                }
            } else {
                this.log({type: 'button-link', name: 'finish-button-return', desc: text})
                if (isZjl) {
                    goHome()
                } else {
                    this.$router.push('/pages/rrh/index')
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.aui-content {
    background: #ffffff;
}
.tipInfo{
    width: px2rem(750);
    margin-top: px2rem(21);
    background-color: #ffffff;
    padding: px2rem(40) 0 px2rem(80);
    .text{
        text-align: center;
    }
    .text-type-1{
        font-size: px2rem(28);
        line-height: px2rem(36);
        margin-top: px2rem(24);
    }
    .text-type-2{
        font-size: px2rem(80);
        font-weight: bold;
        line-height: 2;
        .symbol {
            font-size: px2rem(48);
        }
    }
    .text-type-3{
        font-size: px2rem(28);
        line-height: 1.4;
        color: #666666;
    }
}
.btn2 {
    text-align: center;
    font-size: px2rem(28);
    color: #999;
    height: px2rem(88);
    line-height: px2rem(88);
    margin: px2rem(16) px2rem(32);
}
</style>
