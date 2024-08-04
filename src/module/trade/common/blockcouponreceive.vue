<template>
    <div v-if="couponList.length">
        <template v-for="(item, index) in couponList">
            <m-coupon :coupon="item" bg="orange" :key="index">
                <m-button
                    slot="right"
                    size="small"
                    :disabled="item.actionType == 'hasReceived'"
                    @click="receiveCouponFun(item)"
                >{{item.actionType | BtnText}}</m-button>
            </m-coupon>
        </template>
    </div>
</template>
<script>
import { receiveCoupon } from 'store/modules/trade/product'
import { Coupon, Button } from '@fe/buss-ui'
import { AXD } from 'src/libs/util'
import { vipcardUrl } from './assets/common'
export default {
    name: 'couponReceive',
    props: {
        coupons: Object
    },
    data() {
        return {
            hasVip: false,
            couponList: []
        }
    },
    components: {
        mCoupon: Coupon,
        mButton: Button
    },
    filters: {
        BtnText(type) {
            console.log(type)
            return {
                canReceive: '领取',
                hasReceived: '已领取',
                toPay: '去开卡'
            }[type]
        }
    },
    mounted() {
        this.handleCoupons()
    },
    methods: {
        handleCoupons() {
            this.hasVip = this.coupons.hasVip
            let couponList = this.coupons.list.map((item, i) => {
                let type = this.getCouponType(item.category)
                let showVip = item.showVip
                let tips = item.category === 'product_free_interest' ? '购物车合并购买时不可用' : ''
                let couponObj = {
                    code: item.accessToken,
                    category: item.category,
                    showVip,
                    type, // amount：现金, multi: 复合红包, periods: 分期免息, discount: 折扣
                    amount: item.amount,
                    desc: item.desc,
                    title: item.title,
                    limit: [...item.limit, item.validPeriod],
                    footTips: tips,
                    received: item.received, // 是否已领取
                    repeatable: item.repeatable, // 是否可重复领取
                    actionType: item.actionType
                }
                return couponObj
            })
            this.couponList = couponList
        },
        getCouponType(category) {
            let type = ''
            switch (category) {
                case 'group':
                    type = 'multi'
                    break
                case 'product_free_interest':
                    type = 'periods'
                    break
                case 'discount':
                    type = 'discount'
                    break
                default:
                    type = 'amount'
                    break
            }
            return type
        },
        receiveCouponFun(item) {
            // 会员红包还不是会员
            if (item.actionType === 'toPay') {
                this.goUrl()
                return
            }
            let type = 'hasReceived'
            // 已领取&&不可重复领取
            if (item.actionType === type) {
                this.$_toast('太贪心咯，你已经领过了呢')
                return
            }
            receiveCoupon({
                couponIdsEnum: item.code
            }).then(data => {
                data = data.ret || data
                if (!data.success) {
                    /* 已领取 */
                    let code = data.code
                    if (code === '10000') {
                        this.$_toast('太贪心咯，你已经领过了呢')
                        /* 异常状态 */
                    } else if (code === '10003' || code === '10011' || code === '6001' || code === '10001') {
                        this.$_toast('哎呀呀，来迟一步，红包被领光啦')
                    } else if (code === '-1999') {
                        AXD.util.login()
                    } else if (data.resultDes) {
                        this.$_toast(data.resultDes)
                    }
                } else if (data.success) {
                    if (data.result == 'false') {
                        this.$_toast('亲，不要太频繁，请一分钟后再试')
                    } else {
                        if (!item.repeatable) {
                            item.actionType = type
                        }
                        this.$_toast('领取成功！快去买买买')
                    }
                }
            })
        },
        goUrl() {
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: vipcardUrl,
                        rootPage: 0
                    },
                    callback() {}
                })
            } else {
                window.location.href = vipcardUrl
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
::v-deep .mui-btn_primary.disabled {
    color: #717172;
    background-color: #d0d0d0;
}
</style>