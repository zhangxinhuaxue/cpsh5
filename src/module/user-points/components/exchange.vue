<template>
    <!-- 首页兑换模块 -->
    <section class="pointsAd points__block">
        <h4>
            积分兑换奖品
            <span @click="toExchangeList">更多奖品</span>
        </h4>
        <ol>
            <li
                :style="bgStyle(item)"
                v-for="item in list"
                :key="item.id"
                @click="toProDetail(item.id)"
            >
                <h4>{{item.skuName}}</h4>
                <p>{{item.score}}积分</p>
                <span>
                    兑换
                    <m-icon class="coupon-link-icon" type="arrow2" />
                </span>
            </li>
        </ol>
    </section>
</template>
<script>
import { exchangeList, precheck } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
import { Icon } from '@fe/buss-ui'

export default {
    data() {
        return {
            list: []
        }
    },
    created() {
        this.init()
    },
    components: {
        mIcon: Icon
    },
    methods: {
        init() {
            // 获取展示列表，最多只显示6个
            exchangeList({
                start: 0,
                size: 6
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.list = result.list
                } else {
                    // 获取失败隐藏列表
                    this.$emit('close')
                    if (code == 10001 || code == 10002) {
                        // AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        bgStyle({ imgIcon }) {
            return { 'background-image': 'url(' + imgIcon + ')' }
        },
        toExchangeList() {
            // 跳转兑换列表
            this.$router.push({
                name: 'pointsExchangeList'
            })
        },
        // checkFn({id}) {
        //     // 校验资格
        //     precheck({skuId: id}).then(({success, result, code, resultDes}) => {
        //         if (success) {
        //             this.toProDetail(id)
        //         } else {
        //             if (code == 10001 || code == 10002) {
        //                 AXD.util.smsLogin()
        //                 return
        //             }
        //         }
        //     })
        // },
        toProDetail(id) {
            // 兑换详情
            this.$router.push({
                name: 'pointsExchangeDetail',
                query: { id }
            })
        }
    }
}
</script>

<style lang="scss">
.pointsAd {
    padding-bottom: px2rem(8);
    ol {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        li {
            width: px2rem(191);
            height: px2rem(200);
            overflow: hidden;
            background-repeat: no-repeat;
            background-position: 0 0;
            background-size: 100% 100%;
            color: #fff;
            padding: px2rem(20) px2rem(12);
            border-radius: px2rem(8);
            margin-bottom: px2rem(24);
            margin-right: px2rem(24);
            &:nth-child(3n) {
                margin-right: 0;
            }
            h4 {
                font-size: px2rem(28);
                line-height: px2rem(36);
                margin-bottom: px2rem(4);
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            p,
            span {
                font-size: px2rem(24);
                line-height: px2rem(32);
            }
            p {
                margin-bottom: px2rem(54);
            }
            span {
                display: block;
                font-size: px2rem(24);
                width: px2rem(84);
                height: px2rem(40);
                padding: px2rem(4) px2rem(10);
                overflow: hidden;
                line-height: px2rem(32);
                background-color: rgba(255, 255, 255, 0.2);
                text-align: left;
                border-radius: px2rem(30);
                font-weight: bold;
                position: relative;
                svg {
                    position: absolute;
                    right: px2rem(10);
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: px2rem(16);
                }
            }
        }
    }
}
</style>
