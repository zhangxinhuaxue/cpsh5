<!--
    Created by hity on 05/19/17
-->
<template>
    <div class="desc">
        <p class="desc__title" :style="h5Style">
            <span v-if="nameTags" class="aui-tag_bgcolor">{{nameTags[0]}}</span> <span v-if="isSeaAmoy" class="aui-tag_bgcolor haitao">海淘</span> {{name}}
        </p>
        <!-- <a class="desc__share" v-if="isApp" @click="share()"><i class="icon-share"></i>分享</a> -->
        <p class="desc__money" v-if="buyType != 'seckill'&& !isReservation && !(buyType == 'limitSeckill' && showInfo) && buyType != 'limittime' && buyType != 'presale'">
            <span class="desc__money--info">
                <span class="money-icon">¥</span>
            <span class="desc__price" v-html="complexMoney(price, 100, true)"></span>
            </span>
            <template v-if="priceTags">
                <span v-for="(item, idx) of priceTags" :key="idx" class="aui-tag_bgcolor">{{item}}</span>
            </template>
            <!-- <span class="desc__rest">剩余<em>{{stock}}</em>件</span> -->
            <span class="desc__rest">已售<strong>{{showSumSale || '0'}}</strong>件</span>
        </p>
        <axd-share v-if="shareConfig" :config="shareConfig"></axd-share>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import { appShare } from 'src/libs/share'
import axdShare from 'components/share/index.vue'
const { mapState, mapGetters } = createNamespacedHelpers('trade/product')

export default {
    data() {
        return {
            shareConfig: null
        }
    },
    watch: {
        name(newValue) {
            if (newValue) {
                let shareConfig = {
                    title: this.name,
                    img: this.imgUrl,
                    url: window.location.href
                }

                // 限时抢购分享文案处理
                if (this.buyType === 'limitSeckill') {
                    shareConfig.title = '【低价秒杀】' + shareConfig.title
                    shareConfig.desc = '秒杀价' + (this.minPrice / 100).toFixed(2) + '元，不容错过！'
                }

                this.shareConfig = shareConfig
            }
        }
    },
    computed: {
        ...mapState({
            bannerImgs: state => state.initData.desc.bannerImgs,
            nameTags: state => state.initData.desc.nameTags,
            priceTags: state => state.initData.desc.priceTags,
            name: state => state.initData.desc.name,
            imgUrl: state => state.initData.desc.imgUrl,
            isSeaAmoy: state => state.initData.desc.isSeaAmoy,
            stock: state => state.initData.trade.stock,
            buyType: state => state.initData.trade.buyType,
            isReservation: state => state.initData.trade.isReservation,
            showSumSale: state => state.initData.trade.showSumSale,
            // 当切换sku时，是否显示限时抢购相关信息
            showInfo: state => state.interactData.limitSeckill.showInfo,
            minPrice: state => state.initData.trade.minPrice
        }),
        ...mapGetters([
            'price'
        ]),
        h5Style() {
            return this.isApp ? '' : 'width: 100%'
        },
        // 联想外放分享提示不可用
        isLenovo() {
            return navigator.userAgent.toLowerCase().indexOf('com.subaxd.axd') > -1
        }
    },
    methods: {
        share() {
            if (this.isLenovo) {
                this.$_toast('暂时无法分享')
                return
            }
            if (this.isApp) {
                appShare()
            }
        }
    },
    components: {
        axdShare
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.desc {
    position: relative;
    padding: px2rem(22) px2rem(32) px2rem(18);
    padding-top: px2rem(32);
    background-color: #fff;

    .desc__title {
        width: px2rem(660);
        min-height: px2rem(70);
        color: #222;
        font-size: $auiFontSizeLevel3;
        line-height: px2rem(42);
        @include nLineLimit(2);

        .aui-tag_bgcolor {
            position: relative;
            top: px2rem(-4);
            background: $auiAttentionColor;
        }

        .haitao {
            background: #9012FE;
            color: #fff;
        }
    }

    .desc__share {
        position: absolute;
        top: px2rem(32);
        right: px2rem(32);
        width: px2rem(60);
        padding-top: px2rem(48);
        font-size: $auiFontSizeLevel7;
        line-height: px2rem(34);
        color: #999;

        .icon-share {
            position: absolute;
            top: 0;
            left: 0;
            font-size: px2rem(48);
        }
    }

    .desc__money {
        @include flexbox();
        @include flexVert();
        position: relative;
        padding-top: px2rem(20);

        &>* {
            flex: none;
        }

        .desc__money--info {
            @include flexbox();
            @include flexVertBase();

            .desc__price {
                flex: none;
                font-size: px2rem(44);
                color: $auiAttentionColor;
                line-height: 100%;
                font-weight: bold;
            }

            .money-icon {
                flex: none;
                color: $auiAttentionColor;
                font-size: $auiFontSizeLevel5;
                line-height: px2rem(44);
                padding-right: px2rem(10);
            }
        }

        .aui-tag_bgcolor {
            background: #F99E00;
            border-color: #F99E00;
            margin-left: px2rem(10);
        }

        span:nth-of-type(3) {
            margin-left: px2rem(20);
        }

        .desc__rest {
            position: absolute;
            right: 0;
            top: px2rem(24);
            font-size: $auiFontSizeLevel7;
            line-height: px2rem(44);
            color: $auiTextColorAssistant;

            em {
                color: #666;
            }
        }
    }
}
</style>
