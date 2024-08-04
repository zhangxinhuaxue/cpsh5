<!--
 * @Description: 风险定价确认页
 * @Author: 沈浩
 * @Date: 2019-06-03 15:00:00
 * @LastEditTime: 2019-08-09 15:42:32
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div>
        <div class="aui-page" v-if="pageShow">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-fixedbottom">
                <div class="footer-bar">
                    <div class="footer-bar__account"><span class="fs28">合计：</span><span class="price cc1"><span class="fs28">￥</span><span class="fwb">{{cartTotalPrice | money(100)}}</span></span></div>
                    <div class="footer-bar__btn"><a @click.stop.prevent="submit" href="javascript:;" class="aui-btn_full">提交订单</a></div>
                </div>
            </div>
            <div class="aui-content">
                <div class="aui-cells">
                    <div class="aui-stage">
                    <p>您的信用评分暂不符合借款条件</p>
                    <h2>需购买增信服务，提升信用评分</h2>
                    </div>
                </div>
                <div class="aui-cells">
                    <div class="aui-cell select">
                        <div class="aui-cell__bd">
                            <p>订单信息</p>
                        </div>
                        <div class="aui-cell__ft">抱米花担保费{{cartTotalPrice | money(100)}}</div>
                    </div>
                    <div class="aui-cell select">
                        <div class="aui-cell__bd">
                            <p>商品金额</p>
                        </div>
                        <div class="aui-cell__ft">¥ {{ cartTotalPrice | money(100) }}</div>
                    </div>
                    <div class="aui-cell select">
                        <div class="aui-cell__bd"></div>
                        <div class="aui-cell__ft">小计：¥ {{ cartTotalPrice | money(100) }}</div>
                    </div>
                </div>
                <!-- 分期 -->
                <div class="aui-cells">
                    <div class="aui-cell select" v-if="payWay === 'optional'">
                        <div class="aui-cell__bd" style="display: flex;align-items: center;" @click="attention">担保费支付方式<m-icon type="attetion" class="attention"></m-icon></div>
                        <div class="aui-cell__ft">
                            <input class="aui-switch" type="checkbox" v-model="stageChecked">
                        </div>
                    </div>
                    <div class="aui-stage" v-if="stageChecked && payWay !== 'oneTime'">
                        <!-- <p>① 担保费在取现到账后扣款</p>
                        <p style="margin-bottom: 25px;">② <span style="color: red;">扣款失败担保费转为</span>分期付款</p> -->
                        <div class="stage-title">分期详情</div>
                        <div class="stage-detail">
                            <div class="stage-wrap">
                                <span class="stage-left">首付金额：</span>
                                <span class="stage-right" style="color: red;"><span>￥</span><span>{{ firstPay | money(100) }}</span></span>
                            </div>
                            <div class="stage-wrap">
                                <span class="stage-left">分期金额：</span>
                                <span class="stage-right" style="color: red;"><span>￥</span><span>{{ fenqiPay | money(100) }}</span></span>
                            </div>
                            <div class="stage-wrap">
                                <span class="stage-left">每期应还：</span>
                                <span class="stage-right"><span>￥</span><span>{{ monthPay | money(100) }} x {{ month }}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div class="protocol">
                    <label @click="ischeck = !ischeck">
                        <span class="icon-check1" v-if="ischeck">
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                        <span class="icon-check1-disbaled" v-else>
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                        <!-- <span class="icon-uncheck1" ></span> -->
                        <span>我已阅读并同意</span>
                    </label>
                    <a href="javascript:;" @click="goUrl">《担保服务合同》</a>
                </div>
        </div>
    </div>
</template>
<script>
import {
    virtualCreateTradeBuynow,
    virtualCreateTradeCreate
} from 'store/modules/trade/virtual'
import {openPayment, payMixinMulti} from 'module/trade/common/assets/order_multi'
import {
    getStagingInfo
} from 'store/modules/rrh'
import {
    renderData
} from 'src/store/api'

