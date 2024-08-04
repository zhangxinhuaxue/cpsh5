<!--
    Created by hity on 05/19/17
-->
<template>
    <div v-if="coupon.isShow" class="aui-cell"  @click="getCouponList">
        <ul class="coupon">
            <li v-for="(item, index) in coupon.tipsList" :key="'abstract' + index">
                <span class="coupon-icon"><span class="aui-tag_border left">{{item.title}}</span><span class="aui-tag_border right">{{item.desc|limitString(14)}}</span></span>
            </li>
        </ul>
        <span class="com-more-icon more"></span>
    </div>
</template>
<script>
// import { mapState } from 'vuex'
import { createNamespacedHelpers } from 'vuex'
import createPopup from 'src/module/trade/product/blocks/common/createPopup'
const { mapActions, mapState } = createNamespacedHelpers('trade/product')
export default {
    mixins: [createPopup],
    props: {
        coupon: Object
    },
    data() {
        return {
            config: {
                title: '红包',
                type: 'coupon'
            }
        }
    },
    computed: {
        ...mapState({
            productId: state => state.initData.desc.productId
        })
    },
    methods: {
        ...mapActions([
            'getCouponListData'
        ]),
        getCouponList() {
            if (this.coupon.list.length) {
                this.popup()
                return
            }
            this.getCouponListData({ 'productIds': this.productId }).then(() => {
                this.popup()
            }, ({resultDes = '网络错误，请重试'}) => {
                this.$_toast(resultDes)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/style.scss';
    .coupon {
        @include flexbox();
        @include flexVert();
        width: 100%;
        li {
            flex: none;
            height: 100%;
            .coupon-icon {
                margin-right: px2rem(10);
                .left {
                    border-right: none;
                    padding-left: px2rem(7);
                    padding-right: px2rem(7);
                }
                .right {
                    border-left-style: dashed;
                    padding-left: px2rem(13);
                    padding-right: px2rem(13);
                }
                .aui-tag_border {
                    color: $auiAttentionColor;
                    border-color: $auiAttentionColor;
                }
            }
        }
    }
</style>
