<template>
    <!-- 我的奖品列表 -->
    <section class="points__block prizeList">
        <!-- 红包列表 -->
        <mycoupon-list :data="coupons" v-if="showCouponList"></mycoupon-list>
        <div class="coupon-btn" @click="toMycoupon" v-if="couponLength>2">查看所有红包</div>
        <!-- 其他列表 -->
        <ul>
            <li v-for="(item,index) in list" :key="item.resultId+'_'+index">
                <axd-image :src="item.imgThumb" :class="'points__icon'" :lazy="false"></axd-image>
                <div class="pointsTask__infos">
                    <h4>{{item.productName}}</h4>
                    <p>兑换码：{{item.sendResult}}</p>
                </div>
                <div
                    :class="['points__btn', getCopyClass(index)]"
                    :data-clipboard-text="item.sendResult"
                    @click="copyCode(getCopyClass(index))"
                >复制</div>
            </li>
        </ul>
        <!-- 空提示 -->
        <div class="points__none prize" v-show="noPoints">
            <p>还没有兑换过奖品哦~</p>
            <p>快去兑换吧</p>
        </div>
    </section>
</template>

<script>
import axdImage from 'components/image/index.vue'
import { prizeList, couponList } from 'store/modules/user-points'
import mycouponList from '@/module/common/mycoupon/list.vue'
import { AXD } from 'src/libs/util'
import Clipboard from 'clipboard'
export default {
    name: 'pointsPrizeMine',
    data() {
        return {
            list: [],
            coupons: [],
            moreLoading: false,
            noMore: false,
            noPoints: false,
            showCouponList: false,
            start: 0,
            size: 20,
            couponLength: 0
        }
    },
    components: {
        axdImage,
        mycouponList
    },
    created() {
        window.onscroll = () => {}
        this.init()
    },
    methods: {
        init() {
            // 先请求红包列表，红包列表分页，红包列表没了，或者不足20，接着请求权益列表
            this.getCoupons()
        },
        getCoupons() {
            couponList({
                start: 0,
                size: 2
            }).then(({ success, result, code, resultDes }) => {
                this.moreLoading = false
                if (success) {
                    this.coupons = result.list
                    this.showCouponList = true
                    this.couponLength = result.total
                    // 修改需求，只放置两个红包，接下来直接请求权益
                    this.getRights()
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    // 失败了接着请求权益列表
                    resultDes && this.$_toast(resultDes)
                    this.getRights()
                }
            })
        },
        getRights() {
            prizeList({
                start: this.start,
                size: this.size
            }).then(({ success, result, code, resultDes }) => {
                this.moreLoading = false
                if (success) {
                    this.list = [...this.list, ...result.list]
                    // 如果红包列表和权益列表都没数据，提示无奖品
                    if (!this.list.length && !this.coupons.length) {
                        this.noPoints = true
                        return
                    }
                    // 大于20再做监听
                    if (result.total > 20) {
                        this.scrollEvent()
                    }

                    // 权益列表获取完，等同于所有数据获取完毕
                    if (this.list.length >= result.total) {
                        this.noMore = true
                        return
                    }
                    this.start += 20
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    // 如果红包列表和权益列表都没数据，提示无奖品
                    if (!this.list.length && !this.coupons.length) {
                        this.noPoints = true
                        return
                    }

                    this.$_toast(resultDes)
                    // 失败了默认没有更多
                    this.noMore = true
                }
            })
        },
        scrollEvent() {
            window.onscroll = () => {
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if (
                    scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100 &&
                    !this.moreLoading &&
                    !this.noMore
                ) {
                    this.loadMore()
                }
            }
        },
        loadMore() {
            this.moreLoading = true
            this.getRights()
        },
        copyCode(btnClass) {
            let clipboard = new Clipboard(`.${btnClass}`)
            clipboard.on('success', e => {
                this.$_toast('复制成功')
                e.clearSelection()
            })
            clipboard.on('error', e => {
                this.$_toast('复制失败')
            })
        },
        toMycoupon() {
            if (this.isApp) {
                window.location.href = '/pages/rrh/couponList'
            } else {
                window.location.href = '/pages/put/my/noopen'
            }
        },
        getCopyClass(index) {
            return 'points__btn-copy' + index
        }
    }
}
</script>
<style lang="scss" scoped>
.prizeList {
    padding: 0;
    background-color: transparent;
    // height: 100%;
    // overflow-y: auto;
    width: 100%;
    ul {
        width: px2rem(686);
        margin: px2rem(32) auto;
        li {
            padding: px2rem(32);
            background-color: #fff;
            border-radius: px2rem(8);
            height: px2rem(148);
            p {
                position: relative;
                top: px2rem(7);
            }
            textarea {
                opacity: 0;
                width: 0;
                height: 0;
                overflow: hidden;
            }
        }
    }
    .coupon-btn {
        width: px2rem(686);
        margin: 0 auto;
        background-color: #fff;
        color: #131314;
        border-radius: px2rem(8);
        font-size: px2rem(32);
        line-height: px2rem(100);
        text-align: center;
    }
}
</style>

