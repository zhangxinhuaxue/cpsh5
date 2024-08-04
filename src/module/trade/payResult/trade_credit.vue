<!--
    Created by sunxuejing on 12/10/2017
    带单授信订单结果页 已订单是否成功判断
    2019/01/08 已无带单授信
-->
<template>
    <div class="aui-page">
        <div class="aui-content">
            <div class="credit-result__msg" v-if="currentData">
                <aui-msg :config="currentData">
                    <div class="aui-msg__opr-area" slot="btns" v-if="currentData.btns">
                        <p class="aui-btn__area-1">
                            <a href="javascript:;" class="aui-btn aui-btn_primary" @click="mainClick()">{{currentData.btns.mainBtn}}</a>
                        </p>
                    </div>
                </aui-msg>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import auiMsg from 'module/common/msg/index.vue'
import { getTradeCreditResult, getTradeInfoByPayId } from 'store/modules/trade/payResult'
export default {
    name: 'tradeCreditResult',
    data() {
        return {
            tid: this.$route.params.tradeId,
            gid: this.$route.query.gid,
            code: '',
            statusCode: '',
            productId: '',
            // 订单支付成功
            status1: {
                type: 'success',
                title: '待发货',
                desc: '您的订单已审核通过，请耐心等待卖家发货！',
                btns: {
                    mainBtn: '查看订单'
                }
            },
            // 订单支付失败
            status2: {
                type: 'fail',
                title: '订单关闭',
                desc: '抱歉，当前订单被关闭，推荐使用全款购买。',
                btns: {
                    mainBtn: '全款购买'
                }
            },
            // 订单审核中
            status3: {
                type: 'success',
                title: '审核中',
                desc: '授信资料已提交，请耐心等待！',
                btns: {
                    mainBtn: '查看订单'
                }
            },
            status0: {
                type: 'fail',
                title: '出错啦！'
            }
        }
    },
    computed: {
        currentData() {
            if (!this.statusCode) {
                return false
            }
            return this[this.statusCode]
        }
    },
    components: {
        auiMsg
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            // let params
            // if (this.isApp) {
            //     params = {
            //         trdId: this.tid,
            //         gid: this.gid
            //     }
            //     this.getResult(params)
            // } else {
            //     getTradeInfoByPayId({ payOutOrderId: this.tid }).then(({ success, result, resultDes }) => {
            //         if (success) {
            //             let { tradeGroupId, tradeId } = result.tradeInfoList[0]
            //             this.tid = tradeId
            //             this.gid = tradeGroupId
            //             params = {
            //                 trdId: this.tid,
            //                 gid: this.gid
            //             }
            //             this.getResult(params)
            //         } else {
            //             resultDes ? this.$_toast(resultDes) : this.$_toast('系统错误')
            //         }
            //     })
            // }
            let params = {
                trdId: this.tid,
                gid: this.gid
            }
            this.getResult(params)
        },
        getResult(params) {
            getTradeCreditResult(params).then((res) => {
                this.statusCode = 'status0'
                if (res.success && res.result) {
                    /**
                     * 订单结果res.result
                     * 1.订单通过
                     * 2.交易失败
                     * 3.订单审核中
                     * -1: 异常
                     */
                    let code = res.result
                    // switch (code) {
                    //     case '1':
                    //         this.statusCode = 'status1'
                    //         break
                    //     case '2':
                    //         this.statusCode = 'status2'
                    //         break
                    //     case '3':
                    //         this.statusCode = 'status3'
                    //         break
                    //     default:
                    //         this.statusCode = 'status0'
                    //         break
                    // }

                    if (['1', '2', '3'].indexOf(code) > -1) {
                        this.statusCode = 'status' + code
                    }
                    this.code = code
                    // V3 productId参数去掉 合并支付此参数无用
                }
                //  else {
                //     this.statusCode = 'status0'
                // }
            })
        },
        mainClick() {
            // V3合并支付 成功不能跳转到订单详情，因为可能存在多个商铺合并支付的情况 所以统一跳转到订单列表
            if (this.code == '1' || this.code == '3') {
                this.$router.push({
                    name: 'orderGoods'
                })
            } else {
                // 去商品详情全款购买
                // let pageUrl = window.location.origin + '/mall/product/detail.html?productId=' + this.productId
                // if (this.isApp) {
                //     axdApp.send({
                //         module: 'navigation',
                //         method: 'goURL',
                //         params: {
                //             url: pageUrl,
                //             rootPage: 0
                //         },
                //         callback() {}
                //     })
                // } else {
                //     window.location.href = pageUrl
                // }

                // V3 失败都跳到商城首页
                if (this.isApp) {
                    axdApp.send({
                        module: 'navigation',
                        method: 'goPage',
                        params: {
                            page: 'root', // 原生页面标识
                            loginFirst: false, // 是否需要先登录再跳转
                            closeToRoot: true, // 返回（或者关闭）至首页
                            rootPage: 0 // 当需要返回至首页时标识具体的首页页面0:商城首页1:专题3:取现4:我的,
                        }
                    })
                } else {
                    window.location.href = '/pages/put/index'
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.credit-result__msg {
    margin-top: px2rem(20);
    padding: px2rem(50) 0 px2rem(60);
    background-color: #fff;
}
</style>
