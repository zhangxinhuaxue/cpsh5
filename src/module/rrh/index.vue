<template>
    <div class="mui-page view" v-if="pageInited">
      <hybrid-header :config="barConfig" slot="header"></hybrid-header>
      <div class="mui-content">
        <div v-if="list.length">
          <div v-for="(item, index) in list" class="product" @click="toApply(item)" :key="index">
            <div class="title" flex>
              <img v-if="item.logo" class="icon" :src="item.logo" alt />
              <span>{{item.productName}}</span>
              <span v-if="item.desc1" class="label">{{item.desc1}}</span>
            </div>
            <div class="content" flex>
              <div class="content-item">
                <div class="text-1">借款范围(元)</div>
                <div class="amt">{{item.loanLimitDesc | moneyScopeFormat }}</div>
                <div class="text-1">{{item.lenderTimeDesc}}</div>
              </div>
              <div>
                <div class="text-1">{{item.rateCategory | rateDescFormat}}</div>
                <div class="period">{{item.rateRangeDesc | rateFormat}}</div>
                <div class="text-1">期限范围:{{item.periodDesc}}期</div>
              </div>
            </div>
            <div v-if="item.desc2" class="special">{{item.desc2}}</div>
            <div v-if="item.existCoupon" class="coupon animate__animated animate__swing"></div>
            <div class="apply">去申请</div>
          </div>
          <cms-banner ref="cmsBanner" :bottom="55" :banners="cmsBanner" event-id="productlist-button-banner"></cms-banner>
        </div>
        <!-- v-else-if="isShowSyh" -->
        <SyhResult v-else-if="isShowSyh"  :isShowSyh.sync="isShowSyh" :errorCode.sync="syhErrorCode" positionCode="products" title="您暂不符合借款条件"  subTitle="已为您匹配成功如下借款产品，同时申请3个以上通过率99%" />
        <div v-else-if="syhErrorCode !== '1004'" class="default-wrapper">
            <img :src="cmsDefaultImg" alt="暂未能匹配到合适产品" class="default-img" />
            <div v-if="cmsDefaultContent.hasOwnProperty('button') && cmsDefaultContent.button.hasOwnProperty('content')">
                <template v-if="cmsDefaultContent.button.content">
                    <div class="default-text">
                        <span
                        :style="{color: cmsDefaultContent.text1 && cmsDefaultContent.text1.color}"
                        >{{cmsDefaultContent.text1.content}}</span>
                        <span
                        :style="{color: cmsDefaultContent.text2 && cmsDefaultContent.text2.color}"
                        >{{cmsDefaultContent.text2.content}}</span>
                    </div>
                    <div
                        class="default-btn"
                        @click="goCmsUrl('deafult', cmsDefaultContent.button.url)"
                        :style="{ color: cmsDefaultContent.button.content_color, backgroundColor: cmsDefaultContent.button.button_color }"
                    >{{cmsDefaultContent.button.content}}</div>
                </template>
            </div>
        </div>

      </div>
      <div v-show="!isShowSyh"  class="op bottom-action" slot="bottom">
        <div v-if="isApp" class="op-item repayment" @click="toRepayment">还款</div>
        <div class="op-item loan-record" @click="toLoanRecords">订单</div>
      </div>
    </div>
    <skeleton v-else></skeleton>
</template>
<script>
import { AXD, isApp, isZjl, isAym } from 'src/libs/util'
import { resetHeader } from 'components/header/resetHeader'
import { goHome, rateFormat, moneyScopeFormat, rateDescFormat, closeWebView } from './common/utils'

import 'swiper/dist/css/swiper.css' 
import cmsBanner from 'components/banner/index.vue'

import { getProducts, isNeedTel } from 'store/modules/rrh'
import { getAmountChange } from 'src/store/modules/credit-system'
import SyhResult from '@/module/syh/common/result.vue'
import reloginMixins from 'src/module/rrh/mixins.js'

import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('rrh')

