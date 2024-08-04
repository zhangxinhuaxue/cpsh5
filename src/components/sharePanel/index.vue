<template>
    <section class="share__panel">
        <transition name="fade-in">
            <div class="mask" v-if="showPannel"></div>
        </transition>
        <transition name="slide-down">
            <div v-if="showPannel">
                <!-- app环境下分享面板 -->
                <section>
                    <div @click="nativeShare('shareWxSession')" class="bg-img wx">
                        <span>微信好友</span>
                    </div>
                    <div @click="nativeShare('shareWxTimeline')" class="bg-img pyq">
                        <span>微信朋友圈</span>
                    </div>
                </section>
                <a href="javascript:" class="share__close" @click="closeShare">取消</a>
            </div>
        </transition>
    </section>
</template>
<script type="text/javascript">
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showPannel: this.isShow
        }
    },
    computed: {},
    watch: {
        isShow(val, oldVal) {
            this.showPannel = val
        }
    },
    methods: {
        nativeShare(method) {
            this.$emit('closePopShare')
            axdApp.send({
                module: 'tools',
                method: method,
                repeat: true,
                params: window.AXDShareConfig,
                callback: (data) => {
                    if (data.data.result == 'true') {
                        this.$_toast('分享成功')
                    } else {
                        this.$_toast('已取消')
                    }
                }
            })
        },
        closeShare() {
            this.$emit('closePopShare')
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';

.share__panel {
    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1002;
    }

    div {
        width: 100%;
        height: px2rem(400);
        background-color: #f7f7f7;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1003;
        overflow: hidden;
    }

    section {
        width: px2rem(560);
        height: px2rem(310);
        margin: auto;
        text-align: center;
        display: flex;
        overflow: hidden;

        div {
            position: relative;
            background-position: center 30%;
            background-repeat: no-repeat;
            background-size: px2rem(280) px2rem(122);

            span {
                display: block;
                width: 100%;
                position: absolute;
                top: px2rem(230);
                color: #999999;
                font-size: px2rem(26);
                text-align: center;
            }
        }

        .wx {
            background-image: url(./img/icon_wechat.png);
        }

        .pyq {
            background-image: url(./img/icon_pyq.png);
        }
    }

    .share__close {
        width: 100%;
        height: px2rem(90);
        display: block;
        background-color: #fff;
        color: #333;
        font-size: px2rem(36);
        line-height: px2rem(90);
        text-align: center;
    }
}

.fade-in-enter-active {
    transition: all .3s ease;
}

.fade-in-enter {
    opacity: 0;
}

.slide-enter-active {
    transition: all .5s ease;
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
}

.slide-down-enter-active {
    transition: all .3s ease;
}

.slide-down-enter,
.slide-down-leave-active {
    transition: all .3s ease;
    -webkit-transform: translate(0, 100%);
    transform: translate(0, 100%);
}
</style>
