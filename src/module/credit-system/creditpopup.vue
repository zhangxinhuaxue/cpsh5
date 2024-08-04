<template>
<div>
    <div class="aui-page">
        <div class="tipTitle">由于信用良好，已提升您的额度</div>
        <div class="tipInfo">
            <p class="tipInfoTop"><span>￥</span>{{info.creditAmount | formatMoneyKByComma}}</p>
            <p class="tipInfoBtm">￥{{info.lastCreditAmount | formatMoneyKByComma}}</p>
        </div>
        <div class="tipBtns">
            <div class="btn1" @click="toSubmit">{{setting.text}}</div>
        </div>
    </div>
</div>
</template>
<script>
import { userAmount } from 'store/modules/rrh'
import { formatMoneyKByComma } from 'src/libs/util'
import { renderData } from 'src/store/api'

export default {
    data() {
        return {
            cycleId: '',
            setting: {
                text: '好的',
                url: window.location.origin + '/pages/rrh/index'
            },
            info: {
                creditAmount: '10000',
                lastCreditAmount: '9999'
            }
        }
    },
    created() {
        this.init()
    },
    filters: {
        formatMoneyKByComma
    },
    methods: {
        init() {
            this.getConfig()
            userAmount().then(res => {
                if (res.success) {
                    this.info = res.result
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        getConfig() {
            renderData({
                alias: 'creditsystem',
                type: '/cms'
            }, data => {
                if (data.success && data.result && data.result.blocks) {
                    data.result.blocks.forEach(data => {
                        switch (data.title) {
                            case 'setting':
                                if (JSON.parse(data.objList).popup) {
                                    this.setting = JSON.parse(data.objList).popup
                                }
                                break
                        }
                    })
                }
            })
        },
        // 按钮事件
        toSubmit() {
            this.log({type: 'button-link', name: 'homepage-button-Immediateborrowing', desc: this.setting.text, extendData: this.setting.url})
            if(this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'close',
                    nocallback: true
                })
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: this.setting.url,
                        closeToRoot: false
                    }
                })
            } else {
                window.location.href = this.setting.url
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-page {
    padding-bottom: px2rem(150);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: linear-gradient(#E3EDFF 0%, #fff 20%, #fff 60%);
}
.tipTitle {
    padding: px2rem(150) 0 0;
    font-size: px2rem(40);
    text-align: center;
    color: #333;
}
.tipInfo{
    p {
        text-align: center;
    }
    .tipInfoTop {
        font-size: px2rem(125);
        color: #4286FF;
        span {
            font-size: px2rem(85);
        }
    }
    .tipInfoBtm {
        font-size: px2rem(60);
        color: #ccc;
        text-decoration: line-through;
    }
}
.btn1 {
    text-align: center;
    height: px2rem(110);
    line-height: px2rem(110);
    margin: 0 px2rem(100);
    border-radius: px2rem(4);
    font-size: px2rem(45);
    background-color: #4286FF;
    color: #fff;
    font-weight: bold;
}

</style>
