<template>
<div class="mui-page view">
    <hybrid-header :config="barConfig" slot="header"></hybrid-header>
    <div class="mui-content">
        <div class="mask" v-if="entryRefund" @click="onMask"></div>
        <div class="entry" :class="isApp ? 'appTop' : ''" v-if="entryRefund" @click.stop="handRefund">申请退款</div>
        <m-dialog ref="refundDialog"
            title=""
            type="confirm"
            @confirm="refundDialogConfirm"
            confirmBtn="确认"
            @cancel="refundDialogCancel">
            <div>
                <p v-if="refundStatus==='refundDefault'">您的订单支付金额为{{payMoney}}元，本次可申请退款的金额为{{refundMoney}}元，是否确认申请退款？</p>

                <p v-if="refundStatus==='refundHelp'">查询到您的该笔订单有分期账单还款记录，请联系客服退款</p>

                <p  v-if="refundStatus==='refundFirstPay'">
                    未查询到您的分期还款账单，本次可申请退款的金额为首付金额{{refundMoney}}元，是否确认申请退款
                </p>
                <p v-show="refundStatus!=='refundHelp'"><a @click="openImFn" class="kefu">有疑问？</a></p>
            </div>
        </m-dialog>
        <!--分期时 沙漏加载样式。。-->
        <LoadingHourglass ref="loadingHourglass"></LoadingHourglass>

        <div class="pkg-main">
            <div class="pkg-content">
                <p v-if="rightPackageArea"><img :src="rightPackageArea.img" alt="" /></p>
                <div class="pkg-desc">
                    <div class="pkg-name"><span class="title">{{rightPackage.packageName}}</span><span class="subtitle">{{rightPackage.outCodeText}}</span></div>
                    <div class="pkg-date">{{pkgStatusText}}</div>
                </div>
                <div v-if="hasInstalment && rightPackage.status!==4 " class="pkg-status" >
                    <template  v-if="rightPackage.instalmentPaid">
                        <div class="pkg-status-text color-gray">
                            分期支付
                        </div>
                    </template>
                    <template v-else>
                        <div class="pkg-status-text">
                            分期待还款
                        </div>
                        <div class="pkg-btn" @click="handleGoBill">
                            去还款<m-icon class="arrow-right" type="back1"></m-icon>
                        </div>
                    </template>
                </div>
            </div>
            <template v-if="rightsList.length">
                <p v-if="cashVipBanner"><img :src="cashVipBanner.img" alt="" /></p>
                <m-cell-group>
                    <template v-for="(right,index) in rightsList">
                        <m-cell :key="index" size="xlarge">
                            <img slot="icon" :src="right.img" alt=""/>
                            <div slot="title">
                                <p class="title">{{right.title}}</p>
                                <p class="subtitle">{{right.subTitle}}</p>
                            </div>
                            <div slot="value">
                                <span :class="rightStatusBoxClass(right)" @click="handleGoRrh(right.status)">{{right.statusText}}</span>
                            </div>
                        </m-cell>
                    </template>
                </m-cell-group>
            </template>
            <template v-if="otherVipArea">
                <p v-if="otherVipArea" class="other-vip"><a @click="goRights(otherVipArea.url)"><img :src="otherVipArea.img" alt="" /></a></p>
            </template>
            <template v-if="couponList.length">
                <p v-if="redTicketBanner"><img :src="redTicketBanner.img" alt="" /></p>
                <template v-if="couponList.length">
                    <div class="coupon-list">
                        <template v-for="(coupon,index) in couponList">
                            <div class="coupon-item" :key="index">
                                <div class="coupon-icon">
                                    <template v-if="coupon.couponType === 'amc_discount'">
                                        <p class="icon-count"><span class="count-num">{{coupon.discountRate}}</span><span class="count-suffix">折</span></p>
                                        <p class="icon-type">折扣券</p>
                                    </template>
                                    <template v-else>
                                        <p class="icon-count"><span class="count-num">{{coupon.discountAmt}}</span><span class="count-suffix">元</span></p>
                                        <p class="icon-type">优惠券</p>
                                    </template>

                                </div>
                                <div class="coupon-content">
                                    <p class="ticket-name">{{coupon.couponTitle}}</p>
                                    <p class="ticket-time">{{tranformDate(coupon.startTime) + '-' + tranformDate(coupon.endTime) }}</p>
                                </div>
                                <div class="coupon-btn">
                                    <span class="box-btn status-use" @click="browserDiscount('view')">去查看</span>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
            </template>
        </div>
        <div class="pkg-copyright">
            <span>相关服务请参考</span>
            <template v-if="hasInstalment">
                <span class="contract-url" @click="browserContract('stqy_fwxy')">《服务协议》</span><span class="contract-url" @click="browserContract('bbk_fwgz')">《服务规则》</span>
            </template>
            <template v-else>
                <span class="contract-url" @click="browserContract('bbk_fwxy')">《服务协议》</span><span class="contract-url" @click="browserContract('bbk_fwgz')">《服务规则》</span>
            </template>
        </div>
    </div>
