<!--
 * @LastEditors: sunxj
 * @Description: 修改红包接口和引用红包组件
 -->
<template>
    <com-popup :isPop="popShow" @cancel="closePopup">
        <template slot="content">
            <div class="aui-popup__hd">红包</div>
            <coupon-item class="aui-popup__bd" :coupons="coupons" />
            <!-- <ul class="aui-popup__bd">
                <li v-for="(coupon,index) in couponList">
                    <div class="left">
                        <span v-if="!coupon.groupId" :class="[{'fz_small':moreFont(coupon.couponAmt)}]"><i>¥</i>{{coupon.couponAmt|formatNum}}</span>
                        <span v-if="!coupon.groupId">{{coupon.categoryRule|formatRule}}</span>
                        <span v-else>复合红包</span>
                    </div>
                    <div class="middle">
                        <p>{{coupon.groupName||coupon.name}}</p>
                        <p class="cart_coupon_date">{{coupon.startTime|timeYMD}}-{{coupon.endTime|timeYMD}}</p>
                    </div>
                    <span :class="['cart_coupon_btn',{'disabled':coupon.btnTxt=='已领取'}]" @click="receiveFn(coupon.accessToken,index)">{{coupon.btnTxt}}</span>
                </li>
            </ul> -->
            <div class="aui-popup__ft">
                <a class="aui-btn_full" @click="closePopup">确定</a>
            </div>
        </template>
    </com-popup>
</template>
<script>
import Vue from 'vue'
import comPopup from 'components/popup/index.vue'
import couponItem from 'module/trade/common/blockcouponreceive.vue'
import { AXD } from 'libs/util'
// import { receiveCoupon } from 'src/store/modules/activity'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/cart')
export default {
    name: 'couponPop',
    components: {
        comPopup,
        couponItem
    },
    props: {
        coupons: Object
    },
    data() {
        return {
            popShow: false
        }
    },
    filters: {
        formatRule(val) {
            if (!val) {
                return ''
            }
            let [a] = val.split('|')
            if (a == 0) {
                return '无门槛红包'
            }
            return '满¥' + a / 100 + '使用'
        }
    },
    mounted() {
        // 因为外层v-if，延迟等待dom加载，产生过渡动画
        // this.couponList.map(item => {
        //     Vue.set(item, 'btnTxt', '领取')
        // })
        setTimeout(() => {
            this.popShow = true
        }, 50)
    },
    methods: {
        ...mapMutations(['cartInit']),
        receiveFn(token, i) {
            if (!token) {
                return false
            }
            let param = {
                'couponIdsEnum': token
            }
        },
        closePopup() {
            this.popShow = false
            // 弹窗动画做完，移除弹窗组件
            setTimeout(() => {
                this.cartInit({
                    couponPop: false,
                    footerShow: true
                })
            }, 500)
        },
        moreFont(val) {
            console.log((val / 100).toString().length)
            if ((val / 100).toString().length >= 5) {
                return true
            }
        }
    }
}
</script>
