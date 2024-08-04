<template>
    <!-- 首页签到模块 -->
    <section class="pointsSign">
        <div>
            <h4>每日签到</h4>
            <ul>
                <!-- 底部不变，一直+1...+7，上面的积分，超过7天之后，就一直显示7 -->
                <li v-for="i in list">
                    <span v-if="i >= signDay"><i>+</i>{{resetPoints(i)}}</span>
                    <span class="checked" v-else></span>
                    <p>{{i+1}}天</p>
                </li>
            </ul>
            <p>已连续签到<span>{{signDay}}</span>天!</p>
        </div>
    </section>
</template>

<script>
import { signIn } from 'store/modules/user-points'
import { AXD } from 'src/libs/util'
import hub from 'assets/js/hub'

export default {
    data() {
        return {
            list: Array.from(new Array(7).keys()), // 初始化数组
            signDay: 0 // 签到的当前天数
        }
    },
    activated() {
        this.init()
    },
    methods: {
        init() {
            // 签到
            signIn().then(({success, result, code, resultDes}) => {
                // 通知header模块，获取待领取积分列表
                hub.$emit('refreshList')
                if (success) {
                    let {days, score} = result
                    this.signDay = days
                    // 重置展示天数
                    this.resetArray()
                    // 后台小哥要求，请求完这个列表再请求任务列表
                    this.$emit('initTask')
                    // ===0，说明今天已经签到，无需其他展示
                    if (score == 0) return
                    // 展示积分弹窗
                    this.$emit('popup', {days, score})
                } else {
                    if (code == 10001 || code == 10002) {
                    //     AXD.uttil.smsLogin()
                        return
                    }
                    // 后台小哥要求，请求完这个列表再请求任务列表
                    this.$emit('initTask')
                    this.$_toast(resultDes)
                }
            })
        },
        resetPoints(i) {
            return (this.signDay >= 7) ? 70 : (i + 1) * 10
        },
        resetArray() {
            if (this.signDay > 6) {
                let min = this.signDay - 6
                let max = this.signDay + 1
                this.list = []
                for (let i = min; i < max; i++) {
                    this.list.push(i)
                }
            }
        }
    }
}
</script>

<style lang="scss">
.pointsSign {
    height: px2rem(145);
    margin-bottom: px2rem(24);
    div {
        position: relative;
        top: px2rem(-129);
        width: px2rem(686);
        height: px2rem(274);
        margin: 0 auto;
        padding: px2rem(32);
        padding-top: 0;
        background-color: #fff;
        border-radius: px2rem(20);
        h4 {
            font-size: px2rem(32);
            line-height: 1;
            color: #131314;
            line-height:px2rem(104) ;
        }
        ul {
            display: flex;
            justify-content: space-between;
        }
        & > p{
            font-size: px2rem(24);
            color: #424243;
            line-height: 1.5;
            span {
                color: #FF3E00;
            }
        }
        li {
            text-align: center;
            span {
                display: block;
                position: relative;
                width: px2rem(52);
                height: px2rem(52);
                font-size: px2rem(22);
                color: #CC8800;
                line-height: px2rem(52);
                background-image: url(../images/sign.png);
                background-repeat: no-repeat;
                background-position: 0 0;
                background-size: px2rem(52);
                i {
                    font-size: px2rem(20);
                    font-style: normal;
                }
                &.checked {
                    background-image: url(../images/signed.png);
                }
                &:after {
                    content:"";
                    position: absolute;
                    right: px2rem(-40);
                    top: px2rem(26);
                    width: px2rem(36);
                    height: 1px;
                    background-color: #A1A1A1;
                }
            }
            p {
                font-size: px2rem(22);
                color: #A1A1A1;
                line-height: px2rem(62);
            }
            &:last-child {
                span:after {
                    display: none;
                }
            }
        }
    }
}

</style>
