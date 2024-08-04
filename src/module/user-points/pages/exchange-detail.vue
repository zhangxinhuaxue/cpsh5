<template>
    <section class="points exchangeDetail">
        <!-- 头图 -->
        <axd-image :src="proInfos.imgUrl" :class="'exchangeDetail__img'" :lazy="false"></axd-image>
        <div class="exchangeDetail__content">
            <h3>{{proInfos.skuName}}</h3>
            <div
                class="exchangeDetail__btn"
                @click="showDialog"
                v-if="!showSoldout"
            >{{proInfos.score}}积分兑换</div>
            <div v-else class="exchangeDetail__btn disabled">已下架</div>
            <div class="exchangeDetail__prodetail">
                <h4>商品详情</h4>
                <!-- 富文本 -->
                <div v-html="proInfos.skuDescribe"></div>
            </div>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import axdImage from 'components/image/index.vue'
import { exchangeDetail, precheck, exchange } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
import aymUI from '@fe/aym-ui'
import '@fe/aym-ui/lib/index.css'
Vue.use(aymUI)

export default {
    name: 'pointsExchangeDetail',
    data() {
        return {
            proInfos: {},
            skuId: this.$route.query.id,
            showSoldout: false
        }
    },
    components: {
        axdImage
    },
    created() {
        window.onscroll = () => {}
        this.init()
    },
    methods: {
        init() {
            // 初始化兑换商品信息
            exchangeDetail({
                skuId: this.skuId
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.proInfos = result
                    if (this.proInfos.skuStat !== 'ONLINE') {
                        this.showSoldout = true
                    }
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        showDialog() {
            this.$createDialog({
                type: 'confirm',
                content: '是否兑换该奖品？',
                onConfirm: () => {
                    this.checkFn()
                },
                onCancel: () => {}
            }).show()
        },
        checkFn() {
            // 校验资格
            precheck({
                skuId: this.skuId
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.exchangeFn()
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                    } else if (code == 20010) {
                        // 积分不足
                        this.lackPoints()
                    } else if (code == '8010' || code == '8011' || code == '8012' || code == '8030') {
                        // 商品下架
                        this.offline()
                    } else if (code == '8050') {
                        // 已经兑换过
                        this.hasExhcnage()
                    } else if (code == '6065') {
                        // 需要实名
                        AXD.util.goAuth({
                            backUrl: encodeURIComponent(window.location.href),
                            authItem: 1,
                            channel: 'score_task'
                        })
                    } else if (code == '6066') {
                        // 需要刷脸
                        AXD.util.goAuth({
                            backUrl: encodeURIComponent(window.location.href),
                            authItem: 2,
                            channel: 'score_task'
                        })
                    } else {
                        this.$_toast(resultDes)
                    }
                }
            })
        },
        exchangeFn() {
            // 兑换
            exchange({
                skuId: this.skuId
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.exchangeOk()
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                    } else if (code == 20010) {
                        // 积分不足
                        this.lackPoints()
                    } else if (code == '8010' || code == '8011' || code == '8012' || code == '8030') {
                        // 商品下架
                        this.offline()
                    } else if (code == '8050') {
                        // 已经兑换过
                        this.hasExhcnage()
                    } else if (code == '6065') {
                        // 需要实名
                        AXD.util.goAuth({
                            backUrl: encodeURIComponent(window.location.href),
                            authItem: 1,
                            channel: 'score_task'
                        })
                    } else if (code == '6066') {
                        // 需要刷脸
                        AXD.util.goAuth({
                            backUrl: encodeURIComponent(window.location.href),
                            authItem: 2,
                            channel: 'score_task'
                        })
                    } else {
                        this.$_toast(resultDes)
                    }
                }
            })
        },
        lackPoints() {
            this.$createDialog({
                type: 'confirm',
                content: '对不起，您的积分不足',
                cancelBtn: { text: '我知道了' },
                confirmBtn: { text: '去赚积分' },
                onConfirm: () => {
                    this.$router.push({
                        name: 'pointsIndex'
                    })
                }
            }).show()
        },
        offline() {
            this.$createDialog({
                content: '该奖品已下架，去看看别的吧',
                onConfirm: () => {}
            }).show()
            this.showSoldout = true
        },
        exchangeOk() {
            this.$createDialog({
                type: 'confirm',
                content: '恭喜你，兑换成功',
                cancelBtn: { text: '确定' },
                confirmBtn: { text: '查看奖品' },
                onConfirm: () => {
                    this.$router.push({
                        name: 'pointsPrizeMine'
                    })
                }
            }).show()
        },
        hasExhcnage() {
            this.$createDialog({
                type: 'confirm',
                content: '您已兑换过该商品了',
                cancelBtn: { text: '取消' },
                confirmBtn: { text: '查看奖品' },
                onConfirm: () => {
                    this.$router.push({
                        name: 'pointsPrizeMine'
                    })
                }
            }).show()
        }
    }
}
</script>

<style lang="scss">
.exchangeDetail {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background-color: #fff;
    overflow-y: auto;
    color: #131314;
    &__img {
        height: px2rem(420);
        background-color: green;
        overflow: hidden;
    }
    &__content {
        padding: 0 px2rem(32);
        & > h3 {
            line-height: px2rem(54);
            font-size: px2rem(36);
            padding: px2rem(32) 0;
        }
    }
    &__btn {
        line-height: px2rem(100);
        text-align: center;
        font-size: px2rem(32);
        background-color: #4286FF;
        border-radius: px2rem(8);
        margin-bottom: px2rem(80);
        color: #fff;
        &.disabled {
            background-color: #ccc;
        }
    }
    &__prodetail {
        h4 {
            font-size: px2rem(32);
            line-height: px2rem(40);
            margin-bottom: px2rem(24);
        }
        div {
            font-size: px2rem(24);
            line-height: px2rem(36);
            letter-spacing: px2rem(4);
            word-break: break-all;
            color: #424243;
        }
    }
}
</style>

