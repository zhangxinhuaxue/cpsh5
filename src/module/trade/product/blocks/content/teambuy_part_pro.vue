<!--
    created by yangjun in May 11, 2017
-->
<!-- 提交订单信息参数如何携带，待确认 TO DO -->
<template>
    <div @click="toBuy" class="teambuy__listItem__content">
        <div class="teambuy__listItem__left">
            <p class="teambuy__listItem__left1">{{teambuySate}}</p>
            <p v-if="lastTimeShow" class="teambuy__listItem__left2">剩余{{timeTxt}}</p>
            <p v-if="!lastTimeShow" class="teambuy__listItem__left2">已结束</p>
        </div>
        <div class="teambuy__listItem__right">
            <p class="teambuy__listItem__right1">{{pro.createUserTel}}</p>
            <p class="teambuy__listItem__right2">{{pro.userName}}</p>
        </div>
        <span class="teambuy__listItem__goBtn">去参团</span>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {AXD} from 'libs/util'
export default {
    name: 'teambuyPro',
    data() {
        return {
            timeDiff: 0,
            timeTxt: '',
            lastTimeShow: true,
            teambuySate: '',
            nowDate: '',
            endDate: '',
            subTime: '',
            systemTime: ''
        }
    },
    props: {
        pro: {},
        skuPopupInstance: {
            type: Object
        }
    },
    mounted() {
        // 团是否已满
        let leftNumNew = parseInt(this.pro.leftNum)
        if (leftNumNew === 0) {
            this.teambuySate = '团已满（' + this.pro.num + '人团'
        } else {
            this.teambuySate = '还差' + this.pro.leftNum + '人（' + this.pro.num + '人团）'
        }
        // 倒计时
        this.nowDate = new Date(this.pro.serverTime.replace(/-/g, '/'))
        this.endDate = new Date(this.pro.endTime.replace(/-/g, '/'))
        this.subTime = this.nowDate - (+new Date())

        this.countdown(this.endDate, this.subTime)
    },
    methods: {
        ...mapMutations('trade/product', [
            'updateInitData',
            'updateInteractData'
        ]),
        countdown(endTime, subTime) {
            let that = this
            let nowDate = new Date(+new Date() + subTime)
            let endDate = new Date(endTime)
            let timeDiff = (endDate - nowDate) / 1000
            // 倒计时结束
            if (timeDiff <= 0) {
                that.lastTimeShow = false
                return false
            }
            let oneMin = 60
            let oneHour = 60 * 60
            let oneDay = 60 * 60 * 24
            let totalHour = this.getTwoNum(Math.floor(timeDiff / oneHour))
            let totalMin = this.getTwoNum(Math.floor((timeDiff - totalHour * oneHour) / oneMin))
            let totalSec = this.getTwoNum(Math.floor((timeDiff - totalHour * oneHour - totalMin * oneMin)))
            let outStr = totalHour + ':' + totalMin + ':' + totalSec + ''
            this.timeTxt = outStr
            setTimeout(function() {
                that.countdown(that.endDate, that.subTime)
            }, 1000)
        },
        getTwoNum(num) {
            return num < 10 ? '0' + num : num
        },
        toBuy() {
            let that = this
            if (!that.lastTimeShow) {
                that.$_toast('拼团已过期，请刷新页面')
                return false
            }
            this.updateInteractData({
                targetKey: 'trade',
                popupFrom: 'toTeamReco',
                isSkuPopOpen: true
            })
            this.skuPopupInstance.isPopup = true
            this.updateInteractData({
                targetKey: 'teambuy',
                createTeambuy: 'n',
                recordId: that.pro.recordId
            })
            this.updateInteractData({
                targetKey: 'teambuy',
                tbId: that.pro.tbId
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "src/assets/styles/vars.scss";
    @import "src/assets/styles/rem.scss";
    @import 'src/assets/styles/aui-vars.scss';
    $designWidth: 750;
    img {
        display: block;
        width: 100%;
    }

    body {
        background: #F5F5F5;
    }

    .teambuy {
        margin-bottom: px2rem(20);
        &__list {
            background-color: #fff;
            padding: 0 px2rem(32) px2rem(35);
            margin-top: px2rem(20);
        }
        &__listName {
            font-size: $auiFontSizeLevel7;
            font-weight: normal;
            text-align: center;
            line-height: px2rem(84);
            color: #888;
        }
        &__listItem {
            &__content {
                padding: px2rem(16) px2rem(153) px2rem(16) px2rem(30);
                height: px2rem(98);
                overflow: hidden;
            }
            &__left,
            &__right {
                float: left;
                width: 50%;
                &1 {
                    font-size: $auiFontSizeLevel5;
                    color: #f99e00;
                    height: px2rem(34);
                    line-height: px2rem(34);
                    margin-bottom: px2rem(4);
                }
                &2 {
                    font-size: $auiFontSizeLevel7;
                    color: #999;
                    line-height: px2rem(30);
                }
            }
            &__right {
                p {
                    text-align: right;
                }
                &1 {
                    color: #666;
                }
            }
            &__goBtn {
                position: absolute;
                right: px2rem(-2);
                top: px2rem(-1);
                width: px2rem(133);
                height: px2rem(100);
                background: #FFD72D;
                font-size: $auiFontSizeLevel5;
                color: #222;
                line-height: px2rem(100);
                text-align: center;
                border-top-right-radius: px2rem(10);
                border-bottom-right-radius: px2rem(10);
                border-right: px2rem(1) solid #F8E81C;
            }
        }
    }
</style>
