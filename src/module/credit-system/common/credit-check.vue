<!--
 * @Author: wangzy
 * @Date: 2021-03-25
 * @Description: 倒计时信审结果
 -->
<template>
    <m-dialog ref="dialog" class="dialog">
        <div class="djs" v-if="resultItem === 'djs'">
            <div class="djs-logo"></div>
            <div class="djs-time" v-if="loop">额度审批中...<span>{{times}}s</span></div>
            <div class="djs-time" v-else>申请提交中...</div>
            <p>稍作等待，请勿离开</p>
        </div>
        <div class="pass" v-if="resultItem === 'pass'">
            <div class="pic"></div>
            <p class="tip1">恭喜！获得额度</p>
            <p class="tip2">￥<span>{{amount}}</span></p>
            <m-button @click="toPass">好的</m-button>
        </div>
        <div class="risk" v-if="['ws'].indexOf(resultItem) > -1">
            <div class="pic"></div>
            <p class="tip1">进入人工审核<br/>预计<span>24小时</span>内短信通知结果</p>
            <m-button @click="toRisk">我知道了</m-button>
        </div>
    </m-dialog>
</template>

<script>
import { baseResult } from 'src/store/modules/credit-system'
import { AXD, closeWebView } from 'src/libs/util'
import { renderData } from 'src/store/api'
import { resetHeader } from './setHeader'
import {setLocalStorage,removeLocalStorage} from 'src/libs/util'
export default {
    name: 'credit-check',
    props: {
        timeTotal: {
            type: Number,
            default: 10
        },
        creditOrderId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loop: null,
            setting: {},
            resultItem: '',
            amount: '',
            times: this.timeTotal
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            renderData({
                alias: 'creditsystem',
                type: '/cms'
            }, (data) => {
                if (data.success && data.result && data.result.blocks) {
                    data.result.blocks.forEach(data => {
                        switch (data.title) {
                            case 'setting':
                                this.setting = data.objList ? JSON.parse(data.objList) : {}
                                break
                        }
                    })
                }
            })
        },
        hide(){
            this.$refs.dialog.hide()
        },
        toStart() {
            this.times = this.timeTotal
            this.resultItem = 'djs'
            this.$refs.dialog.show()
            // this.countDown()
        },
        // 倒计时
        countDown() {
            if (this.times > 0) {
                if (this.times % 2 === 0) {
                    removeLocalStorage('creditStatus')
                    baseResult({ creditOrderId: this.creditOrderId }).then(res => {
                        if (res.success) {
                            if (res.result.resultItem === 'risk') {
                                // 审核中继续倒计时
                            } else {
                                // 结束倒计时
                                this.$refs.dialog.hide()
                                clearTimeout(this.loop)

                                this.resultItem = res.result.resultItem
                                switch(this.resultItem) {
                                    case 'pass':
                                        this.amount = res.result.amount
                                        this.$refs.dialog.show()
                                        break
                                    case 'reject':
                                        this.resetReplace(`${window.location.origin}/pages/credit-system/basic/aiyoumi`)
                                        break
                                    case 'contact':
                                        this.resetReplace(`${window.location.origin}/pages/credit-system/changeContacts`)
                                        break
                                    case 'close':
                                        this.setClosedCredit(res.result)
                                        this.resetReplace(`${window.location.origin}/pages/credit-system/closeGuide`)
                                        break
                                    case 'ws':
                                        this.$refs.dialog.show()
                                        break
                                    case 'edu':
                                        resetHeader(() => {
                                            axdApp.send({
                                                module: 'webview',
                                                method: 'historyClear'
                                            })
                                            AXD.util.goEducation({
                                                source: 'edu',
                                                backUrl: encodeURIComponent(window.location.origin + '/pages/credit-system/result')
                                            })
                                        })
                                        break
                                }
                            }
                        } else {
                            this.$refs.dialog.hide()
                            clearTimeout(this.loop)
                            this.$_toast(res.resultDes)
                        }
                    })
                }
                this.times--
                this.loop = setTimeout(this.countDown, 1000)
            } else {
                // 结束倒计时
                this.$refs.dialog.hide()
                clearTimeout(this.loop)
                this.resultItem = 'ws'
                this.$refs.dialog.show()
            }
        },
        // 授信成功,弹框告知额度
        toPass() {
            resetHeader(() => {
                axdApp.send({
                    module: 'webview',
                    method: 'historyClear'
                })
                this.resetReplace(this.setting.pass)
            })
        },
        // 进信审
        toRisk() {
            closeWebView()
        },
        // 授信关闭的msg信息保存
        setClosedCredit(res = {}){
            const info  = {
                item: (res && res.resultItem) || '',
                msg:  (res && res.msg) || '',
                tmp:Date.now()
            }
            setLocalStorage('creditStatus',JSON.stringify(info))
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
::v-deep.dialog .mui-dialog__ft {
    display: none;
}
.djs {
    padding: px2rem(50) 0 px2rem(100);
    .djs-logo {
        width: px2rem(120);
        height: px2rem(120);
        background: url('../assets/images/waiting.png') center center no-repeat;
        background-size: cover;
        margin: 0 auto;
    }
    .djs-time {
        font-size: px2rem(38);
        font-weight: bold;
        color: #666;
        margin: px2rem(20) 0 px2rem(15) 0;
        span {
            color: #4286FF;
        }
    }
    p {
        font-size: px2rem(28);
        color: #999;
    }
}
.pass {
    .pic {
        width: px2rem(120);
        height: px2rem(120);
        background: url('../assets/images/amount-pic.png') center center no-repeat;
        background-size: cover;
        margin: 0 auto;
    }
    .tip1 {
        color: #333;
        font-size: px2rem(36);
        font-weight: bold;
        margin: px2rem(20) 0;
    }
    .tip2 {
        color: #4286FF;
        font-size: px2rem(64);
        margin-bottom: px2rem(64);
        span {
            font-size: px2rem(100);
        }
    }
}
.risk {
    .pic {
        width: px2rem(120);
        height: px2rem(120);
        background: url('../assets/images/check-pic.png') center center no-repeat;
        background-size: cover;
        margin: 0 auto;
    }
    .tip1 {
        color: #666;
        font-size: px2rem(34);
        line-height: px2rem(48);
        margin: px2rem(20) 0 px2rem(140);
        span {
            color: #4286FF;
        }
    }
}
</style>
