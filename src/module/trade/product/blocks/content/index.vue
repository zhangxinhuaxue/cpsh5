<!--
    Created by hity on 05/15/17
-->
<template>
    <div class="aui-content">
        <div class="banner">
            <axd-swiper v-if="firstScreenDone&&bannerImgs.length" :swipe-data='bannerImgs' :config='swipeConfig'></axd-swiper>
            <!-- TODO 这里有一个促销图标!!!! -->
            <img v-if="saleImgUrl" class="img_cuxiao" :src="saleImgUrl" alt="">
        </div>
        <div class="bargain" @click="toBargainDetail()" v-if="buyType=='bargain'&&bargainPrice">
            <span class="bargain__s1">砍</span>
            <span class="bargain__s2">去砍价<i class="icon-arrow2"></i></span>
            <p>最低价<span>￥</span><span v-html="complexMoney(bargainPrice, 100, true)"></span></p>
            <p>邀请好友来砍价</p>
        </div>
        <reservation v-if="isReservation" :productId="productId">
        </reservation>
        <presale v-if="buyType === 'presale'"></presale>
        <limittime v-if="buyType === 'limittime'"></limittime>
        <limit-seckill v-if="buyType === 'limitSeckill' && showInfo"></limit-seckill>
        <p v-if="productType==='COUPON'" class="product__coupon">该优惠券购买后自动发货，发券成功不支持退款</p>
        <axd-desc v-if="!isReservation"></axd-desc>
        <axd-tax v-if="isSeaAmoy"></axd-tax>
        <p class="limittime-show-date" v-if="buyType === 'limittime' && limittimeState === 'before'">
            {{limitStartTime}}
        </p>
        <axd-seckill v-if="buyType === 'seckill'"></axd-seckill>
        <!-- A+会员卡信息 -->
        <div v-if="!$_isCheck&&activity&&buyType=='vip'" class="vip-panel">
            <div class="vip-info">
                <i><img :src="iconImg"></i>
                <div class="vip-info__right">
                    <p v-if="prefer&&prefer!=0" class="tips1">会员下单立减<span>{{prefer | formatNum}}</span>元</p>
                    <p v-else class="tips1">
                        会员下单享折扣
                    </p>
                    <p v-if="!activity.member" class="tips2">更多爆款省到离谱</p>
                </div>
            </div>
            <a v-if="!activity.member" href="javascript:;" @click="goVipCard" class="aui-cell_access go-btn">
            <span>立即<br>开通</span>
            <div class="aui-cell__ft"></div>
        </a>
        </div>
        <div v-if="imgUrl" data-target="hotsale" @click="goLink"><img :src="imgUrl" alt=""></div>
        <!-- <axd-sell-point></axd-sell-point> -->
        <axd-teambuy v-if="buyType === 'teambuy'" :skuPopupInstance="skuPopupInstance"></axd-teambuy>
        <axd-attach></axd-attach>
        <div class="aui-cells">
            <!-- 预约类型，状态小于2（预约0&预约中1）不可选参数 -->
            <p v-if="!(isReservation&&reservationStatus<2)" class="sku-hook aui-cell" @click="popupSku">
                <template v-if="!hasJdSku">选择商品参数</template>
                <template v-if="hasJdSku">已选
                    <span class="skuTips">{{skuInfo}}</span>
                </template>
                <span class="com-more-icon more"></span>
            </p>
            <axd-spec v-if="firstScreenDone && productType == 'JD' && areaUpdateDone"></axd-spec>
            <div v-if="isSeaAmoy" class="aui-cell notice" @click="openNotice()">
                海淘商品购物须知
                <span class="com-more-icon more"></span>
            </div>
        </div>
        <axd-area v-if="firstScreenDone && productType == 'JD'"></axd-area>
        <!-- <div class="qa">
            <p class="qa__tag">问一问</p>
            <template v-if="qa.qTotal">
                <p class="qa__title">
                    <span class="qa-icon icon__question"></span>{{qa.title}}
                </p>
                <p class="qa__answer">{{qaAnswer}}</p>
            </template>
            <template v-else>
                <p class="qa__tips">
                    <span class="qa-icon icon__go-ask"></span>商品好不好，问问买过的人</p>
            </template>
            <p class="qa__btn-wrap" @click="goQuestionList">
                <a class="qa__more aui-btn_small">{{qaBtnTxt}}</a>
            </p>
        </div> -->
        <axd-shop v-if="firstScreenDone"></axd-shop>
        <axd-panel v-if="firstScreenDone"></axd-panel>
        <axd-totop v-if="firstScreenDone"></axd-totop>
    </div>
</template>
<script>
/* global Image */
import { mapState, mapMutations } from 'vuex'
import axdSwiper from 'components/swipe/swipe_v1.vue'
import axdDesc from './desc.vue'
// import axdSellPoint from './sellPoint.vue'
import axdAttach from './attach/index.vue'
import axdShop from './shop.vue'
import axdPanel from './panel/index.vue'
import axdSeckill from './seckill_part.vue'
import limitSeckill from './flashsale_info.vue'
import axdTeambuy from './teambuy_part.vue'
import axdTotop from 'components/totop/index.vue'
import axdSpec from './spec.vue'
import axdArea from './area.vue'
import axdTax from './tax.vue'
import limittime from './limittime.vue'
import reservation from './reservation.vue'

