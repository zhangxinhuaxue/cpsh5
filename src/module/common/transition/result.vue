<template>
<div>
    <div class="status" :class="status"></div>
    <div v-if="des" class="des">{{des}}</div>
    <div v-if="detail" class="sub-des">{{detail}}</div>
</div>
</template>
<script>
export default {
    name: 'transition',
    props: {
        status: {
            type: String,
            default: 'waiting'
        },
        during: {
            type: Number,
            default: 0
        },
        polling: {
            type: Number,
            default: 0
        },
        type: {
            type: String
        },
        subDes: {
            type: String
        }
    },
    computed: {
        des() {
            let des = ''
            switch (this.status) {
                case 'timeout':
                    des = '抱歉，请求超时，请稍候再试'
                    break
                case 'waiting':
                    des = `正在查询${this.type}结果，请稍后`
                    break
                case 'fail':
                    des = `${this.type}操作失败，请稍候再试`
                    break
                case 'success':
                    des = `恭喜您，${this.type}成功!`
                    break
                default:
                    break
            }
            return des
        }
    },
    data() {
        return {
            detail: this.subDes,
            interval: null
        }
    },
    watch: {
        during: {
            immediate: true,
            handler(newValue, oldValue) {
                if (newValue) {
                    let time = newValue
                    this.detail = time + 's...'
                    this.interval = setInterval(() => {
                        if (time) {
                            time--
                            this.detail = time ? time + 's...' : ''
                            if (!time) {
                                clearInterval(this.interval)
                                this.$emit('timeout')
                            }
                        }
                    }, 1000)
                } else {
                    clearInterval(this.interval)
                    this.detail = ''
                }
            }
        },
        subDes(newValue, oldValue) {
            this.detail = newValue
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@mixin gif2x($url) {
    background-image: url($url+'@2x.gif');
    @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
        background-image:url($url+'@3x.gif');
    }
}
.status {
    width: px2rem(140);
    height: px2rem(140);
    background-size: 100%;
    margin: px2rem(80) auto 0;
}
.waiting {
    @include gif2x('./imgs/waiting');
}
.fail {
    @include img2x('./imgs/fail');
}
.timeout {
    @include img2x('./imgs/timeout');
}
.success {
    @include img2x('./imgs/success');
}
.des{
    font-size: px2rem(36);
    line-height: px2rem(44);
    font-weight: bold;
    text-align: center;
    margin-top: px2rem(40);
}
.sub-des {
    margin:px2rem(20) auto;
    width:px2rem(600);
    font-size:px2rem(28);
    color:rgba(113,113,114,1);
    line-height: px2rem(44);
    text-align: center;
}
</style>
