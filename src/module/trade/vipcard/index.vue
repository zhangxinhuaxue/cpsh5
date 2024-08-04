<template>
    <div class="pay" v-if="skuList.length != 0">
        <div class="part1">
            <img class="part1-img" src="./images/A+VIP.png" alt="">
        </div>
        <ul class="part2">
            <li class="grid" v-for="icon in rightIcons" :key="icon.bgImg">
                <img class="icon" :src="icon.bgImg" :alt="icon.hotArea[0].url">
                <div
                  v-for="(hotArea, key) in icon.hotArea"
                  :key="hotArea.url"
                  :class="`text${key+1}`">{{ hotArea.url }}</div>
            </li>
        </ul>
        <div class="part3">
            <div
              :class="['part3-price', {'part3-price_active': curIndex === index}]"
              v-for="(sku, index) in skuList"
              :key="sku.skuName"
              @click="choose(index, sku)">
                <div class="part3-price_inner1">
                    <img v-if="curIndex === index" class="price-check" src="./images/checked1.png" alt="">
                    <img v-else class="price-check" src="./images/check1.png" alt="">
                    <span class="price-title">{{ sku.skuName }}</span>
                    <span class="skuSubName">有效期{{sku.days}}天</span>
                </div>
                <div class="part3-price_inner2">
                    <div class="price-current">￥{{ (parseInt(sku.price)/100).toFixed(2) }}</div>
                    <div class="price-init">原价￥{{ (parseInt(sku.originalPrice)/100).toFixed(2) }}</div>
                </div>
            </div>
            <div class="part3-protocols">
                <img v-if="readed" @click="readProtocols" class="protocols-check" src="./images/checked2.png" alt="">
                <img v-else @click="readProtocols" class="protocols-check" src="./images/check2.png" alt="">
                <span>阅读同意</span>
                <span class="protocols-link" @click="goProtocols">《招集令招财卡会员服务协议》</span>
            </div>
            <div :class="['part3-button', {'part3-button_disabled': !readed}]" @click="confirm">立即支付</div>
        </div>
    </div>
