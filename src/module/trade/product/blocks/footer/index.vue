<!--
    Created by hity on 05/15/17
-->
<template>
    <footer class="aui-fixedbottom">
        <img
            v-if="Object.keys(suspensionTag).length"
            class="suspension-tag"
            :src="suspensionTag.url"
            @click="goAcitivity(suspensionTag.remark, $event)"
            alt="悬浮标签"
        />
        <div class="shopping-btn-group">
            <template v-if="!isUndercarriage">
                <span v-if="!isMini" class="contact" @click="openImFn">
                    <i class="icon-service"></i>联系客服
                </span>
                <!-- 新品预约 -->
                <template v-if="isReservation &&reservationStatus!=2">
                    <span
                        v-if="reservationStatus==0"
                        class="to-cart"
                        style="background :#ccc;"
                    >活动未开始</span>
                    <span
                        v-else-if="reservationStatus==3"
                        class="to-cart"
                        style="background :#ccc;"
                    >活动已结束</span>
                    <span v-else class="to-cart" @click="reservationHandler">立即预约</span>
                </template>
                <!-- 普通商品类型 -->
                <template v-else-if="trade.buyType === 'normal'">
                    <span
                        v-if="trade.cartStatus"
                        :class="{'disbaled-buy': isDisabledStock}"
                        class="to-cart"
                        @click="popupSku('addCart')"
                    >加入购物车</span>
                    <span
                        class="to-buy"
                        :class="{'disbaled-buy': isDisabledStock}"
                        @click="popupSku('toBuy')"
                    >立即购买</span>
                </template>
                <!-- 限时抢购 -->
                <template v-else-if="trade.buyType == 'limitSeckill'">
                    <template v-if="limitSeckillState == 'before'">
                        <span class="to-cart disabled">即将开抢</span>
                    </template>
                    <template v-if="limitSeckillState == 'selling'">
                        <span
                            v-if="trade.cartStatus"
                            class="to-cart"
                            @click="popupSku('addCart')"
                        >加入购物车</span>
                        <span class="to-buy" @click="popupSku('toBuy')">立即购买</span>
                    </template>
                    <template v-if="limitSeckillState == 'over'">
                        <span class="to-cart disabled">已结束</span>
                    </template>
                </template>
                <!-- 秒杀 -->
                <template v-else-if="trade.buyType == 'seckill'">
                    <span
                        class="to-buy seckillBtn__buyBtn"
                        :class="{'seckillBtn__buyBtn--isGray':!seckillInteract.canBuy}"
                        @click="popupSku('toBuy')"
                    >{{seckillInteract.btnTxt}}</span>
                </template>
                <!-- 团购 -->
                <template v-else-if="trade.buyType == 'teambuy'">
                    <template v-if="!teambuy.isOver">
                        <span class="to-cart teambuyBtn__singleBtn" @click="toSingle">
                            ￥{{teambuy.originPrice|money}}
                            <br />单独买
                        </span>
                        <span
                            v-if="!$route.query.recordId"
                            class="to-buy teambuyBtn__teamBtn"
                            @click="popupSku('toTeamBuy')"
                        >
                            ￥{{teambuy.price|money}}
                            <br />
                            {{teambuy.num}}人团
                        </span>
                        <span
                            v-if="$route.query.recordId"
                            class="to-buy teambuyBtn__teamBtn-record"
                            @click="popupSku('toTeamReco')"
                        >去参团</span>
                    </template>
                    <span v-if="teambuy.isOver" class="aui-btn_full disabled">拼团已结束</span>
                </template>
                <!-- 限时抢购 -->
                <template v-else-if="trade.buyType == 'limittime'">
                    <template v-if="pdLimitState == 'before'">
                        <span class="icon_clock" @click="remind()">{{activityTxt}}</span>
                        <span class="originPriceBuybtn" @click="popupSku('toBuy')">原价购买</span>
                        <span
                            v-if="trade.cartStatus"
                            class="cartBtn"
                            @click="popupSku('addCart')"
                        >加入购物车</span>
                    </template>
                    <template v-if="pdLimitState == 'ing'">
                        <span
                            v-if="trade.cartStatus"
                            class="to-cart"
                            @click="popupSku('addCart')"
                        >加入购物车</span>
                        <span
                            class="btn"
                            :style="{backgroundColor: ingBgColor}"
                            @click="popupSku('toBuy')"
                        >立即购买</span>
                    </template>
                </template>
                <!-- 预售 -->
                <template v-else-if="trade.buyType == 'presale'">
                    <div class="presale__btn" @click="popupSku('toBuy')">
                        <span>
                            {{presale.depositEnd | dateFormat('MM月dd日hh:mm')}}结束
                            <br />
                            付尾款后{{presale.shipTime}}天内发货
                        </span>
                        <div>
                            <span>立即付定金</span>
                            <p>
                                定金¥
                                <span v-html="complexMoney(presale.deposit, 100, true)"></span>
                            </p>
                        </div>
                    </div>
                </template>
                <!-- 新人专享 -->
                <template v-else-if="trade.buyType === 'chance'">
                    <span
                        class="to-buy"
                        :class="{'disbaled-buy': isDisabledStock}"
                        @click="popupSku('toBuy')"
                    >立即购买</span>
                </template>
                <!-- 如果不是以上几种特殊场景则全部按照普通商品展示，兼容后面新加的活动类型，目前包括【普通商品，N件任选，砍价活动，A+会员】 -->
                <template v-else>
                    <span
                        v-if="trade.cartStatus"
                        :class="{'disbaled-buy': isDisabledStock}"
                        class="to-cart"
                        @click="popupSku('addCart')"
                    >加入购物车</span>
                    <span
                        class="to-buy"
                        :class="{'disbaled-buy': isDisabledStock}"
                        @click="popupSku('toBuy')"
                    >立即购买</span>
                </template>
            </template>
            <span
                v-if="isUndercarriage && trade.buyType != 'limitSeckill'"
                class="aui-btn_full disabled"
            >商品已下架</span>
            <span
                v-if="isUndercarriage && trade.buyType == 'limitSeckill'"
                class="aui-btn_full disabled"
            >已抢完</span>
        </div>
    </footer>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import { AXD } from 'libs/util'
