<!--  created by yangjun -->
<template>
    <div>
        <div class="aui-cells" v-for="(merchant,index) in info.confirmVo.merchants">
            <!-- 商品信息 -->
            <h2 class="aui-cells_checkbox">
                <i class="cart_icon-shop"></i>{{merchant.shop.name}}
            </h2>
            <ul>
                <li>
                    <product :info="merchant"></product>
                </li>
            </ul>
            <div v-if="productPresetData!==null" class="aui-cell" style="height: auto">
                <productPresaleInfo :info="presaleInfo"></productPresaleInfo>
            </div>
            <!-- N件任选增加活动优惠列表，兼容之前的优惠数据，新增A+会员卡在dom上有小差异-->
            <template v-if="merchant.discountFees&&merchant.discountFees.length">
                <div class="aui-cell select aui-cell_textoverflow vip-tips" v-for="discount in merchant.discountFees">
                    <span v-if="discount.discountType === 'Vip'">
                        <img :src="iconImg">
                    </span>
                    <div class="aui-cell__bd">{{discount.title}}</div>
                    <div class="aui-cell__ft"><template v-if="discount.discountType === 'Vip'">-￥</template>{{discount.discountAmt|formatNum}}</div>
                </div>
            </template>
            <a class="aui-cell aui-cell_access select" href="javascript:;" @click="showCoupon(index,merchant.shop.merchantId)">
                <div class="aui-cell__bd">
                    <p>红包</p>
                </div>
                <div class="aui-cell__ft">{{merchant.couponVo.useEffect}}</div>
            </a>
            <div class="aui-cell aui-cell_textoverflow select">
                <div class="aui-cell__bd">
                    运费
                </div>
                <div class="aui-cell__ft">{{merchant.postfee || "包邮"}}</div>
            </div>
            <div class="aui-cell" v-if="!isEndPay">
                <div class="aui-cell__hd">
                    <label class="aui-label">买家留言</label>
                </div>
                <div class="aui-cell__bd">
                    <input v-model="merchant.buyerMessage" @blur="confirmMsg(index)" class="aui-input" type="text" maxlength="120" placeholder="若需要发票等要求，请在这里填写">
                </div>
            </div>
            <div v-if="productPresetData!==null" class="aui-cell" style="height: auto">
                <productPresaleStep :info="productPresetData.payinfos"></productPresaleStep>
            </div>
            <p class="proInfos aui-cell">
                <span class="proNum">共{{merchant.count}}件商品</span>
                <span class="proPrice">小计:<i>￥{{merchant.shopTotalPrice|formatNum}}</i></span>
            </p>
        </div>
        <item :stageLabel="stageLabel"></item>
        <insurance v-if="accidentInsurance.isShow"></insurance>
        <popup :isPop="isPop" @complete="popSelect" @cancel="popCancel">
            <!-- <keep-alive> -->
            <components slot="content" :is="componentName" :popData="popData" @confirm="popSelect"></components>
            <!-- </keep-alive> -->
        </popup>
    </div>
</template>
<script>
/* 组件库 */
import { createNamespacedHelpers } from 'vuex'
import axdImage from 'components/image/index.vue'
import product from './product.vue'
import item from '../../common/confirm_item/item_product.vue'
import insurance from '../../common/confirm_item/insurance.vue'
import popup from 'components/popup/index.vue'
import { productCouponMixin } from 'module/trade/common/assets/pop_multi'
import productPresaleInfo from './presale-info.vue'
import productPresaleStep from './presale-step.vue'
const { mapState, mapMutations } = createNamespacedHelpers('trade/confirm')

export default {
    name: 'merchantMore',
    mixins: [productCouponMixin],
    props: {
        info: Object,
        stageLabel: Object,
        isEndPay: Boolean,
        productPresetData: {
            type: Object
        }
    },
    data() {
        return {
            iconImg: require('src/assets/images/icon_vip.svg')
            //  presaleInfo: null,
            //  presaleStep: null
        }
    },
    computed: {
        ...mapState({
            createOrderSku: state => state.createOrderSku,
            accidentInsurance: state => state.accidentInsurance
        }),
        presaleInfo() {
            if (!this.productPresetData) {
                return
            }
            let { price = '', depositDiscount = '', actualPrice = '' } = this.productPresetData
            return {
                price,
                depositDiscount,
                actualPrice
            }
        }
    },
    components: {
        productPresaleInfo,
        productPresaleStep,
        axdImage,
        product,
        item,
        insurance,
        popup
    },
    mounted() {
        // this.initPresetData()
    },

    methods: {
        ...mapMutations([
            'CONFIRM_INIT',
            'EDIT_SKUPARAM'
        ]),
        showCoupon(i, merId) {
            // if (typeof this.info.confirmVo.merchants[i].couponVo.code == 'undefined') {
            //     return false
            // }
            let queryParams = JSON.parse(this.$route.query.data)
            let proArr = this.info.confirmVo.merchants[i].carts.map(({ num, skuId, activityIds }) => {
                let merchantId = this.info.confirmVo.merchants[i].shop.merchantId
                let { goodsType, outOrderId } = queryParams[i]
                console.log(goodsType, outOrderId)

                return { merchantId, num, skuId, activityIds, goodsType, outOrderId }
            })
            // proArr = proArr.join(',')
            // 存储获取商铺红包所需参数 格式1,1,1,1

            this.CONFIRM_INIT({
                commonCouponParam: proArr,
                couponForMerchantIndex: i
            })
            this.showCouponPop(i, merId)
        },
        confirmMsg(i) {
            // 提交商铺留言
            let copyCOS = JSON.parse(JSON.stringify(this.createOrderSku))
            copyCOS[i].buyerMessage = this.info.confirmVo.merchants[i].buyerMessage
            this.EDIT_SKUPARAM(copyCOS)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.fr {
    float: right;
}

h2 {
    position: relative;
    padding-left: px2rem(80);
    padding-right: px2rem(32);
    font-size: px2rem(28);
    color: #222;
    font-weight: normal;
    line-height: px2rem(80);
    background-color: #fff;
    border-bottom: px2rem(1) solid #dcdcdc;
}

.cart_icon-shop {
    position: absolute;
    left: px2rem(32);
    top: px2rem(20);
    width: px2rem(40);
    height: px2rem(40);
    background: url(../../cart/images/icon-shop.png) no-repeat 0 0;
    background-size: cover;
}

.proInfos.aui-cell {
    display: block !important;
    line-height: px2rem(96);
    text-align: right !important;
    padding: 0;
    padding-right: px2rem(30);
    height: auto;

    .proNum {
        font-size: px2rem(24);
        margin-right: px2rem(33);
    }

    .proPrice {
        font-size: px2rem(26);

        i {
            font-size: px2rem(30);
        }
    }
}

.vip-tips.aui-cell {
    img {
        width: px2rem(40);
        height: px2rem(28);
        margin-right: px2rem(10);
    }
    .aui-cell__ft {
        color: #131314;
    }
}
</style>
