<template>
    <section class="pointsList">
        <!-- 可兑换列表 -->
        <ul v-if="list.length">
            <li v-for="(item, i) in list" :key="i">
                <div>
                    <div class="starTime">开奖时间： {{item.lotteryTime}}</div>
                    <dl class="clearfix">
                        <dt>
                            <axd-image :src="item.imgUrl" :lazy="false"></axd-image>
                        </dt>
                        <dd>
                            <p class="title">{{item.title}}</p>
                            <p class="price">{{item.objExts.description}}</p>
                            <p class="points"><em>{{item.points}}</em>&nbsp;积分</p>
                        </dd>
                    </dl>
                    <div>
                        <span class="fl status">{{statusList[item.status]}}</span>
                        <span class="goPoints fr" @click="toPoints">赚积分</span>
                    </div>
                </div>
            </li>
        </ul>
        <p class="tac" v-else>
            <img class="noimg" src="../images/couponNo.png" alt="">
        </p>
    </section>
</template>

<script>
import axdImage from 'components/image/index.vue'
import { pointsList, precheck } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
export default {
    name: 'pointsRecord',
    data() {
        return {
            list: [],
            moreLoading: false,
            noMore: false,
            start: 0,
            statusList: {
                '0': '待开奖',
                '1': '恭喜您~中奖啦',
                '2': '很遗憾，未中奖'
            }
        }
    },
    components: {
        // eslint-disable-next-line vue/no-unused-components
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
            pointsList({
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
                    if (code == 10001 || code == 10002 || code == '-1999') {
                        AXD.util.login()
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
        toPoints() {
            this.$router.push({
                path: '/pages/points/index'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.pointsList {
    padding: px2rem(32);
    li {
        width: px2rem(686);
        height: px2rem(384);
        background: #ffffff;
        border-radius: px2rem(20);
        padding: px2rem(32);
        margin-bottom: px2rem(24);
        text-align: left;
        height: auto;
        .starTime {
            font-size: px2rem(28);
            font-weight: 400;
            text-align: left;
            color: #666;
            padding: px2rem(10) 0;
        }
        dl {
            width: px2rem(622);
        }
        dt {
            width: px2rem(180);
            height: px2rem(180);
            background: #adccd8;
            border-radius: px2rem(4);
            float: left;
            img {
                display: inline-block;
                text-align: center;
                width: 100%;
            }
        }
        dd {
            float: left;
            padding-left: px2rem(16);
            .title {
                font-size: px2rem(36);
                font-weight: 500;
                text-align: left;
                color: #333;
                width: px2rem(418);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                padding: px2rem(5) 0 px2rem(20) 0;
            }
            .price {
                font-size: px2rem(28);
                font-weight: 400;
                text-align: left;
                color: #999999;
                line-height: px2rem(33);
                padding: px2rem(5) 0 0 0;
            }
            .points {
                font-size: px2rem(24);
                font-weight: 400;
                text-align: left;
                color: #666666;
                line-height: px2rem(33);
                padding: 0;
                em {
                    font-size: px2rem(38);
                    font-style: normal;
                    font-weight: 600;
                    text-align: left;
                    color: #ff3e00;
                    line-height: px2rem(53);
                }
            }
        }
        .status {
            font-size: px2rem(32);
            color: #ffa000;
            height: px2rem(56);
            line-height: px2rem(56);
        }
        .goPoints {
            width: px2rem(128);
            height: px2rem(56);
            background: #4286ff;
            border-radius: px2rem(4);
            font-size: px2rem(28);
            color: #ffffff;
            line-height: px2rem(56);
            text-align: center;
            display: inline-block;
            float: right;
            margin-top: px2rem(17);
        }
    }
    .tac {
        text-align: center;
        .noimg {
            width: px2rem(480);
            height: px2rem(480);
            display: inline-block;
        }
    }
}


</style>
