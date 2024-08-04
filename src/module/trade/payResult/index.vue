<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <!-- fail -->
            <template v-if="isFail">
                <div class="mt20 fail__outter">
                    <aui-msg :config="failStatus">
                        <!-- <a slot="btns" @click.stop.prevent="goOrderList" class="aui-btn aui-btn_primary  mt60">查看订单</a> -->
                    </aui-msg>
                    <div class="aui-cols">
                        <div class="aui-col-1 pr12 pl12" v-if="isApp">
                            <a
                                @click.stop.prevent="goOrderDetail"
                                class="aui-btn"
                                :class="[config.btn.title ?'aui-btn_weaken':'aui-btn_primary aui-btn_wid600']"
                            >查看订单</a>
                        </div>
                        <div class="aui-col-1 pr12 pl12" v-else-if="config.h5Btn.isShowButton">
                            <a
                                @click.stop.prevent="goH5Detail"
                                class="aui-btn"
                                :class="[config.btn.title ?'aui-btn_weaken':'aui-btn_primary aui-btn_wid600']"
                            >{{config.h5Btn.buttonText}}</a>
                        </div>
                        <div class="aui-col-1 pr12 pl12" v-if="config.btn.title">
                            <a
                                @click.stop.prevent="primarybtn(config.btn.url)"
                                class="aui-btn aui-btn_primary"
                            >{{config.btn.title}}</a>
                        </div>
                    </div>
                </div>
            </template>
            <!-- success  -->
            <template v-else>
                <div class="bill-result__msg" v-if="show">
                    <aui-msg :config="returnStatus"></aui-msg>
                    <div class="aui-cells aui-cells_reset">
                        <div v-if="payInfo.payment" class="aui-cell">
                            <div class="aui-cell__bd">
                                <p>总金额</p>
                            </div>
                            <div class="aui-cell__ft">￥{{payInfo.payment | money}}</div>
                        </div>
                        <div v-if="payInfo.installment == '0'" class="aui-cell">
                            <div class="aui-cell__bd">
                                <p>实际首付</p>
                            </div>
                            <div class="aui-cell__ft text_cco">￥{{payInfo.downPayment | money}}</div>
                        </div>
                        <div v-else class="aui-cell">
                            <div class="aui-cell__bd">
                                <p>实际支付</p>
                            </div>
                            <div class="aui-cell__ft text_cco">￥{{payInfo.realPayment | money}}</div>
                        </div>
                    </div>
                    <div class="aui-cols">
                        <div class="aui-col-1 pr12 pl12" v-if="isApp">
                            <a
                                @click.stop.prevent="goOrderDetail"
                                class="aui-btn"
                                :class="[config.btn.title ?'aui-btn_weaken':'aui-btn_primary aui-btn_wid600']"
                            >查看订单</a>
                        </div>
                        <div class="aui-col-1 pr12 pl12" v-else-if="config.h5Btn.isShowButton">
                            <a
                                @click.stop.prevent="goH5Detail"
                                class="aui-btn"
                                :class="[config.btn.title ?'aui-btn_weaken':'aui-btn_primary aui-btn_wid600']"
                            >{{config.h5Btn.buttonText}}</a>
                        </div>
                        <div class="aui-col-1 pr12 pl12" v-if="config.btn.title">
                            <a
                                @click.stop.prevent="primarybtn(config.btn.url)"
                                class="aui-btn aui-btn_primary"
                            >{{config.btn.title}}</a>
                        </div>
                    </div>
                </div>
                <scratch></scratch>
                <!-- 推荐 -->
                <result-rec v-if="config.display" :config="config"></result-rec>
            </template>
        </div>
    </div>
