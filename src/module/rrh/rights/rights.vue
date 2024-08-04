<template>
<div >
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="mui-content">
        <div v-if="list.length">
            <p v-if="rightCardArea"><img :src="rightCardArea.img" alt=""></p>
            <p v-if="cashRightBanner"><img :src="cashRightBanner.img" alt=""></p>
            <template v-if="$route.query.totalDiscountAmtWithRight && $route.query.totalDiscountAmtWithRight !== '0'">
                <div v-if="serverFeeArea" class="post">
                    <img :src="serverFeeArea.img" alt="">
                    <div class="service">
                        <p>取现服务费<span class="fsred">立减{{$route.query.totalDiscountAmtWithRight / 1000}}元</span></p>
                        <p class="fsmoney"><span>原服务费{{$route.query.securityAmt / 1000}}元</span><label class="point"></label><span>优惠后{{$route.query.securityAmtWithRight / 1000}}元</span></p>
                    </div>
                </div>
                <p v-if="passRateArea"><img :src="passRateArea.img" alt=""></p>
            </template>
            <template v-else>
                <p v-if="passRateAreaNoServerFee"><img :src="passRateAreaNoServerFee.img" alt=""></p>
            </template>
        </div>
        <p v-if="vlArea"><img :src="vlArea.img" alt="" /></p>
        <p v-if="lifeArea"><img :src="lifeArea.img" alt="" /></p>
        <p v-if="freeTicketArea"><img :src="freeTicketArea.img" alt="" /></p>
        <template v-if="couponList.length">
            <p v-if="redPacketBanner"><img :src="redPacketBanner.img" alt=""></p>
            <div class="couponList clearfix">
                <dl v-for="(item, i) in couponList" :key="i">
                    <dt>
                        <p><span class="disNum">{{item.couponType === 'amc_discount' ? item.discountRate : item.discountAmt}}</span><span>{{item.couponType === 'amc_discount' ? '折' : '元'}}</span></p>
                        <p>折扣券</p>
                    </dt>
                    <dd>
                        <div class="pb50">{{item.couponTitle}}</div>
                        <div class="col_999">{{item.startTime + '-' + item.endTime}}</div>
                    </dd>
                </dl>
            </div>
        </template>
        <com-popup :isPop="showDetention" class="detention-popup" @cancel="showDetention = false">
            <template slot="content">
                <div class="popup__body">
                    <span>{{detent.content}}</span>
                </div>
                <div class="popup__footer">
                    <m-button size="small" type="plain" @click="toCancel">{{detent.cancelText}}</m-button>
                    <m-button size="small" @click="dialogClose">{{detent.submitText}}</m-button>
                </div>
            </template>
        </com-popup>
      <!-- 支付方式选择 -->
      <ModelPayMethod
          v-model="isInstallment"
          :isShow.sync="isShowModalPayMethod"
          :instalmentObj="instalmentObj"
          :listProtocolDefault="listProtocol"
          :listProtocolStage="listProtocolStage"
          @confirm="handleBuy">
      </ModelPayMethod>
      <!--分期时 沙漏加载样式。。-->
      <LoadingHourglass ref="loadingHourglass"></LoadingHourglass>
    </div>
    <div class="bottom-action">
        <Agreement v-if="!instalmentSupport" class="agreement-color" v-model="isChoose" :listProtocol="listProtocol"></Agreement>

        <div class="btn-box" :class="{mt20: instalmentSupport}">
            <template v-if="instalmentSupport">
                <div class="angle-mark angle-mark-installment"></div>
                <div class="button__price">
                    <span class="fs24">首付</span><span class="fs28 fw600"> ¥ </span><span class="fs48 fw600">{{instalmentObj.firstPay|formatMoneyK(0)}}</span>
                </div>
            </template>
            <template v-else>
                <!-- currentPrice: 优惠价， price: 原价 -->
                <div v-if="currentPrice" class="angle-mark angle-mark-discount"></div>
                <div v-else class="angle-mark angle-mark-limit"></div>
                <div class="button__price">
                    <span class="fs28 fw600">¥</span><span class="fs48 fw600">{{payPrice|formatMoneyK(0)}}</span><span class="fs24">/立享价</span>
                    <span v-if="currentPrice" class="price-origin" >
                        原价￥{{price|formatMoneyK(0)}}
                    </span>
                </div>
            </template>
            <div class="button__submit" @click="handlePreBuy">
                立即开通
            </div>
<!--            <m-button type="full" class="btn-buy" @click="handlePreBuy">¥{{price / 100}}立即开通</m-button>-->
        </div>
    </div>
