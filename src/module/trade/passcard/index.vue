<template>
    <m-page class="bg" v-if="adList">
        <footer slot="bottom" class="mui-fixedbottom height130">
            <div class="apply-btn" @click="goConfirm">
                <img v-if="btnImg" :src="btnImg" />
            </div>
            <!-- <p v-if="showSubBtn" class="other-btn" @click="goLoanConstract">不考虑，继续申请借款<m-icon type="back1"></m-icon></p> -->
        </footer>
        <div class="pd100">
            <template v-for="(item, index) in adList">
                <img :src="item.img" :key="'img' + index" />
            </template>
        </div>
    </m-page>
</template>

<script>
import Vue from 'vue'
import { Page, Icon, Toast } from '@fe/buss-ui'
import { renderDataCms } from 'src/store/api'
// import {
//     getReactDetailInfo
// } from 'src/store/modules/trade/product'
import { getLoanpassProductInfo } from 'store/modules/trade/virtual'
import { getSkuInfo } from 'src/store/modules/trade/vipcard'
import { preBuyNow } from 'src/store/modules/trade/virtual'
import { AXD } from 'libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/virtual')
Vue.use(Toast)
export default {
    name: 'passcardIndex',
    data() {
        return {
            type: this.$route.query.type,
            backUrl: this.$route.query.backUrl,
            loanId: this.$route.query.loanId,
            isMast: this.$route.query.isMast,
            adList: null,
            btnImg: ''
        }
    },
    computed: {
        ...mapState({
            skuId: state => state.skus.id,
            activityIds: state => state.activityIds
        }),
        isPasscard() {
            return true
        },
        showSubBtn() {
            return this.backUrl && !this.isMast
        },
        title() {
            return this.isPasscard ? '购买取现通行证' : '开通A+会员'
        },
        productInfoFunction() {
            return this.isPasscard ? getLoanpassProductInfo : getSkuInfo
        }
    },
    components: {
        mPage: Page,
        mIcon: Icon
    },
    created() {
        this.init()
        this.getproductSkuInfo()
        // this.getProductData()
        document.title = this.title
    },
    methods: {
        ...mapMutations(['saveVirtualData']),
        init() {
            renderDataCms({ alias: 'passcardHome' }, false).then(res => {
                if (res.success && res.result && res.result.blocks) {
                    let blocks = res.result.blocks
                    blocks.forEach(item => {
                        if (this.isPasscard) {
                            if (item.title === 'passcardTtn' && this.type == '2') {
                                this.btnImg = item.img
                            }
                            if (item.title === 'vippasscardTtn' && this.type == '3') {
                                this.btnImg = item.img
                            }
                            if (item.title === 'passcardAd') {
                                this.adList = item.objListArray
                            }
                        } else {
                            if (item.title === 'vipcardTtn') {
                                this.btnImg = item.img
                            }
                            if (item.title === 'vipcardAd') {
                                this.adList = item.objListArray
                            }
                        }
                    })
                }
            })
        },
        getproductSkuInfo() {
            this.productInfoFunction().then(res => {
                if (res.success && res.result) {
                    let sku = res.result.skuList[0]
                    this.saveVirtualData({
                        source: 'passcard',
                        activityIds: [],
                        isRefresh: 'n', // 确认页刷新isRefresh值丢失返回上一页
                        confirm: {
                            num: 1
                        },
                        skus: {
                            id: sku.skuId
                        },
                        // goodstype: 'vipcard',
                        rechargeTitle: sku.skuName
                    })
                } else if (res.code === '-1999' || res.code === '10010' || res.code === '-1997') {
                    AXD.util.login()
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        // getProductData() {
        //     getReactDetailInfo({productId: this.productId}).then(({success, result}) => {
        //         if (success) {
        //             let { productSkus } = result.productAllVo
        //             let sku = productSkus.slice(-1)[0]
        //             this.saveVirtualData({
        //                 source: 'passcard',
        //                 activityIds: [],
        //                 isRefresh: 'n', // 确认页刷新isRefresh值丢失返回上一页
        //                 confirm: {
        //                     num: 1
        //                 },
        //                 skus: {
        //                     id: sku.id
        //                 },
        //                 // goodstype: 'vipcard',
        //                 rechargeTitle: sku.name
        //             })
        //         }
        //     })
        // },
        goConfirm() {
            let params = {
                activityIds: [],
                // goodsType: this.goodstype,
                num: 1,
                skuId: this.skuId
            }
            params = JSON.stringify(params)
            preBuyNow({ params }).then(res => {
                if (res.success) {
                    this.$router.push({
                        name: 'virtualConfirm',
                        query: {
                            backUrl: this.backUrl,
                            loanId: this.loanId
                        }
                    })
                    return
                }

                if (res.code == '-1999') {
                    AXD.util.login()
                    return
                }
                if (res.code == '8070') {
                    this.saveVirtualData({
                        activityIds: ''
                    })
                    this.$router.push({
                        name: 'virtualConfirm',
                        query: {
                            backUrl: this.backUrl,
                            loanId: this.loanId
                        }
                    })
                    return
                }
                this.$_toast(res.resultDes)
            })
            // this.$router.push({
            //     name: 'virtualConfirm',
            //     query: {
            //         backUrl: this.backUrl,
            //         loanId: this.loanId
            //     }
            // })
        },
        goLoanConstract() {
            if (this.backUrl) {
                window.location.href = this.backUrl
            } else {
                window.go(-1)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.bg {
    background-color: #fffbfe;
}
.pd100 {
    padding-bottom: px2rem(100);
}
.height236 {
    height: px2rem(236);
    padding-top: px2rem(32);
}
.height130 {
    height: px2rem(130);
    padding-top: px2rem(15);
}
.height136 ::v-deep .mui-content {
    bottom: px2rem(236);
}
.apply-btn {
    height: px2rem(96);
}
.other-btn {
    margin-top: px2rem(24);
    text-align: center;
    font-size: $auiFontSizeLevel7;
    color: $auiTextColorGeneral;
    .mui-icon {
        transform: rotate(180deg);
        font-size: px2rem(22);
    }
}
</style>