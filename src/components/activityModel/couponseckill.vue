<!--
    created by yangjun on 03/20/18
    红包秒杀模块
    功能： 分场次，每场倒计时，文案，颜色均更改，预告下一场
 -->
<!--  标题图片，背景颜色&&图片，红包背景图片，每场开始&&结束时间，前中后三种场次样式，按钮&&提示文案，红包库存，秒杀接口 -->
<template>
    <div class="couponSeckill" :style="blockStyle()" v-if="showCS">
        <axd-image :src="config.img" :lazy="true"></axd-image>
        <ul class="couponSeckill__main" :class="blockLayout(line.length)" v-for="(line,index_line) in couponList">
            <li class="couponSeckill__item" v-for="(item,index_item) in line">
                <axd-image :src="item.imgUrl" :lazy="true"></axd-image>
                <div class="couponSeckill__itemContent" @click="seckillCoupon(item,index_line,index_item)">
                    <span :style="handleConfiguration(item,'bs')">{{handleConfiguration(item,'bt')}}</span>
                    <p :style="handleConfiguration(item,'tc')" v-if="line.length==1">{{handleConfiguration(item,'tt')}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import Vue from 'vue'
import axdImage from 'src/components/image/index.vue'
import axdToast from 'components/toast/index'
import { AXD } from 'src/libs/util'
import { _getPromise } from 'src/store/base'
import { getSeckillCoponList, getNextSeckillCoponInfo, getSysTime, revieveSeckillCoupon } from 'src/store/modules/activity'
export default {
    name: 'couponSeckill',
    components: {
        axdImage
    },
    props: {
        config: Object,
        // 自定义登录, 默认值走非自定义登录逻辑
        customLoginParam: {
            type: Object,
            default: () => {
                return {
                    isCustomLogin: false,
                    customLogin: function() {}
                }
            }
        }
    },
    data() {
        return {
            isH5: (aixuedai.isUavoApp === 'n'),
            showCS: true,
            couponList: [],
            curSessionData: null,
            tipStyle: {
                'color': '#' + this.config.objExtJson.tipTxtColor
            },
            status: '',
            sysTime: '',
            subTime: ''
        }
    },
    beforeMount() {
        this.init()
    },
    methods: {
        handleConfiguration({ showStock, itemStatus, nextStartTime }, which) {
            let {
                secKillBeginBtnBgColor,
                secKillBeginBtnTipsTxtColor,
                secKillBeginBtnTxt,
                secKillBeginBtnTxtColor,
                secKillPreBeginTipsTxt, // 以上为可抢状态
                secKillEndBtnBgColor,
                secKillEndBtnTipsTxtColor,
                secKillEndBtnTxt,
                secKillEndBtnTxtColor,
                secKillPreEndTipsTxt, // 以上为抢到状态
                secKillFinishBtnBgColor,
                secKillFinishBtnTipsTxtColor,
                secKillFinishBtnTxt,
                secKillFinishBtnTxtColor,
                secKillPreFinishTipsTxt, // 以上为结束状态
                secKillPreBtnBgColor,
                secKillPreBtnTipsTxt,
                secKillPreBtnTipsTxtColor,
                secKillPreBtnTxt,
                secKillPreBtnTxtColor // 以上为预告状态
            } = this.config.objExtJson
            let bgc, c, bt, tt, tc, isOver, hasGot
            // 判断状态，综合赋值
            if (this.status === 'ing' && (showStock > 0) && itemStatus) {
                if (itemStatus == 'needNext') {
                    isOver = true
                } else if (itemStatus == 'got') {
                    hasGot = true
                }
            } else if (this.status === 'ing' && (showStock <= 0)) {
                isOver = true
            } else if (this.status === 'after') {
                isOver = true
            }
            // console.log(isOver, '===isOver')
            // console.log(hasGot, '===hasGot')
            // console.log(this.status, '===status')

            if (this.status === 'before') {
                bgc = secKillPreBtnBgColor
                c = secKillPreBtnTxtColor
                bt = secKillPreBtnTxt
                tt = secKillPreBtnTipsTxt
                tc = secKillPreBtnTipsTxtColor
                if (!tt) {
                    // 如果没有配置提示文案，预告下一场
                    tt = this.handleBeforeTxt(this.curSessionData.startTime)
                }
            } else if (this.status === 'ing' && (showStock > 0) && !itemStatus) {
                bgc = secKillBeginBtnBgColor
                c = secKillBeginBtnTxtColor
                bt = secKillBeginBtnTxt
                tt = secKillPreBeginTipsTxt
                tc = secKillBeginBtnTipsTxtColor
                if (!tt) {
                    tt = '仅剩' + showStock + '张'
                }
            } else if (isOver) {
                bgc = secKillFinishBtnBgColor
                c = secKillFinishBtnTxtColor
                bt = secKillFinishBtnTxt
                tt = secKillPreFinishTipsTxt
                tc = secKillFinishBtnTipsTxtColor
                if (!tt && nextStartTime) {
                    tt = this.handleBeforeTxt(nextStartTime, true)
                    console.log(tt)
                }
            } else if (hasGot) {
                bgc = secKillEndBtnBgColor
                c = secKillEndBtnTxtColor
                bt = secKillEndBtnTxt
                tt = secKillPreEndTipsTxt
                tc = secKillEndBtnTipsTxtColor
            }
            // return
            if (which == 'bs') {
                return {
                    'background-color': '#' + bgc,
                    'color': '#' + c
                }
            } else if (which == 'bt') {
                return bt
            } else if (which == 'tt') {
                return tt
            } else if (which == 'tc') {
                console.log('tc', tc)
                return {
                    'color': '#' + tc
                }
            }
        },
        init() {
            this.getSystemTime(() => {
                this.getList()
            })
        },
        blockLayout(len) {
            if (len === 1) {
                return 'line_1'
            } else if (len === 2) {
                return 'line_2'
            } else if (len === 3) {
                return 'line_3'
            }
        },
        blockStyle() {
            let { bgImg, bgColor } = this.config
            if (!bgImg && bgColor) {
                return {
                    'background-color': '#' + this.config.bgColor
                }
            } else if (bgImg && !bgColor) {
                return {
                    'background-image': 'url(' + this.config.bgImg + ')'
                }
            } else if (bgImg && bgColor) {
                return {
                    'background-image': 'url(' + this.config.bgImg + ')',
                    'background-color': '#' + this.config.bgColor
                }
            } else {
                return false
            }
        },
        getSystemTime(fn) {
            getSysTime().then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.sysTime = result
                    this.subTime = new Date(result) - new Date()
                    fn && fn()
                } else {
                    axdToast(resultDes)
                }
            })
        },
        getList() {
            getSeckillCoponList({
                templateId: this.config.id
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    // 没有result返回code=1也是结束信息
                    if (result && result.entryCouponList && result.entryCouponList.length) {
                        let { cpsSeckillEntry, entryCouponList } = result
                        // 获取数据格式化时间
                        let { startTime, endTime } = cpsSeckillEntry
                        startTime = startTime.replace(/-/g, '/')
                        endTime = endTime.replace(/-/g, '/')
                        // 覆盖格式化时间
                        Object.assign(cpsSeckillEntry, { startTime, endTime })
                        this.curSessionData = cpsSeckillEntry
                        this.couponList = entryCouponList
                        // 处理时间
                        this.handleTime()
                    } else {
                        this.showCS = false
                        // this.showOver()
                    }
                } else {
                    this.showCS = false
                    // this.showOver()
                    axdToast(resultDes)
                }
            })
        },
        // 处理时间，确认状态，触发按钮样式变化&&倒计时
        handleTime() {
            let now = new Date()
            let sys = new Date(this.sysTime)
            let start = new Date(this.curSessionData.startTime)
            let end = new Date(this.curSessionData.endTime)
            if (sys < start) {
                this.status = 'before'
            }
            // 每次请求都应该是待开始或者正在开抢的状态，依然返回结束的场次可认为没有下一场次
            if (sys > end) {
                this.status = 'after'
            }
            if (sys > start && sys < end) {
                this.status = 'ing'
            }
            // 根据状态开始倒计时
            this.startCD()
        },
        formatTime(time) {
            // 例 09 => 9
            return time < 10 ? time[1] : time
        },
        // 根据状态开启倒计时
        startCD() {
            let { startTime, endTime } = this.curSessionData
            if (this.status === 'before') {
                this.cdBefore(startTime)
            }
            if (this.status === 'ing') {
                this.cdIng(endTime)
            }
        },
        // 开始前倒计时
        cdBefore(start) {
            this.countdown(start, () => {
                this.status = 'ing'
                this.startCD()
            })
        },
        // 抢购中倒计时
        cdIng(end) {
            this.countdown(end, () => {
                this.status = 'after'
                this.init()
            })
        },
        countdown(endTime, callback) {
            endTime = new Date(endTime)
            let nowDate = new Date(+new Date() + this.subTime)
            let timeDiff = (endTime - nowDate) / 1000
            if (timeDiff <= 0) {
                callback && callback()
                return false
            }
            setTimeout(() => {
                this.countdown(endTime, callback)
            }, 1000)
        },
        // 需要红包token
        seckillCoupon(item, i, j) {
            if (this.status == 'before') {
                axdToast('秒杀还没开始哦~')
                return false
            }

            if (this.status == 'after' || item.itemStatus == 'needNext') {
                axdToast('已经抢完啦~')
                return false
            }
            // 去使用代表已经抢过， 点击去使用
            if (item.itemStatus === 'got') {
                this.toUseCoupon(item)
            } else {
                this.requestCoupon(i, j)
            }
        },
        requestCoupon(i, j) {
            console.log(this.couponList[i], i, j, '====item')
            let item = this.couponList[i][j]
            let { accessToken } = item
            revieveSeckillCoupon({
                accessToken,
                entryId: this.curSessionData.id
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    Vue.set(item, 'itemStatus', 'got')
                    axdToast('领取成功')
                    console.log(this.couponList[i][j])
                    this.status = 'ing'
                } else {
                    if (code == '-1999' || code == '10010') {
                        AXD.util.smsLogin(this.customLoginParam)
                    } else if (code == '12000' || code == '10003') {
                        axdToast('已经抢完啦~')
                        this.getCouponNextSessionInfo(accessToken, i, j)
                    } else {
                        axdToast(resultDes)
                    }
                }
            })
        },
        // 如果结束了或者没有库存的情况下，请求当前红包秒杀下一场的信息，如果没有信息，认为没有下一场
        getCouponNextSessionInfo(accessToken, i, j) {
            let item = this.couponList[i][j]
            getNextSeckillCoponInfo({
                accessToken: accessToken,
                templateId: this.config.id
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    // 如果有下一场就展示下一场的时间，如果没有就显示配置文案
                    if (result) {
                        let { startTime, endTime } = result
                        startTime = startTime.replace(/-/g, '/')

                        Vue.set(item, 'itemStatus', 'needNext')
                        Vue.set(item, 'nextStartTime', startTime)
                    } else {
                        Vue.set(item, 'showStock', 0)
                    }
                } else {
                    axdToast(resultDes)
                }
            })
        },
        // 处理开始前文案，不在当天，要加日期，在当天，只展示时间点
        handleBeforeTxt(startTime, next) {
            let startArr = startTime.split(' ')
            let sysArr = this.sysTime.split(' ')
            let mon = this.formatTime(startArr[0].split('/')[1])
            let day = this.formatTime(startArr[0].split('/')[2])
            let hour = this.formatTime(startArr[1].split(':')[0])
            let min = this.formatTime(startArr[1].split(':')[1])
            let txt = ''
            // 不在同一天，需要展示日期
            if (startArr[0] !== sysArr[0]) {
                let md = mon + '月' + day + '日'
                if (next) {
                    txt = '下一场' + md + startArr[1].split(':')[0] + ':' + startArr[1].split(':')[1]
                } else {
                    if (min == '00') {
                        txt = md + hour + '点开抢'
                    } else {
                        txt = md + hour + ':' + min + '开抢'
                    }
                }
            } else {
                txt = hour + '点开抢'
            }
            return txt
        },
        toUseCoupon({ url }) {
            let { app, h5 } = url
            let toUrl
            if (this.isH5) {
                toUrl = h5 || '/pages/rrh/index'
            } else {
                toUrl = app || '/pages/rrh/index'
            }
            window.location.href = toUrl
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
$designWidth: 750;
.couponSeckill {
    padding-bottom: px2rem(10);
    background-size: 100%;
    &__item {
        overflow: hidden;
        position: relative;
        &Content {
            position: absolute;
            span {
                display: block;
                width: px2rem(120);
                line-height: px2rem(36);
                height: px2rem(36);
                text-align: center;
                border-radius: px2rem(5);
                background-color: #ff6666;
                color: #fff;
                font-size: px2rem(22);
            }
        }
    }
    &__main {
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: cover;
        margin-bottom: px2rem(10);
        padding: 0 px2rem(20);
        &:last-child {
            margin-bottom: 0;
        }
        &.line_1 {
            .couponSeckill__item {
                height: px2rem(160);
                &Content {
                    right: px2rem(10);
                    top: 0;
                    width: px2rem(240);
                    height: 100%;
                    padding-top: px2rem(38);
                    text-align: center;
                    span {
                        display: block;
                        width: px2rem(150);
                        line-height: px2rem(60);
                        height: px2rem(60);
                        font-size: px2rem(28);
                        margin: 0 auto;
                        margin-bottom: px2rem(20);
                        overflow: hidden;
                    }
                    p {
                        font-size: px2rem(26);
                        color: #fff;
                        line-height: 1;
                        text-align: center;
                    }
                }
            }
        }
        &.line_2,
        &.line_3 {
            display: flex;
            justify-content: space-between;
        }
        &.line_2 {
            .couponSeckill__item {
                width: px2rem(350);
                height: px2rem(130);
                &Content {
                    right: px2rem(49);
                    top: px2rem(31);
                }
            }
        }
        &.line_3 {
            .couponSeckill__item {
                width: px2rem(230);
                height: px2rem(170);
                &Content {
                    left: px2rem(50);
                    bottom: px2rem(16);
                }
            }
        }
    }
}
</style>