</div>
</template>
<script>
import { renderDataCms, rightsDetail, createOrder, getPayParameterByGid ,rightsPackageRisk} from 'src/store/modules/rrh'
import { AXD } from 'src/libs/util'
import comPopup from 'components/popup/index.vue'
import ModelPayMethod from './components/model-pay-method.vue'
import LoadingHourglass from 'src/components/loading-hourglass'
import Agreement from 'src/components/agreement'

import { formatMoneyK } from 'src/libs/util'

export default {
    filters:{
        formatMoneyK
    },
    components: {
        comPopup,
        ModelPayMethod,
        LoadingHourglass,
        Agreement
    },
    data() {
        return {
            listProtocol: [
                {label: '《服务协议》', value: 'bbk_fwxy'}, {label: '《服务规则》', value: 'bbk_fwgz'}
            ],
            listProtocolStage: [
                {label: '《服务协议》', value: 'stqy_fwxy'}, {label: '《服务规则》', value: 'bbk_fwgz'}
            ],
            list: [],
            show: true,
            isChoose: false,
            packageId: '',
            packageName: '',
            subTitle: '',
            skuId: '',
            price: '',
            currentPrice:'', // 优惠价格
            oidBiz: this.$route.query.oidBiz,
            couponList: [],
            barConfig: {
                leftAction: 'detention',
                h5: {
                    rightBtnShow: false,
                    title: ''
                },
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: 'detention'
                }
            },
            contractPath: window.location.hostname.indexOf('app') > -1 ? '/app/user/contract/viewTemplate/' : '/h5/user/contract/viewTemplate/',
            detent: {
                content: '开通权益卡可提升取现通过率至90%，确定放弃吗？',
                cancelText: '倔强放弃',
                submitText: '我要购买'
            },
            showDetention: false,
            isShowModalPayMethod:false,
            isInstallment:false, // 是否分期
            instalmentSupport: false, //是否支持分期,
            instalmentObj: {},
            serialNo:''// 风控流水号
        }
    },
    watch: {
        packageName(nv, ov) {
            if (nv) {
                this.barConfig.h5.title = '开通' + this.packageName
                document.title = '开通' + this.packageName
            }
        }
    },
    computed: {
        payPrice(){
            return this.currentPrice||this.price
        },
        rightCardArea() {
            let area = this.list.find(item => item.title === 'rightCardArea')
            return area
        },
        //  服务费cms
        cashRightBanner() {
            let banner = this.list.find(item => item.title === 'cashRightBanner')
            return banner
        },
        serverFeeArea() {
            let area = this.list.find(item => item.title === 'serverFeeArea')
            return area
        },
        passRateArea() {
            let area = this.list.find(item => item.title === 'passRateArea')
            return area
        },
        passRateAreaNoServerFee() {
            let area = this.list.find(item => item.title === 'passRateAreaNoServerFee')
            return area
        },
        vlArea() {
            let area = this.list.find(item => item.title === 'vlArea')
            return area
        },
        lifeArea() {
            let area = this.list.find(item => item.title === 'lifeArea')
            return area
        },
        freeTicketArea() {
            let area = this.list.find(item => item.title === 'freeTicketArea')
            return area
        },
        redPacketBanner() {
            let banner = this.list.find(item => item.title === 'redPacketBanner')
            return banner
        }
    },
    created() {
        let $this = this
        this.getList()
        window.detention = () => {
            $this.showDetention = true
            return false
        }
    },
    methods: {
        getList() {
            rightsDetail({packageId: this.$route.query.buyPackageId}).then((res) => {
                if (res.success) {
                    const  {couponList, skuId, packageId, packageName, subTitle, price,currentPrice,instalmentSupport, firstPay, instalmentPay,planDetail} = res.result
                    this.couponList = couponList
                    this.skuId = skuId
                    this.packageId = packageId
                    this.packageName = packageName
                    this.subTitle = subTitle
                    this.price = price
                    this.currentPrice = currentPrice
                    this.instalmentSupport = !!instalmentSupport
                    this.isInstallment = this.instalmentSupport
                    if(this.instalmentSupport){
                        this.instalmentObj = {
                            price,
                            currentPrice,
                            instalmentSupport,
                            firstPay,
                            instalmentPay,
                            planDetail
                        }
                    }

                    this.renderData(skuId)
                    if(packageName) {
                        this.barConfig.h5.title = '开通' + packageName
                        document.title = '开通' + packageName
                    }
                } else {
                    this.$_toast(res.resultDes)
                    if (res.code === '-1999' || res.code ==='-1997') {
                        AXD.util.login()
                    }
                }
            })
        },
        renderData(skuId) {
            renderDataCms({alias: skuId}).then((res) => {
                if (res.success) {
                    this.list = res.result.blocks
                }
            })
        },
        async handlePreBuy(){

            // 是否打开分期开关
            if(this.instalmentSupport){
                const baiduMac = await AXD.util.getLocationInfo('权益包预风控获取定位')
                rightsPackageRisk({
                    baiduMac,
                    rightsPackageId: this.packageId
                }).then(res => {
                    if(res.success){
                        this.serialNo = res.result
                        this.isShowModalPayMethod = true
                        return
                    }
                    this.$_toast(res.resultDes)
                    if (res.code === '-1999' || res.code ==='-1997') {
                        AXD.util.login()
                    }
                })
              return
            }
            this.handleBuy()
        },
        logNameBuybutton(){
            if(this.isInstallment){
                // 分期支付
                return 'rights-buy-installment'
            }
            if(this.currentPrice){
                // 折扣支付
                return 'rights-buy-discount'
            }
            // 全额支付
            return  'rights-buy-full'
        },
        handleBuy(){
            const logName = this.logNameBuybutton()
            this.log({type: 'button-logic', name: logName, desc: '立即开通'})

            if (!this.isChoose && !this.instalmentSupport) {
                this.$_toast('请阅读并同意服务协议/服务规则')
                return false
            }

            if(this.isInstallment){
                this.$refs.loadingHourglass.show('请不要离开，系统正在评估您的申请，大约需要几秒钟')
            }

            if(this.isShowModalPayMethod){
                this.isShowModalPayMethod = false
            }

            const quitUrl = `${location.origin}/pages/trade/pay-error?backUrl=${encodeURIComponent(location.href)}`

            const { preNeedCard, oidBiz, productName} = this.$route.query
            let returnUrl = `${location.origin}/pages/rrh/index`

            if (preNeedCard === 'n') {
                 returnUrl =`${location.origin}/pages/rrh/loan?oidBiz=${oidBiz}&name=${productName}`
            }

            createOrder({
                rightsPackageId: this.packageId,
                serialNo: this.serialNo,
                instalment: +this.isInstallment
            },{
                showLoading: !this.isInstallment
            }).then(res => {
                if (res.success) {
                    getPayParameterByGid({
                        gid: res.result.tradeGroupId,
                        quitUrl,
                        returnUrl
                    }).then((data) => {
                        if (data.success) {
                            window.location.href = aixuedai.webCashUrl + '/h5cashier/index?payInfo=' + encodeURIComponent(data.result.parameters)
                            return
                        }
                        if(this.isInstallment){
                            this.$refs.loadingHourglass.hide()
                        }

                        this.$_toast(data.resultDes)
                    })
                    return
                }

                if(this.isInstallment){
                    this.$refs.loadingHourglass.hide()
                }

                if (res.code === '-1999' || res.code ==='-1997') {
                    AXD.util.login()
                    return
                }

                // 风控拒绝
                if(res.code === '8224'){
                    this.$_alert({
                        content: res.resultDes,
                        confirmBtn:'我知道了',
                        onConfirm: () => {
                            this.$router.push({
                                path:'/pages/rrh/index'
                            })
                        }
                    })
                    return
                }

                this.$_toast(res.resultDes)

            })
        },
        onContact(code) {
            this.resetHref(this.contractPath + code)
        },
        // 挽留弹款
        goBack() {
            const {
                query
            } = this.$route
            this.$router.push({
                name: 'rrhLoan',
                query: {
                    oidBiz: query.oidBiz,
                    name: query.name,
                    hasGoldenCard: query.hasGoldenCard,
                    preRightPackage:'y'
                }
            })
        },
        toCancel() {
            this.goBack()
        },
        dialogClose() {
            this.showDetention = false
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../../style';
@import '../styles/common';
@import '../../../assets/styles/flex';
.mui-page {
    //background-color: #f4f4f4 !important;
}

.agreement-color{
    ::v-deep {
        .icon-checkbox, .icon-checkbox.active{
            color: #222;
        }
        .color-link{
            color: #FCA534;
        }
    }
}
.btn-box {
    //padding: px2rem(0) px2rem(32);
    display: flex;
    align-items: center;
    width: px2rem(686);
    height: px2rem(96);
    margin: 0 auto px2rem(20);
    position: relative;
    background: center / 100% no-repeat url('~src/assets/images/rights-button-bg.png');

    .angle-mark{
        position: absolute;
        left: 0;
        top: 0;
    }
    .angle-mark-limit{
        width: px2rem(110);
        height: px2rem(64);
        background: center / 100% no-repeat url('~src/assets/images/rights-icon-limit.png');

    }
    .angle-mark-discount{
        width: px2rem(128);
        height: px2rem(74);
        background: center / 100% no-repeat  url('~src/assets/images/rights-icon-discount.png');

    }
    .angle-mark-installment {
        width: px2rem(110);
        height: px2rem(64);
        background: center / 100% no-repeat url('~src/assets/images/rights-icon-installment.png');
    }
    .button__price{
        flex: 1;
        color: #FFC24F;
        text-align: center;
        .price-origin{
            font-size: px2rem(24);
            color: #999;
            text-decoration:  line-through;
            margin-left: px2rem(8);
        }
    }
    .button__submit{
        width: px2rem(256);
        font-size: px2rem(36);
        font-weight: 600;
        text-align: center;
        color: #222222;
    }
}
//.bottom-action {
    //background-color: #F4F4F4 !important;
//}
.mui-content {
    padding-bottom: px2rem(200);
    //background: #F4F4F4;
    .couponList {
        padding: 0 px2rem(32) px2rem(100) px2rem(32);
        font-size: px2rem(26);
        dt {
            width: px2rem(200);
            height: px2rem(179);
            float: left;
            background: linear-gradient(90deg,#f9b061 1%, #f98851);
            border-radius: px2rem(12) 0 0 px2rem(12);
            text-align: center;
            color: #FFFFFF;
            padding-top: px2rem(56);
            margin-bottom: px2rem(26);
            .disNum {
                font-size: px2rem(54);
                line-height: px2rem(26);
                font-weight: 700;
            }
        }
        dd {
            width: px2rem(486);
            height: px2rem(179);
            margin-bottom: px2rem(26);
            float: left;
            color: #222222;
            padding: px2rem(35) px2rem(32);
            background: #fff;
            border-radius: 0 px2rem(12) px2rem(12) 0;
            .pb50 {
                margin-bottom: px2rem(40);
                font-size: px2rem(28);
                line-height: px2rem(34);
            }
            .col_999 {
                color: #999999;
                font-size: px2rem(24);
                line-height: px2rem(34);
            }
        }
    }
    .post {
        position: relative;
        .service {
            position: absolute;
            left: px2rem(215);
            top: px2rem(65);
            font-size: px2rem(30);
            font-weight: 500;
            text-align: left;
            color: #222222;
            line-height: px2rem(26);
        }
        .service>p:nth-child(1){
            font-size: px2rem(33);
            line-height: px2rem(33);
            font-weight: 700;
        }
        .fsred {
            color: #E80C0C;
        }
        .fsmoney {
            font-size: px2rem(24);
            font-weight: 600;
            text-align: left;
            line-height: px2rem(24);

            span {
                display: inline-block;
                padding: px2rem(5);
            }
            span:nth-child(1) {
                border: px2rem(1) solid #cccccc;
                border-radius: px2rem(5);
                background-color: #cccccc;
                color: #929292
            }
            span:nth-child(3){
                background-color: #fedeba;
                border: px2rem(1) solid #fedeba;
                border-radius: px2rem(5);
                color: #fd9a66;
            }
        }

        .point {
            width: px2rem(42);
            height: px2rem(14);
            margin: px2rem(27) px2rem(8) 0 px2rem(8);
            background: url(../styles/imgs/rights-point.png);
            background-size: px2rem(42) auto;
            display: inline-block;
        }
    }
    ::v-deep .detention-popup {
        .aui-mask {
            z-index: 2000;
        }

        .aui-popup_content {
            width: 70%;
            padding: px2rem(40) 0;
            top: 50%;
            bottom: auto;
            margin: -40% auto 0;
            border-radius: 2px;
            z-index: 2001;
        }

        .popup__body {
            padding: 0 px2rem(40) px2rem(40);
            font-size: px2rem(32);
            line-height: px2rem(40);
        }

        .popup__footer {
            text-align: center;

            .mui-btn {
                width: 40%;
                margin: 0 px2rem(10);
            }

            .mui-btn_plain {
                background: rgba(0, 0, 0, 0.1);
            }
        }
    }
}

.mt20{
    margin-top: px2rem(20);
}
.fs24 {
    font-size: px2rem(24);
}

.fs28 {
    font-size: px2rem(28);
}

.fs48 {
    font-size: px2rem(48);
}

fw600{
    font-weight: 600;
}
</style>

<!--<style lang="scss">-->
<!--.mui-icon-hourglass {-->
<!--    display: inline-block;-->
<!--    width: 2em;-->
<!--    height: 4em;-->
<!--    margin-right: px2rem(16);-->
<!--    background:center / 100% no-repeat  url('../../../assets/images/icon-hourglass.svg');-->
<!--}-->
<!--</style>-->
