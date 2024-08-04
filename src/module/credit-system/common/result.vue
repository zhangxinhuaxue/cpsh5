<!--
    Created dongyusi on 07/2018
-->
<template>
    <m-page>
        <error-page v-if="error" :resubmitParam="query" :msg="msg"></error-page>
        <div class="res" v-else>
            <div class="res-img" :class="currentData.type"></div>
            <p class="res-title">{{msg}}</p>
            <m-button v-if="doTaobao" class="res-btn" @click="goLink('taobao')">继续申请淘宝认证</m-button>
            <template v-else>
            <div v-if="currentData.btnTexts && currentData.btnTexts.length" class="res-btns">
                <m-button v-for="(item, index) in currentData.btnTexts" :type="item.type" :key="index" class="res-btn" @click="goLink(item.link)">{{item.btnText}}
                </m-button>
            </div>
            <m-button v-else class="res-btn" @click="goLink(currentData.link)">{{currentData.btnText}}</m-button>
            </template>
        </div>
    </m-page>
</template>
<script>
import { getNeedDoCreditItem, getResult } from 'src/store/modules/credit-system'
import errorPage from './error.vue'
import { setHeader, resetHeader } from '../common/setHeader'
import { isSupportLocalStorage, appDownloadUrl } from 'libs/util'
import { amountMixin } from '../common/mixins'
export default {
    name: 'credit-result',
    mixins: [amountMixin],
    data() {
        return {
            // isApp: aixuedai.isUavoApp === 'y',
            // query: this.$route.query,
            msg: '',
            status: '',
            doTaobao: false,
            taobaoData: {
                btnText: '继续申请淘宝认证',
                link: 'taobao',
                btnTexts: []
            },
            // currentData: {},
            error: false,
            '10032': {
                type: 'type-reject',
                btnText: '返回',
                link: appDownloadUrl
            },
            '99': {
                type: 'type-close',
                btnText: '首页逛逛',
                link: appDownloadUrl
            },
            // 风控提交成功 - 审核中
            '0': {
                type: 'type-authing',
                btnText: '返回',
                link: 'creditAmount'
            },
            // 审核中
            '2': {
                type: 'type-authing',
                btnText: '返回',
                link: 'creditAmount'
            },
            // 学历审核中
            'eduAuthing': {
                type: 'type-authing',
                btnText: '返回'
            },
            // 驳回
            '4': {
                type: 'type-reject',
                btnText: '重新提交',
                link: 'creditAmount'
            },
            // 关闭
            '5': {
                type: 'type-close',
                btnText: '首页逛逛',
                link: appDownloadUrl
            },
            // 通过
            '3': {
                type: 'type-pass',
                btnTexts: [{
                    btnText: '去取现',
                    type: 'plain',
                    link: 'rootPageCash'
                }, {
                    btnText: '继续提额',
                    type: 'primary',
                    link: 'creditAmount'
                }]
            }
        }
    },
    computed: {
        currentData() {
            return this.status ? (this[this.status] ? this[this.status] : {}) : {}
        }
    },
    components: {
        errorPage
    },
    mounted() {
        setHeader({
            leftbuttonVisible: false
        })
    },
    watch: {
        $route: {
            handler() {
                this.init()
            },
            immediate: true
        }
    },
    methods: {
        init() {
            let { authOrderId, code, creditOrderId, msg, creditItem,authItem } = this.$route.query
            this.doTaobao = false
            // 认证失败，有认证工单号，跳转错误页，可重新提交
            if (authOrderId) {
                this.msg = msg
                // 学历认证审核中   
                if(authItem === '11'){
                    this.status  = 'eduAuthing'
                    return
                }

                this.error = true
                return
            }
            // 微贷限流
            if (code === '10032') {
                this.status = '10032'
                this.msg = msg
                return
            }
            // 认证未完成，不需要重新提交，直接失败结果
            if (!creditOrderId) {
                this.status = '99'
                this.msg = msg
                return
            }
            console.log(creditItem)
            // 银行卡结果页是否需要做淘宝提额
            if (creditItem === '2') {
                getNeedDoCreditItem({
                    creditItem: '9',
                    from: this.from,
                    platform: this.platform
                }).then((res) => {
                    if (res.success) {
                        let result = res.result
                        this.doTaobao = result.needDo
                    }
                })
            }

            // 认证成功，有授信工单号，取授信结果
            this.getCreditItemResult(creditOrderId)
        },
        getCreditItemResult(creditOrderId) {
            getResult({
                creditOrderId
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    this.error = false
                    this.status = result.status || '99'
                    this.msg = result.msg
                } else {
                    this.error = true
                    this.msg = res.resultDes
                }
            })
        },
        goLink(linkUrl) {
            // 跳转提额
            let link = linkUrl || appDownloadUrl
            resetHeader()
            if (link === 'creditAmount') {
                if (isSupportLocalStorage() && localStorage.getItem('amountUrl')) {
                    window.location.href = decodeURIComponent(localStorage.getItem('amountUrl'))
                    return
                } else {
                    link = appDownloadUrl
                }
            }
            if (this.isApp && link === 'rootPageCash') {
                axdApp.send({
                    module: 'navigation',
                    method: 'goPage',
                    params: {
                        page: 'root',
                        loginFirst: false,
                        closeToRoot: true,
                        rootPage: 3
                    }
                })
                return
            }
            if (this.isApp && link === appDownloadUrl) {
                axdApp.send({
                    module: 'webview',
                    method: 'close'
                })
                return
            }
            window.location.href = link
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.res {
    text-align: center;
    padding: px2rem(30) 0 px2rem(40);
    background-color: #fff;

    .res-title {
        width: px2rem(600);
        margin: px2rem(10) auto px2rem(48);
        font-size: $auiFontSizeLevel4;
        height: px2rem(72)
    }
}

.res-img {
    width: px2rem(140);
    height: px2rem(140);
    margin: 0 auto;
}

.res-btns {
    display: flex;

    .res-btn {
        margin-top: 0;
        width: px2rem(300);
    }
}

.res-btn {
    width: px2rem(600);
}

.type-pass {
    background: url('../assets/images/pass.png') no-repeat center;
    background-size: 100%;
}

.type-authing {
    background: url('../assets/images/authing.png') no-repeat center;
    background-size: 100%;
}

.type-reject {
    background: url('../assets/images/reject.png') no-repeat center;
    background-size: 100%;
}

.type-close {
    background: url('../assets/images/close.png') no-repeat center;
    background-size: 100%;
}
</style>
