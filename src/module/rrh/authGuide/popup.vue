<template>
<div>
    <div class="aui-page" v-show="showInfo">
        <div class="tipTitle">您有一笔借款申请待确认</div>
        <div class="tipInfo">
            <p>借款金额：<span>￥{{info.amtLoan | formatMoneyK}}</span></p>
            <p>借款期限：<span>{{info.period}}期</span></p>
            <p>收款账户：<span>{{info.custAccountDesc}}</span></p>
        </div>
        <div class="tipBtns">
            <div class="btn1" @click="toSubmit">确定继续</div>
            <div class="btn2" @click="toCancel">放弃，重新申请</div>
        </div>
    </div>
    <div class="aui-page" v-show="showWrong">
        <div class="tipTitle"></div>
        <div class="tipNoInfo">
            <img src="../styles/imgs/serverwrong.png"/>
            <p>很抱歉，服务器连接异常</p>
        </div>
        <div class="tipBtns">
            <div class="btn1" @click="toReload">重新加载</div>
            <div class="btn2" @click="toClose">关闭弹窗</div>
        </div>
    </div>
</div>
</template>
<script>
import { authFindCycle, authTrial, authGiveup } from 'store/modules/rrh'
import { formatMoneyK } from 'src/libs/util'
import { closeWebView } from '../common/utils'
export default {
    data() {
        return {
            showInfo: false,
            showWrong: false,
            cycleId: '',
            info: {}
        }
    },
    created() {
        this.init()
    },
    filters: {
        formatMoneyK
    },
    methods: {
        init() {
            authFindCycle().then(res => {
                if (res.success && res.result.cycleId) {
                    this.showInfo = true
                    this.showWrong = false
                    this.cycleId = res.result.cycleId
                    authTrial({
                        cycleId: this.cycleId,
                        signType: 'AFTER'
                    }).then(res => {
                        if (res.success) {
                            this.info = res.result
                        } else {
                            this.$_toast(res.resultDes)
                        }
                    })
                } else {
                    this.showInfo = false
                    this.showWrong = true
                }
            })
        },
        // 打开新窗口跳转URL
        goUrl(url) {
            if(this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url,
                        closeToRoot: false
                    }
                })
            } else {
                window.location.href = url
            }
        },
        // 确定继续
        toSubmit() {
            let url = window.location.origin + '/pages/rrh/authtwo?cycleId=' + this.cycleId
            this.log({type: 'button-link', name: 'upwindow-button-surecontinue', desc: '确定继续', extendData: url})
            axdApp.send({
                module: 'webview',
                method: 'close',
                nocallback: true
            })
            this.goUrl(url)
        },
        // 放弃，重新申请
        toCancel() {
            authGiveup({ cycleId: this.cycleId }).then(res => {
                if (res.success && res.result) {
                    let url = window.location.origin + '/pages/rrh/loan?oidBiz=202263&name=贷呗&balance=' + this.info.amtLoan + '&activePeriodVal=' + this.info.period
                    this.log({type: 'button', name: 'upwindow-button-reapply', desc: '放弃，重新申请', extendData: url})
                    axdApp.send({
                        module: 'webview',
                        method: 'close',
                        nocallback: true
                    })
                    this.goUrl(url)
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        // 重新加载
        toReload() {
            window.location.reload()
            
        },
        // 关闭弹窗
        toClose() {
            closeWebView()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-page {
    padding-bottom: px2rem(80);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: linear-gradient(#E3EDFF 0%, #fff 20%, #fff 60%);
}
.tipTitle {
    padding: px2rem(80) 0 px2rem(50);
    font-size: px2rem(45);
    text-align: center;
    color: #333;
    font-weight: bold;
}
.tipInfo{
    padding: 0 px2rem(50);
    flex: auto;
    font-size: px2rem(38);
    color: #666;
    p {
        padding-bottom: 1em;
        text-indent: -5em;
        padding-left: 5em;
    }
    span {
        color: #4f4f4f;
        font-weight: bold;
    }
}
.tipNoInfo {
    flex: auto;
    text-align: center;
    img {
        width: px2rem(400);
        height: px2rem(400);
        margin: 0 auto;
    }
    p {
        font-size: px2rem(46);
        color: #999;
    }
}
.btn1,.btn2 {
    text-align: center;
    height: px2rem(110);
    line-height: px2rem(110);
    margin: 0 px2rem(32);
    border-radius: px2rem(4);
}
.btn1 {
    font-size: px2rem(34);
    background-color: #4286FF;
    color: #fff;
    font-weight: bold;
}
.btn2 {
    font-size: px2rem(28);
    color: #999;
}
</style>
