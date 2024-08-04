<template>
    <h-page>
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <template v-if="success">
                <div class="aui-content__page-error">
                    <p><span class="icon-success"></span></p>
                    <p class="aui-content__tips">支付成功</p>
                </div>
                <div class="aui-content__page-ft">
                    <m-button size="middle">确定 ({{second}}s)</m-button>
                </div>
            </template>
            <template v-else>
                <div class="aui-content__page-error">
                    <p><span class="icon-fail"></span></p>
                    <p class="aui-content__tips">支付失败</p>
                    <p class="aui-content__desc">{{payfailTxt}}</p>
                </div>
                <div class="aui-content__page-ft">    
                    <m-button type="plain"  size="middle" @click="back">返回</m-button>
                    <m-button size="middle" @click="repay">重新支付</m-button>
                </div>
            </template>
        </div>
    </h-page>
</template>
<script>
import { renderData } from 'src/store/api'
import {getPaymentParamsV3, openPaymentV3} from 'module/trade/common/assets/order_multi'
import hPage from '../common/hPage'
export default {
    data() {
        return {
            isApp: window.aixuedai.isUavoApp === 'y',
            loanId: this.$route.query.loanId,
            gid: this.$route.query.gid,
            tradeid: this.$route.params.tradeId,
            success: false,
            payfailTxt: '',
            second: 2,
            barConfig: {
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: 'stayWindow'
                },
                h5: {
                    visible: false
                }
            }
        }
    },
    created() {
        window.stayWindow = this.back
        renderData({ alias: window.aixuedai.alias || 'rrhzx' }, ({success, result}) => {
            if (result && result.blocks) {
                result.blocks.forEach(item => {
                    if (item.blockType === 'extend') {
                        let json = JSON.parse(item.objList)
                        this.payfailTxt = json.payfailTxt
                    }
                })
            }
        })
    },
    beforeMount() {
        let errorCode = this.$route.query.errorCode
        if (errorCode && errorCode !== '0') {
            this.success = false
        } else {
            this.paySuccess(this.loanId)
        }
    },
    methods: {
        back() {
            this.$createDialog({
                type: 'confirm',
                title: '温馨提示',
                cancelBtn: {text: '坚决返回'},
                confirmBtn: {text: '重新支付'},
                content: '购买增信服务，可提升信用评分，增加放款成功率，可重新支付哦！',
                onConfirm: () => {
                },
                onCancel: () => {
                    this.canLeave = true
                    this.$router.replace({name: 'rrhIndex'})
                }
            }).show()
        },
        repay() {
            getPaymentParamsV3.call(this, this.gid).then((res) => {
                return openPaymentV3.call(this, res)
            }).then((res) => {
                let data = res.data

                // 重新支付后，只需改变当前页状态,  不需要再次跳转
                if (data.success === 'true') {
                    this.paySuccess(this.loanId)
                    // this.$router.replace({name: 'servicePayResult', params: {tradeId: this.tradeid}, query: {loanId: this.loanId, gid: this.gid}})
                }
            })
        },
        paySuccess(loanId) {
            this.success = true
            let timer = setInterval(() => {
                this.second--
                if (this.second == 0) {
                    clearInterval(timer)
                    this.$router.replace({path: 'pages/rrh/constract', query: {loanId: loanId, oidBiz: this.$route.query.oidBiz, source: 'done'}})
                }
            }, 1000)
        }
    },
    components: {
        hPage
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-content{
    background-color: #fff;
    top:px2rem(20);
}
.aui-content__page-error{
    p{
        text-align: center;
        .icon-fail,.icon-success{
            font-size: px2rem(126);
        }
    }
}
.aui-content__page-ft{
    font-size: 0;
}
.mui-btn{
    width: px2rem(240);
    border-radius: px2rem(50);
    margin: 0 px2rem(12)!important;
}
</style>


