<template>
    <m-page>
        <hybrid-header slot="header" :config="barConfig" class="mui-bar_nav"></hybrid-header>
        <div class="page__content">
            <div class="img-error"></div>
            <div class="error-desc">支付失败</div>
            <div class="button-box">
                <m-button :round="false" type="plain" @click="handleBack">返回</m-button>
                <m-button :round="false" class="ml32" @click="handleRepay">重新支付</m-button>
            </div>

        </div>
    </m-page>
</template>
<script>
import {AXD, parseQuery} from 'src/libs/util'
import {getPayParameterByGid} from 'src/store/modules/rrh'
import {getPayError} from 'src/store/modules/trade/payResult'
import { cashierOrigin } from 'src/libs/domain'

export default {
    name: 'PayError',
    props: {},
    data() {
        return {
            barConfig: {
                leftAction: 'goBack',

                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: 'goBack'
                }
            },
            gid: '',
            returnUrl: '',
            quitUrl: '',
            backUrl: ''
        }
    },
    computed: {},
    created() {
        // 1. 清空历史记录
        // 2. 跳转使用replace

        if (this.isApp) {
            axdApp.send({
                module: 'webview',
                method: 'historyClear'
            })
        }
        window.goBack = () => {
            this.handleBack()
        }
        this.getUrl()
    },
    methods: {
        getUrl() {
            this.backUrl = ''
            const {token} = this.$route.query
            getPayError({token}).then(res=>{
                if(res.success){
                    const {gid,returnUrl,quitUrl} = res.result ||{}
                    this.gid = gid
                    this.returnUrl = returnUrl
                    this.quitUrl =  quitUrl

                    const quitUrlSearch = quitUrl.split('?')[1]
                    const { backUrl } = parseQuery(quitUrlSearch)
                    this.backUrl = backUrl

                    return
                }
                this.$_toast(res.resultDes)
                if (res.code === '-1999' || res.code ==='-1997') {
                    AXD.util.login()
                }
            })
        },
        handleBack() {
            if(this.backUrl){
                console.log(this.backUrl)
                this.resetReplace(this.backUrl)
                return
            }

            if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'goBack',
                    params: {},
                    callback: function (data) {
                    }
                })
                return
            }
            history.back()
        },
        handleRepay() {
            getPayParameterByGid({
                gid: this.gid,
                returnUrl: this.returnUrl,
                quitUrl: this.quitUrl
            }).then((res) => {
                if (res.success) {
                    const url = `${cashierOrigin}/h5cashier/index?payInfo=${encodeURIComponent(res.result.parameters)}`
                    this.resetReplace(url)
                    // window.location.href = aixuedai.webCashUrl + '/h5cashier/index?payInfo=' + encodeURIComponent(res.result.parameters)
                    return
                }
                this.$_toast(res.resultDes)
            })

        }
    }
}
</script>

<style lang="scss" scoped>

$colorPrimary: #4286ff;

.page__content {
    padding: px2rem(50) px2rem(32);
    height: 100%;
    background: #fff;

}

.img-error {
    width: px2rem(110);
    height: px2rem(110);
    margin: 0 auto;
    background: center / 100% url(./assets/icon-error.png);
}

.error-desc {
    font-size: px2rem(36);
    color: #333;
    font-weight: 600;
    text-align: center;
    margin-top: px2rem(38);
}

.button-box {
    display: flex;
    margin-top: px2rem(60);
}

.ml32 {
    margin-left: px2rem(32);

}
</style>
