<template>
<div>
    <div class="insurance" flex>
        <div style="flex: 1;">
            <div class="insurance-title">
                <span>借款人意外险</span><span class="insurance-instruction" @click="goInsuranceLink"></span></div>
            <div class="insurance-assist">买一份保险，多一份安心</div>
        </div>
        <div class="insurance-check" @click="chooseInsuracne">
            <input type="radio" name="radio1" class="aui-check" >
            <span v-show="isChecked" class="icon-check1">
                <span class="path1"></span><span class="path2"></span>
            </span>
            <span v-show="!isChecked" class="icon-uncheck1">
                <span class="path1"></span><span class="path2"></span>
            </span>
        </div>
    </div>
    <div v-if="isChecked">
        <div class="insurance-items">
           <div class="item">
                <span class="label">投保人</span>
                <span class="value">{{insuranceInfo.username}}</span>
            </div>
            <div class="item">
                <span class="label">身份证号</span>
                <span class="value">{{insuranceInfo.idCard}}</span>
            </div>
            <div class="item">
                <span class="label">保障期</span>
                <span class="value">{{insuranceInfo.insureMonth}}</span>
            </div>
            <div class="item">
                <span class="label">续保至</span>
                <span class="value">{{insuranceInfo.endDate}}</span>
            </div>
            <div class="item">
                <span class="label">缴费方式</span>
                <span class="value">{{insuranceInfo.payMode}}</span>
            </div>
        </div>
        <div class="aui-cells aui-sells_format mt-0">
            <a class="aui-cell aui-cell_access" href="javascript:;" @click="selectJob">
                <div class="aui-cell__bd">
                    <p>职业信息</p>
                </div>
                <div class="aui-cell__ft">{{jobName}}</div>
            </a>
        </div>
        <div class="insurance-fee">
            <div class="main">保费: <span class="fee">{{insuranceInfo.payment}}</span></div>
    <!--         <div class="assist">保费=(保额/1000)*0.84*分期数</div> -->
        </div>
        <div class="insurance-agree">
            <span class="check" :class="{dischecked: !isAgreed}" @click="chooseAgree">&nbsp;</span>阅读并同意此保险的<span class="link" @click="goContract('statement')">告知与声明</span> <span class="link" @click="goContract('notice')">投保须知</span> <span class="link" @click="goRuleLink">保险条款</span>
        </div>
    </div>
