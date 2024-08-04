<template>
<m-page style="background: #f8f8f8 !important;">
    <hybrid-header :config="barConfig" slot="header"></hybrid-header>
    <div class="container">
        <div class="couponItem" v-for="(item, index) in couponeLists || []" :key="index">
            <label class="vipIcon" v-if="item.source === 'aplus_coupon'">会员可用</label>
            <div class="clearfix">
                <div class="partLeft clearfix">
                    <p>
                        <span class="fsnum">{{item.couponType === 'amc_discount' ? item.discountRate : item.discountAmt}}</span>
                        <span class="fsword">{{item.couponType === 'amc_discount' ? '折' : '元'}}</span>
                    </p>
                    <p class="fsword type">{{toType(item.couponType)}}</p>
                </div>
                <div class="partRight clearfix">
                    <p>{{item.couponTitle}}</p>
                    <p class="time">{{item.startTime + '-' + item.endTime}}<span @click="goPro(item.couponType)" class="use" v-if="item.couponStatus === 'use'">使用</span></p>
                </div>
            </div>
            <div class="detPart">
                <p @click="toggle1(index)"><span class="mr500">详细信息</span><i :class="item.styleName"></i></p>
                <div class="detRule" v-show="item.flag">
                    <p v-if="item.couponType === 'amc_discount'">本券最高可减{{item.maxDiscountAmt}}元</p>
                    <p>{{item.couponDesc}}</p>
                    <p v-if="item.source === 'aplus_coupon'">只限招财卡会员可用</p>
                    <p>{{item.limitLoanProducts}}</p>
                </div>
            </div>
        </div>
        <div v-show="initFlag">
            <div class="loadmore" @click="getMoreData" v-show="this.curPage !== this.totalPage && total !== '0'">点击加载更多</div>
            <div class="loadmore" v-show="total == 0"><img class="noimg" src="../styles/imgs/couponNo.png" alt=""></div>
            <div class="invalid" @click="goPage">
                查看已失效的优惠券&nbsp;<i class="right"></i>
            </div>
        </div>
    </div>
