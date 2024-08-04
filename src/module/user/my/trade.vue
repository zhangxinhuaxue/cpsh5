<template>
    <div class="trade">
        <ul class="trade-item">
            <li v-for="item in product" class="product-item" @click="goProduct(item)">
                <p>{{item.num}}</p>
                <p>{{item.name}}</p>
            </li>
        </ul>
        <ul class="trade-item order">
            <li v-for="(value, key, index) in order" class="order-item" @click="goOrder(index)">
                <img :src="value.icon" alt="">
                <p>{{value.name}}</p>
                <transition name="expand">
                    <span v-if="(key != 'ALL' && value.num > 0)" class="aui-badge tip">{{value.num}}</span>
                </transition>
            </li>
        </ul>
    </div>
</template>
<script>
import {
    myMallInfo
} from 'src/store/modules/user'
import { AXD } from 'src/libs/util'
export default {
    name: 'my',
    props: {
        isLogin: false
    },
    data() {
        return {
            product: [{
                name: '红包',
                type: 'couponCount',
                num: 0,
                linkname: 'noopen'
            }, {
                name: '店铺收藏',
                type: 'shopCount',
                num: 0,
                linkUrl: '/pages/shop/myCollection'
            }, {
                name: '购物车',
                type: 'cartCount',
                num: 0,
                linkname: 'cart'
            }],
            order: {
                WAIT_BUYER_PAY: {
                    name: '待付款',
                    icon: require('./img/order1.png'),
                    num: 0
                },
                WAIT_SELLER_SEND_GOODS: {
                    name: '待发货',
                    icon: require('./img/order2.png'),
                    num: 0
                },
                WAIT_BUYER_CONFIRM_GOODS: {
                    name: '待收货',
                    icon: require('./img/order3.png'),
                    num: 0
                },
                ALL: {
                    name: '全部订单',
                    type: 'orderAll',
                    icon: require('./img/order4.png'),
                    num: 0
                }
            }
        }
    },
    watch: {
        isLogin(val) {
            if (val) {
                this.init()
            }
        }
    },
    methods: {
        init() {
            myMallInfo().then((res) => {
                if (res.success) {
                    let result = res.result
                    this.product.forEach((item) => {
                        item.num = result[item.type]
                    })
                    res.result.orderStatus.forEach((item) => {
                        if (this.order[item.type]) {
                            this.order[item.type].num = item.count
                        }
                    })
                }
            })
        },
        goProduct(item) {
            if (!this.isLogin) {
                AXD.util.login()
                return
            }
            if (item.linkname) {
                this.$router.push({
                    name: item.linkname
                })
                return
            }
            if (item.linkUrl) {
                window.location.href = item.linkUrl
            }
        },
        goOrder(key) {
            if (!this.isLogin) {
                AXD.util.login()
                return
            }
            let path = '/pages/order/goods?status=' + (key + 1)
            this.$router.push(path)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.trade-item {
    display: flex;
    height: px2rem(169);
    justify-content: space-between;
    background-color: #fff;
    padding: 0 px2rem(65);
    margin-top: px2rem(20);
}

.product-item {
    text-align: center;
    padding-top: px2rem(46);
    p {
        &:first-child {
            font-size: px2rem(34);
        }
        &:last-child {
            font-size: $auiFontSizeLevel6;
            color: $auiTextColorGeneral;
        }
    }
}

.order {
    height: px2rem(167);
    padding: 0 px2rem(48);
    .order-item {
        position: relative;
        display: block;
        text-align: center;
        padding-top: px2rem(40);
        color: $auiTextColorGeneral;
        font-size: $auiFontSizeLevel6;
        min-width: px2rem(106);
        img {
            display: inline-block;
            width: px2rem(50);
        }
    } // 使用rem会有问题，这里是用px来解决
    .tip {
        position: absolute;
        top: px2rem(30);
        left: px2rem(60);
    }
}

.expand-enter-active {
    transition: all .5s;
}

.expand-enter {
    transform: scale(0.815);
}
</style>
