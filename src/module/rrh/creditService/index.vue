<template>
    <h-page>
        <div class="wrap">
            <primarykv v-for="(item,index) in kv" :config="item" :key="index"></primarykv>
            <div class="bottom" :class="{'iphonex':isIphoneX}">
                <div class="protocol">
                    <label @click="ischeck = !ischeck">
                        <span class="icon-check1" v-if="ischeck">
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                        <span class="icon-check1-disbaled" v-else>
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                        <!-- <span class="icon-uncheck1" ></span> -->
                        <span>我已阅读并同意</span>
                    </label>
                    <a href="javascript:;" @click="goUrl">《担保服务合同》</a>
                </div>
                <div class="bar">
                    <div class="bar-item left">担保费:<span>￥{{cartTotalPrice | formatMoney}}</span></div>
                    <div class="bar-item right" @click="submit">
                        <m-button type="full" :disabled="disable">立即投保</m-button>
                    </div>
                </div>
            </div>
        </div>
    </h-page>
</template>
<script>
import Vue from 'vue'
import hPage from '../common/hPage'
import primarykv from 'src/components/activityModel/primarykv.vue'
import {
    renderData
} from 'src/store/api'
import {
    formatMoney
} from 'src/libs/util'
import {
    virtualCreateTradeBuynow,
    virtualCreateTradeCreate
} from 'store/modules/trade/virtual'
import {openPayment, payMixinMulti} from 'module/trade/common/assets/order_multi'
import lazyload from 'src/libs/lazyload'
Vue.use(lazyload)
export default {
    data() {
        return {
            isApp: window.aixuedai.isUavoApp === 'y',
            loanId: this.$route.query.zxId,
            cartTotalPrice: '',
            csrfToken: '',
            skuId: '',
            kv: [],
            ischeck: true,
            comfirmFunction: virtualCreateTradeCreate,
            contractUrl: '',
            disable: true
        }
    },
    mixins: [payMixinMulti],
    filters: {
        formatMoney
    },
    computed: {
        isIphoneX() {
            return /iphone/gi.test(navigator.userAgent.toLowerCase()) && (screen.height == 812 && screen.width == 375)
        }
    },
    created() {
        this.getCmsData().then((cmsRes) => {
            if (cmsRes && cmsRes.blocks) {
                cmsRes.blocks.forEach(item => {
                    if (item.blockType === 'primary_kv') {
                        this.kv.push(item)
                    }
                    if (item.blockType === 'extend') {
                        let obj = JSON.parse(item.objList)
                        this.skuId = obj.skuId || ''
                        let device = this.isApp ? 'app' : 'h5'
                        this.contractUrl = `/${device}/user/contract/viewTemplate/${obj.taiheContract}`
                    }
                })
            }
            return this.init()
        }).then((initRes) => {
            let {cartTotalPrice, csrfToken} = initRes.confirmVo
            this.cartTotalPrice = cartTotalPrice
            this.csrfToken = csrfToken
        })
        // Promise.all([this.init(), this.getCmsData()]).then(([initRes, cmsRes]) => {
        //     let {cartTotalPrice, csrfToken} = initRes.confirmVo
        //     this.cartTotalPrice = cartTotalPrice
        //     this.csrfToken = csrfToken
        //     if (cmsRes && cmsRes.blocks) {
        //         cmsRes.blocks.forEach(item => {
        //             if (item.blockType === 'primary_kv') {
        //                 this.kv.push(item)
        //             }
        //             if (item.blockType === 'extend') {
        //                 this.skuId = JSON.parse(item.objList).skuId || ''
        //             }
        //         })
        //     }
        // })
    },
    methods: {
        init() {
            return new Promise((resolve, reject) => {
                let p = {loanId: this.loanId, skuId: this.skuId}
                virtualCreateTradeBuynow({params: JSON.stringify(p)}).then((res) => {
                    if (res.success) {
                        this.disable = false
                        resolve(res.result)
                    } else {
                        reject()
                    }
                })
            })
        },
        getCmsData() {
            return new Promise((resolve, reject) => {
                renderData({ alias: 'rrhzx' }, ({success, result}) => {
                    if (success) {
                        resolve(result)
                    } else {
                        reject()
                    }
                })
            })
        },
        submit() {
            if (!this.ischeck) {
                this.$_toast('请先阅读并同意《担保服务合同》')
                return
            }
            this.$router.push({
                name: 'rrhConfirm',
                query: {
                    loanId: this.loanId,
                    skuId: this.skuId,
                    oidBiz: this.$route.query.oidBiz
                }
            })
        },
        goUrl() {
            window.location.href = window.location.origin + this.contractUrl
        }
    },
    components: {
        hPage,
        primarykv
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.wrap{
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.bottom{
    position:fixed;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #fff;
    .protocol{
        padding: px2rem(32);
        line-height: px2rem(33);
        span{
            font-size: px2rem(24);
            color: #A1A1A1;
        }
        a{
            font-size: px2rem(24);
            color: #61C9FF;
        }
    }
    .bar{
        display: flex;
        line-height: px2rem(100);
        position: relative;
        &::before{
            content: '';
            display:block;
            width: 100%;
            height: 1px;
            border-top: 1px solid #E4E4E4;
            transform: scaleY(0.5);
            position: absolute;
            left: 0;
            top: -1px;
        }
        .left{
            width: px2rem(460);
            font-size: px2rem(28);
            color: #131314;
            text-align: right;
            padding-right: px2rem(20);
            span{
                font-size: px2rem(32);
                color: #FF3E00;
            }
        }
        .right{
            width: px2rem(290);
        }
    }
}
.iphonex{
    padding-bottom: px2rem(68);
    .bar{
        &::after{
            content: '';
            display:block;
            width: 100%;
            height: 1px;
            border-top: 1px solid #E4E4E4;
            transform: scaleY(0.5);
            position: absolute;
            left: 0;
            bottom: 0;
        }
    }
}
</style>