</m-page>
</template>
<script>
import { AXD } from 'src/libs/util'
import { getCouponList } from 'store/modules/rrh'
export default {
    name: 'couponList',
    data() {
        return {
            initFlag: false,
            total: 0,
            curPage: 1,
            totalPage: 0,
            start: 0,
            couponeLists: [],
            barConfig: {
                action: 'goPage', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    title: '优惠券', // title
                    rightBtnShow: true, // 是否显示右侧按钮
                    icon: '',
                    text: '使用规则' // 按钮显示文案
                },
                app: {
                    leftbuttonVisible: true,
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#333333', // #ff00000颜色 showType=TEXT
                        text: '使用规则' // 展示文字内容 showType=TEXT
                    },
                    rightBtnShow: true
                }
            }
        }
    },
    mounted() {
        axdApp.send({
            module: 'webview',
            method: 'setRightCloseBtnStatus',
            params: {
                showClose: false
            }
        })
        this.init()
        window.goPage = () => {
            this.goRulePage()
        }
    },
    methods: {
        toType(type) {
            if (type === 'amc_discount') {
                return '折扣券'
            } else if (type === 'amc_free') {
                return '抵扣券'
            } else if (type === 'product' || type === 'money_off') {
                return '商品优惠券'
            }
        },
        getList() {
            getCouponList({
                start: (this.curPage - 1) * 20,
                isCanUse: 1
            }).then(res => {
                if (res.success) {
                    this.initFlag = true
                    this.total = res.result.total
                    if (res.result.total) {
                        let list = res.result.list
                        list.length && list.forEach((item, i) => {
                            item.flag = false
                            item.styleName = 'down'
                            this.couponeLists.push(item)
                        })
                        this.totalPage = Math.ceil(res.result.total / 20)
                    } else {
                        this.$_toast('暂无可用优惠券')
                    }
                } else {
                    if (res.code === '-1999') {
                        this.$_toast('登录已失效，请重新登录', () => {
                            AXD.util.login()
                        })
                    }
                }
            })
        },
        init() {
            this.couponeLists = []
            this.getList()
        },
        getMoreData() {
            if (this.curPage < this.totalPage) {
                this.curPage ++
                this.getList()
            }
        },
        toggle1(index) {
            this.couponeLists[index].flag = !this.couponeLists[index].flag
            this.couponeLists[index].styleName = this.couponeLists[index].flag ? 'up' : 'down'
            // this.$set(this.couponeLists, this.couponeLists[index].flag, !this.couponeLists[index].flag)
            // this.$set(this.couponeLists, this.couponeLists[index].styleName, this.couponeLists[index].flag ? 'up' : 'down')
        },
        goPage() {
            this.$router.push({
                path: '/pages/rrh/invalidCouponList'
            })
        },
        goPro(couponType) {
            if (couponType === 'product' || couponType === 'money_off'){
                // https://m.zhaojiling.com/cms/renderPage?alias=salemall
                this.resetHref('/cms/renderPage?alias=salemall')
                return 
            }
    
            if (couponType === 'amc_free' || couponType === 'amc_discount') {
                this.$router.push({
                    path: '/pages/rrh/index'
                })
            }
        },
        goRulePage() {
            this.$router.push({
                path: '/pages/rrh/useRule'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
@import 'src/assets/styles/rem.scss';
@import 'src/assets/styles/mixins.scss';
$designWidth: 750;
.container {
    padding: px2rem(32);
    .loadmore {
        color:#999;
        text-align: center;
        font-size: px2rem(28);
        padding: px2rem(40) 0 0 0;
    }
    .noimg {
        width: px2rem(480);
        height: px2rem(480);
        display: inline-block;
    }
    .invalid {
        font-size: px2rem(28);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #4286FF;
        line-height: px2rem(40);
        text-align: center;
        padding-top: px2rem(65);
        i {
            border: solid #4286FF;
            border-width: 0 px2rem(2) px2rem(2) 0;
            display: inline-block;
            padding: 3px;
            vertical-align: middle;
        }
        .right {
            transform: rotate(-45deg);
            -webkit-transform: rotate(-45deg);
        }
        .left {
            transform: rotate(135deg);
            -webkit-transform: rotate(135deg);
        }
    }
    .post {
        position: relative;
    }
    .useStatus {
        position: absolute;
        right: 0;
        top: 0;
        img {
            width: px2rem(152);
            height: px2rem(148);
        }
    }
    .couponItem {
        margin-bottom: px2rem(24);
        position: relative;
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
            right: 0;
            top: 0;
        }
        .detPart {
            border-top: px2rem(1) dashed #e6e6e6;
            border-radius: px2rem(12) px2rem(12) px2rem(12) px2rem(12);
            padding: px2rem(20) px2rem(32);
            background: #fff;
            font-size: px2rem(24);
            color: #666;;
            i {
                border: solid black;
                border-width: 0 px2rem(2) px2rem(2) 0;
                display: inline-block;
                padding: 3px;
            }
            .up {
                transform: rotate(-135deg);
                -webkit-transform: rotate(-135deg);
            }
            .down {
                transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
            }
            .detRule {
                color: #999;
                line-height: px2rem(40);
                margin-top: px2rem(20);
            }
            .mr500 {
                margin-right: px2rem(500);
            }
        }
        .partRight {
            padding: px2rem(32) px2rem(20) 0 px2rem(32);
            background: #fff;
            color: #333;
            border-radius: 0 px2rem(12) px2rem(12) 0;
            width: px2rem(486);
            height: px2rem(180);
            float: right;
            font-size: px2rem(28);
        }
        .time {
            margin-top: px2rem(37);
            color: #999;
            font-size: px2rem(24);
        }
        .use {
            margin-left: px2rem(25);
            width: px2rem(68);
            height: px2rem(36);
            background: #ECF2FF;
            border-radius: px2rem(4);
            font-size: px2rem(22);
            color: #4286FF;
            display: inline-block;
            text-align: center;
        }
        .partLeft {
            float: left;
            padding-top: px2rem(30);
            text-align: center;
            width: px2rem(200);
            height: px2rem(180);
            background: #4286FF;
            color: #FFFFFF;
            border-radius: px2rem(12) 0 0 px2rem(12);
        }
        .fsnum {
            font-size: px2rem(68);
            font-weight: bold;
            line-height: px2rem(79);
            font-family: DINAlternate-Bold, DINAlternate;
        }
        .fsword {
            font-size: px2rem(28);
            font-weight: 400;
            color: #FFFFFF;
            line-height: px2rem(40);
        }
        .type {
            font-weight: 500;
        }
    }
    .invalidCoupon {
        .partLeft {
            background: #E6E6E6;
        }
        .partRight {
            color: #ccc !important;
        }
        .time {
            color: #ccc;
        }
        .detPart {
            color: #ccc !important;
            i {
                border: solid #ccc;
                border-width: 0 px2rem(2) px2rem(2) 0;
                display: inline-block;
                padding: 3px;
            }
            .up {
                transform: rotate(-135deg);
                -webkit-transform: rotate(-135deg);
            }
            .down {
                transform: rotate(45deg);
                -webkit-transform: rotate(45deg);
            }
            .detRule {
                color: #ccc;
            }
        }
    }
}
</style>