</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: tradeState, mapMutations, mapGetters } = createNamespacedHelpers('trade/confirm')
const { mapState } = createNamespacedHelpers('jobInfo')
export default {
    name: 'insurance',
    data() {
        return {
            isShowDetail: false,
            isChecked: false,
            isAgreed: false
        }
    },
    computed: {
        ...mapState({
            jobInfo: state => state.jobInfo
        }),
        ...tradeState({
            insuranceInfo: state => state.accidentInsurance.insuranceInfo
        }),
        jobName() {
            return this.jobInfo.id ? this.jobInfo.name : '请选择'
        }
    },
    watch: {
        jobInfo(newVal, oldVal) {
            this.saveInsuranceToOrderSku({
                type: 'accidentInsurance',
                'skuItemVos': [{
                    skuId: this.insuranceInfo.skuId,
                    num: 1,
                    tradeSkuItemExtVo: {
                        jobId: newVal.id
                    }
                }]
            })
        }
    },
    methods: {
        /**
         * 选择保险
         * @return {[type]} [description]
         */
        chooseInsuracne() {
            this.isChecked = !this.isChecked
            if (this.isChecked) {
                this.saveAccidentInsuranceInfo({
                    isChosed: true
                })
                if (this.jobInfo.id) {
                    this.saveInsuranceToOrderSku({
                        type: 'accidentInsurance',
                        'skuItemVos': [{
                            skuId: this.insuranceInfo.skuId,
                            num: 1,
                            tradeSkuItemExtVo: {
                                jobId: this.jobInfo.id
                            }
                        }]
                    })
                }
            } else {
                this.saveAccidentInsuranceInfo({
                    isChosed: false
                })
                this.delInsuranceFromOrderSku(this.insuranceInfo.skuId)
            }
        },
        /**
         * 是否同意保险须知等
         * @return {[type]} [description]
         */
        chooseAgree() {
            this.isAgreed = !this.isAgreed
            if (this.isAgreed) {
                this.saveAccidentInsuranceInfo({
                    isAgreed: true
                })
            } else {
                this.saveAccidentInsuranceInfo({
                    isAgreed: false
                })
            }
        },
        /**
         * 告知与声明、投保须知
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        goContract(name) {
            this.$router.push({
                path: this.$route.path + '/board',
                query: {
                    type: name
                }
            })
        },
        /**
         * 保险条款
         * @return {[type]} [description]
         */
        goRuleLink() {
            this.$router.push({
                path: this.$route.path + '/rule'
            })
        },
        goInsuranceLink() {
            this.$router.push({
                path: this.$route.path + '/insurance'
            })
        },
        /**
         * 选择职业信息
         * @return {[type]} [description]
         */
        selectJob() {
            this.$router.push({
                name: 'jobInfo',
                params: {
                    level: 1,
                    pid: 0
                }
            })
        },
        ...mapMutations(['saveAccidentInsuranceInfo', 'saveInsuranceToOrderSku', 'delInsuranceFromOrderSku']),
        ...mapGetters(['getInsuranceInfo'])
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';
.insurance {
    height: px2rem(140);
    background-color: #ffffff;
    &-title{
        margin-top: px2rem(32);
        height: px2rem(42);
        font-size: px2rem(30);
        line-height: px2rem(42);
        color: #222222;
        padding-left: px2rem(32);
    }
    &-instruction{
        width: px2rem(23);
        height: px2rem(23);
        display: inline-block;
        margin-left: px2rem(8);
        @include img2x('../assets/imgs/info');
        background-size: 100%;
    }
    &-assist{
        margin-top: px2rem(8);
        height: px2rem(24);
        line-height: px2rem(24);
        color: #999999;
        font-size: px2rem(24);
        padding-left: px2rem(32);
    }
    .insurance-check{
        height: px2rem(46);
        line-height: 0;
        margin-right: px2rem(32);
        margin-top: px2rem(48);
    }
}
.insurance-items{
    padding: px2rem(12) px2rem(32);
    background-color: #ffffff;
    position: relative;
    &::before{
        content: '';
        height: 1px;
        width: px2rem(718);
        position: absolute;
        background-color: #e4e4e4;
        top: px2rem(0);
        right: 0;
    }
    &::after{
        content: '';
        height: 1px;
        width: px2rem(718);
        position: absolute;
        background-color: #e4e4e4;
        bottom: px2rem(0);
    }
    .item{
        position: relative;
        height: px2rem(68);
        line-height: px2rem(68);
        font-size: px2rem(28);
        background-color: #ffffff;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        .label{
            text-align:left;
            color: #999999;
            flex: 2;
        }
        .value{
            text-align:right;
            color: #222222;
            flex: 3;
        }
    }
}
.insurance-fee{
    position: relative;
    background-color: #ffffff;
    padding: px2rem(32) px2rem(32) px2rem(40);
    text-align: right;
    .main{
        font-size: px2rem(36);
        line-height: px2rem(40);
    }
    .assist{
        margin-top: px2rem(12);
        color: #999999;
        font-size: px2rem(26);
        line-height: px2rem(26);
    }
    .fee{
        color: #e31436;
        &::before{
            content: '￥';
        }
    }
    &::before{
        content: '';
        height: 1px;
        width: px2rem(718);
        position: absolute;
        background-color: #e4e4e4;
        top: px2rem(0);
        right: 0;
    }
}
.insurance-agree{
    background-color: #ffffff;
    padding-left: px2rem(32);
    padding-bottom: px2rem(20);
    font-size: px2rem(24);
    line-height: px2rem(32);
    color: #999999;
    .check{
        width: px2rem(24);
        height: px2rem(24);
        display: inline-block;
        @include img2x('../assets/imgs/checked');
        background-size: 100%;
        margin-right: px2rem(5);
        line-height: px2rem(24);
    }
    .dischecked{
        @include img2x('../assets/imgs/dischecked');
        background-size: 100%;
    }
    .link{
        color: #F18800;
        margin-right: px2rem(10);
    }
}
.mt-0{
    margin-top: 0;
}

</style>
