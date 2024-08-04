<template>
    <m-page>
        <hybrid-header :config="barConfig" slot="header"></hybrid-header>
        <div>
            <div v-if="list.length">
                <div v-for="(item, index) in list" class="product" @click="toApply(item)" :key="index">
                    <div class="title" flex>
                        <img v-if="item.logo" class="icon" :src="item.logo" alt="" />
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
                    <div class="apply">去申请</div>
                </div>
                <swiper v-if="list.length >= 3" :options="swiperOption" style="overflow: hidden;" class="banner-bottom_relative">
                    <swiper-slide v-for="banner in cmsBanner" :key="banner.bgImg">
                        <img :src="banner.bgImg" alt="banner" @click="goCmsUrl(banner.hotArea[0].url)" />
                    </swiper-slide>
                </swiper>
            </div>
            <div v-else-if="notMatched" class="default-wrapper">
                <img :src="cmsDefaultImg" alt="暂未能匹配到合适产品" class="default-img" />
                <div v-if="cmsDefaultContent" class="default-text">
                    <span :style="{color: cmsDefaultContent.text1.color}">{{cmsDefaultContent.text1.content}}</span><span :style="{color: cmsDefaultContent.text2.color}">{{cmsDefaultContent.text2.content}}</span>
                </div>
                <div class="default-btn" @click="goCmsUrl(cmsDefaultContent.button.url)" :style="{ color: cmsDefaultContent.button.content_color, backgroundColor: cmsDefaultContent.button.button_color }">{{cmsDefaultContent.button.content}}</div>
            </div>
        </div>
        <swiper v-if="list.length !== 0 && list.length < 3" :options="swiperOption" style="overflow: hidden;" class="banner-bottom_absolute">
            <swiper-slide v-for="banner in cmsBanner" :key="banner.bgImg">
                <img :src="banner.bgImg" alt="banner" @click="goCmsUrl(banner.hotArea[0].url)" />
            </swiper-slide>
        </swiper>
        <div class="op bottom" slot="bottom">
            <div v-if="isApp" class="op-item repayment" @click="toRepayment">还款</div>
            <div class="op-item loan-record" @click="toLoanRecords">订单</div>
        </div>
    </m-page>
</template>
<script>
import { AXD } from 'src/libs/util'
import { getProducts } from 'store/modules/rrh'
import { goHome, rateFormat, moneyScopeFormat, rateDescFormat, closeWebView } from './common/utils'
import { resetHeader } from 'components/header/resetHeader'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('rrh')
export default {
    name: 'quxianIndex',
    data() {
        return {
            tabUrl: {},
            swiperOption: {
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                }
            },
            list: [],
            // 默认已登录
            isLogin: true,
            notMatched: false,
            // 默认已实名认证
            isAuth: true,
            barConfig: {
                action: '', // 右侧按钮点击事件， 必须是window变量
                leftAction: '',
                h5: {},
                app: {
                    rightBtnShow: true,
                    leftbuttonAction: 'closeWindow',
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#000000', // #ff00000颜色 showType=TEXT
                        text: '' // 展示文字内容 showType=TEXT
                    }
                }
            },
            cmsDefaultImg: '',
            cmsBanner: [],
            cmsDefaultContent: null
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    filters: {
        rateFormat,
        moneyScopeFormat,
        rateDescFormat
    },
    mounted() {
        window.closeWindow = () => {
            closeWebView()
        }
        window.goBack = () => {
            // 重置原生head
            resetHeader()
            closeWebView()
        }
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
    },
    methods: {
        ...mapActions(['getRenderData']),
        /**
         * 初始化.
         * @return {[type]} [description]
         */
        init() {
            getProducts().then(res => {
                if (res.success) {
                    this.list = res.result || []
                    this.notMatched = !this.list.length
                } else {
                    if (res.code === '-1999') {
                        this.isLogin = false
                        this.goLogin()
                        return false
                    } else if (res.code === '2851000') {
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
                    this.$_toast(res.resultDes)
                }
            })
            this.getRenderData().then(data => {
                if (data.success && data.result && data.result.blocks) {
                    data.result.blocks.forEach(data => {
                        switch (data.title) {
                            case 'default_img':
                                this.cmsDefaultImg = JSON.parse(JSON.parse(data.objList))[0].bgImg
                                break
                            case 'banner':
                                this.cmsBanner = JSON.parse(JSON.parse(data.objList))
                                break
                            case 'default_content':
                                this.cmsDefaultContent = JSON.parse(data.objList)
                                break
                            default:
                                break
                        }
                    })
                }
            })
        },
        goCmsUrl(url) {
            axdApp.send({
                module: 'navigation',
                method: 'goURL',
                params: {
                    url,
                    closeToRoot: false
                },
                callback: function(ret) {}
            })
        },
        /**
         * 查看借款记录
         * @return {[type]} [description]
         */
        toLoanRecords() {
            if (!this.isLogin) {
                this.goLogin()
            } else if (!this.isAuth) {
                this.goAuth()
            } else {
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
            if (!this.isLogin) {
                this.goLogin()
            } else if (!this.isAuth) {
                this.goAuth()
            } else {
                this.$router.push({
                    name: 'rrhBill'
                })
            }
        },
        toApply(product) {
            if (!this.isLogin) {
                this.goLogin()
            } else if (!this.isAuth) {
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
            } else {
                this.$router.push({
                    name: 'rrhApply',
                    query: {
                        oidBiz: product.oidBiz,
                        name: product.productName
                    }
                })
            }
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
.banner-bottom_relative {
    width: 100%;
    margin-top: px2rem(150);
    margin-bottom: px2rem(40);
}
.banner-bottom_absolute {
    width: 100%;
    position: absolute;
    bottom: 3.5rem;
}
</style>
