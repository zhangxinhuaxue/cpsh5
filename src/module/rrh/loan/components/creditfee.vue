<template>
   <m-cell-group class="fee-block" style="overflow: visible;">
        <m-cell v-if="rate.handlerServiceFee !== '0.00' " class="right-align fee" :value="'￥' + rate.handlerServiceFee">
            <div slot="title" class="title-top">
                <span>{{rate.feeName}}</span>
                <span class="fee-tip" @click.stop="showFeeInfo"></span>
            </div>
        </m-cell>
        <m-cell v-if="rate.securityFlag" is-link is-select class="fee" @click="toggleShow" :style="{'height': '3.1rem'}">
            <template v-if="rate.preRiskFlag">
                <!-- 预风控产品 -->
                <div slot="title">
                    <div class="title-top">
                        <span>{{securityInfo.securityDesc}}</span>
                        <span class="fee-tip" @click.stop="showCreditInfo"></span>
                    </div>
                    <p class="mui-cell__bd_subtitle">{{includeFlag ? '含信用评分、会员权益' : ''}}</p>
                </div>
                <div slot="icon">
                    <span class="discount" v-show="securityInfo.discountRate">{{securityInfo.discountRate}}折</span>
                </div>
                <div slot="value">
                    <div>
                        <p class="mui-cell__ft_value"> <span :class="{'cell__value--delete':isChooseRights&&securityInfo.totalDiscountAmtWithRight>0}">每期￥{{securityInfo.periodRepayAmt|formatMoneyK}}</span>，分{{securityInfo.securityPeriod}}期</p>
                        <p v-if="isChooseRights&&securityInfo.totalDiscountAmtWithRight>0" class="mui-cell__ft_subvalue color-red">每期￥{{securityInfo.periodRepayAmtWithRight|formatMoneyK}}，共优惠￥{{securityInfo.totalDiscountAmtWithRight|formatMoneyK}}</p>
                    </div>
                </div>
            </template>
            <template v-else>
                <!-- 非预风控产品 -->
                <div slot="title">
                    <div class="title-top">
                        <span v-if="securityInfo.selectSecurityFlag && (securityInfo.selectSecurityFlag !== '0')" class="icon__check" :class="{icon__checked: isChecked}" @click.stop="checkToggle"></span>
                        <span>{{securityInfo.securityDesc}}</span>
                        <span class="fee-tip" @click.stop="showCreditInfo"></span>
                    </div>
                    <div class="title-btm">
                        <p class="title-tip">开通{{securityInfo.securityDesc.replace('费', '')}}，取现通过率提升90%</p>
                    </div>
                </div>
                <div slot="icon">
                    <span class="discount" v-show="securityInfo.discountRate">{{securityInfo.discountRate}}折</span>
                </div>
                <div slot="value">
                    <div>
                        <p class="mui-cell__ft_value"> <span :class="{'cell__value--delete':isChooseRights&&securityInfo.totalDiscountAmtWithRight>0}">每期￥{{securityInfo.periodRepayAmt|formatMoneyK}}</span>，分{{securityInfo.securityPeriod}}期</p>
                        <div class="title-btm"></div>
                    </div>
                </div>
            </template>
        </m-cell>
        <m-cell v-show="this.initCoupon && securityInfo.couponNum > 0" :value="securityInfo.couponNum + '张可用'" @click="showCouponDetail(securityInfo.couponNum)" title="优惠券" is-link is-select></m-cell>
        <m-cell v-show="!this.initCoupon" :value="'-¥' + ((securityInfo.couponDiscountAmt || 0) / 1000).toFixed(2)" @click="showCouponDetail(securityInfo.couponNum)" title="优惠券" is-link is-select></m-cell>
        <!-- 优惠券 -->
        <popup :isPop="isShowCouponDetail" @cancel="closeCouponDetail">
            <template slot="content">
                <div class="aui-popup_content">
                <div class="popup-select__hd">
                    <a class="close" href="javascript:;" @click="closeCouponDetail">
                        <span class="icon-close1"></span>
                    </a>
                    <h3>选择优惠券</h3>
                </div>
                <div class="aui-popup__bd">
                    <slot name="tip"></slot>
                    <div class="couponList">
                        <!-- 可用优惠券列表 -->
                        <div class="coupon" v-for="(couponItem, i) in securityInfo.availableCoupons" :key="i + Date.now()">
                            <label class="vipIcon" v-if="couponItem.source === 'aplus_coupon'">会员可用</label>
                            <ul class="clearfix">
                                <li class="li1 newItem">
                                    <p class="pb10">
                                        <span class="fs1">{{couponItem.couponType === 'amc_discount' ? couponItem.discountRate : couponItem.discountAmt}}</span><span class="fs3">{{couponItem.couponType === 'amc_discount' ? '折' : '元'}}</span>
                                        <span class="fs4">{{couponItem.couponType === 'amc_discount' ? '折扣券' : '现金券'}}</span>
                                        <span class="ask" @click="goDetail(couponItem)"><m-icon type="ask"></m-icon></span>
                                    </p>
                                    <p class="useTime">{{couponItem.startTime}} - {{couponItem.endTime}}&nbsp;有效</p>
                                    <p class="line"></p>
                                    <p class="fontSty" v-if="couponItem.couponType === 'amc_discount'">本券最高可减{{couponItem.maxDiscountAmt}}元</p>
                                    <p class="useRule fontSty">{{couponItem.couponDesc}}</p>
                                    <p class="overTime fontSty">{{couponItem.useScope}}</p>
                                </li>
                                <li class="li3">
                                    <m-icon @click="getCouponCode(couponItem.couponCode)" :type="couponCode == couponItem.couponCode ? 'checkbox_checked' : 'checkbox_unchecked'"></m-icon>
                                </li>
                            </ul>
                        </div>
                        <!-- 不可用优惠券列表 -->
                        <div class="coupon unUse" v-for="(couponItem2, i2) in securityInfo.unavailableCoupons" :key="i2 + 'a'">
                            <label class="vipIcon" v-if="couponItem2.source === 'aplus_coupon'">会员可用</label>
                            <ul class="clearfix">
                                <li class="li1 newItem">
                                    <p class="pb10">
                                        <span class="fs1">{{couponItem2.couponType === 'amc_discount' ? couponItem2.discountRate : couponItem2.discountAmt}}</span><span class="fs3">{{couponItem2.couponType === 'amc_discount' ? '折' : '元'}}</span>
                                        <span class="fs4">{{couponItem2.couponType === 'amc_discount' ? '折扣券' : '现金券'}}</span>
                                        <span class="ask" @click="goDetail(couponItem2)"><m-icon type="ask"></m-icon></span>
                                    </p>
                                    <p class="useTime">{{couponItem2.startTime}} - {{couponItem2.endTime}}&nbsp;有效</p>
                                    <p class="line"></p>
                                    <p class="fontSty" v-if="couponItem2.couponType === 'amc_discount'">本券最高可减{{couponItem2.maxDiscountAmt}}元</p>
                                    <p class="useRule fontSty">{{couponItem2.couponDesc}}</p>
                                    <p class="overTime fontSty">{{couponItem2.useScope}}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            </template>
        </popup>
        <!-- 月供详情 -->
        <popup :isPop="isShowCreditFee" @cancel="isShowCreditFee=false">
            <template slot="content">
                <repayment-list :config="repayDetail" @repaymentClose="isShowCreditFee=false">
                    <div class="tip" slot="tip">{{tipInfo}}</div>
                </repayment-list>
            </template>
        </popup>
   </m-cell-group>