</div>
</template>

<script>

import { getRightPackageDetail, renderDataCms, refundMoney, refundDetail } from 'store/modules/rrh'
import { AXD } from 'src/libs/util'
import { newSobotIm } from 'src/libs/im'
import LoadingHourglass from 'src/components/loading-hourglass'

export default {
    name: 'rightDetail',
    components: {
        LoadingHourglass
    },
    data() {
        return {
            status: '',
            payMoney: 0,
            refundMoney: 0,
            rightPackageId:'',
            rightPackage: {},
            assets: {
                blocks: [],
                template: {}
            },
            entryRefund: false,
            barConfig: {
                action: 'onRefund',
                leftAction: '',
                h5: {
                    rightBtnShow: false,
                    title: this.$route.query.name
                },
                app: {
                    rightBtnShow: false,
                    title: this.$route.query.name
                }
            },
            contractPathPrefix: window.location.hostname.indexOf('app') > -1 ? '/app/user/contract/viewTemplate/' : '/h5/user/contract/viewTemplate/',
            hasInstalment: false, // 是否分期
            supportUserRefund: false // 是否支持用户退款
        }
    },
    watch: {
        status(nv, ov) {
            this.handRight(nv)
        }
    },
    created() {
        this.init()
    },
    mounted () {
        window.onRefund = () => {
            this.entryRefund = true
        }
    },
    computed: {
        refundStatus(){
            // refundDefault 普通退款
            // refundFirstPay 首付退款
            // refundHelp  客服退款
            if(!this.hasInstalment){
                return 'refundDefault'
            }
            if(this.supportUserRefund){
                return  'refundFirstPay'
            }
            return  'refundHelp'

         },
        couponList() {
            const {
                couponList
            } = this.rightPackage
            return couponList || []
        },
        rightsList() {
            const {
                rightsList
            } = this.rightPackage
            return rightsList || []
        },
        rightPackageArea() {
            const {
                blocks
            } = this.assets
            let area = blocks.find(item => item.title === 'rightPackageArea')
            return area
        },
        cashVipBanner() {
            const {
                blocks
            } = this.assets
            let banner = blocks.find(item => item.title === 'cashVipBanner')
            return banner
        },
        cashVipArea() {
            const {
                blocks
            } = this.assets
            let area = blocks.find(item => item.title === 'cashVipArea')
            return area
        },
        otherVipArea() {
            const {
                blocks
            } = this.assets
            let area = blocks.find(item => item.title === 'otherVipArea')
            if (area && area.objListArray && area.objListArray.length) {
                area = area.objListArray[0]
            }
            return area
        },
        redTicketBanner() {
            const {
                blocks
            } = this.assets
            let banner = blocks.find(item => item.title === 'redTicketBanner')
            return banner
        },
        // 权益包状态展示
        pkgStatusText() {
            const {
                endTime,
                status,
                statusText
            } = this.rightPackage
            let str = ''
            switch (parseInt(status)) {
                case 0:
                case 1:
                case 2:
                    str = '有效期至' + this.tranformDate(endTime)
                    break
                case 3:
                case 4:
                case 5:
                    str = statusText
                    break
                default:
                    break
            }
            return str
        }
    },
    methods: {
        onMask() {
            this.entryRefund = false
        },
        init() {
            const {
                query
            } = this.$route
            this.rightPackageId = (query && query.id) || ''
            this.queryRightPackageDetail()
        },
        // 查询权益包详情
        queryRightPackageDetail() {
            getRightPackageDetail({
                id: this.rightPackageId
            }).then(res => {
                if (res.success) {
                    const {status, skuId, hasInstalment, supportUserRefund } = this.rightPackage = res.result||{}
                    // console.log(this.rightPackage,999)
                    this.status = res.result.status
                    // this.rightPackage = res.result || {}

                    this.hasInstalment = hasInstalment===1
                    this.supportUserRefund = supportUserRefund===1

                    this.getCmsSource(skuId)
                    this.handRight(status)

                }else if(res.code === '-1999' || res.code === '-1997'){
                    AXD.util.login()
                }
            })
        },
        handRight(status) {
            if ( status == 1) {
                this.barConfig = {
                    action: 'onRefund',
                    h5: {
                        title: this.$route.query.name,
                        rightBtnShow: true,
                        isIcon: true,
                        icon: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/19110808726.png'
                    },
                    app: {
                        leftbuttonVisible: true,
                        rightBtn: 'custom', // 右侧按钮close share custom
                        rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                            showType: 'IMAGE', // TEXT:文字 IMAGE:图片
                            imageUrl: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/19110808726.png', // 图⽚地址
                            action: 'onRefund' // 点击右侧按钮执⾏的js函数名,记得定义window全局变量
                        },
                        rightBtnShow: true
                    }
                }
            } else {
                this.barConfig = {
                    action: 'onRefund',
                    leftAction: '',
                    h5: {
                        rightBtnShow: false,
                        title: this.$route.query.name
                    },
                    app: {
                        rightBtnShow: false,
                        title: this.$route.query.name
                    }
                }
            }
        },
        refundDialogConfirm() {
            this.$refs.refundDialog.hide()
            this.entryRefund = false

            if(this.refundStatus==='refundHelp'){
                this.openImFn()
                return
            }
            refundDetail({
                id: this.rightPackageId
            }).then(res => {
                if (res && res.success) {
                    this.$_toast(res.resultDes || '您已成功提交退款申请，请等待系统审核')
                    this.queryRightPackageDetail()
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        refundDialogCancel() {
            this.$refs.refundDialog.hide()
            this.entryRefund = false
        },
        openImFn() {
            AXD.util.isLogin().then(() => {
                // 获取智齿客服机器人URL
                newSobotIm(res => {
                    window.location.href = res
                })
            })
        },
        handleGoRrh(status){
            if(status===1){
                this.$router.push({
                    path: '/pages/rrh/index'
                })
            }
        },
        handleGoBill(){
            this.$router.push({
                path: '/pages/rrh/bill'
            })
        },
        async handRefund() {

            // hasInstalment
            if(this.hasInstalment){
              const  isConfirm =  await  this.$_confirm('您的订单为分期支付，系统需要查询您的分期订单，是否确认退款？').then(res => {
                  this.$refs.loadingHourglass.show('系统正在核算您的退款金额，请耐心等待')
                  return true
                }, res => {
                    return false
                })
                if(!isConfirm){
                    return
                }
            }
            refundMoney({
                id: this.rightPackageId
            },{
                showLoading: !this.hasInstalment
            }).then(res => {
                if (res.success) {
                    this.payMoney = (res.result.payMoney/1000).toFixed(2)
                    this.refundMoney = (res.result.refundMoney/1000).toFixed(2)
                    this.$refs.refundDialog.show()
                } else {
                    this.$_toast(res.resultDes)
                }
            }).finally(()=>{
                if(this.hasInstalment){
                    this.$refs.loadingHourglass.hide()
                }
            })
        },
        // 获取图片静态资源
        getCmsSource(skuId = '') {
            renderDataCms({
                alias: skuId
            }).then(res => {
                if (res && res.success) {
                    this.assets = res.result || {}
                }
            })
        },
        //  权益卡不同状态展示样式
        rightStatusBoxClass(right = {}) {
            let cs = ['box-btn']
            switch (parseInt(right.status)) {
                case 0:
                case 1:
                case 2:
                    cs.push('status-use')
                    break
                case 3:
                case 4:
                case 5:
                    cs.push('status-dead')
                    break
                default:
                    cs.push('status-use')
                    break
            }
            return cs
        },
        // 有效期转化
        tranformDate(str = '') {
            if (!str) return
            str = str.split(' ')[0]
            return str.replace(/-/g, '.').trim()
        },
        // 查看优惠券列表
        browserDiscount(type = '') {
            switch (type) {
                case 'view':
                    // this.$router.push({path:'/pages/rrh/couponList'})
                    this.resetHref('/pages/rrh/couponList')
                    break
                default:
                    break
            }
        },
        // 查看协议
        browserContract(code = '') {
            // let href = ''
            // switch (code) {
            //     case 'bbk_fwxy':
            //     case 'bbk_fwgz':
            //         href = this.contractPathPrefix + code
            //         break
            // }
            const  href = this.contractPathPrefix + code

            if (href !== '') {
                this.resetHref(href)
            }
        },
        goRights(url) {
            this.resetHref(url)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../style';
@import '../styles/common';
@import '../../../assets/styles/flex';

.mui-content {
    background-color: #f8f8f8;
    padding-bottom: px2rem(50);
    .mask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0);
        z-index: 10;
    }
    .kefu {
        color: #4286FF;
        font-size: px2rem(24);
        padding-top: px2rem(24);
        font-weight: 400;
        text-decoration: underline;
        display: inline-block;
    }
    .entry {
        font-size: px2rem(28);
        font-weight: 400;
        text-align: left;
        color: #333333;
        position: fixed;
        right: px2rem(12);
        top: 1.87733rem;
        z-index: 11;
        background: url('https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/202011/19110810608.png') no-repeat 0 0;
        background-size: px2rem(294) auto;
        width: px2rem(294);
        height: px2rem(138);
        padding: px2rem(51) 0 0 px2rem(36);
    }
    .appTop{
        top: 0 !important;
    }

    .box-btn {
        display: inline-block;
        padding: px2rem(8) px2rem(20);
        min-width: px2rem(124);
        text-align: center;
        border-radius: px2rem(4);
        font-size: px2rem(28);

        &.status-use {
            color: #905200;
            border: px2rem(2) solid #905200;
        }

        &.status-dead {
            color: #CCCCCC;
            border: px2rem(2) solid #CCCCCC;
        }
    }

    .pkg-content {
        position: relative;
        line-height: 1.4;
        .pkg-desc {
            position: absolute;
            top: px2rem(82);
            left: px2rem(124);
            color: #222222;

            .pkg-date {
                margin-top: px2rem(16);
                font-size: px2rem(24);
                line-height: px2rem(33);
            }

            .pkg-name {
                font-size: 0;
                .title {
                    font-size: px2rem(36);
                    font-weight: bold;
                }
                .subtitle{
                    font-size: px2rem(28);
                }

            }
        }
        .pkg-status{
            position: absolute;
            top: px2rem(92);
            right: px2rem(64);
            text-align: right;
            .pkg-status-text{
                font-size: px2rem(28);
                color: #333;
                &.color-gray{
                    color: #666;
                }
            }
            .pkg-btn{
                display: inline-block;
                font-size: px2rem(24);
                color: #222;
                border: px2rem(2) solid #222222;
                border-radius: px2rem(4);
                padding: px2rem(6) px2rem(16) px2rem(6) px2rem(20);
                margin-top: px2rem(10);
                .arrow-right{
                    font-size: px2rem(16);
                    transform: rotate(180deg);
                    vertical-align: middle;
                }
            }
        }
    }


    .mui-cells{
        border-radius: px2rem(12);
        margin: 0 px2rem(32);
        padding: px2rem(12) 0;
        background-color: #ffff;
    }
    .coupon-list {
        border-radius: px2rem(12);
        margin: 0 px2rem(32);
        padding: px2rem(8) 0;
        background-color: #ffff;
    }

    .mui-cells .mui-cell {
        &::before {
            display: none;
        }
    }
.mui-cell_xlarge{
    padding-right: px2rem(32);
    ::v-deep .mui-cell__hd_icon{
        height: px2rem(100);
        width: px2rem(100);
    }
    ::v-deep .mui-cell__bd{
        padding:0 px2rem(40) 0 px2rem(4);


        .title{
            color: #333333;
            text-align: left;
            line-height: px2rem(40);
            font-size: px2rem(28);
            white-space:pre-wrap;
        }
        .subtitle{
            text-align: left;
            font-size: px2rem(24);
            line-height: px2rem(33);
            color: #666666;
            white-space: pre-wrap
        }
    }

}
    .coupon-item {
        display: flex;
        height: px2rem(152);
        margin: px2rem(24) 0;
    }

    .coupon-icon {
        width: px2rem(168);
        background: linear-gradient(90deg,#f9b061 1%, #f98851);;
        text-align: center;

        .icon-count {
            margin-top: px2rem(26);
            line-height: px2rem(26);
            font-weight: 700;
            color: #FFFFFF;

            .count-num {
                display: inline-block;
                font-weight: bold;;
                font-size: px2rem(58);
                line-height: px2rem(67);
            }

            .count-suffix {
                display: inline-block;
                font-size: px2rem(24);
                line-height: px2rem(33);
            }
        }

        .icon-type {
            font-size: px2rem(24);
            line-height: px2rem(33);
            color: #FFFFFF;
        }
    }

    .coupon-content {
        flex: 1;
        padding: px2rem(34) 0 0 px2rem(24);

        .ticket-name {
            font-size: px2rem(28);
            line-height: px2rem(40);
        }

        .ticket-time {
            margin-top: px2rem(18);
            font-size: px2rem(24);
            line-height: px2rem(33);
            color: #999999
;
        }
    }

    .coupon-btn {
        padding: px2rem(48) px2rem(32);
    }

    .pkg-copyright {
        margin: px2rem(40) px2rem(32) 0 px2rem(32);
        font-size: px2rem(24);
        line-height: px2rem(32);
        color:#999999;
        text-align: left;

        .contract-url {
            color: #905200;
        }
    }
}
</style>