export default {
    name: 'comfirmMnw',
    mixins: [payMixinMulti],
    data() {
        return {
            ischeck: true,
            pageShow: false,
            barConfig: {
                h5: {
                    title: '确认订单', // title
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: ''
                }
            },
            stageChecked: true,
            cartTotalPrice: 0,
            csrfToken: '',
            firstPay: '',
            fenqiPay: '',
            month: '',
            monthPay: '',
            comfirmFunction: virtualCreateTradeCreate,
            loanId: this.$route.query.loanId,
            skuId: this.$route.query.skuId,
            payWay: '',
            contractUrl: ''
        }
    },
    created() {
        window.stayWindow = () => {
            console.log('请求结果为返回之前，请勿回退页面')
        }

        this.getCmsData({alias: 'rrhzx'}).then(res => {
            res.blocks.forEach(item => {
                if (item.blockType === 'extend') {
                    let obj = JSON.parse(item.objList)
                    this.payWay = obj.payWay || ''
                    let device = this.isApp ? 'app' : 'h5'
                    this.skuId = obj.skuId || ''
                    this.contractUrl = `/${device}/user/contract/viewTemplate/${obj.taiheContract}`
                }
            })
            let p = {
                loanId: this.loanId,
                skuId: this.skuId
            }
            Promise.all([
                virtualCreateTradeBuynow({params: JSON.stringify(p)}),
                getStagingInfo(p)

            ]).then(res => {
                this.pageShow = true

                this.cartTotalPrice = res[0].result.confirmVo.cartTotalPrice
                this.csrfToken = res[0].result.confirmVo.csrfToken
                this.firstPay = res[1].result.firstPay
                this.fenqiPay = res[1].result.fenqiPay
                this.month = res[1].result.month
                this.monthPay = res[1].result.monthPay
            })
        })
    },
    methods: {
        getCmsData() {
            return new Promise((resolve, reject) => {
                renderData({ alias: 'rrhzx' }, ({success, result}) => {
                    if (success) {
                        resolve(result)
                    } else {
                        reject()
                    }
                })
            })
        },
        submit() {
            if (!this.ischeck) {
                this.$_toast('请先阅读并同意《担保服务合同》')
                return
            }
            let isStage = 0
            if (this.payWay === 'oneTime') {
                isStage = 0
            } else if (this.payWay === 'staging') {
                isStage = 1
            } else if (this.payWay === 'optional') {
                isStage = this.stageChecked ? 1 : 0
            }
            let params = {
                csrfToken: this.csrfToken,
                loanId: this.loanId,
                skuId: this.skuId,
                isStage
            }
            this.barConfig.app.leftbuttonAction = 'stayWindow'
            this.barConfig = {...this.barConfig}
            // 调用公共创建订单，唤起收银台方法
            this.$nextTick(() => {
                this.createOrder(params, (res, gid, tradeid) => {
                    this.barConfig.app.leftbuttonAction = ''
                    this.barConfig = {...this.barConfig}
                    let data = res.data
                    // 支付后, 统一跳增信服务 的支付结果页
                    this.$router.replace({name: 'rrhServicePayResult', params: {tradeId: tradeid}, query: {loanId: this.loanId, oidBiz: this.$route.query.oidBiz, gid, errorCode: data.errorCode}})
                })
            })
        },
        attention() {
            this.$_alert('未选择担保费代扣方式，仅支持一次性现金支付。')
        },
        goUrl() {
            window.location.href = window.location.origin + this.contractUrl
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-content {
    padding-bottom: px2rem(80);
}
.account_height {
    height: px2rem(152);
    .aui-cell__ft {
        color:rgba(246,96,69,1);
        font-size: px2rem(60);
    }
}
.footer-bar {
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    &__account {
        width: 9.81333rem;
        display: flex;
        align-items: center;
        padding-left: .68267rem;
    }
    &__btn {
        flex: 1;
    }
    .fs28 {
        font-size: 0.59733rem;
    }
    .cc1 {
        color: #E31436;
        font-size: 0.68267rem;
    }
    .fwb {
        font-size: px2rem(38);
    }
}
.aui-stage {
    padding: .64rem .68267rem;
    position: relative;
    &:before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #e4e4e4;
        transform-origin: 0 0;
        transform: scaleY(.5);
        left: .68267rem;
    }
    .stage-title {
        margin-bottom: .64rem;
    }
    .stage-left {
        color: #b7b7b7;
    }
}
.attention {
    width: px2rem(30);
    height: px2rem(30);
    margin-left: px2rem(10);
}
.protocol{
    position: absolute;
    width: 100%;
    bottom: px2rem(100);
    padding: px2rem(32);
    line-height: px2rem(33);
    span{
        font-size: px2rem(26);
        color: #A1A1A1;
    }
    a{
        font-size: px2rem(26);
        color: #61C9FF;
    }
}
</style>
