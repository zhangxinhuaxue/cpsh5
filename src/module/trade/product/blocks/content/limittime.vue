<!--
created: hity, on 03/28/2018
-->
<template>
    <div id="pd-limit" :style="{ backgroundColor: bgColor}">
        <img class="pd-limit_ad" v-if="limittime.adUrl" :src="limittime.adUrl" />
        <div class="pd-limit_bd" :style="{backgroundImage: 'url(' + bgImg + ')'}">
            <div class="pd-limit_price">
                <span class="pd-limit_price_activity">
                    <em>¥ </em><span v-html="complexMoney(discountPrice, 100, true)"></span>
                </span>
                <p class="pd-limit_price_normal">
                    <span class="price_up"><em>¥</em><span v-html="complexMoney(price, 100, true)"></span></span>
                    <span class="desc__rest">已售<strong>{{showSumSale || '0'}}</strong>件</span>
                </p>
            </div>
            <div class="seckill-wrap"></div>
        </div>
    </div>
</template>
<script>
import { getSystime } from 'store/modules/trade/product'
import { formatDateTime } from 'src/libs/util/util'
import Seckill from 'src/libs/seckill'
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('trade/product')

export default {
    name: 'pdLimit',
    data() {
        return {
            seckillObj: null
        }
    },
    computed: {
        ...mapState({
            limittime: state => state.initData.activity,
            showSumSale: state => state.initData.trade.showSumSale
        }),
        ...mapGetters({
            price: 'price',
            discountPrice: 'discountPrice'
        }),
        bgColor() {
            let {
                state,
                beforeBgColor,
                ingBgColor
            } = this.limittime
            console.log('state', state)
            console.log('bg', state === 'before' ? beforeBgColor : (state === 'ing' ? ingBgColor : '#fff'))
            return state === 'before' ? beforeBgColor : (state === 'ing' ? ingBgColor : '#fff')
        },
        bgImg() {
            let beforeBgImg = 'https://img.aiyoumi.com/null/2018328/150246894/20180328150246_750x86.png?height=86&width=750'
            let ingBgImg = 'https://img.aiyoumi.com/null/2018328/1504140/20180328150413_750x86.png?height=86&width=750'
            let state = this.limittime.state
            return state === 'before' ? beforeBgImg : (state === 'ing' ? ingBgImg : '')
        }
    },
    beforeDestroy() {
        this.seckillObj.destory()
    },
    mounted() {
        this.init()
    },

    methods: {
        ...mapMutations([
            'updateInitData'
        ]),

        init() {
            this.seckillObj = new Seckill({
                el: document.querySelector('.seckill-wrap'),
                during: 1000,
                style: '#seckill',
                template: '<span class="block">$h$h</span> : <span class="block">$m$m</span> : <span class="block">$s$s</span> $isBefore{后开始}$isIng{后结束}',
                endTime: this.limittime.timeEnd,
                startTime: this.limittime.timeStart,
                getServerTime: () => {
                    return new Promise((resolve, reject) => {
                        getSystime().then(({ success, result }) => {
                            resolve({
                                success,
                                serverTime: result
                            })
                        })
                    })
                },
                beginSeckillCb: () => {
                    // 改变vuex中限时抢购状态变量
                    this.updateInitData({
                        targetKey: 'activity',
                        state: 'ing'
                    })
                }
            })
            this.seckillObj.init()
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

.pd-limit_bd {
    display: flex;
    justify-content: space-between;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
    padding: px2rem(10) px2rem(32);

    .pd-limit_price {
        position: relative;
        display: flex;

        .pd-limit_price_activity {
            font-size: px2rem(70);
            color: #FFFFFF;
            line-height: px2rem(70);

            em {
                font-size: px2rem(32);
            }
        }

        .pd-limit_price_normal {
            display: inline-block;
            position: relative;
            // height: px2rem(100);
            font-size: px2rem(24);
            color: #DFFFEA;
            line-height: px2rem(32);
            padding: px2rem(35) 0 0 px2rem(20);

            .price_up {
                position: absolute;
                left: px2rem(20);
                top: 0;
                text-decoration: line-through;
            }

            .desc__rest {
                height: px2rem(34);
                line-height: px2rem(34);
                background: rgba(219, 41, 41, 1);
                border-radius: px2rem(4);
                padding: 0 px2rem(8);
                font-size: px2rem(22);
                line-height: px2rem(44);
                color: #fff;

                em {
                    color: #666;
                }
            }
        }
    }

    .seckill-wrap {
        align-self: center;
        font-size: px2rem(28);
        color: #FFFFFF;

        #seckill span {
            background: #3E2E2C;
            border-radius: px2rem(4);
            font-size: px2rem(28);
            line-height: px2rem(40);
            display: inline-block;
            text-align: center;
            padding: px2rem(6) px2rem(10);
        }
    }
}
</style>