</template>

<script>
import repaymentList from './repayment-list.vue'
import popup from 'components/popup/index.vue'
import { formatMoneyK, formatDateTime } from 'src/libs/util'
export default {
    props: ['oidBiz', 'rrhzx', 'initCoupon', 'rate', 'openAccountConfigInfo', 'includeFlag','isChooseRights','securityType'],
    components: {
        popup,
        repaymentList
    },
    filters:{
        formatMoneyK,
        formatDateTime
    },
    data() {
        return {
            // 信息显示
            isShowCreditFee: false,
            // 合同模板路径
            relativePath: '',
            securityInfo: {},
            // 是否显示月供详情
            isShowCouponDetail: false,
            couponCode: '',
            // tipInfo: '',
            // repayDetail: {
            //     title: '',
            //     dataList: []
            // },
            securityPlansObj:{},
            securityPlansWithRightObj:{},
            isChecked: false
        }
    },
    computed:{
        repayDetail(){
            if(this.isChooseRights){
                return this.securityPlansWithRightObj
            }
            return this.securityPlansObj
        },
        tipInfo(){
            const rmb = this.isChooseRights ?this.securityInfo.securityAmtWithRight : this.securityInfo.securityAmt
            return `该费用分${this.securityInfo.securityPeriod}期收取，总计应收${formatMoneyK(rmb)}元`
        }
    },
    watch: {
        'rate.securityInfo': {
            handler(n) {
                this.securityInfo = {
                    securityDesc: n.securityDesc,
                    discountRate: n.discountRate,
                    securityPlans: n.securityPlans || [],
                    securityPeriod: n.securityPeriod,
                    securityAmt: n.securityAmt,
                    securityAmtWithRight: n.securityAmtWithRight,
                    // monthPay: (n.securityAmt && n.securityPeriod) ? (n.securityAmt / 1000 / n.securityPeriod).toFixed(2) : '0.00',
                    periodRepayAmt: n.periodRepayAmt,
                    periodRepayAmtWithRight:n.periodRepayAmtWithRight,
                    totalDiscountAmtWithRight: n.totalDiscountAmtWithRight,
                    couponNum: n.couponNum || 0, // 可用优惠券数
                    couponDiscountAmt: n.couponDiscountAmt, // 优惠券已优惠金额
                    availableCoupons: n.availableCoupons || [], // 可用优惠券集合
                    unavailableCoupons: n.unavailableCoupons || [], // 不可用优惠券集合
                }
                if (n.selectSecurityFlag) {
                    this.securityInfo.selectSecurityFlag = n.selectSecurityFlag
                    this.isChecked = (this.securityInfo.selectSecurityFlag === '1')
                }
                // const securityAmt = (n.securityAmt / 1000).toFixed(2)
                // this.tipInfo = `该费用分${n.securityPeriod}期收取，总计应收${securityAmt}元`

                const getArr = (arr=[])=> arr.map(item=>({
                    repayDate: item.repayDate,
                    actualPay: formatMoneyK(parseFloat(item.repayAmt)),
                    detail: `服务费：${formatMoneyK(item.repayAmt)}`
                }))
                this.securityPlansObj = {
                    title:  n.securityDesc,
                    dataList: getArr(n.securityPlans||[])
                }
                // 权益包选中后
                this.securityPlansWithRightObj = {
                    title:  n.securityDesc,
                    dataList: getArr(n.securityPlansWithRight||[])
                }

            }
        },
        initCoupon(v, ov) {
            if (v === true) {
                this.couponCode = ''
            }
        }
    },
    methods: {
        checkToggle() {
            this.isChecked = !this.isChecked
        },
        // 每期应还金额格式化
        repayFormat(amt) {
            return (amt / 1000).toFixed(2) + '元'
        },
        // 每期应还弹窗
        showRepayAmt() {
            this.$refs.repayAmtDialog.show()
        },
        // toggle显示列表信息
        toggleShow() {
            this.isShowCreditFee = !this.isShowCreditFee
        },

        showFeeInfo() {
            this.$createDialog({
                type: 'alert',
                title: '手续费',
                content: (this.openAccountConfigInfo && this.openAccountConfigInfo[this.oidBiz] && this.openAccountConfigInfo[this.oidBiz]['premium']) || '手续费为用户首期还款时一次性收取费用',
                confirmBtn: {
                    text: '知道了'
                }
            }).show()
        },
        // 弹窗说明
        showCreditInfo() {
            const content  =  this.rrhzx[`${this.securityType}Tip`] || ''
            this.$createDialog({
                title: this.securityInfo.securityDesc,
                content,
                confirmBtn: {
                    text: '知道了'
                }
            }).show()
        },
        /**
         * 显示优惠券
         * @return {[type]} [description]
         */
        showCouponDetail(num) {
            this.log({type: 'button', name: 'cash-button-coupon', desc: '优惠券'})
            let unarr = this.securityInfo.unavailableCoupons || []
            if (num || (unarr && unarr.length)) {
                this.isShowCouponDetail = true
            }
        },
        closeCouponDetail() {
            this.isShowCouponDetail = false
        },
        getCouponCode (code) {
            this.couponCode = this.couponCode === code ? '' : code
            this.$emit('getCode', this.couponCode)
            this.isShowCouponDetail = false
        },
        goDetail (couponItemObj) {
            this.$router.push({
                name: 'couponRule',
                query: {
                    couponItemObj
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped>
@import 'src/style.scss';
.color-red{
    color: #FF3E00;
}
.aui-popup__bd{
  margin-bottom:0!important;
  min-height:0!important;
  background-color: #f7f7f7;
  padding-top: px2rem(16);
}
.popup-select__hd {
    display: flex;
    height: px2rem(96);
    line-height: px2rem(96);
    padding: 0 px2rem(32);
    position: relative;
    text-align: center;
    background-color: #fff;
    .close {
        display: inline-block;
        width: px2rem(96);
        line-height: px2rem(96);
        position: absolute;
        left: 0;
        top: 0;
        span {
            font-size: px2rem(32);
        }
    }
    & h3 {
        width: 100%;
        line-height: px2rem(96);
        text-align: center;
        font-weight: normal;
        font-size: px2rem(32);
        color: #666;
    }
    &:after {
        @include hairline(bottom);
    }
}


.coupon{
    position: relative;
    width: px2rem(686);
    // height: px2rem(200);
    // overflow: hidden;
    background: #fff;
    margin: px2rem(32);
    border-radius: px2rem(8);
    .vipIcon {
        width: px2rem(112);
        height: px2rem(32);
        line-height: px2rem(32);
        display: inline-block;
        text-align: center;
        background: linear-gradient(90deg,#edd9c0 6%, #e6bd97 100%);
        border-radius: px2rem(4);
        font-size: px2rem(22);
        font-weight: 400;
        color: #333333;
        position: absolute;
        left: 0;
        top: 0;
    }
    .ask {
        // position: absolute;
        // left: px2rem(300);
        // top: px2rem(20);
        display: inline-block;
        width: px2rem(50);
        vertical-align: px2rem(30);
        .mui-icon{font-size: px2rem(32);}
    }
    .mui-icon{font-size: px2rem(44);color:#4286FF;}
    li {
        float: left;
        font-size: px2rem(28);
        color: #333;
        line-height: px2rem(40);
    }
    .li1 {
        width: px2rem(260);
        text-align: center;
        padding-top: px2rem(25);
        .pb10 {
            padding-bottom: px2rem(10);
        }
        .fs1 {
            font-size: px2rem(68);
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FF3E00;
        }
        .fs2 {
            font-size: px2rem(40);
            color: #FF3E00;
            font-weight: 400;
        }
        .fs3 {
            font-size: px2rem(32);
            color: #FF3E00;
        }
        .fs4 {
            font-size: px2rem(32);
            font-weight: 400;
            padding-left: px2rem(8);
        }
        .useTime {
            height: px2rem(33);
            font-size: px2rem(24);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: px2rem(33);
        }
    }
    .li2 {
        width: px2rem(330);
        padding-top: px2rem(38);
        .useRule {
            padding-bottom: px2rem(15);
        }
        .overTime {
            color: #666;
            font-size: px2rem(24);
        }
    }
    .li3 {
        width: px2rem(96);
        padding: px2rem(75) 0 px2rem(40) px2rem(20);
    }
    .newItem {
        width: px2rem(580);
        text-align: left;
        padding-left: px2rem(55);
        padding-bottom: px2rem(30);
        .line {
            border-top: px2rem(1) dashed #E6E6E6;
            // border-top: px2rem(1) dashed red;
            height: px2rem(1);
            margin: px2rem(16) 0;
        }
        .fontSty {
            font-size: px2rem(24);
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: px2rem(33);
        }
    }
}
.unUse {
    .fs1, .fs2, .fs3, .useRule, .overTime, p, li{
        color: #999 !important;
    }
    .ask, .mui-icon {
        display: inline-block;
        width: px2rem(50);
        vertical-align: px2rem(15);
        .mui-icon{font-size: px2rem(32);}
        opacity: 0.6;
    }
}

// 增信费-折扣浮层
.discount {
    display: inline-block;
    position: absolute;
    right: px2rem(50);
    top: -5px;
    width: px2rem(78);
    height: px2rem(36);
    @include img2x('../../styles/imgs/floatTip');
    background-size: 100%;
    font-size: px2rem(19);
    text-align: center;
    color: #fff;
}
.tip {
    line-height: px2rem(30);
    font-size: px2rem(24);
    color: #A1A1A1;
    padding: px2rem(20) 0 px2rem(20) px2rem(32);
    background-color: #F8F8F8;
    label span {
        font-size: px2rem(26);
    }
    .link {
        color: #307EC1;
        margin: 0 px2rem(12);
    }
}
// 增信费详情
.creditFee {
    padding: 0 px2rem(32);
    background: #fff;
    div {
        .creditFee-btn {
            color: #307EC1;
        }
        display: flex;
        justify-content: space-between;
        font-size: px2rem(28);
        padding: px2rem(16) 0;
    }
}
.fee-tip{
    display: inline-block;
    width: px2rem(30);
    height: px2rem(30);
    @include img2x('../../styles/imgs/explain');
    background-repeat: no-repeat;
    background-size: 100%;
    margin-left: px2rem(15);
}

.repayAmt-list {
    font-family: 'Helvetica Neue';
    height: px2rem(500);
    overflow-y: auto;
    text-align: left;
    .mui-cell {
        border: none;
    }
}
.fee-block {
    ::v-deep {
        .mui-cell:first-child:before {
            content: none;
        }
        .mui-cell__bd_title_mini {
            font-size: inherit;
        }
    }
}
.cell__value--delete{
    text-decoration: line-through;
}
.icon__check {
    display: inline-block;
    width: px2rem(35);
    height: px2rem(35);
    @include img2x('../../styles/imgs/check1');
    background-repeat: no-repeat;
    background-size: contain;
    margin-right: px2rem(15);
}
.icon__checked {
    @include img2x('../../styles/imgs/checked1');
}
.title-top {
    display: flex;
    align-items: center;
}
.title-btm {
    height: px2rem(45);
}
.title-tip {
    position: absolute;
    left: px2rem(30);
    top: px2rem(75);
    width: px2rem(343);
    height: px2rem(40);
    padding: px2rem(5) 0 0 px2rem(5);
    color: #FF5547;
    font-size: px2rem(20);
    @include img2x('../../styles/imgs/tip1');
    background-size: contain;
}
</style>