import { newSobotIm } from 'src/libs/im'
import { educationMixin } from 'src/module/trade/common/education'
import { _post } from 'src/store/base'
import { activityRemind, saveReservation } from 'store/modules/trade/product'
import * as util from 'src/libs/util'
import debounce from 'lodash/debounce'

const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('trade/product')

export default {
    name: 'product-footer',
    mixins: [educationMixin],
    props: {
        skuPopupInstance: {
            type: Object
        }
    },
    data() {
        return {
            normal: true,
            IMtype: 'callphone',
            sdkParams: null,
            ua: navigator.userAgent.toLowerCase(),
            activityTxt: '预约抢购',
            isMini: false, // 是否为小程序
            sobotUrl: ''
        }
    },
    created() {
        this.preloadIm()
    },
    computed: {
        ...mapState({
            uid: state => state.initData.user.uid,
            eduCode: state => state.initData.user.eduCode,
            desc: state => state.initData.desc,
            trade: state => state.initData.trade,
            shop: state => state.initData.shop,
            teambuy: state => state.initData.teambuy,
            seckillInteract: state => state.interactData.seckill,
            teambuyInteract: state => state.interactData.teambuy,
            firstScreenDone: state => state.interactData.firstScreenDone,
            productType: state => state.initData.shop.type,
            stockState: state => state.initData.jd.stockState,
            limitSeckillState: state => state.interactData.limitSeckill.state,
            pdLimitState: state => state.initData.activity.state,
            beforeBgColor: state => state.initData.activity.beforeBgColor,
            ingBgColor: state => state.initData.activity.ingBgColor,
            activityId: state => state.initData.activity.id,
            remindSwitch: state => state.initData.activity.remindSwitch,
            validSkuNum: state => state.initData.jd.validSkuNum,
            presale: state => state.initData.presale,
            suspensionTag: state => state.initData.suspensionTag,
            isReservation: state => state.initData.trade.isReservation,
            reservationStatus: state => state.interactData.reservationStatus
        }),
        isDisabledStock() {
            return this.productType == 'JD' && this.stockState != '有货'
        },
        ...mapGetters(['isUndercarriage'])
    },
    methods: {
        ...mapMutations(['updateInteractData']),
        popupSku(popupFrom) {
            // 京东无货
            if (this.isDisabledStock) {
                this.$_toast('已选商品参数暂时无货')
                return
            }
            if (this.trade.buyType == 'seckill' && !this.seckillInteract.canBuy) {
                return
            }
            let tempPause = false
            if (popupFrom == 'toBuy' || popupFrom == 'toTeamBuy' || popupFrom == 'toTeamReco') {
                if (!this.uid) {
                    AXD.util.login()
                    return false
                }
            }

            if (!tempPause) {
                this.buyLoginLeft(popupFrom)
            }
        },
        buyLoginLeft(popupFrom) {
            if (popupFrom === 'toBuy' && this.trade.buyType === 'normal') {
                if (this.eduCode === '1014') {
                    this.goBasicAuth(window.location.origin + '/pages/mall/product/' + this.desc.productId)
                    return false
                } else if (this.eduCode === '1015') {
                    this.$_toast('抱歉，此类商品为教育专享优惠商品，您无法购买。')
                    return false
                }
            }
            this.updateInteractData({
                targetKey: 'trade',
                popupFrom,
                isSkuPopOpen: true
            })
            this.skuPopupInstance.isPopup = true
        },
        toSingle() {
            window.location.href = '/pages/mall/product/' + this.teambuy.originProductId
        },
        preloadIm() {
            if (!this.isApp) return

            // 嘉兴客服已废弃
            // loadInit(window, document, 'script', 'https://kfmcs.jiaxincloud.com/mcs.js', '_JIAXIN')

            // 获取智齿客服机器人URL
            newSobotIm(res => (this.sobotUrl = res))
        },
        openImFn() {
            this.$_alert('客服热线：88375600')
            // if (!this.isApp) {
            //     window.location.href = aixuedai.appDownloadUrl
            //     return
            // }
            // if (!this.uid) {
            //     AXD.util.login()
            //     return
            // }
            // // 其他APP使用
            // if (this.ua.indexOf('com.subaxd.axd') > -1) {
            //     this.callphone()
            //     return
            // }
            // axdApp.send({
            //     module: 'webview',
            //     method: 'configNavigationBar',
            //     params: {
            //         visible: true,
            //         rightbuttonVisible: false
            //     },
            //     callback: function(data) {}
            // })
            // let params = {
            //     productId: this.desc.productId,
            //     merchantId: this.desc.merchantIdStr
            // }
            // 打开客服
            // openIm(params)
            // window.location.href = this.sobotUrl
        },
        remind() {
            activityRemind({
                activityId: this.activityId,
                productId: this.desc.productId
            }).then(({ success, code, resultDes }) => {
                if (success) {
                    this.activityTxt = '已预约'
                    this.$_toast('将在开抢前提醒你')
                } else {
                    if (code.toString() === '-1999') {
                        AXD.util.login()
                        return false
                    } else {
                        resultDes && this.$_toast(resultDes)
                    }
                }
            })
        },
        goAcitivity(url, e) {
            e.stopPropagation()
            const index1 = window.location.pathname.lastIndexOf('/')
            const productId = window.location.pathname.slice(index1 + 1)
            if (window.location.href.includes('scroll')) {
                const scroll = window.location.search.replace('?', '')
                window.location.href = `${url}?productId=${productId}&${scroll}`
            } else {
                window.location.href = `${url}?productId=${productId}`
            }
        },
        reservationHandler: debounce(
            function() {
                saveReservation({
                    productId: this.$route.params.productId
                }).then(({ success, code, resultDes }) => {
                    if (success) {
                        this.$_toast('预约成功，商品会在开抢前5分钟发送提醒消息')
                    } else {
                        if (+code === -1999 || +code === 10010) {
                            AXD.util.login()
                            return false
                        } else {
                            this.$_toast(resultDes)
                        }
                        // this.$_toast(res.resultDes)
                    }
                })
            },
            300,
            { leading: true, trailing: false }
        )
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.suspension-tag {
    position: absolute;
    top: px2rem(-110);
    width: px2rem(685);
    height: px2rem(90);
    left: 50%;
    transform: translateX(-50%);
    border-radius: px2rem(10);
    z-index: 1000;
}

.shopping-btn-group {
    height: 100%;
    @include flexbox();

    & > * {
        @include flex(1);
        display: block;
        text-align: center;
        height: 100%;
    }

    .contact {
        flex: none;
        width: px2rem(170);
        font-size: $auiFontSizeLevel7;
        line-height: px2rem(42);
        color: $auiTextColorAssistant;
        background-color: #fff;
        height: px2rem(100);
        overflow: hidden;

        .icon-service {
            display: block;
            top: px2rem(16);
            left: px2rem(66);
            font-size: px2rem(42);
            padding-top: px2rem(16);

            &::before {
                color: #666;
            }
        }
    }

    .btn {
        font-size: $auiFontSizeLevel3;
        line-height: px2rem(100);
        height: px2rem(100);
        color: #ffffff;
    }

    .to-cart {
        background: #ffd72d;
        font-size: $auiFontSizeLevel3;
        color: $auiTextColorImportant;
        line-height: px2rem(100);
        height: px2rem(100);
    }

    .to-buy {
        background: $auiAttentionColor;
        font-size: $auiFontSizeLevel3;
        color: #ffffff;
        line-height: px2rem(100);
        height: px2rem(100);
    }

    .disabled {
        width: 100%;
        height: 100%;
        background: $auiTextColorLight;
        font-size: $auiFontSizeLevel3;
        color: $auiTextColorImportant;
        line-height: px2rem(100);
    }

    .disbaled-cart {
        background-color: #ffeda7;
        color: #666666;
    }

    .disbaled-buy {
        background-color: #ffc1c1;
        color: #fff;
    }

    .remind-success {
        background: #f2f2f2 !important;
        color: #cccccc;
    }

    .icon_clock {
        width: px2rem(96);
        padding-top: px2rem(60);
        background: url(../../img/icon_clock.png) no-repeat center px2rem(20);
        background-size: px2rem(32);
        font-size: px2rem(24);
        color: #666;
        text-align: center;
        flex: none;
        margin-right: px2rem(44);
    }

    .originPriceBuybtn {
        background-color: #474747;
        color: #fff;
        font-size: px2rem(30);
        line-height: px2rem(100);
    }

    .cartBtn {
        background-color: #59ca80;
        color: #fff;
        font-size: px2rem(30);
        line-height: px2rem(100);
    }
}

.seckillBtn {
    &__buyBtn {
        background: #ffd72d;
        color: $auiTextColorImportant;
        font-size: $auiFontSizeLevel3;
        text-align: center;
    }
}

.teambuyBtn {
    &__singleBtn,
    &__teamBtn {
        height: 100%;
        padding-top: px2rem(16);
        line-height: px2rem(36) !important;
        text-align: center;
        color: #fff;
        background: $auiAttentionColor;
    }
}

.presale__btn {
    background: linear-gradient(to right, #5054ff, #cd50ff);
    background: -webkit-linear-gradient(left, #5054ff, #cd50ff);
    color: #fff;
    font-size: px2rem(24);
    padding: px2rem(20) px2rem(32) 0;
    @include flexbox();
    justify-content: space-between;

    & > span {
        text-align: left;
        line-height: 1.3;
    }

    div {
        line-height: 1.2;

        & > span {
            font-size: px2rem(32);
        }
    }
}
</style>
