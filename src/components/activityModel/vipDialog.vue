<template>
    <div class="vip-dialog_wrapper">
        <transition name="fade">
            <div class="vip-dialog_mask" v-show="visible"></div>
        </transition>
        <transition name="fade-offset">
            <div class="vip-dialog" v-show="visible">
                <div class="vip-dialog_header">{{ headerText }}</div>
                <div class="vip-dialog_content" v-html="bodyContent"></div>
                <div class="vip-dialog_footer">
                    <div class="footer" style="color: #A1A1A1;" @click="closeDialog">{{ footerContent1 }}</div>
                    <div class="vertical"></div>
                    <div class="footer" style="color: #FE9104;" @click="goPay">{{ footerContent2 }}</div>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        days: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {}
    },
    computed: {
        headerText() {
            if (this.type === 'notVIP') {
                return '开通A+会员'
            } else if (this.type === 'success') {
                return '领取成功'
            } else if (this.type === 'soon_expire') {
                return '会员要到期了'
            } else if (this.type === 'expired') {
                return '会员到期'
            }
        },
        bodyContent() {
            if (this.type === 'notVIP') {
                return '您未开通爱又米A+会员，<br>暂时无法领取'
            } else if (this.type === 'success') {
                return '恭喜您，已成功领取该权益，<br>快去使用吧'
            } else if (this.type === 'soon_expire') {
                return `您的会员<span class="remind">${this.days == 0 ? '今天' : `${this.days}天`}</span>${this.days == 0 ? '即将到期' : '后即将到期'}，会影响您的权益使用，请<span class="remind">即时续费</span>`
            } else if (this.type === 'expired') {
                return '您的会员已到期，若需要继续使用各项权益，请<span class="remind">即时续费</span>'
            }
        },
        footerContent1() {
            if (this.type === 'notVIP') {
                return '放弃领取'
            } else {
                return '取消'
            }
        },
        footerContent2() {
            if (this.type === 'notVIP') {
                return '立即开通'
            } else if (this.type === 'success') {
                return '去使用'
            } else {
                return '去续费'
            }
        }
    },
    destroyed() {
        clearTimeout(this.timeout)
    },
    methods: {
        pay() {
            window.location.href = window.location.origin + '/pages/vipcard'
        },
        goCouponList() {
            if (window.aixuedai.isUavoApp !== 'n') {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: window.location.origin + '/pages/coupon/my/list',
                        closeToRoot: false
                    },
                    callback() {}
                })
            } else {
                // 红包列表h5环境下跳app下载页
                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.aixuedai.axd'
            }
        },
        closeDialog() {
            this.$emit('update:visible', false)
            this.$emit('close')
        },
        goPay() {
            if (this.type === 'success') {
                this.goCouponList()
            } else if (this.type === 'soon_expire' || this.type === 'notVIP') {
                this.pay()
            }
            this.timeout = setTimeout(() => {
                this.closeDialog()
            }, 500)
        }
    }
}
</script>
<style scoped lang="scss">
@import 'src/assets/styles/animation.scss';
.vip-dialog {
    position: fixed;
    top: 25%;
    left: 50%;
    margin-left: - px2rem(300);
    background: #fff;
    z-index: 10012;
    width: px2rem(600);
    height: px2rem(337);
    border-radius: px2rem(12);
    &_mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .8);
        z-index: 10001;
    }
    &_header {
        font-size: px2rem(36);
        font-weight: 400;
        width: 100%;
        text-align: center;
        margin: px2rem(42) 0 px2rem(20) 0;
    }
    &_content {
        font-size: px2rem(28);
        color: #424243;
        padding: 0 px2rem(60);
        text-align: center;
    }
    &_footer {
        width: 100%;
        height: px2rem(100);
        font-size: px2rem(36);
        position: absolute;
        bottom: px2rem(0);
        border-top: 1px solid #E4E4E4;
        display: flex;
        align-items: center;
    }
    .footer {
        flex: 1;
        text-align: center;
        height: px2rem(100);
        line-height: px2rem(100);
    }
    .vertical {
        width: 1px;
        height: 100%;
        background: #E4E4E4;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    ::v-deep .remind {
        color: #9B7D46;
    }
}
</style>
