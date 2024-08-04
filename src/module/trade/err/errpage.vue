<!--
    created by zhaozhisheng on 06/10/2017
    使用demo

    let url = window.location.href
    this.$router.replace({
        name: 'err',
        params: {
            title: '商品详情',
            tip: '  ',
            desc: '商品已售罄，去看看其他商品吧',
            btnShow: true,
            btnTxt: '重新加载',
            action: 'reload', // reload goback分别对应刷新页面和回退
            url: url // action为reload的时候要给一个url
        }
    })
 -->
<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <p class="err_logo"></p>
            <p class="err_tip-title">{{tip}}</p>
            <p class="err_tip-content">{{desc}}</p>
            <p v-if="btnShow" class="err_btn" @click="reload">{{btnTxt}}</p>
        </div>
    </div>
</template>
<script>
/* global history */
import hybridHeader from 'components/header/hybridheader.vue'
export default {
    name: 'errpage',
    data() {
        return {
            isApp: aixuedai.isUavoApp === 'y',
            title: this.$route.params.title,
            tip: this.$route.params.tip || '出错啦',
            desc: this.$route.params.desc,
            btnShow: this.$route.params.btnShow,
            btnTxt: this.$route.params.btnTxt,
            refreshUrl: this.$route.params.url,
            clickAction: this.$route.params.action
        }
    },
    computed: {
        barConfig() {
            return {
                h5: {
                    visible: false,
                    title: this.title || document.title,
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            }
        }
    },
    components: {
        hybridHeader
    },
    mounted() {
        console.log('out-route', this.$route)
    },
    methods: {
        reload() {
            if (this.clickAction === 'reload' && this.refreshUrl) {
                // window.location.href = this.refreshUrl
                let path = ''
                let query = ''
                if (this.refreshUrl.indexOf('?') !== -1) {
                    path = this.refreshUrl.split('?')[0]
                    query = this.str2obj(this.refreshUrl.split('?')[1])
                } else {
                    path = this.refreshUrl
                }
                this.$router.replace({
                    path: path,
                    query: query
                })
            } else {
                this.goBack()
            }
        },
        goBack() {
            if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'goBack',
                    params: {},
                    callback: function(data) {}
                })
            } else {
                history.back()
            }
        },
        str2obj(str) {
            let arr = str.split('&')
            let obj = {}
            for (let i = 0; i < arr.length; i++) {
                let key = arr[i].split('=')[0]
                let value = arr[i].split('=')[1]
                obj[key] = value
            }
            return obj
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
$designWidth: 750;
p {
    text-align: center;
}

.err_logo {
    width: px2rem(250);
    height: px2rem(374);
    background: url('./err.png') 0 center no-repeat;
    background-size: cover;
    margin: 0 auto;
    margin-top: px2rem(160);
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

</style>
