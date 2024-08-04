<template>
    <div :class="['err_page', classname]" v-if="!doDestroy">
        <p class="err_logo"></p>
        <p class="err_tip-title">{{errTip}}</p>
        <p class="err_tip-content">{{errDes}}</p>
        <p v-if="showBtn" class="err_btn" @click="reload">重新加载</p>
    </div>
</template>
<script>
export default {
    props: {
        errDes: {
            type: String,
            default: '系统繁忙，请稍后再试'
        },
        reloadOrBack: {
            type: String,
            default: 'back'
        },
        hasH5Bar: {
            type: Boolean
        },
        errTip: {
            type: String,
            default: '出错啦'
        },
        errTitle: {
            type: String
        },
        showBtn: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isApp: window.aixuedai.isUavoApp === 'y',
            doDestroy: false
        }
    },
    beforeRouteLeave(to, from, next) {
        this.doDestroy = true
        next()
    },
    computed: {
        classname() {
            return this.hasH5Bar ? 'top88' : ''
        }
    },
    watch: {
        reloadOrBack(curVal, oldVal) {
            if (curVal == 'reload') {
                this.hideRightBtn()
            }
        },
        errTitle(curVal) {
            document.title = curVal // app标题
            let h5TitleContainer = document.getElementsByClassName('aui-navbar__title')
            if (h5TitleContainer.length) {
                h5TitleContainer[0].innerHTML = curVal // H5标题 H5无法watch document变量 并给予相应处理
            }
        }
    },
    components: {},
    mounted() {
        if (this.reloadOrBack == 'reload') {
            this.hideRightBtn()
        }
    },
    methods: {
        reload() {
            let _this = this
            if (_this.reloadOrBack == 'reload') {
                let u = navigator.userAgent
                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

                if (isiOS && _this.isApp) {
                    axdApp.refresh()
                } else {
                    window.location.reload()
                }
            } else {
                if (_this.isApp) {
                    axdApp.send({
                        module: 'webview',
                        method: 'goBack',
                        params: {},
                        callback: function(data) {}
                    })
                } else {
                    history.back()
                }
            }
        },
        hideRightBtn() {
            // 隐藏header右侧按钮
            let h5Bar = document.getElementsByClassName('aui-navbar')
            let h5RightBtn = document.getElementsByClassName('aui-navbar__tools')
            if (h5Bar.length && h5RightBtn.length) {
                document.getElementsByClassName('aui-navbar__tools')[0].style.display = 'none'
            } else if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'configNavigationBar',
                    params: {
                        visible: true,
                        rightbuttonVisible: false // 右侧按钮是否显示
                    },
                    callback: function(data) {}
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';
@import '../../assets/styles/rem.scss';
$designWidth: 750;
.err_page {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    padding-top: px2rem(160);
    z-index: 9999;
    p {
        text-align: center;
    }
}

.err_logo {
    width: 7rem;
    height: 7rem;
    background: url(https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202009/13115714346.png) 0 center no-repeat;
    background-size: cover;
    margin: 0 auto;
}

.err_tip-title {
    font-size: px2rem(36);
    color: #222222;
    line-height: px2rem(40);
    margin-top: px2rem(30);
}

.err_tip-content {
    width: px2rem(550);
    margin: 0 auto;
    font-size: px2rem(30);
    color: #666666;
    line-height: px2rem(40);
    padding-top: px2rem(10);
}

.err_btn {
    width: px2rem(222);
    height: px2rem(70);
    margin: 0 auto;
    border: 1px solid #F99E00;
    border-radius: px2rem(100);
    font-size: px2rem(28);
    color: #F99E00;
    line-height: px2rem(70);
    margin-top: px2rem(30);
}

.top88 {
    top: px2rem(88);
}
</style>
