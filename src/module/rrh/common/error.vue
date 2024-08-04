<template>
    <div class="err_content">
        <p class="err_logo" :style="{'background-image': 'url('+errorInfo.img+')'}"></p>
        <p class="err_tip-title">{{errorInfo.content}}</p>
        <m-button style="justify-self: center" size="middle" @click="toPage(errorInfo.buttonUrl)">{{errorInfo.buttonText}}</m-button>
    </div>
</template>
<script>
export default {
    props: {
        conf: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        errorInfo() {
            console.log(this.conf)
            return Object.assign({}, {
                img: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202009/13115714346.png',
                content: '抱歉，服务器出现异常',
                buttonText: '返回',
                buttonUrl: ''
            }, this.conf)
        }
    },
    methods: {
        toPage(url) {
            if(url) {
                window.location.href = url
            } else {
                this.$router.back()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.err_content {
    display: grid;
    justify-content: center;
    align-content: center;
    position: fixed;
    width: 100%;
    height: 80%;
}
.err_logo {
    width: 7rem;
    height: 7rem;
    background: url(https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202009/13115714346.png) 0 center no-repeat;
    background-size: cover;
    margin: 0 auto;
}

.err_tip-title {
    font-size: px2rem(32);
    color: #999;
    text-align: center;
    line-height: px2rem(40);
    padding: px2rem(20) px2rem(60) px2rem(40);
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
</style>
