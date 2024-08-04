<template>
    <section class="lottery-area" v-bind:class="hashName">
        <div class="heitbox">
            <div class="hrefbox" v-if="initInfo.objExts.joinType === '2'">
                <span @click="goRecord">抽奖记录&nbsp;></span>
            </div>
            <div class="heit" v-if="initInfo.objExts.joinType === '2'">
                <dl class="clearfix">
                    <dt>
                        <img :src="initInfo.prizeList[0].imgUrl"/>
                    </dt>
                    <dd>
                        <p class="title">{{initInfo.prizeList[0].title}}</p>
                        <p class="price">{{initInfo.prizeList[0].objExts.description}}</p>
                        <p class="points"><em>{{initInfo.objExts.points}}</em>&nbsp;积分</p>
                    </dd>
                </dl>
            </div>
            <div class="lottery-box">
                    <span class="btn start-btn" @click="startLottery"></span>
                    <div class="lottery-bg" :style="animationStyle"></div>
                </div>
        </div>
        <div class="lottery-box"  v-if="initInfo.objExts.joinType !== '2'">
            <span class="btn" :class="[isDisabled || cahshoutFlag?'disabled-btn':'start-btn']" v-on:click="startLottery"></span>
            <div class="lottery-bg" :style="animationStyle"></div>
        </div>
        <div class="redcoupon" v-if="initInfo.objExts.joinType !== '2'">
            <h3 class="couponTT"><img src="http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202010/15175345568.png" alt=""></h3>
            <p v-if="!initInfo.userAwardList.length" class="noCoupon">暂未获得红包，快去参加活动吧</p>
            <div v-else>
                <ul class="myList">
                    <li v-for="(item, index) in initInfo.userAwardList" :key="index">
                        <div class="left">
                            <span class="sty4">{{item.prizeTitle}}</span>
                        </div>
                        <span class="right" @click="goUse(item.prizeType)">去使用</span>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            newDesignWidth: 750,
            hashName: '_' + (new Date().getTime().toString()),
            lotteryCircle: 4,
            during: 3000,
            totalDegrees: 0,
            animationStyle: undefined
        }
    },
    props: ['initInfo', 'isDisabledState', 'prizeInfo', 'toDoLottery', 'cahshoutFlag'],
    created() {
        this.styleReady()
    },
    computed: {
        lotteryState() {
            return this.toDoLottery
        },
        isDisabled() {
            return this.initInfo.hasApply
        }
    },
    watch: {
        lotteryState(newValue) {
            let self = this
            if (!newValue) {
                return
            }

            let perDegree = 360 / this.initInfo.prizeCount
            this.totalDegrees = parseInt(this.lotteryCircle * 360 + (this.prizeInfo.position - 1) * perDegree)
            this.animationStyle = {
                transform: 'rotate(-' + this.totalDegrees + 'deg)',
                transition: 'transform ' + this.during + 'ms'
            }
            var movement = setTimeout(function() {
                clearInterval(movement)
                self.animationStyle = {
                    transform: 'rotate(-' + (self.totalDegrees % 360) + 'deg)',
                    transition: 'transform 0ms'
                }
                // 抽奖结束
                self.$emit('afterLottery')
            }, this.during)
        }
    },
    methods: {
        // 默认style
        styleReady() {
            let styleElem = document.createElement('style')

            let styleArray = [
                '.' + this.hashName + ', .' + this.hashName + ' * {margin: 0; padding: 0; list-style: none; }',
                '.' + this.hashName + ' { position: relative;  width: 100%; background-image:url(' + this.initInfo.blockBg + '); background-repeat: repeat-y; background-position: center top; background-size: 100% 100%; padding-bottom: ' + this._px2rem(47) + '; margin-top: ' + this._px2rem(-1) + ';}',
                '.' + this.hashName + ' .remain-count { position: absolute; bottom:' + this._px2rem(20) + '; text-align:center; width: 100%;}',
                '.' + this.hashName + ' .lottery-box { position: relative; top:' + this._px2rem(this.initInfo.top) + '; margin:auto; width: ' + this._px2rem(750) + ';}',
                '.' + this.hashName + ' .lottery-box .lottery-bg{ position: absolute; top:0; left:0; width: 100%; height: 100%;}',
                '.' + this.hashName + ' .lottery-box .btn{ z-index:10; position: relative; display: block; width:' + this._px2rem(750) + '; height:' + this._px2rem(120) + '; background-repeat: no-repeat; background-position: center; background-size: 100% auto; margin: auto;}',
                '.' + this.hashName + ' .lottery-box .start-btn {background-image:url(' + this.initInfo.startUrl + ');}',
                '.' + this.hashName + ' .lottery-box .disabled-btn { background-image:url(' + this.initInfo.disabledUrl + ');}'
            ]

            let node = document.createTextNode(styleArray.join(' '))
            styleElem.appendChild(node)
            document.getElementsByTagName('head')[0].appendChild(styleElem)
        },

        // 转盘内size换算
        _px2remAndO2N(oldPx) {
            return (oldPx * 320 / this.newDesignWidth / 20) * (this.initInfo.lotteryWidth / 750) + 'rem'
        },

        // 非转盘内size换算
        _px2rem(px) {
            return (px * 320 / this.newDesignWidth / 20) + 'rem'
        },
        startLottery() {
            if (this.initInfo.objExts.joinType === '2') {
                this.$emit('beforeLottery', false)
                return false
            }
            this.log({type: 'button', name: 'button-lottery-apply', desc: '点击报名的人数'})
            if (this.isDisabled) {
                return
            }
            // 抽奖前的处理逻辑
            this.$emit('beforeLottery', this.isDisabled)
        },
        goUse(prizeType) {
            if (prizeType === '2') {
                this.log({type: 'button-logic-link', name: 'button-lottery-exchange', desc: '积分兑换奖品人数'})
                window.location.href = '/pages/points/exchange-list'
                return false
            }
            this.log({type: 'button-logic-link', name: 'button-lottery-use', desc: '点击我的红包去使用人数'})
            window.location.href = '/pages/rrh/index'
        },
        goRecord() {
            window.location.href = '/pages/points/pointsRecord'
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
@import 'src/assets/styles/rem.scss';
@import 'src/assets/styles/mixins.scss';
$designWidth: 750;
.hrefbox {
    text-align: right;
    padding-right: px2rem(52);
    span {
        width: px2rem(210);
        height: px2rem(52);
        border-radius: px2rem(10) px2rem(10) 0 0;
        display: inline-block;
        font-size: px2rem(28);
        color: #ffffff;
        line-height: px2rem(52);
        text-align: center;
        padding-left: px2rem(45);
        background:#DF7C56 url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/30165332341.png') no-repeat px2rem(20) center;
        background-size: px2rem(32) px2rem(32);
    }
}
.heitbox {
    padding-top: px2rem(50);
    .heit {
        width: px2rem(686);
        background: #ffffff;
        border-top-left-radius: px2rem(20);
        border-top-right-radius: px2rem(20);
        padding: px2rem(48) 0 0 0;
        margin: 0 px2rem(32) px2rem(0) px2rem(32);
        text-align: left;
        height: auto;
        .btnBlue{
            width: px2rem(622);
            height: px2rem(88);
            background: #4286ff;
            border-radius: px2rem(4);
            font-size: px2rem(38);
            line-height: px2rem(88);
            display: inline-block;
            color: #fff;
            text-align: center;
            margin-top: px2rem(32);
        }
        dl {
            width: px2rem(622);
            margin: 0 px2rem(32);
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
    }
}


.redcoupon {
    padding: px2rem(32);
    margin: px2rem(24) px2rem(32);
    background: #fff;
    border-radius: px2rem(20);
    width: px2rem(686);
    .couponTT {
        text-align: center;
        padding-bottom: px2rem(10);
        img {
            width: px2rem(230);
            height: px2rem(34);
            display: inline-block;
        }
    }
    .noCoupon {
        text-align: center;
        font-size: px2rem(28);
        line-height: px2rem(60);
    }
    .myList{
        li {
            background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202010/15175343575.png') no-repeat 0 0;
            background-size: px2rem(622) px2rem(134);
            margin-bottom: px2rem(20);
            width: px2rem(622);
            height: px2rem(134);
        }
        .left {
            width: px2rem(400);
            float: left;
            padding: px2rem(20) px2rem(40) 0;
            span {
                display: inline-block;
                vertical-align: middle;
            }
            .rmb {
                color: #E7412E;
                font-size: px2rem(36);
                font-weight: 500;
            }
            .sty1 {
                font-size: px2rem(68);
                color: #E7412E;
                font-family: PingFang SC;
            }
            .sty2 {
                color: #E7412E;
                font-size: px2rem(36);
                font-weight: 500;
            }
            .sty3 {
                font-size: px2rem(28);
                font-family: PingFang SC;
                font-weight: 400;
                color: #9A794D;
                line-height: px2rem(34);
            }
            .sty4 {
                font-size: px2rem(32);
                font-family: PingFang SC;
                font-weight: 400;
                color: #9A794D;
                padding-top: px2rem(10);
            }
        }
        .right {
            font-size: px2rem(36);
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: px2rem(34);
            width: px2rem(200);
            display: inline-block;
            text-align: center;
            height: px2rem(134);
            line-height: px2rem(134);
            float: right;
        }
    }
}
.dialog-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;

    button {
        width: px2rem(64);
        height: px2rem(64);
        border: none;
        background: url('http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/23182504161.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: px2rem(343);
        bottom: px2rem(366);
        z-index: 30;
    }

    .bg {
        img {
            display: inline-block;
            text-align: center;
        }
        .img1 {
            width: px2rem(440);
            height: px2rem(116);
        }
        .img2 {
            width: px2rem(280);
            height: px2rem(280);
        }
        span {
            font-size: px2rem(44);
            font-weight: 500;
            color: #333;
            display: block;
            width: 100%;
            margin-top: px2rem(5);
        }
        label {
            font-size: px2rem(36);
            font-weight: 400;
            color: #333;
            display: block;
            width: 100%;
        }
        p {
            padding: px2rem(20) 0 px2rem(40) 0;
            font-size: px2rem(28);
            line-height: px2rem(40);
            color: #666;
        }
        a.btn1 {
            width: px2rem(240);
            height: px2rem(88);
            line-height: px2rem(88);
            background: #4286ff;
            display: inline-block;
            color: #ffffff;
            text-align: center;
            font-size: px2rem(32);
            border-radius: px2rem(4);
        }
        a.btnLong {
            width: px2rem(400);
            height: px2rem(88);
            line-height: px2rem(88);
            background: #4286ff;
            display: inline-block;
            color: #ffffff;
            text-align: center;
            font-size: px2rem(32);
            border-radius: px2rem(4);
        }
        a.btnWhite {
            width: px2rem(240);
            height: px2rem(88);
            line-height: px2rem(88);
            background: #fff;
            border: px2rem(1) solid #e6e6e6;
            display: inline-block;
            color: #333;
            font-weight: 600;
            text-align: center;
            font-size: px2rem(32);
            border-radius: px2rem(4);
        }
        width: px2rem(574);
        height: px2rem(656);
        border-radius: px2rem(12);
        margin: px2rem(200) auto 0;
        overflow: hidden;
        text-align: center;
        background: #fff;
        padding-bottom: px2rem(70);
    }
}
</style>
