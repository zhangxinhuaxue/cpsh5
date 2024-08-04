<template>
    <div class="order-list">
        <order-list v-for="(item,index) in orderArr" :key="item.trade.id" :orderInfo="item.order" @complete="goDetail(item.order[0].id)">
            <div class="order-info__sub top-line">
                共1件商品
                <template v-if="item.trade.postFee>0">邮费:￥{{item.trade.postFee | toRMB(100)}}</template> 实付:<span>￥{{item.trade.amount | toRMB(100)}}</span>
            </div>
            <div class="order__btns top-line">
                <a v-if="item.trade.status=='WAIT_SELLER_SEND_GOODS'" href="javascript:;" class="aui-btn_small-bg weaken" @click="openImFn(item)">联系客服</a>
            </div>
        </order-list>
    </div>
</template>
<script>
import orderList from 'module/common/order2/order-list.vue'
import { openIm } from 'src/libs/im'
import { AXD } from 'libs/util'
export default {
    name: 'myOrderAll',
    filters: {
        cardBtnText(isShow) {
            return isShow ? '收起卡密' : '查看卡密'
        }
    },
    props: {
        orderArr: Array
    },

    data() {
        return {
            isShowCardArr: [],
            IMtype: 'callphone',
            sdkParams: null
        }
    },

    components: {
        orderList
    },
    watch: {
        orderArr(to, from) {
            this.initCardArr()
            // console.log('watch-change')
        }
    },
    methods: {
        openImFn(item) {
            if (!this.isApp) {
                window.location.href = aixuedai.appDownloadUrl
                return false
            }
            AXD.util.isLogin(false).then(() => {
                let params = {
                    productId: item.order[0].productId,
                    merchantId: item.trade.strMerchantId || ''
                }
                // 打开客服
                openIm(params)
            }, () => {
                // 未登录
                AXD.util.login()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.order-list {
    font-size: px2rem(26);
    padding: px2rem(30) px2rem(32) 0;
}

.order__btns .aui-btn_small.card-btn {
    padding-right: px2rem(20);
}

.icon-arrow2 {
    display: inline-block; //position: absolute;
    // top: 50%;
    // right: px2rem(20);
    font-size: px2rem(22); // transform-origin: 50% 50%;
    font-weight: 700;
    transition: transform .5s;
    &:before {
        color: #f99e00;
    } // translateY(-50%)
    &.down {
        transform: scale(0.7) rotate(90deg)
    }
    &.up {
        transform: scale(0.7) rotate(270deg)
    }
}
</style>
