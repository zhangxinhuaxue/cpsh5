<!--
    Created by hity on 05/15/17
-->
<template>
    <div>
        <!-- <label v-for="(item, index) in coupon.list" class="aui-cell aui-cell_auto" :for="index">
            <div class="aui-cell__bd coupon-item">
                <template v-if="!item.groupId">
                    <p class="coupon-item__num">¥<em>{{item.couponAmt|formatPirce}}</em></p>
                    <p>{{item.name|limitString(50)}} {{item.limit|range(item.merchants) }} </p>
                </template>
                <p v-if="item.groupId" class="coupon-item__name">{{(item.groupName ? item.groupName : item.name)|limitString(60)}}</p>
                <p class="coupon-item__date">有效期：{{item.startTime|timeYMD}}－{{item.endTime|timeYMD}}</p>
            </div>
            <div class="aui-cell__ft">
                <a href="javascript:;" v-if="item.received&&item.repeatable==='n'" class="aui-btn_small isGray" @click="getItem(item)">已领取</a>
                <a href="javascript:;" v-else class="aui-btn_small" @click="getItem(item)">立即领取</a>
            </div>
        </label> -->
        <coupon-item :coupons="coupon" />
    </div>
</template>
<script>
import { mapState } from 'vuex'
import {
    receiveCoupon
} from 'store/modules/trade/product'
import couponItem from 'module/trade/common/blockcouponreceive.vue'
import {
    AXD
} from 'src/libs/util'

export default {
    // filters: {
    //     range(limit, merchants) {
    //         if (limit === 'all' && (typeof merchants === 'undefined' || merchants == -1)) {
    //             return '全场适用'
    //         } else {
    //             return '指定商品适用'
    //         }
    //     },
    //     formatPirce(value) {
    //         return value == undefined ? 0 : (value / 100)
    //     }
    // },
    computed: {
        ...mapState('trade/product', {
            coupon: state => state.initData.coupon,
            uid: state => state.initData.user.uid
        })
    },
    components: {
        couponItem
    },
    methods: {
        getItem(item) {
            let me = this
            if (!this.uid) {
                AXD.util.login()
                return false
            }
            // 已领取&&不可重复领取
            if (item.received && item.repeatable === 'n') {
                me.$_toast('太贪心咯，你已经领过了呢')
                return
            }
            receiveCoupon({
                'couponIdsEnum': item.accessToken
            }).then(function(data) {
                data = data.ret || data
                if (!data.success) {
                    /* 已领取 */
                    if (data.code === '10000') {
                        me.$_toast('太贪心咯，你已经领过了呢')
                        /* 异常状态 */
                    } else if (data.code === '10003' || data.code === '10011' || data.code === '6001' || data.code === '10001') {
                        me.$_toast('哎呀呀，来迟一步，红包被领光啦')
                    } else if (data.code === '-1999') {
                        AXD.util.login()
                    } else if (data.resultDes) {
                        me.$_toast(data.resultDes)
                    }
                } else if (data.success) {
                    if (data.result == 'false') {
                        me.$_toast('亲，不要太频繁，请一分钟后再试')
                    } else {
                        if (item.repeatable === 'n') {
                            item.received = true
                        }
                        me.$_toast('领取成功！快去买买买')
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-cell_auto {
    height: auto;
}
.isGray {
    color: #999;
    border-color: #ccc;
}
.aui-btn_small {
    width: px2rem(136);
    padding: 0;
    text-align: center;
}
</style>
