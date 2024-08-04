<!--
    created: mahui,
    desc: 配合积分任务的模块，在积分任务中配置了浏览任务，则会显示该模块，如浏览主会场页面15秒
-->
<template>
    <div v-if="showBrowseCount" type="bcountdown" class="bcountdown" :style="styleObj">
        <axd-image :src="config.img" :fixWH="true"></axd-image>
        <div class="bcountdown__text">
            <p class="bcountdown__box">
                <template v-if="leftSeconds">
                    {{config.beforeCountdownText || '浏览'}}{{leftSeconds}}秒{{config.afterCountdownText || '后获得奖励'}}
                </template>
                <template v-else>
                    {{config.finishText}}
                </template>
            </p>
        </div>
    </div>
</template>

<script>
import axdToast from 'components/toast/index'
import axdImage from 'src/components/image/index.vue'
import {checkByOutCode, completeByOutCode} from 'src/store/api'
import {
    AXD
} from 'src/libs/util'
export default {
    name: 'browsecountdown',
    props: {
        config: {
            type: Object
        }
    },
    data() {
        return {
            leftSeconds: 15,
            showBrowseCount: false,
            bgImg: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/201907/23195802068.png'
        }
    },
    components: {
        axdImage
    },
    computed: {
        styleObj() {
            return {
                // backgroundImage: `url(${this.config.img || this.bgImg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                color: this.config.textColor ? `#${this.config.textColor}` : '#ffffff'
            }
        }
    },
    created() {
        window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(cb) {
            window.setTimeout(cb, 1000 / 60)
        }
        this.checkByOutCode()
    },
    methods: {
        checkByOutCode() {
            // 查询用户是否领取了浏览任务
            checkByOutCode({
                taskOutCode: this.config.taskOutCode
            }).then(({success, code, result, resultDes}) => {
                if (success) {
                    if (result) {
                        this.showBrowseCount = true
                        this.$nextTick(() => {
                            this.countDown()
                        })
                    }
                } else if (code === '10001' || code === '10002') {
                    AXD.util.login()
                } else {
                    axdToast(resultDes)
                }
            })
        },
        completeByOutCode() {
            // 完成任务通知服务端
            completeByOutCode({
                taskOutCode: this.config.taskOutCode
            }).then(({success, code, result, resultDes}) => {
                if (success && result) {
                } else if (code === '10001' || code === '10002') {
                    AXD.util.login()
                } else {
                    axdToast(resultDes)
                }
            })
        },
        countDown() {
            let count = 0
            this.leftSeconds = this.config.countdown / 1000
            let minus = () => {
                window.requestAnimationFrame(() => {
                    if (this.leftSeconds <= 0) {
                        // 发送标识
                        this.completeByOutCode()
                        return
                    }

                    count++
                    if (count >= 60) {
                        this.leftSeconds--
                        count = 0
                    }
                    minus()
                })
            }
            minus()
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/style.scss';
.bcountdown {
    position: fixed;
    top: px2rem(815);
    right: 0;
    display: inline-block;
    z-index: 999;
    // width: px2rem(152);
    // height: px2rem(64);
    // border-radius: px2rem(36) 0px 0px px2rem(36);

    &__text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    &__box {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        width: 100%;
        max-height: px2rem(62);

        padding: 0 px2rem(28);
        font-size: px2rem(19);
        line-height: px2rem(31);
        text-align: center;
        overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 2; //想要的行数
        // -webkit-box-orient: vertical;
    }
}
</style>
