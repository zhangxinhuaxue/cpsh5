<!--
created: daly, on 09/12/2018
场景价格未给到 需要后期修改  TO DO
-->
<template>
    <div class="pd__presale">
        <div class="pd__presaleLine1">
            <p class="pd__presales1"><i>￥</i><span v-html="complexMoney(presalePrice, 100, true)"></span></p>
            <p class="pd__presales2">预售价</p>
            <p class="pd__presales3">原价￥<span v-html="complexMoney(originPrice, 100, true)"></span></p>
            <!-- <p class="pd__presales4">剩余<i>{{stock}}</i>件</p> -->
            <!-- 已预定xx -->
            <p class="pd__presales4">{{preSaleNum}}</p>
        </div>
        <p class="pd__presaleLine2">定金￥<span v-html="complexMoney(presale.deposit, 100, true)"></span></p>
        <div class="pd__presaleLine3">
            <p>支付尾款时间:{{presale.retainageStart | dateFormat('MM月dd日hh:mm')}} 〜{{presale.retainageEnd | dateFormat('MM月dd日hh:mm')}}
                <br>付尾款后{{presale.shipTime}}天内发货</p>
            <span @click="toContact">预售规则 <i class="icon-arrow2"></i></span>
        </div>
    </div>
</template>
<script>
import { resetHeader } from 'components/header/resetHeader'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('trade/product')

export default {
    name: 'presale',
    computed: {
        ...mapState({
            presale: state => state.initData.presale,
            originPrice: state => state.interactData.presale.originPrice,
            preSaleNum: state => state.initData.trade.preSaleNum,
            stock: state => state.initData.trade.stock,
            presalePrice: state => state.interactData.presale.price
        }),
        ...mapGetters([
            'price'
        ])
    },
    methods: {
        toContact() {
            resetHeader()
            let env = this.isApp ? '/app' : '/h5'
            let url = env + '/user/contract/viewTemplate/CT181009691'
            window.location.href = url
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

.pd__presale {
    padding: px2rem(40) px2rem(32) 0;
    line-height: 1;
    background-color: #fff;

    &Line1 {
        font-size: px2rem(24);
        overflow: hidden;

        p {
            float: left;
        }
    }

    &s1 {
        color: #8C50FF;
        font-size: px2rem(40);
        font-weight: 600;

        i {
            font-size: px2rem(28);
            // letter-spacing: px2rem(-4);
        }
    }

    &s2 {
        margin-top: px2rem(8);
        margin-left: px2rem(10);
        background-color: #8C50FF;
        font-size: px2rem(20);
        padding: 0 px2rem(10);
        line-height: px2rem(28);
        border-radius: px2rem(14);
        color: #fff;
    }

    &s3 {
        margin-top: px2rem(11);
        margin-left: px2rem(20);
        color: #999;
        text-decoration: line-through;
    }

    &s4 {
        float: right !important;
        margin-top: px2rem(8);
        color: #999;

        i {
            color: #666;
        }
    }

    &Line2 {
        font-size: px2rem(24);
        color: #F66045;
        margin-bottom: px2rem(20);

        // i {
        //     letter-spacing: px2rem(-4);
        // }
    }

    &Line3 {
        color: #999;
        font-size: px2rem(24);
        overflow: hidden;

        p {
            float: left;
            line-height: 1.2;
        }

        span {
            float: right;
            color: #666;

            i {
                font-size: px2rem(24);
                color: #666;
            }
        }
    }
}
</style>
