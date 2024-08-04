<!--
 * @Description: 去掉了appleid类型和mobilegame类型的充值，改为了game类型充值
 * @Author: sunxj
 * @Date: 2019-01-09 18:20:50
 * @LastEditTime: 2019-05-29 15:41:03
 * @LastEditors: sunxj
 -->
<template>
    <div>
        <div class="aui-page" v-if="!fixedPageHeight"></div>
        <div class="aui-page" v-if="fixedPageHeight" :style="{'height':+fixedPageHeight+'px'}">
            <hybrid-header :config="barConfig"></hybrid-header>
            <detail-footer :checkName="checkName" :disabled="btnDisabled" @click.native="goRecharge" />
            <div class="aui-content" v-if="productData">
                <div class="aui-cells">
                    <div class="aui-cell select">
                        <div class="aui-cell__bd">
                            <p>订单信息</p>
                        </div>
                        <div class="aui-cell__ft text-overflow">{{ productData.name }}</div>
                    </div>
                </div>
                <vip-charge v-if="chargeData.cardType !== 'card'" :chargeData="chargeData" :specialName="specialName" />
                <skus v-if="productSkus.length" :skus="productSkus" :name="productData.name" :defaultIndex="skuIndex" />
                <explain v-if="explainObj.content" :config="explainObj"></explain>
            </div>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import vipCharge from './blocks/vip-content.vue'
import skus from './blocks/skus.vue'
import explain from './blocks/explain.vue'
import detailFooter from './blocks/detail-footer.vue'
import { initHeightMixin } from 'src/module/common/pageheight_init'
import {
    // getVirtualDetailInfo
    getReactDetailInfo
} from 'store/modules/trade/product'
import {
    getVirtualGames,
    preBuyNow
} from 'store/modules/trade/virtual'
import {
    AXD
} from 'libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('trade/virtual')
// const { mapGetters: mapGettersConfirm, mapMutations: mapMutationsConfirm } = createNamespacedHelpers('trade/confirm')

