<template>
    <a :href="'/pages/mall/product/'+productConfig.productId">
        <axd-image :src="productConfig.imgUrl" :lazy="false" :resizeW="290" :class="['flashsale__product__img', {'grey': ((productConfig.stock==0 && status=='started') || status=='end')}, {'end': status=='end'}, {'undercarriage': productConfig.stock==0 && status=='started'}]">
        </axd-image>
        <p class="flashsale__product__desc">
            {{productConfig.productName}}
        </p>
        <p class="flashsale__product__price" :style="{color: '#'+styleConfig.secKillPriCharColor}">
            秒杀价 ¥<span v-html="formatPrice(productConfig.minPrice)"></span>
        </p>
        <p class="flashsale__product__originPrice" :style="{color: '#'+styleConfig.originPriCharColor}" v-html="'¥' + formatPrice(productConfig.originPrice)">
        </p>
        <!-- 样式A：未开抢带提醒，样式B：未开抢显示开抢时间 -->
        <a href="javascript:;" class="flashsale__product__btn" :style="btnStyle" @click="setRemind">
            {{btnText}}
        </a>
    </a>
</template>
<script>
import { formatComplexMoney } from 'src/libs/util'
import axdImage from 'src/components/image/index.vue'
import {
    setCMSRemindDetail
} from 'src/store/modules/flashsale/index'
import axdToast from 'components/toast/index'
import {
    AXD
} from 'src/libs/util'
export default {
    name: 'flashsale-product',
    props: {
        styleConfig: Object,
        productConfig: Object,
        entryConfig: Object,
        status: { // 限时抢购状态：未开抢 || 抢购中 || 已结束
            type: String,
            default: ''
        },
        formatStartTime: String,
        customLoginParam: Object
    },
    data() {
        return {
            hasSetRemind: false // 是否设置过提醒
        }
    },
    computed: {
        btnText() {
            if (this.status === 'started') {
                return Number(this.productConfig.stock) ? '立即抢购' : '已抢完'
            } else if (this.status === 'end') {
                return '已结束'
            } else if (this.status === 'before') {
                if (this.styleConfig.blockStyle === 'styleA') {
                    return (this.productConfig.reminded || this.hasSetRemind) ? '已提醒' : '设置提醒'
                } else {
                    return this.formatStartTime
                }
            }
        },
        btnStyle() {
            if (this.status === 'started') {
                return Number(this.productConfig.stock) ? this.seckillBtnStyle : this.endBtnStyle
            } else if (this.status === 'end') {
                return this.endBtnStyle
            } else if (this.status === 'before') {
                if (this.styleConfig.blockStyle === 'styleA') {
                    return (this.productConfig.reminded || this.hasSetRemind) ? this.hasSetNoticeBtnStyle : this.beforeBtnStyleA
                } else {
                    return this.beforeBtnStyleB
                }
            }
        },
        beforeBtnStyleA() {
            return {
                backgroundColor: '#' + this.styleConfig.setNoticeButtColor,
                color: '#' + this.styleConfig.setNoticeCharColor
            }
        },
        hasSetNoticeBtnStyle() {
            return {
                backgroundColor: '#' + this.styleConfig.hasSetNoticeButtColor,
                color: '#' + this.styleConfig.hasSetNoticeCharColor
            }
        },
        beforeBtnStyleB() {
            return {
                backgroundColor: '#' + this.styleConfig.secKillStartButtColor,
                color: '#' + this.styleConfig.secKillStartCharColor
            }
        },
        endBtnStyle() {
            return {
                backgroundColor: '#' + this.styleConfig.secKillEndButtColor,
                color: '#' + this.styleConfig.secKillEndCharColor
            }
        },
        seckillBtnStyle() {
            return {
                backgroundColor: '#' + this.styleConfig.secKillNowButtColor,
                color: '#' + this.styleConfig.secKillNowCharColor
            }
        },
        goProductId() {
            return this.status != 'end' && this.productConfig.stock > 0 ? this.productConfig.productId : this.productConfig.copyPid
        }
    },
    components: {
        axdImage
    },
    created() {},
    methods: {
        formatPrice(price) {
            return formatComplexMoney(price, 100, true)
        },
        setRemind(e) {
            if (this.status !== 'before' || this.styleConfig.blockStyle !== 'styleA') return
            e.preventDefault()

            if (this.productConfig.reminded || this.hasSetRemind) {
                axdToast('您已设置提醒')
            } else {
                setCMSRemindDetail({
                    entryId: this.productConfig.seckilEntryId,
                    productId: this.productConfig.productId
                }).then((data) => {
                    if (data.success) {
                        axdToast('开抢提醒设置成功')
                        this.hasSetRemind = true
                    } else {
                        if (data.code == '-1999') {
                            AXD.util.login(this.customLoginParam)
                        } else {
                            axdToast(data.result)
                        }
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.flashsale__product {
    display: block;
    float: left;
    width: px2rem(290);
    height: px2rem(510);
    margin-right: px2rem(10);
    background-color: #ffffff;

    &:first-child {
        margin-left: px2rem(15);
    }
    &:last-child {
        margin-right: px2rem(15);
    }

    &__img {
        display: -webkit-flex;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        justify-content: center;
        align-items: center;

        position: relative;
        width: 100%;
        height: px2rem(290);
        img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
        }
    }
    &__img.grey:after {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: px2rem(-90);
        margin-left: px2rem(-90);
        width: px2rem(180);
        height: px2rem(180);
        border-radius: px2rem(90);
        background-color: rgba(0, 0, 0, .6);
        color: #ffffff;
        text-align: center;
        line-height: px2rem(180);
        font-size: px2rem(30);
    }

    &__desc {
        width: 100%;
        height: px2rem(60);
        line-height: px2rem(32);

        margin: px2rem(15) 0 0;
        padding: 0 px2rem(14);
        font-size: px2rem(26);
        color: #666666;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    &__price {
        padding-left: px2rem(16);
        font-size: px2rem(16);
        span {
            font-size: px2rem(32);
            font-weight: bold;
        }
    }
    &__originPrice {
        padding-left: px2rem(13);
        font-size: px2rem(24);
        text-decoration: line-through;
    }
    &__btn {
        display: block;
        margin: 0 auto;
        width: px2rem(260);
        height: px2rem(50);
        text-align: center;
        line-height: px2rem(50);
        font-size: px2rem(26);
        border-radius: px2rem(4);
    }
}

.end:after {
    content: '已结束';
}

.undercarriage:after {
    content: '已抢完';
}
</style>