</template>
<script>
import {
    AXD
} from 'libs/util'
import { getSkuInfo } from 'src/store/modules/trade/vipcard'
import { renderDataCms } from 'src/store/api'
import {
    virtualCreateTradeV3
} from 'store/modules/trade/virtual'
import {
    payMixinMulti
} from '../common/assets/order_multi'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/virtual')
export default {
    name: 'vipcardConfirm',
    mixins: [payMixinMulti],
    data() {
        return {
            curIndex: 0,
            readed: false,
            skuList: [],
            sku: {},
            csrfToken: '',
            comfirmFunction: virtualCreateTradeV3,
            renderData: [],
            isAppDomain: location.host.indexOf('app') === 0,
            rightIcons: []
        }
    },
    computed: {
        // rightIcons() {
        //     let iconObj = this.renderData.find(data => data.title === '权益图标_购买页')
        //     return iconObj && JSON.parse(JSON.parse(iconObj.objList))
        // },
        relativePath() {
            return (this.isApp && this.isAppDomain) ? '/app/user/contract/viewTemplate/' : '/h5/user/contract/viewTemplate/'
        }
    },
    mounted() {
        Promise.all([
            getSkuInfo(),
            renderDataCms({
                alias: 'vipcard',
                type: '/cms'
            })
        ]).then(res => {
            if (res.every(data => data.success)) {
                let [skuData, renderData] = res
                this.skuList = skuData.result.skuList
                this.sku = skuData.result.skuList[0]
                this.csrfToken = skuData.result.csrfToken
                this.renderData = renderData.result.blocks
                if(renderData && renderData.result && renderData.result.blocks) {
                    let iconObj = this.renderData.find(data => data.title === '权益图标_购买页')
                    this.rightIcons = JSON.parse(JSON.parse(iconObj.objList))
                }
            } else if (res.some(data => data.code === '10010' || data.code === '-1999' || data.code === '-1997')) {
                AXD.util.login()
            } else {
                this.$_toast('页面初始化失败，请稍后再试')
            }
        })
    },
    methods: {
        ...mapMutations([
            'saveVirtualData'
        ]),
        choose(index, sku) {
            this.curIndex = index
            this.sku = sku
        },
        readProtocols() {
            this.readed = !this.readed
        },
        confirm() {
            if (!this.readed) {
                this.$_toast('请阅读并同意会员服务协议')
                return
            }
            // let params = {
            //     csrfToken: this.csrfToken, // 唯一性验证，防止重复提交
            //     // cpCode: this.storeCouponCode,
            //     num: 1,
            //     skuId: this.sku.skuId,
            //     goodsType: 'vipcard' // 类型 micard
            // }
            this.saveVirtualData({
                source: 'vipcard',
                activityIds: [],
                isRefresh: 'n', // 确认页刷新isRefresh值丢失返回上一页
                skuId: this.sku.skuId,
                confirm: {
                    num: 1
                },
                skus: {
                    id: this.sku.skuId
                },
                goodstype: 'vipcard',
                rechargeTitle: this.sku.skuName
            })
            this.$router.push({
                name: 'virtualConfirm'
            })
            // this.createOrder(params)
        },
        goProtocols() {
            window.location.href = this.relativePath + 'ZJL_ZCK'
        }
    }
}
</script>
<style scoped lang="scss">
// @function px2rem( $px  ){
//     @return $px*320/$designWidth/20 + rem;
// }
$designWidth: 750;
.pay {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    background: #fff;
    .part1 {
        width: 100%;
        height: px2rem(200);
        background: url('./images/part1bg.png') no-repeat 0 0;
        background-size: px2rem(750) auto;
        // background: linear-gradient(90deg,rgba(86,80,78,1) 0%,rgba(39,37,36,1) 100%);
        &-img {
            width: px2rem(333);
            height: px2rem(38);
            position: absolute;
            top: px2rem(47);
            left: 50%;
            transform: translateX(-50%);
        }
    }
    .part2 {
        position: absolute;
        top: px2rem(115);
        left: 0;
        width: px2rem(690);
        height: px2rem(230);
        // background-image: url('./images/pay_bg.png');
        // background-size: px2rem(690) px2rem(450);
        // background-position: bottom;
        background: #fff;
        border: solid 1px #fff;
        border-radius: 4px;
        box-shadow: 0 0 4px #ccc;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: px2rem(20) px2rem(30);
        .grid {
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: px2rem(12) 0;
        }
        .icon {
            width: px2rem(70);
            height: px2rem(70);
        }
        .text1 {
            font-size: px2rem(28);
            font-weight: 500;
            color: #424243;
        }
        .text2 {
            font-size: px2rem(24);
            color: #717172;
        }
    }
    .part3 {
        padding: px2rem(200) px2rem(25) 0 px2rem(25);
        &-price {
            width: 100%;
            height: px2rem(128);
            border-radius: px2rem(8);
            border: 1px solid rgba(208,208,208,1);
            margin-bottom: px2rem(25);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 px2rem(30);
            &_inner1 {
                display: flex;
                align-items: center;
            }
            &_inner2 {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
            &_active {
                border-color: #9B7D46;
                background: #FFFBF2;
            }
        }
        .price-check {
            width: px2rem(36);
            height: px2rem(36);
            display: inline-block;
            margin-right: px2rem(10);
        }
        .price-title {
            font-size: px2rem(32);
            color: #333;
            margin-right: px2rem(12);
        }
        .skuSubName {
            font-size: px2rem(24);
            color: #666;
        }
        .price-current {
            font-size: px2rem(34);
            color: #131314;
            font-weight: 500;
        }
        .price-init {
            font-size: px2rem(24);
            color: #717172;
            text-decoration: line-through;
        }
        &-protocols {
            font-size: px2rem(24);
            color: #999999;
            display: flex;
            align-items: center;
            margin-top: px2rem(88);
        }
        .protocols-check {
            width: px2rem(24);
            height: px2rem(24);
            margin-right: px2rem(15);
        }
        .protocols-link {
            color: #9B7D46;
        }
        &-button {
            height: px2rem(96);
            line-height: px2rem(96);
            background: linear-gradient(90deg,rgba(86,80,78,1) 0%,rgba(39,37,36,1) 100%);
            border-radius: px2rem(48);
            text-align: center;
            color: #F6E5C0;
            font-size: px2rem(36);
            margin-top: px2rem(28);
            &_disabled {
                opacity: .5;
            }
        }
    }
}
</style>