</template>
<script>
import { getTradeInfo, getTradeInfoByGid, getTradeInfoByPayId, getCreditUrl } from 'src/store/modules/trade/payResult'
import axdAlert from 'components/alert/index'
import { resultMixin } from 'src/module/common/resultRecommend/result'
import scratch from './scratch/index.vue'
import { AXD } from 'src/libs/util'
// import { Button as mButton } from '@fe/buss-ui'
export default {
    name: 'payResult',
    mixins: [resultMixin],
    data() {
        return {
            returnStatus: {
                type: 'success',
                title: '支付成功',
                desc: ''
            },
            failStatus: {
                type: 'fail',
                title: '支付失败',
                desc: '系统繁忙，请稍后再试'
            },
            barConfig: {
                action: 'close', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    // title: '支付成功', // title
                    leftBtnShow: false,
                    rightBtnShow: true,
                    text: '完成'
                },
                app: {
                    leftbuttonVisible: false,
                    rightBtnShow: true,
                    rightBtn: 'custom',
                    rightBtnInfo: {
                        showType: 'TEXT',
                        text: '完成'
                    }
                }
            },
            isGetPayInfo: true,
            show: false,
            tradeId: '',
            gid: '',
            payInfo: {},
            isFail: false,
            // isApp: aixuedai.isApp === 'y'
            // payment: '',
            // downPayment: '',
            // realPayment: '',
        }
    },
    components: {
        scratch
    },
    created() {
        if (this.isApp) {
            axdApp.send({
                module: 'webview',
                method: 'historyClear'
            })
        }
    },
    beforeMount() {
        let errorCode = this.$route.query.errorCode
        let that = this
        this.tradeId = this.$route.params.tradeId
        this.gid = this.$route.query.gid
        this.judgePageType()
        window.close = function() {
            if (that.isApp) {
                axdApp.close()
            }
        }
    },
    methods: {
        judgePageType() {
            let errorCode = this.$route.query.errorCode

            if (errorCode) {
                if (errorCode === '1002' || errorCode === '416') {
                    let groupId = this.$route.query.gid
                    let tradeId = this.tradeId
                    getCreditUrl({ groupId, tradeId }).then(({ success, result = '' }) => {
                        if (success) {
                            AXD.util.goCredit(result)
                            // window.location.href = result
                        }
                    })
                    return
                }

                // 其他失败情况显示失败页
                document.title = '支付失败'
                this.isFail = true
            } else {
                document.title = '支付成功'
            }
            // let params = {
            //     applyType: 'payment',
            //     tradeId
            // }
            // this.marketInit(params)
            //
            this.createParamAndGetRecoPros()
        },
        createParamAndGetRecoPros() {
            let params = { applyType: 'payment' }
            if (this.gid) {
                Object.assign(params, { gid: this.gid })
            } else {
                Object.assign(params, { tradeId: this.tradeId })
            }
            this.marketInit(params)
        },
        initPayInfo() {
            // 合并支付 接口变更 20180512 yangjun
            if (this.gid) {
                getTradeInfoByGid({ gid: this.gid }).then(res => {
                    this.handleRes(res)
                })
            } else {
                getTradeInfo({ tradeId: this.tradeId }).then(res => {
                    this.handleRes(res)
                })
            }
        },
        handleRes(res) {
            this.show = true
            if (res.success && res.result) {
                let result = res.result
                this.payInfo = result
                // 东方金融结果页弹窗
                if (res.code === '7000') {
                    axdAlert('缴费成功！转账略有延迟，请不要重复缴费')
                }
                // this.payment = result.payment
                // this.downPayment = result.downPayment
                // this.realPayment = result.realPayment
            }
        },
        goOrderList() {
            // 查看订单按钮埋点
            this.$router.push({
                name: 'orderGoods'
            })
        },
        goOrderDetail() {
            // 查看订单按钮埋点
            if (this.gid) {
                this.$router.push({
                    name: 'orderGoods'
                })
            } else {
                this.$router.push({
                    name: 'orderGoodsDetail',
                    query: {
                        tId: this.tradeId
                    }
                })
            }
            // if (this.isApp) {
            //     window.location.href = '/pages/order/goodsDetail?id=' + this.tradeId
            // }
        },
        goH5Detail() {
            let url = this.config.h5Btn.buttonLinkUrl
            if (url) {
                window.location.href = url
            }
        },
        primarybtn(url) {
            window.location.href = url
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

.aui-btn {
    width: auto;
}

.fail__outter {
    background-color: #fff;
    padding-bottom: px2rem(60);
}

.bill-result__msg {
    padding-bottom: px2rem(60);
    background-color: #fff;
    margin-top: px2rem(20);
}

.mt20 {
    margin-top: px2rem(20);
}

.mt60 {
    margin-top: px2rem(60);
}

.mantissa {
    font-size: $auiFontSizeLevel5;
    font-style: normal;
}

.aui-cols {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 0 px2rem(60);

    .aui-btn {
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .aui-btn_wid600 {
        width: px2rem(600);
        margin: 0 auto;
    }
}

@for $i from 1 to 12 {
    .aui-col-#{$i} {
        -webkit-box-flex: $i;
        -webkit-flex: $i;
        flex: $i;
        overflow: hidden;
    }
}

.pl12 {
    padding-left: px2rem(12);
}

.pr12 {
    padding-right: px2rem(12);
}

.aui-cells_reset {
    margin-bottom: px2rem(50);
    margin-top: 0;

    .aui-cell {
        padding-top: 0;
        padding-bottom: 0;
        height: px2rem(58);

        &:before {
            content: none;
        }
    }

    .aui-cell__bd {
        color: $auiTextColorAssistant;
    }

    .aui-cell__ft {
        color: $auiTextColorGeneral;
    }

    .text_cco {
        color: $auiAttentionColor;
    }
}
</style>
