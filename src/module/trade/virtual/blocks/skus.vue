<!--
 * @Description: 游戏/会员 sku list
 * @Author: sunxj
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-02-21 17:04:17
 * @LastEditors: sunxj
 -->
<template>
    <div class="page-amount">
        <p class="page-amount__tit">面额</p>
        <ul class="page-amount__item">
            <li v-for="(item, index) in skus" :class="{'select': curIndex == index}" @click="selectAmount(item, index)" :key="index">
                <p>{{ item.name | formatName }}</p>
                <p>¥ {{ item.price | formatPrice(discount) }}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/virtual')
export default {
    name: 'game-skus',
    props: {
        skus: {
            type: Array
        },
        defaultIndex: {
            type: Number,
            default: 0
        },
        name: String
    },
    data() {
        return {
            curIndex: 0
        }
    },
    filters: {
        formatName(name) {
            if (name.indexOf(':') > -1) {
                return name.split(':')[1]
            } else {
                return name
            }
        },
        formatPrice(val, discount) {
            let num = discount || 100
            let discountVal = parseFloat(val) * num
            if (discountVal % 10000 == 0) {
                return discountVal / 10000
            } else {
                return (discountVal / 10000).toFixed(2)
            }
        }
    },
    computed: {
        ...mapState({
            discount: state => state.discount
        })
    },
    mounted() {
        let i = this.defaultIndex
        this.selectAmount(this.skus[i], i)
    },
    methods: {
        ...mapMutations([
            'saveVirtualData'
        ]),
        selectAmount(item, i) { // 选择面额
            this.curIndex = i
            let rechargeTitle = `${this.name} ${item.name}`
            this.saveVirtualData({
                rechargeTitle: rechargeTitle,
                skus: item
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.page-amount {
    background-color: #fff;
    padding: px2rem(32);
    margin-top: px2rem(20);
    &__tit {
        font-size: px2rem(28);
        margin-bottom: px2rem(20);
    }
    &__item {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        flex-wrap: wrap;
        text-align: center;
        li {
            list-style: none;
            width: px2rem(222);
            border: 1px solid $auiLineColorLight;
            border-radius: px2rem(8);
            padding: px2rem(20) 0;
            margin-right: px2rem(10);
            margin-bottom: px2rem(15);
            &:nth-child(3n) {
                margin-right: 0;
            }
            p:nth-child(1) {
                font-size: $auiFontSizeLevel2;
            }
            p:nth-child(2) {
                font-size: $auiFontSizeLevel7;
                color: #666;
            }
            &.select {
                border-color: #f99e00;
                color: #f99e00;
                p {
                    color: #f99e00;
                }
            }
        }
    }
}
</style>