import presale from './presale.vue'
import { getQaInfo } from 'store/modules/trade/product'
import { AXD } from 'libs/util'
import { getDateTime, padStart } from 'libs/util'
import { vipcardUrl } from 'module/trade/common/assets/common'

export default {
    name: 'product-content',
    props: {
        skuPopupInstance: {
            type: Object
        }
    },
    data() {
        return {
            swipeConfig: {
                isAutoPlay: true,
                speed: 3000,
                isShowBullets: true
            },
            isAvail: false,
            qa: {
                title: '',
                qTotal: 0,
                aTotal: 0
            },
            vipcardUrl,
            iconImg: require('src/assets/images/icon_vip.svg')
        }
    },
    created() {
        this._getQaInfo()
    },
    computed: {
        ...mapState('trade', {
            desc: state => state.product.initData.desc,
            saleImgUrl: state => state.product.initData.sales.saleImgUrl,
            imgUrl: state => state.product.initData.sales.imgUrl,
            imgLink: state => state.product.initData.sales.url || 'javascript:;',
            bannerImgs: state => state.product.initData.desc.bannerImgs,
            buyType: state => state.product.initData.trade.buyType,
            isSeaAmoy: state => state.product.initData.desc.isSeaAmoy,
            firstScreenDone: state => state.product.interactData.firstScreenDone,
            tradeInteractObj: state => state.product.interactData.trade,
            productType: state => state.product.initData.shop.type,
            skuId: state => state.product.interactData.trade.skuId,
            skuInfo: state => state.product.interactData.jd.skuInfo,
            // 当切换sku时，是否显示限时抢购相关信息
            showInfo: state => state.product.interactData.limitSeckill.showInfo,
            limittimeState: state => state.product.initData.activity.state,
            startTime: state => state.product.initData.activity.timeStart,
            areaUpdateDone: state => state.product.interactData.jd.areaUpdateDone,
            bargainPrice: state => state.product.initData.activity.finalDiscountPrice,
            // A+会员价格优惠金额
            prefer: state => state.product.initData.trade.prefer,
            activity: state => state.product.initData.activity,
            isReservation: state => state.product.initData.trade.isReservation,
            reservationStatus: state => state.product.interactData.reservationStatus
        }),
        hasJdSku() {
            return this.skuId > 0 && this.productType == 'JD'
        },
        qaAnswer() {
            return this.qa.aTotal ? this.qa.aTotal + '个回答' : '暂无回答'
        },
        qaBtnTxt() {
            return this.qa.qTotal ? '查看全部问题' + this.qa.qTotal : '去提问'
        },
        productId() {
            return this.$route.params.productId
        },
        limitStartTime() {
            let date = new Date(getDateTime(this.startTime))
            return [
                this.format2string(date.getMonth() + 1),
                '月',
                this.format2string(date.getDate()),
                '日 ',
                this.format2string(date.getHours()),
                ':',
                this.format2string(date.getMinutes()),
                '开抢'
            ].join('')
        }
    },
    components: {
        axdSwiper,
        axdDesc,
        // axdSellPoint,
        axdAttach,
        axdShop,
        axdPanel,
        axdSeckill,
        limitSeckill,
        axdTeambuy,
        axdSpec,
        axdArea,
        axdTotop,
        axdTax,
        limittime,
        reservation,
        presale
    },
    methods: {
        ...mapMutations('trade/product', [
            'updateInteractData'
        ]),
        format2string(value) {
            return padStart(value.toString(), '0', 2)
        },
        goVipCard() {
            // 延迟100毫秒是为了添加埋点，防止埋点丢失情况
            setTimeout(() => {
                window.location.href = this.vipcardUrl
            }, 100)
        },
        popupSku() {
            this.updateInteractData({
                targetKey: 'trade',
                popupFrom: 'hook',
                isSkuPopOpen: true
            })
            this.skuPopupInstance.isPopup = true
        },
        openNotice() {
            window.location.href = '/cms/renderPage?alias=wyklhggz'
        },
        _getQaInfo() {
            getQaInfo({
                productId: this.productId
            }).then(({ success, resultDes, result }) => {
                if (success) {
                    let {
                        bestQuestion,
                        quesiontCount,
                        reply
                    } = result
                    this.qa = {
                        title: bestQuestion,
                        qTotal: AXD.util.stringToNumber(quesiontCount),
                        aTotal: AXD.util.stringToNumber(reply)
                    }
                } else {
                    resultDes && this.$_toast(resultDes)
                }
            })
        },
        goQuestionList() {
            this.$router.push({
                name: 'productQlist',
                query: {
                    productId: this.productId,
                    productName: this.desc.name
                }
            })
        },
        toBargainDetail() {
            window.location.href = '/activity/activity-bargain-main/index/share?productId=' + this.$route.params.productId
        },
        goLink() {
            window.location.href = this.imgLink
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.banner {
    position: relative;
    width: px2rem(750);
    height: px2rem(750);

    .img_cuxiao {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        z-index: 1;
        max-width: px2rem(750);
        max-height: px2rem(250);
    }
}

.vip-panel {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: px2rem(98);

    .vip-info {
        flex: 1;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        padding-left: px2rem(32);
        background-color: #F1E7DB;

        i {
            display: inline-block;
            width: px2rem(48);
            height: px2rem(34);
        }

        &__right {
            padding: px2rem(17) 0 px2rem(17) px2rem(13);
        }
    }

    .tips1 {
        font-size: px2rem(28);
        height: px2rem(36);
        line-height: px2rem(36);
        font-weight: bold;
        color: #131314;
    }

    .tips2 {
        font-size: px2rem(20);
        height: px2rem(28);
        line-height: px2rem(28);
        color: #717172;
    }

    .go-btn {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
        width: px2rem(152);
        background: linear-gradient(to left, #212121, #363636);
        color: #DFCC9E;
        font-size: px2rem(28);
        line-height: px2rem(38);
        padding-left: px2rem(15);

        span:last-child {
            margin-left: px2rem(13);
        }

        .aui-cell__ft {
            &:after {
                background-image: url('data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAYAAAC58NwRAAAArElEQVQ4T2N8dH5By79/DPmMDP/nyhklFDIyMv5nwAMYH5xd8JmB4T8PWA0j41x5w/hUfJoYH56dP+E/A0M+3FACmhj////P+PD8wtkM//8nE6OJEaSIFE1gDaRogmsgVhOKBmI0YWjApYmRgWGivHFiAVYNEE2rmB+d/3r9/38GVYgvGb8oGCfwUm4DoSAmP5QImQyLL9JjmliT4TaQnFpJzg8k5zh82RGbHAArSLoVkqlr1wAAAABJRU5ErkJggg==');
                right: px2rem(15);
                color: #DFCC9E;
            }
        }
    }
}

.limittime-show-date {
    background: #FFE9EA;
    height: px2rem(96);
    padding: px2rem(26) px2rem(32);
    font-size: px2rem(30);
    color: #FF6161;
}

.sku-hook,
.notice {
    position: relative;
    padding: 0 px2rem(32);
    margin: 0 auto;
    height: px2rem(96);
    font-size: $auiFontSizeLevel5;
    line-height: px2rem(96);
    color: #666;
    background-color: #fff;
}

.qa {
    padding: 0 px2rem(32);
    background-color: #fff;

    .qa__tag {
        padding: px2rem(25) 0 px2rem(30) 0;
        font-size: px2rem(28);
        color: #666666;
        line-height: 110%;
    }

    .qa__title,
    .qa__tips {
        font-size: px2rem(28);
        color: #666666;
        line-height: 130%;
        @include nLineLimit(1);
    }

    .qa-icon {
        display: inline-block;
        height: px2rem(30);
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-position: center center;
        margin-right: px2rem(6);
        vertical-align: text-bottom;
        position: relative; // 设计微调
        top: px2rem(-4);
    }

    .qa__tips {
        text-align: center;

        .icon__go-ask {
            width: px2rem(80);
            background-image: url(../../img/go-ask.png);
        }
    }

    .qa__title {
        .icon__question {
            width: px2rem(40);
            background-image: url(../../img/question.png);
        }
    }

    .qa__btn-wrap {
        text-align: center;
        padding-bottom: px2rem(40);

        .qa__more {
            padding: 0 px2rem(48);
            line-height: px2rem(50);
            height: auto;
            border-radius: px2rem(100);
        }
    }

    .qa__answer {
        padding-left: px2rem(46);
        font-size: px2rem(26);
        color: #999999;
    }
}

// 砍价浮标
.bargain {
    position: absolute;
    top: px2rem(597);
    left: px2rem(33);
    z-index: 2;
    font-size: px2rem(24);
    width: px2rem(460);
    height: px2rem(90);
    line-height: px2rem(90);
    padding-left: px2rem(102);
    padding-right: px2rem(127);
    padding-top: px2rem(12);
    color: #fff;
    border-radius: px2rem(45);
    background: linear-gradient(to right, rgba(238, 36, 60, 0.75) 30%, rgba(253, 53, 73, 1), rgba(253, 53, 73, 1));

    &__s1 {
        position: absolute;
        left: 0;
        top: 0;
        width: px2rem(90);
        height: px2rem(90);
        text-align: center;
        border-radius: 50%;
        font-size: px2rem(46);
        background-color: #F62C40;
    }

    &__s2 {
        position: absolute;
        right: px2rem(24);
        top: 0;
    }

    .icon-arrow2 {
        font-size: px2rem(22);
        position: relative;
        top: px2rem(2);
        left: px2rem(7);

        &:before {
            color: #fff;
        }
    }

    p {
        line-height: px2rem(33);

        span {
            font-size: px2rem(36);

            font {
                font-size: px2rem(18);
            }
        }
    }
}

.product__coupon {
    color: #FF9000;
    font-size: px2rem(24);
    padding: px2rem(24) px2rem(32) 0;
    background-color: #fff;
}
</style>
