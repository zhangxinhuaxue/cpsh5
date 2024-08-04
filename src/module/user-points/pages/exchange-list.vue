<template>
    <section class="points__block exchangeList">
        <!-- 可兑换列表 -->
        <ul>
            <li v-for="item in list"  @click="toDetail(item.id)">
                <axd-image :src="item.imgThumb" :class="'points__icon'" :lazy="false"></axd-image>
                <div class="pointsTask__infos">
                    <h4>{{item.skuName}}</h4>
                    <p>{{item.score}}积分</p>
                </div>
                <div class="points__btn">兑换</div>
            </li>
        </ul>
        <div @click="toMine">查看我兑换的奖品</div>
    </section>
</template>

<script>
import axdImage from 'components/image/index.vue'
import { exchangeList, precheck } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
export default {
    name: 'pointsExchangeList',
    data() {
        return {
            list: [],
            moreLoading: false,
            noMore: false,
            start: 0
        }
    },
    components: {
        axdImage
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name !== 'pointsExchangeDetail') {
                window.onscroll = () => {}
                vm.list = []
                vm.moreLoading = false
                vm.noMore = false
                vm.start = 0
                vm.init()
            } else {
                vm.scrollEvent()
            }
        })
    },
    methods: {
        init() {
            // 获取可兑换列表
            exchangeList({
                start: this.start,
                size: 20
            }).then(({success, result, code, resultDes}) => {
                this.moreLoading = false
                if (success) {
                    this.list = [...this.list, ...result.list]

                    // 大于20再做监听
                    if (result.total > 20) {
                        this.scrollEvent()
                    }

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
                    this.noMore = true
                    this.$_toast(resultDes)
                }
            })
        },
        scrollEvent() {
            window.onscroll = () => {
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100 && !this.moreLoading && !this.noMore) {
                    this.loadMore()
                }
            }
        },
        loadMore() {
            this.moreLoading = true
            this.init()
        },
        // checkFn({id}) {
        //     // 校验用户资格
        //     precheck({skuId: id}).then(({success, result, code, resultDes}) => {
        //         if (success) {
        //             this.toDetail(id)
        //         } else {
        //             if (code == 10001 || code == 10002) {
        //                 AXD.util.smsLogin()
        //                 return
        //             }
        //             this.$_toast(resultDes)
        //         }
        //     })
        // },
        toDetail(id) {
            this.$router.push({
                name: 'pointsExchangeDetail',
                query: { id }
            })
        },
        toMine() {
            // 跳到我的兑换列表
            this.$router.push({
                name: 'pointsPrizeMine'
            })
        }
    }
}
</script>

