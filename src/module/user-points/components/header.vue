<template>
    <!-- 首页领取积分模块 -->
    <section :class="['pointsHeader',{'scroll': needScroll}]" ref="header">
        <!-- 总积分 -->
        <div class="pointsHeader__total" @click="toPointsDetail">
            <p>可用积分</p>
            <h3 :class="{'more5': more5}">{{isLogin?total:loginTxt}}<m-icon type="arrow2" v-if="isLogin"></m-icon></h3>
        </div>
        <!-- 领取金币模块 -->
        <div class="pointsHeader__coins">
            <!-- 循环一下，7个领完再填充数组 -->
            <section
                v-for="(item,index) in list"
                :style="formatPosition(index)"
                :key="item.id"
                @click="pick(item.id,index)"
                v-show="item.id">
                <span>{{item.score}}</span>
                <p>{{item.source}}</p>
            </section>

        </div>
        <div class="pointsHeader__btns">
            <!-- 积分规则 -->
            <span @click="toRule"></span>
            <!-- 兑换奖品 -->
            <span @click="toExchangeList"></span>
        </div>
    </section>
</template>

<script>
import Vue from 'vue'
import { Icon } from '@fe/buss-ui'
import hub from 'assets/js/hub'
import { scoreTotal, scoreUnpickList, scorePick } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
import aymUI from '@fe/aym-ui'
import '@fe/aym-ui/lib/index.css'
Vue.use(aymUI)

export default {
    data() {
        return {
            total: 0, // 总积分
            isLogin: false,
            loginTxt: '请先登录',
            bgUrl: require('../images/header.png'),
            list: [], // 待领取积分图
            positionList: [ // 7个金币的定位
                [84, 331],
                [128, 173],
                [128, 489],
                [235, 44],
                [235, 617],
                [64, 61],
                [64, 601]
            ],
            start: 0, // 分页起始
            noMore: false, // 是否还有更多数据
            pickNum: 0, // 加满7重置为0
            needScroll: false, // 领取完毕，上移
            more5: false // 总积分数大于5位数，切换UI
        }
    },
    components: {
        mIcon: Icon
    },
    activated() {
        this.getSoreTotal()
    },
    created() {
        // 签到成功，再请求待领取列表
        hub.$on('refreshList', this.scoreList)
    },
    methods: {
        getSoreTotal() {
            // 获取总积分
            scoreTotal().then(({success, result, code, resultDes}) => {
                if (success && result) {
                    this.isLogin = true
                    this.total = result.score || '0'
                    if (this.total.toString().length > 4) this.more5 = true
                } else {
                    if (code == 10001 || code == 10002) {
                        this.needScroll = true
                        // AXD.util.smsLogin()
                        // this.total = '请先登录'
                        this.$createDialog({
                            // type: 'confirm',
                            content: '您还未登录，请先登录',
                            confirmBtn: {text: '立即登录'},
                            onConfirm: () => {
                                AXD.util.smsLogin()
                            }
                        }).show()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        scoreList() {
            // get score list that is unpicked
            scoreUnpickList({
                start: this.start,
                size: 7
            }).then(({success, result, code, resultDes}) => {
                if (success) {
                    this.list = result.list
                    if (result.total == 0) {
                        this.needScroll = true
                        return
                    }
                    if (result.total <= 7) {
                        this.noMore = true
                    }
                    // 点掉之后后台数据也会清掉，多以不用加值start
                    // this.start += 7
                } else {
                    if (code == 10001 || code == 10002) {
                        // AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        formatPosition(i) {
            // 确定7个金币的位置
            let o = this.positionList[i]
            let top = window.hotcss.px2rem(o[0], 750) + 'rem'
            let left = window.hotcss.px2rem(o[1], 750) + 'rem'

            return {
                top,
                left,
                'animation-delay': (Math.random() * 5).toFixed(1) + 's'
            }
        },
        pick(id, i) {
            // 获取积分
            scorePick({ id }).then(({success, result, code, resultDes}) => {
                if (success && result) {
                    this.total = result.score || '0'
                    this.$set(this.list, i, {})
                    this.pickNum++
                    // 如果拾取7个金币之后，还有数据，接着请求
                    // 否则，验证长度和list长度,相等时，认为拾取完毕，需要上移
                    if (this.pickNum === 7 && !this.noMore) {
                        this.scoreList()
                    } else if (this.pickNum == this.list.length) {
                        this.list = []
                        this.needScroll = true
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
        toPointsDetail() {
            if (this.isLogin) {
                // 去积分列表
                this.$router.push({
                    name: 'pointsDetail'
                })
            } else {
                AXD.util.smsLogin()
            }
        },
        toExchangeList() {
            // 去兑换列表
            this.$router.push({
                name: 'pointsExchangeList'
            })
        },
        toRule() {
            // window.location.href = 'https://m.aiyoumi.com/h5/user/contract/viewTemplate/CT190627101'
            window.location.href = 'https://m.zhaojiling.com/h5/user/contract/viewTemplate/CT190627101'
        }
    }
}
</script>
<style lang="scss">
.pointsHeader {
    position: relative;
    background: url(../images/header.png) no-repeat 0 bottom;
    background-size: 100%;
    height: px2rem(650);
    font-family: 'SUB';
    transition: all linear .5s;
    &.scroll {
        height: px2rem(500);
    }
    &__total {
        position: absolute;
        bottom: px2rem(246);
        left: 50%;
        transform: translateX(-50%);
        color: #6B4C05;
        text-align: center;
        p {
            font-size: px2rem(24);
        }
        h3 {
            font-size: px2rem(76);
            line-height: px2rem(100);
            font-weight: normal;
            .mui-icon {
                position: relative;
                top: px2rem(-18);
                left: px2rem(4);
                font-size: px2rem(23);
            }
            &.more5 {
                font-size: px2rem(70);
                .mui-icon {
                position: relative;
                    top: px2rem(-16
                    );
                    left: px2rem(4);
                    font-size: px2rem(20);
                }
            }
        }
    }
    &__coins {
        section {
            position: absolute;
            width: px2rem(90);
            // height: px2rem(90);
            line-height: px2rem(42);
            padding-top: px2rem(24);
            background-image: url(../images/coin.png);
            background-repeat: no-repeat;
            background-position: 0 0;
            background-size: 100%;
            text-align: center;
            font: px2rem(36) SUB;
            color: #D87D00;
            animation: waggle 1s ease-in infinite alternate;

            span {
                display: block;
                margin-bottom: px2rem(28);
                font-size: px2rem(36);
            }
            // i {
            //     position: relative;
            //     top: px2rem(-5);
            //     font-style: normal;
            //     font-size: px2rem(28);
            // }
            p {
                font-size: px2rem(22);
                line-height: px2rem(30);
                color: #fff;
            }
        }
    }
    &__btns {
        position: absolute;
        right: px2rem(30);
        bottom: px2rem(140);
        width: px2rem(284);
        height: px2rem(114);
        display: flex;
        justify-content: space-between;
        span {
            width: px2rem(132);
            height: px2rem(114);
            background-size: contain;
            background-image: url(../images/header-btn1.png);
            background-repeat: no-repeat;
            background-position: 0 0;
            &:last-child {
                background-image: url(../images/header-btn2.png);
            }
        }
    }
}
@keyframes waggle {
    from {
        transform: translate(0,0)
    }
    to {
        transform: translate(0,px2rem(-10));
    }
}
</style>


