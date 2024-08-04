<template>
<div class="package">
    <!-- 未开通去购买 -->
    <m-cell-group class="rightPackage no-access" v-if="rightsObj.rightStatus == 3 && preRightPackage !== 'y'">
        <p v-if="newRightPackage"><img :src="newRightPackage.img" alt=""/></p>
        <m-cell size="xlarge" @click="goPageRights">
            <div slot="title">
                <p class="p1">{{rightsObj.rightTitle}}</p>
                <p class="p2">{{rightsObj.rightSubTitle}}</p>
            </div>
            <div slot="value">
                    <p class="valStyle">开通<m-icon type="arrow2"></m-icon></p>
            </div>
        </m-cell>
    </m-cell-group>
    <!-- 支付中状态 -->
    <m-cell-group class="rightPackage" v-if="rightsObj.rightStatus == 2">
        <m-cell size="xlarge" subTitle="" value="">
            <div slot="title">
                <p class="p1 elet">您领取的{{rightsObj.rightPackageName}}正在支付中，可刷新页面查看结果…</p>
            </div>
        </m-cell>
    </m-cell-group>
    <!-- 已开通，是否选择使用权益包 -->
    <m-cell-group class="rightPackage" v-if="rightsObj.rightStatus == 1 || rightsObj.rightStatus == 4">
        <template v-if="rightsObj.totalDiscountAmtWithRight && rightsObj.totalDiscountAmtWithRight !=='0'">
            <m-cell size="large" subTitle="取现红包和服务费立减服务" value="">
                <div slot="title">
                    <p class="p1">使用{{rightsObj.rightPackageName}}服务费立减权益</p>
                </div>
                <div slot="value">
                    <m-icon v-show="!rightsObj.rightForceSelect" :type="value ? 'checkbox_checked' : 'checkbox_unchecked'" class="checkbox" @click="changeRight"></m-icon>
                </div>
            </m-cell>
        </template>
        <template v-else>
            <m-cell size="large" subTitle="取现红包和通过率优化服务" value="">
                <div slot="title">
                    <p v-if="!rightsObj.rightForceSelect" class="p1">使用{{rightsObj.rightPackageName}}取现通过率提升权益</p>
                    <p v-if="rightsObj.rightForceSelect" class="p1">使用{{rightsObj.rightPackageName}}提升取现通过率</p>
                </div>
                <div slot="value">
                    <m-icon v-show="!rightsObj.rightForceSelect" :type="value ? 'checkbox_checked' : 'checkbox_unchecked'" class="checkbox" @click="changeRight"></m-icon>
                </div>
            </m-cell>
        </template>
    </m-cell-group>
</div>
</template>
<script>
export default {
    props: {
        rightsObj: {
            type: Object
            // rightPackageName: "会员卡"
            // rightStatus: 0
            // rightSubTitle: "会员卡"
            // rightTitle: "会员卡"
        },
        value: {
            type: Boolean
        },
        oidBiz: {
            type: String
        },
        productName: {
            type: String
        },
        cmsConf:{
            type:Object
        },
        preRightPackage:{
            type:String
        }
    },
    data() {
        return {}
    },
    watch: {
        'rightsObj.rightStatus':{
            handler  (nv, ov) {
                if (nv == '1') {
                    this.$emit('input', true)
                } else {
                    this.$emit('input', false)
                }
            },
            immediate: true
        }
    },
    computed:{
        // 开通权益卡背景
        newRightPackage(){
            const {newRightPackage} = this.cmsConf
            return newRightPackage
        },
        newRightStyle(){
            let style = {}
            if(this.newRightPackage && this.newRightPackage.img){
                style = {'background-image':`url(${this.newRightPackage.img}) !important`,'background-repeat':'no-repeat'}
            }
            return style
        }
    },
    methods: {
        changeRight() {
            // 权益卡失效不允许
            if(this.rightsObj.rightStatus == '4'){
                if(!this.value){
                    this.$createDialog({
                        type:'confirm',
                        content:'您的悦享权益已失效，您可重新购买权益进行借款申请',
                        confirmBtn:{
                            text:'继续借款'
                        },
                        cancelBtn: {
                            text: '联系客服'
                        },
                        onConfirm: ()=>{
                            this.$emit('input', false)
                        },
                        onCancel:()=>{
                            this.$router.push('/pages/help/contact')
                        }
                    }).show()
                }else{
                    this.$emit('input', !this.value)
                }
            }else{
                this.$emit('input', !this.value)
            }
        },
        goPageRights() {
            this.log({type: 'button-logic', name: 'rights-open-action', desc: '开通'})
            this.$router.push({
                path: '/pages/rrh/rights',
                query: {
                    buyPackageId: this.rightsObj.buyPackageId,
                    totalDiscountAmtWithRight: this.rightsObj.totalDiscountAmtWithRight,
                    securityAmt: this.rightsObj.securityAmt,
                    securityAmtWithRight: this.rightsObj.securityAmtWithRight,
                    oidBiz: this.oidBiz,
                    productName: this.productName,
                    preNeedCard: 'n'
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.mui-cells {
    margin-top: px2rem(8) !important;
}
.mui-cell__bd {
    white-space: inherit !important;
}
.package {
    margin: px2rem(24) 0;
}
.mui-cell {
    background: #fff4e6 !important;
}
.rightPackage {
    border: px2rem(2) solid #FC9E2E;
    border-radius: px2rem(4);

    &.no-access{
        border: none;
        .mui-cell{
            position: absolute;
            left: 0;
            top: px2rem(25);
            width: 100%;
            background-color: transparent !important;
        }
    }
    .left {
        float: left;
        width: px2rem(480);

    }
    .p1 {
        padding-top: px2rem(0);
        font-size: px2rem(30);
        font-weight: 600;
        text-align: left;
        color: #81590f;
        line-height: px2rem(42);
    }
    .elet {
        word-wrap: break-word;
        word-break: normal;
        white-space: normal;
    }
    .p2 {
        padding: px2rem(8) 0;
        font-size: px2rem(24);
        font-weight: 400;
        text-align: left;
        color: #666;
        line-height: px2rem(33);
    }
    .valStyle {
        font-size: px2rem(28);
        font-weight: 400;
        text-align: right;
        color: #b4854d;
        line-height: px2rem(40);
        .mui-icon{
            margin-left: px2rem(25);
        }
    }
    .col_red {
        color: red;
    }
    .checkbox {
        width: px2rem(36);
        height: px2rem(36);
        color: #81590f;
    }
}
</style>