window.closeWindow = () => {
    closeWebView()
}
window.goBack = () => {
    // 重置原生head
    resetHeader()
    closeWebView()
}
export default {
    name: 'rrhIndex',
    mixins: [reloginMixins],
    data() {
        return {
            isShowSyh: false,
            syhErrorCode: '', // 1001,1003 引导去授信   1002:放款不足
            pageInited: false,
            tabUrl: {},
            list: [],
            // 默认已登录
            isLogin: true,
            // 默认已实名认证
            isAuth: true,
            barConfig: {
                app: {
                    rightBtnShow: false,
                    leftbuttonAction: 'closeWindow'
                }
            },
            cmsDefaultImg: 'https://img.aiyoumi.com/null/2019620/174542380/20190620174542_426x279.png?height=279&width=426',
            cmsBanner: [],
            defaultContent: {},
            creditContent: {}, 
            cmsDefaultContent: {
                text1: {},
                text2: {},
                button: {}
            },
            syh1002_content: {
                text1: {},
                text2: {},
                button: {}
            },
            syh1004_content: {
                text1: {},
                text2: {},
                button: {}
            },
            syh1005_content: {
                text1: {},
                text2: {},
                button: {}
            },
            syh1006_content: {
                text1: {},
                text2: {},
                button: {}
            },
        }
    },
    components: {
        cmsBanner, 
        SyhResult
    },
    filters: {
        rateFormat,
        moneyScopeFormat,
        rateDescFormat
    },
    watch:{
        syhErrorCode(to,from){
            if(to === '1002'){
                this.cmsDefaultContent = this.syh1002_content || {text1: {}, text2: {}, button: {}}
                return 
            }
            if(to === '1001' || to === '1003' ){
                this.cmsDefaultContent = this.creditContent || {text1: {}, text2: {}, button: {}}
                return
            }
            //1004, "引导用户跳转导出产品对应的产品详情页", 此状态下需要关闭cms背景图，否则跳转的时候会出现假过度页
            if(to === '1004'){
                this.goExportProduct()
                return
            }
            // "1005", "招财卡会员用户"
            if(to === '1005'){
                this.cmsDefaultContent = this.syh1005_content || {text1: {}, text2: {}, button: {}}
                return
            }
            // "1006", "非招财卡会员用户"
            if(to === '1006'){
                this.cmsDefaultContent = this.syh1006_content || {text1: {}, text2: {}, button: {}}
                return
            }
        }
    },
    mounted() {
        if (this.isApp) {
            // 导航栏右按钮显示关闭
            axdApp.send({
                module: 'webview',
                method: 'configNavigationBar',
                repeat: true,
                params: {
                    visible: true,
                    color: '#ffffff',
                    leftbuttonVisible: true,
                    rightbuttonVisible: true,
                    rightbutton: 'close'
                },
                callback: () => {}
            })
        }
    },
    created() {
        this.init()
        this.getSourceData()
        this.isNeedTeled()
    },
    methods: {
        ...mapActions(['getRenderData']),
        /**
         * 初始化.
         * @return {[type]} [description]1231123423
         */
        init() {
            getProducts().then((res) => {
                this.pageInited = true

                if (res.success) {
                    this.list = res.result || []

                    this.$nextTick(() => {
                        this.list.length > 0 && this.$refs && this.$refs.cmsBanner && this.$refs.cmsBanner.calcuSwiper()
                    })
                    if(this.list.length === 0) {
                        // getAmountChange().then(({ success, result}) => {
                        //     if (success && result.totalAmount === '0') {
                        //         this.cmsDefaultContent = this.creditContent || {text1: {}, text2: {}, button: {}}
                        //     } else {
                        //         this.isShowSyh = true
                        //         this.cmsDefaultContent = this.defaultContent || {text1: {}, text2: {}, button: {}}
                        //     }
                        // })

                        this.isShowSyh = true
                        this.cmsDefaultContent = this.defaultContent || {text1: {}, text2: {}, button: {}}
                    }
                } else {
                    if (res.code === '-1999') {
                        this.log({type: 'logic', name: 'loan_needlogin_-1999', desc: '取现产品页用户未登录，跳转登录'})
                        this.isLogin = false
                        this.goLogin()
                        return false
                    } else if (res.code === '2851000') {
                        this.log({type: 'logic', name: 'loan_showAuth_2851000', desc: '取现产品页用户未实名，显示认证弹窗'})
                        this.isAuth = false
                        let dialog = this.$createDialog({
                            type: 'confirm',
                            title: '',
                            content: '请先通过实名验证',
                            onConfirm: () => {
                                dialog.hide()
                                this.goAuth()
                            },
                            onCancel: () => {
                                dialog.hide()
                                this.goBack()
                            }
                        }).show()
                        return false
                    }
                    this.isShowSyh = true
                    this.$_toast(res.resultDes)
                }
            })
            // 清除之前缓存的金额期数
            window.sessionStorage.removeItem('balance')
            window.sessionStorage.removeItem('activePeriodVal')
        },
        getSourceData() {
            this.getRenderData().then((data) => {
                if (data.success && data.result && data.result.blocks) {
                    data.result.blocks.forEach((data) => {
                        if(isZjl) {
                            if (data.title === 'banner_index_zjl') {
                                this.cmsBanner = data.objListArray
                            }
                        } else if (isAym) {
                            if (data.title === 'banner_index_aym') {
                                this.cmsBanner = data.objListArray
                            }
                        } else {
                            if (data.title === 'banner_index') {
                                this.cmsBanner = data.objListArray
                            }
                        }
                        if (data.title === 'default_img') {
                            this.cmsDefaultImg = JSON.parse(JSON.parse(data.objList))[0].bgImg
                            return
                        }
                        if (data.title === 'default_content') {
                            this.defaultContent = JSON.parse(data.objList)
                            return
                        }
                        if (data.title === 'credit_content') {
                            this.creditContent = JSON.parse(data.objList)
                            return
                        }
                        if (data.title === 'syh1002_content') {
                            this.syh1002_content = Object.assign(this.syh1002_content,JSON.parse(data.objList)) 
                            return
                        }
                        if(data.title === 'syh1005_content'){
                            //  直接赋值会修改对象指针，导致watch拿不到变动的数据
                            this.syh1005_content = Object.assign(this.syh1005_content,JSON.parse(data.objList))
                            return
                        }
                        if(data.title === 'syh1006_content'){
                            this.syh1006_content = Object.assign(this.syh1006_content,JSON.parse(data.objList))
                            return 
                        }
                    })
                }
            })
        },
        goCmsUrl(type, url) {
            if(type==='banner') {
                this.log({type: 'button-logic-link', name: 'productlist-button-banner', url})
            } else {
                this.log({type: 'button-logic-link', name: 'productlist-page-null', url})
            }
            if(isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url,
                        closeToRoot: false
                    },
                    callback: function (ret) {}
                })
            } else {
                location.href = url
            }
        },
        /**
         * 查看借款记录
         * @return {[type]} [description]
         */
        toLoanRecords() {
            if (!this.isAuth) {
                this.goAuth()
            } else {
                this.log({type: 'button-logic-link', name: 'productlist-button-order', desc: '订单'})
                this.$router.push({
                    name: 'rrhLoanRecords'
                })
            }
        },
        /**
         * 还款
         * @return {[type]} [description]
         */
        toRepayment() {
            if (!this.isAuth) {
                this.goAuth()
            } else {
                this.log({type: 'button-logic-link', name: 'productlist-button-reimbursement', desc: '还款'})
                this.$router.push({
                    name: 'rrhBill'
                })
            }
        },
        toApply(product) {
            this.log({type: 'button-link', name: 'productlist-button-applynow', desc: '去申请', extendData: 'oidBiz=' + product.oidBiz})
            this.$router.push('/pages/rrh/auto?oidBiz=' + product.oidBiz + '&name=' + product.productName)
        },
        /**
         * 登录
         * @return {[type]} [description]
         */
        goLogin() {
            AXD.util.login()
        },
        /**
         * 实名认证
         * @return {[type]} [description]
         */
        goAuth() {
            AXD.util.goAuth({
                backUrl: encodeURIComponent(window.location.href),
                authItem: 1,
                channel: 'aym_finance'
            })
        },
        goBack() {
            if (this.isApp) {
                goHome()
            } else {
                this.$router.back()
            }
        },
        /**
         * @function
         * @description 跳转至导流产品
         * @returns {boolean} 
         */
        goExportProduct(){
            const url = '/pages/guide/bjList'
            window.location.href = url
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';
@import './styles/common.scss';
@mixin icon {
    width:px2rem(44);
    height: px2rem(44);
    position: absolute;
    top: px2rem(12);
    left: 50%;
    transform: translateX(-50%);
    content: '';
    background-repeat: no-repeat;
}
::v-deep .mui-content {
    margin-bottom: px2rem(100);
}
.product{
    position: relative;
    color: #131314;
    padding:  0 px2rem(32) px2rem(24);
    &:before{
        content: '';
        position: absolute;
        height: 1px;
        width: px2rem(686);
        bottom: 0;
        left: px2rem(32);
        background-color: #ececec;
    }
    &:after{
            content: " ";
            display: inline-block;
            height: .62222rem;
            width: .62222rem;
            background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0IDQ0Ij48c3R5bGU+LnN0MHtmaWxsOiNjY2N9PC9zdHlsZT48cGF0aCBpZD0iWE1MSURfNF8iIGNsYXNzPSJzdDAiIGQ9Ik0zMyAyMUwxNS4xIDMuMWMtLjYtLjYtMS41LS42LTIuMSAwcy0uNiAxLjUgMCAyLjFsMTYuOSAxNi45TDEzIDM5Yy0uNi42LS42IDEuNSAwIDIuMS4zLjMuNy40IDEuMS40cy44LS4xIDEuMS0uNEwzMyAyMy4yYy4zLS4zLjQtLjcuNC0xLjEuMS0uNC0uMS0uOC0uNC0xLjF6Ii8+PC9zdmc+");
            background-size: cover;
            right: px2rem(32);
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
    .title{
        font-size: px2rem(32);
        line-height: px2rem(96);
        height: px2rem(96);
        font-weight: bold;
        align-items: center;
        .label{
            color: #ff3e00;
            font-size: px2rem(20);
            font-weight: 400;
            border: 1px solid #ff3e00;
            height: px2rem(32);
            line-height: px2rem(32);
            border-radius: px2rem(16);
            padding: 0 px2rem(8);
            margin-left: px2rem(24);
        }
        .icon{
            width: px2rem(36);
            height: px2rem(36);
            margin-right: px2rem(24)
        }
    }
    .text-1{
        color: #a1a1a1;
        font-size: px2rem(24);
        line-height: px2rem(24);
    }
    .amt, .period{
        font-size: px2rem(34);
        line-height: px2rem(40);
        font-weight: bold;
        margin: px2rem(12) 0 px2rem(16);
    }
    .amt{
        color: #ff3e00;
    }
    .content-item{
        margin-right: px2rem(80);
    }
    .special{
        display: inline-block;
        height: px2rem(44);
        line-height: px2rem(44);
        padding: 0 px2rem(16);
        font-size: px2rem(24);
        color: #717172;
        background-color: #f8f8f8;
        border-radius: px2rem(22);
        width: auto;
    }
    .coupon {
        width: px2rem(32);
        height: px2rem(38);
        position: absolute;
        top: 20%;
        right: px2rem(82);
        background: url('./styles/imgs/hongbao.png') no-repeat 0 0;
        background-size: px2rem(32) px2rem(38);
        animation-name: aroundAnimation; /*动画的名称*/
        transform-origin: center center; /*设置动画旋转元素的基点为*/
    }
    .animate__animated {
        animation-duration: 1.5s;
        -webkit-animation-duration: 1.5s;
        animation-fill-mode: both;
        -webkit-animation-fill-mode: both;
    }

    @-webkit-keyframes swing {
        20% {
            -webkit-transform: rotate(15deg);
            transform: rotate(15deg)
        }

        40% {
            -webkit-transform: rotate(-10deg);
            transform: rotate(-10deg)
        }

        60% {
            -webkit-transform: rotate(5deg);
            transform: rotate(5deg)
        }

        80% {
            -webkit-transform: rotate(-5deg);
            transform: rotate(-5deg)
        }

        to {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }
    }

    @keyframes swing {
        20% {
            -webkit-transform: rotate(15deg);
            transform: rotate(15deg)
        }

        40% {
            -webkit-transform: rotate(-10deg);
            transform: rotate(-10deg)
        }

        60% {
            -webkit-transform: rotate(5deg);
            transform: rotate(5deg)
        }

        80% {
            -webkit-transform: rotate(-5deg);
            transform: rotate(-5deg)
        }

        to {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }
    }

    .animate__swing {
        -webkit-transform-origin: top center;
        transform-origin: center bottom;
        -webkit-animation-name: swing;
        animation-name: swing
    }

    .apply{
        height: px2rem(32);
        line-height: px2rem(32);
        font-size: px2rem(24);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: px2rem(64);
    }
}
.product:active {
    background-color: #ececec;
}
.op{
    width: px2rem(750);
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
    flex-wrap: nowrap;
    .op-item{
        position:relative;
        height: px2rem(100);
        flex: 1;
        text-align:center;
        color: #666666;
        font-size: px2rem(22);
        line-height: px2rem(150);
    }
    .loan-record:before{
        @include icon;
        @include img2x('./styles/imgs/repRecord');
        background-size:100%;
    }
    .repayment-record:before{
        @include icon;
        @include img2x('./styles/imgs/repRecord');
        background-size:100%;
    }
    .repayment:before{
        @include icon;
        @include img2x('./styles/imgs/repayment');
        background-size:100%;
    }
}
body.aym {
    .op{
        .loan-record:before{
            @include img2x('./styles/imgs_old/repRecord');
        }
        .repayment-record:before{
            @include img2x('./styles/imgs_old/repRecord');
        }
        .repayment:before{
            @include img2x('./styles/imgs_old/repayment');
        }
    }
}
.default-wrapper {
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.default-img {
    width: px2rem(426);
    height: px2rem(279);
    margin-bottom: px2rem(20);
}
.default-text {
    font-weight: 600;
    font-size: px2rem(28);
    text-align: center;
    margin-bottom: px2rem(25);
}
.default-btn {
    width: px2rem(300);
    height: px2rem(84);
    line-height: px2rem(84);
    border-radius: px2rem(7);
    text-align: center;
    font-weight: 400;
    font-size: px2rem(34);
    margin: 0 auto;
}
</style>