export default {
    name: 'virtualDetail',
    mixins: [initHeightMixin],
    data() {
        return {
            fixedPageHeight: 0,
            initialBodyHeight: 0,
            skuIndex: 0,
            showPop: false,
            tpyeNamesObj: {
                key1: 'game',
                key2: 'vip',
                key3: 'appleid',
                key4: 'mobilegame',
                key5: 'game_vip',
                key6: 'id_mobile',
                game: {
                    title: '游戏充值',
                    explainName: '游戏说明'
                },
                vip: {
                    title: '会员充值',
                    explainName: '会员特权'
                },
                mobilegame: {
                    title: '手游充值',
                    explainName: '游戏说明'
                },
                appleid: {
                    title: '苹果ID充值',
                    explainName: '购前须知'
                }
            },
            specialName: {
                name1: '魔兽',
                name2: '穿越火线'
            },
            explainObj: {
                name: '',
                content: ''
            },
            productData: null,
            virtualData: {
                productData: {},
                // gamesData: {},
                name1: '魔兽',
                name2: '穿越火线'
            },
            chargeData: {},
            productSkus: [],
            barConfig: {
                // action: 'switchDialog', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    title: '充值', // title
                    // icon: 'icon-ask' // 按钮显示ICON，一定要早AUI iconfont里面选  外面的不支持
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            checkName: '请核对充值账号：',
            btnDisabled: false
        }
    },
    computed: {
        ...mapState({
            uid: state => state.uid,
            chargeAcm: state => state.chargeAcm,
            passcard: state => state.passcard,
            chargegame: state => state.chargegame,
            chargeregion: state => state.chargeregion,
            chargeserver: state => state.chargeserver,
            chargetype: state => state.chargetype,
            skuId: state => state.skus.id,
            activityIds: state => state.activityIds
        }),
        // ...mapGettersConfirm([
        //     'skuIdAndNum'
        // ]),
        // ...mapGetters([
        //     'disPrice'
        // ]),
        // type() {
        //     return this.productData.virtualType
        // },
        // appleidShow() {
        //     if (this.type === this.tpyeNamesObj.key3 || this.type === this.tpyeNamesObj.key4) {
        //         return this.tpyeNamesObj.key6
        //     } else if (this.type === this.tpyeNamesObj.key1 || this.type === this.tpyeNamesObj.key2) {
        //         return this.tpyeNamesObj.key5
        //     }
        // },
        // pageBgColor() {
        //     if (this.appleidShow === this.tpyeNamesObj.key6) {
        //         return '#fff'
        //     } else {
        //         return '#f7f7f7'
        //     }
        // },
        chargeText() {
            let name = this.productData.name
            if (name && name.indexOf(this.virtualData.name2) > -1) {
                return '游戏大区'
            } else {
                return '游戏名称'
            }
        }
    },
    mounted() {
        axdApp.send({
            module: 'webview',
            method: 'configNavigationBar',
            params: {
                visible: true
            },
            callback: function(data) {}
        })
        this.init()
    },
    methods: {
        ...mapMutations([
            'saveVirtualData'
        ]),
        // ...mapMutationsConfirm([
        //     'saveSkuId'
        // ]),
        init() {
            let that = this
            let productId = this.$route.params.productId
            // let url = window.location.href
            // 新人专享入参特殊
            let param = { productId }
            if (this.$route.query.activeType === 'chance') {
                let { xrdt, xrid, activeType } = this.$route.query
                param = Object.assign(param, { data: xrdt, sign: xrid, activeType })
            }

            getReactDetailInfo(param).then((data) => {
                if (data.success && data.result) {
                    let result = data.result
                    // let productAll = res.productAllVo
                    // let productType = productAll.productType || ''
                    // let productVirtual = productAll.productVirtual
                    // let virtualType = productVirtual.virtualType
                    let {
                        productAllVo: {
                            productType,
                            productVirtual,
                            productSkus,
                            content,
                            activityId
                        },
                        uid
                    } = result
                    // 实物／话费跳转
                    if (productType !== 'virtual') {
                        this.resetRoute(productType, productId)
                        return false
                    }
                    let virtualType = productVirtual.virtualType || this.tpyeNamesObj.key1
                    // 跳转米卡
                    if (virtualType === 'micard') {
                        this.$router.replace({
                            name: 'mikaIndex'
                        })
                        return false
                    }
                    // let skus = productAll.productSkus
                    let sukLen = productSkus.length
                    // 默认选中哪个价格产品
                    let defaultIndex = ~~this.$route.query.defaultVal
                    defaultIndex = (defaultIndex < sukLen) ? defaultIndex : 0
                    this.skuIndex = defaultIndex
                    let skuId = productSkus[defaultIndex].id
                    this.productSkus = productSkus

                    this.getVirtualGamesData(skuId)
                    this.productData = productVirtual
                    // this.$set(this.productData, 'skus', skus)
                    this.explainObj.content = content
                    let explainObj = this.tpyeNamesObj[virtualType]
                    document.title = this.barConfig.h5.title = explainObj.title
                    this.explainObj.name = explainObj.name

                    that.saveVirtualData({
                        uid,
                        productId,
                        activityIds: activityId ? [activityId] : [],
                        source: 'gameVip',
                        name: productVirtual.name,
                        isRefresh: 'n' // 确认页刷新isRefresh值丢失返回上一页
                    })
                    // 新人专享替换activityIds
                    if (result.sceneVo) {
                        let {sceneType, activity} = result.sceneVo
                        this.saveVirtualData({
                            sceneType: sceneType || 'normal'
                        })
                        if (sceneType === 'chance' && activity) {
                            let {chanceId, id} = activity
                            this.saveVirtualData({
                                activityIds: [ id + '_' + chanceId ]
                            })
                        }
                    }

                    // 获取缓存的账号
                    if (uid) {
                        that.getStorageAcm(productId)
                    }
                } else {
                    let resultDes = data.resultDes ? data.resultDes : '网络异常，稍后再试!'
                    this.$_toast(resultDes)
                }
            })
        },
        resetRoute(productType, productId) {
            let name
            if (productType === 'real') { // 实物
                name = 'product'
            } else if (productType === 'phone') { // 话费
                name = 'telrecharge'
            }
            this.$router.replace({
                name,
                params: {
                    productId
                }
            })
        },
        getStorageAcm(productId) {
            let that = this
            let localStorage = window.localStorage
            let arr = JSON.parse(localStorage.getItem('virtualAcmData')) || []
            if (arr.length) {
                for (let item of arr) {
                    if (item.uid === that.uid) {
                        if (item.productId === productId) {
                            let chargeaccount = item.chargeaccount
                            let passcard = item.passcard

                            that.saveVirtualData({
                                chargeAcm: chargeaccount,
                                passcard: passcard
                            })
                            break
                        }
                    } else {
                        localStorage.removeItem('virtualAcmData')
                        break
                    }
                }
            }
        },
        getVirtualGamesData(skuId) {
            let that = this
            getVirtualGames({
                skuId: skuId
            }).then((data) => {
                if (data.success) {
                    let res = data.result
                    if (res) {
                        let goodstype = res.cardType || res.chargePWD || ''
                        that.chargeData = res
                        that.saveVirtualData({
                            goodstype
                            // gamesVo: res
                        })
                    }

                    setTimeout(() => {
                        this.initPageHeight()
                    }, 0)
                } else {
                    let resultDes = data.resultDes ? data.resultDes : '网络异常，稍后再试!'
                    this.$_toast(resultDes)
                }
            })
        },
        /* 初始化page容器高度，避免数字键盘弹出后，最下按钮飘上来 */
        // initPageHeight() {
        //     let pHeight = document.getElementsByClassName('aui-page')[0].offsetHeight
        //     if (pHeight == 0) {
        //         setTimeout(this.initPageHeight, 100)
        //     } else {
        //         this.fixedPageHeight = pHeight
        //         this.initialBodyHeight = pHeight

        //         // 处理H5浏览器下向上滚动 浏览器头部会自动收起 导致页面高度变化 底部按钮悬空的问题
        //         let that = this
        //         window.onresize = () => {
        //             return (() => {
        //                 let screenHeight = document.body.clientHeight
        //                 if (screenHeight >= that.initialBodyHeight) {
        //                     that.fixedPageHeight = screenHeight
        //                 }
        //             })()
        //         }
        //     }
        // },
        goRecharge() {
            // if (!this.uid) {
            //     AXD.util.login()
            //     return false
            // }
            // if (this.appleidShow === this.tpyeNamesObj.key5) {
            // }
            let text = this.checkInfo()
            if (text) {
                this.$_toast(text)
                return false
            }

            let params = {
                activityIds: this.activityIds,
                goodsType: this.goodstype,
                num: 1,
                skuId: this.skuId
            }
            params = JSON.stringify(params)
            preBuyNow({ params }).then(res => {
                if (res.success) {
                    this.$router.push({
                        name: 'virtualConfirm'
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
                        name: 'virtualConfirm'
                    })
                    return
                }
                this.$_toast(res.resultDes)
            })
            // 确认页选取分期需要skuId
            // this.saveSkuId(this.skuId)
            // 跳确认页
            // this.$router.push({
            //     name: 'virtualConfirm'
            // })
            // confirmInit({
            //     params: this.skuIdAndNum
            // }).then((res) => {
            //     if (!res.success) {
            //         let resultDes = res.resultDes ? res.resultDes : '网络异常，稍后再试!'
            //         this.$_toast(resultDes)
            //         return
            //     }
            //     this.$router.push({
            //         name: 'virtualConfirm'
            //     })
            // })
        },
        checkInfo() {
            let productData = this.virtualData.productData
            let chargeData = this.chargeData
            let name = productData.name || ''
            let cardtype = chargeData.cardType || ''
            let chargegameObj = chargeData.chargeGame
            let chargeregionArr = chargeData.chargeRegion || []
            let chargeserverArr = chargeData.chargeServer || []
            let chargetypeArr = chargeData.chargeType || []
            let text = ''
            if (name.indexOf(this.virtualData.name1) > -1 && !this.passcard) {
                text = '请输入通行证'
            } else if (cardtype !== 'card' && !this.chargeAcm) {
                text = '请输入充值帐号'
            } else if (chargegameObj && !this.chargegame) {
                text = '请选择' + this.chargeText
            } else if (chargeregionArr.length && !this.chargeregion) {
                text = '请选择游戏区'
            } else if (chargeserverArr.length && !this.chargeserver) {
                text = '请选择游戏服务器'
            } else if (chargetypeArr.length && !this.chargetype) {
                text = '请选择充值类型'
            }
            return text
        }
    },
    components: {
        hybridHeader,
        vipCharge,
        skus,
        explain,
        detailFooter
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-content {
    padding-bottom: px2rem(80);
}
.text-overflow {
    width: px2rem(535);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
