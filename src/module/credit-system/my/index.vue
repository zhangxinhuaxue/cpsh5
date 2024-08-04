<!--
 * @Author: sunxj
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 * @Date: 2019-03-14 18:51:08
 * @LastEditTime: 2019-08-28 13:50:26
 -->
<template>
    <m-page>
        <section class="amount__hd">
            <p class="amount__text">可用额度(元)</p>
            <p class="amount__num">{{accountInfo.enableCreditAmount | formatMoney(1000, false) | largeNum}}</p>
            <p class="amount__text">总额度{{accountInfo.totalAmount | formatMoney(1000, true) | largeNum}}元</p>
            <div class="amount__tips">{{accountInfo.changeTip}}</div>
        </section>
        <section class="amount__bd">
            <h3 class="sub-title">快速提额</h3>
            <group-shadow>
                <auth-cells :data="advData" @click.native="goAmount">
                    <m-button slot="value" size="small">
                        去提额
                    </m-button>
                </auth-cells>
            </group-shadow>
            <template v-if="strategyList">
            <h3 class="sub-title">信用知识</h3>
            <group-shadow>
                <problem-cells :data="strategyList" />
            </group-shadow>
            </template>
        </section>
    </m-page>
</template>
<script>
import groupShadow from '../components/group-shadow.vue'
import authCells from '../components/auth-cells.vue'
import problemCells from '../components/problem-cells.vue'
import { setEnvCookie } from '../common/index'
import { getAmountChange } from 'src/store/modules/credit-system'
import { renderData } from 'src/store/modules/loan'
import { AXD, formatNum } from 'src/libs/util'
export default {
    name: 'credit-myamount',
    data() {
        return {
            query: this.$route.query,
            accountInfo: {
                changeTip: '',
                enableCreditAmount: '0',
                totalAmount: '0'
            },
            advData: [{
                button: '去提额',
                dese: '最高可获得50000额度',
                name: '全民提额',
                nameTitle: '10秒提额',
                status: '1',
                important: true,
                type: '0'
            }],
            strategyList: null
        }
    },
    components: {
        groupShadow,
        authCells,
        problemCells
    },
    filters: {
        formatMoney(num, unit, isIntegral) {
            return formatNum(num, unit, isIntegral)
        },
        largeNum(value = 0) {
            let str = value.toString()
            if (str === '0') {
                return '0.00'
            }
            let list = str.split('.')
            let largeNum = list[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
            if (list[1]) {
                largeNum = `${largeNum}.${list[1]}`
            }
            return largeNum
        }
    },
    mounted() {
        // 用户组那边要测试在不同测试环境，都使用阿里云1的网关
        setEnvCookie(this.query.env)
        this.init()
        window.axdBackFunc = () => {
            this.init()
        }
    },
    methods: {
        init() {
            this.getMyAmount()
            // 信用知识配置
            this.getCreditProblem()
        },
        getCreditProblem() {
            let params = {
                alias: 'config_creditproblem'
            }
            renderData(params).then(({ success, result = {} }) => {
                if (success) {
                    let { blocks = [] } = result
                    if (blocks.length && blocks[0].title === 'datalist') {
                        let resJson = JSON.parse(blocks[0].objList)
                        this.strategyList = resJson
                    }
                }
            })
        },
        getMyAmount() {
            getAmountChange().then(({ success, result, code = '', resultDes }) => {
                if (success) {
                    Object.assign(this.accountInfo, result)
                } else {
                    if (code === '10002') {
                        AXD.util.login()
                        return
                    }
                    this.$_toast(resultDes, () => {
                        this.close()
                    })
                }
            })
        },
        goAmount() {
            let backUrl = encodeURIComponent(window.location.href)
            let creditUrl = `${window.aixuedai.h5WebUrl}/pages/credit-system/amount?creditBackUrl=${backUrl}`
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: creditUrl
                    },
                    callback() {}
                })
            } else {
                // window.location.href = creditUrl
                this.resetHref(creditUrl)
            }
        },
        close() {
            axdApp.send({
                module: 'webview',
                method: 'close'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

::v-deep.mui-page {
    background-color: #fff;
}

.amount__hd {
    background-color: #fff;
    padding: px2rem(32);
}

.amount__text {
    font-size: $auiFontSizeLevel5;
    color: #717172;
    margin-top: px2rem(20);
}

.amount__num {
    color: #131314;
    font-size: px2rem(80);
    font-family: DINAlternate-Bold;
    line-height: px2rem(100);
}

.amount__tips {
    font-size: $auiFontSizeLevel7;
    color: #F18800;
    padding-top: px2rem(24);
    position: relative;

    &:before {
        content: "";
        display: inline-block;
        width: px2rem(293);
        height: px2rem(11);
        background: url('../assets/images/line.png') no-repeat 0 0;
        background-size: cover;
        position: absolute;
        top: 0;
        left: 0;
    }
}

.amount__bd {
    border-top: px2rem(20) solid #f7f7f7;
    background-color: #fff;
    padding: px2rem(20);
}

.sub-title {
    font-size: $auiFontSizeLevel4;
    color: #131314;
    font-weight: 500;
    margin: px2rem(36) 0 px2rem(20);
}
</style>
