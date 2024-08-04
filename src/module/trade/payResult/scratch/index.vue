<!--
    created: mahui, on 07/30/2018
    desc: 支付成功页面刮奖区域，使用canvas完成特效，只要用户手滑动以下就会全部显示出奖品信息
-->
<template>
    <div v-if="showScratch" class="scratch">
        <template v-if="!showNoChance">
            <canvas id="scratch" v-if="showCanvas">
                该浏览器暂不支持canvas
            </canvas>

            <div v-if="showTips" class="scratch__result chance-tips">
                <p><span></span>本次支付获得<span></span></p>
                <p>1次刮奖机会</p>
                <a href="javascript:;" @click="doScratch">立即刮奖</a>
            </div>

            <template v-else>
                <div v-if="showScratchResult" class="scratch__result scratch-result">
                    <p>{{prizeTitle}}</p>
                    <a href="javascript:;" @click="goCoupon">立即领奖</a>
                </div>

                <div v-else class="scratch__result tips">
                    谢谢参与
                </div>
            </template>

        </template>

        <div v-else class="scratch__result tips">
            刮奖次数已用完
        </div>
    </div>
</template>

<script>
import { renderDataCms } from 'src/store/api'
import {
    getLotteryInitInfo,
    getLotteryRun
} from 'src/store/modules/activity'
export default {
    name: 'scratch',
    data() {
        return {
            showScratch: false,
            showScratchResult: true,
            showNoChance: false,
            showTips: true,
            ctx: null,
            clientWidth: 0,
            canvasDom: null,
            scale: 1,
            moveX: 0,
            moveY: 0,
            token: '',
            prizeTitle: '',
            showCanvas: true
        }
    },
    created() {
    },
    beforeMount() {
        this.initChance()
    },
    mounted() {
        this.clientWidth = document.body.clientWidth
    },
    methods: {
        initCanvas() {
            let canvasDom = document.querySelector('#scratch')
            this.canvasDom = canvasDom

            let scale = this.clientWidth / 750
            this.scale = scale

            canvasDom.width = Math.ceil(scale * 626)
            canvasDom.height = Math.ceil(scale * 276)
            this.ctx = canvasDom.getContext('2d')

            this.loadImageAsync(require('./images/scratch_bg.png')).then((image) => {
                this.ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasDom.width, canvasDom.height)

                this.ctx.lineCap = 'round' // 线的两头样式为圆
                this.ctx.lineJoin = 'round' // 线的拐角样式为圆

                this.initListener()
            })
        },
        initListener() {
            this.canvasDom.addEventListener('touchstart', (e) => {
                let x = e.touches[0].pageX
                let y = e.touches[0].pageY

                this.moveX = this.windowToCanvas(x, y).x
                this.moveY = this.windowToCanvas(x, y).y
                this.ctx.arc(this.moveX, this.moveY, 25 * this.scale, 0, 2 * Math.PI)
            })
            this.canvasDom.addEventListener('touchmove', (e) => {
                let x = e.touches[0].pageX
                let y = e.touches[0].pageY

                let ctx = this.ctx
                ctx.globalCompositeOperation = 'destination-out'

                ctx.beginPath()
                ctx.moveTo(this.moveX, this.moveY)
                ctx.lineTo(this.windowToCanvas(x, y).x, this.windowToCanvas(x, y).y)

                this.moveX = this.windowToCanvas(x, y).x
                this.moveY = this.windowToCanvas(x, y).y

                ctx.stroke()
                ctx.lineWidth = 120 * this.scale
            }, false)
            this.canvasDom.addEventListener('touchend', (e) => {
                // 滑动结束，去除刮奖层
                this.ctx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height)

                this.showCanvas = false
            })
        },
        loadImageAsync(url) {
            return new Promise((resolve, reject) => {
                let img = new Image()
                if (!url.startsWith('data:image')) {
                    // 跨域
                    img.crossOrigin = 'anonymous'
                }

                img.src = url
                img.onload = () => {
                    resolve(img)
                }
                img.onerror = (err) => {
                    reject(new Error('图片加载发生错误'))
                }
            })
        },
        windowToCanvas(x, y) {
            let bbox = this.canvasDom.getBoundingClientRect()
            return {
                x: x - bbox.left * (this.canvasDom.width / bbox.width),
                y: y - bbox.top * (this.canvasDom.height / bbox.height)
            }
        },
        initChance() {
            renderDataCms({
                alias: 'pay_result',
                type: '/cms',
                timeStamp: new Date().getTime()
            }).then(({success, result, resultDes}) => {
                if (success && result) {
                    let extend = result.blocks.find((item, index) => {
                        return item.blockType === 'extend' && JSON.parse(item.objList).token
                    })

                    if (extend) {
                        this.token = JSON.parse(extend.objList).token
                        this.getChance()
                    }
                }
            })
        },
        getChance() {
            getLotteryInitInfo({
                token: this.token,
                timeStamp: new Date().getTime()
            }, ({success, result: {chanceCount}}) => {
                if (success) {
                    this.showScratch = true
                    if (Number(chanceCount)) {
                        this.$nextTick(() => {
                            // 初始化canvas
                            this.initCanvas()
                        })
                    } else {
                        this.showNoChance = true
                    }
                }
            })
        },
        doScratch() {
            getLotteryRun({
                token: this.token
            }, ({success, result, resultDes, code}) => {
                // 去除提示刮奖盒子
                this.showTips = false

                if (success && result && result.prizeTitle) {
                    this.prizeTitle = result.prizeTitle
                } else if (code === '10010') {
                    // 未登录
                    this.$_toast('登录已失效，请重新登录')
                } else {
                    // 异常情况，或没抽到奖品，皆为谢谢参与
                    this.showScratchResult = false
                }
            })
        },
        goCoupon() {
            window.location.href = (window.aixuedai.isUavoApp === 'n') ? window.aixuedai.appDownloadUrl : '/pages/coupon/my/list?from=payResult'
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.scratch {
    position: relative;
    width: 100%;
    height: px2rem(384);
    background: url(./images/scratch_prize_bg.png) 0 0 no-repeat;
    background-size: 100%;
    padding: px2rem(54) px2rem(62);
    #scratch {
        z-index: 2;
        position: absolute;
        top: px2rem(54);
        left: px2rem(62);
    }
    &__result {
        position: absolute;
        top: px2rem(54);
        left: px2rem(62);
        width: px2rem(626);
        height: px2rem(276);
        text-align: center;
        padding-top: px2rem(47);
        p {
            &:first-of-type {
                color: #999999;
                font-size: px2rem(28);
                height: px2rem(34);
                line-height: px2rem(34);
                margin-bottom: px2rem(10);
            }
            &:last-of-type {
                font-size: px2rem(38);
                height: px2rem(46);
                line-height: px2rem(46);
                margin-bottom: px2rem(20);
            }
            span {
                vertical-align: middle;
                display: inline-block;
                width: px2rem(100);
                height: px2rem(2);
                margin-right: px2rem(12);
                background: linear-gradient(to right, rgba(#999999, 0), rgba(#999999, 1));
                &:last-of-type {
                    background: linear-gradient(to right, rgba(#999999, 1), rgba(#999999, 0));
                    margin-left: px2rem(12);
                }
            }
        }
        a {
            display: block;
            margin: 0 auto;
            width: px2rem(320);
            height: px2rem(72);
            background: url(./images/scratch_btn.png) 0 0 no-repeat;
            background-size: 100%;
            color: #ffffff;
            font-size: px2rem(34);
            text-align: center;
            line-height: px2rem(72);
        }
    }

    .scratch-result {
        z-index: 1;
        padding-top: px2rem(69);
        p {
            font-size: px2rem(38);
            color: #FC3D1A;
        }
    }
    .chance-tips {
        z-index: 3;
    }
    .tips {
        padding-top: px2rem(90);
    }
}

</style>
