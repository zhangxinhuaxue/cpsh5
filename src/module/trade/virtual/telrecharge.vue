<!--
 * @Description: 话费详情页
 * @Author: sunxj
 * @Date: 2019-01-09 20:15:46
 * @LastEditTime: 2019-05-29 15:41:16
 * @LastEditors: sunxj
 -->
<template>
    <div>
        <div class="aui-page" :style="{'height':+fixedPageHeight+'px'}">
            <hybrid-header :config="barConfig"></hybrid-header>
            <detail-footer :checkName="checkName" :disabled="btnDisabled" @click.native="goRecharge" />
            <div class="aui-content">
                <div v-if="bannerObj.img">
                    <a :href="bannerUrl">
                        <axd-image :src="bannerObj.img" alt=" " :lazy="false"></axd-image>
                    </a>
                </div>
                <div class="area-input">
                    <input class="input_telnum" maxlength="13" type="tel" placeholder="请输入手机号码" v-model="telNum">
                    <a href="javascript:;" class="icon_close" v-show="telNum" @click="clearTelNum">
                        <span class="icon-delete"></span>
                    </a>
                    <span class="telnum_location" v-if="locationRes && isTelLen11">{{locationRes}}</span>
                </div>
                <div class="area-choice">
                    <template v-if="!productSkus.length">
                        <a href="javascript:;" class="area-choice_unit"  :key="'acm' + index" v-for="(item, index) in choicesDefault">
                            <p class="choice_amount_default">￥{{item}}</p>
                        </a>
                    </template>
                    <p class="clearfix">
                        <template v-for="item in productSkus">
                            <a href="javascript:;" :key="item.id" :class="['area-choice_unit',isActive(item.amount)]" @click="chooseAmount(item)">
                                <p class="choice_amount">￥{{item.amount}}</p>
                                <p class="choice_price">售价 ￥{{item.price}}</p>
                            </a>
                        </template>
                    </p>
                    <!-- <p class="tip_fenqi">{{fenqiTip}}</p> -->
                </div>
                <div class="charge-tips" v-html="content"></div>
            </div>
        </div>
        <axd-dialog :showDialog="showDialog" :dialogInfo="dialogInfo" @mainClick="switchDialog">
            <div slot="content" class="text_left">
                <p v-for="(item, index) in dialogContent" :key="'problem' + index">
                    {{index+1}}、{{item}}
                </p>
            </div>
        </axd-dialog>
    </div>
</template>
<script>
import {
    getReactDetailInfo
} from 'store/modules/trade/product'
import { renderData, preBuyNow } from 'store/modules/trade/virtual'
import axdImage from 'src/components/image/index.vue'
import dialog from '../common/item_dialog/dialog.vue'
import hybridHeader from 'components/header/hybridheader.vue'
import detailFooter from './blocks/detail-footer.vue'
import { initHeightMixin } from 'src/module/common/pageheight_init'
import { AXD } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/virtual')
// const { mapMutations: mapMutationsConfirm } = createNamespacedHelpers('trade/confirm')
export default {
    name: 'telRecharge',
    mixins: [initHeightMixin],
    data() {
        return {
            isLogin: false,
            // telNum: '',
            productId: '',
            // skuId: '',
            chargeAmount: 50, // 默认充值金额
            price: 50, // 默认充值套餐价格
            csrfToken: '', // 提交订单校验token
            locationOff: {
                text1: '归属地查询中',
                text2: '未知归属地'
            },
            realLocation: '', // 真实的归属地
            locationRes: '', // 归属地显示
            content: '',
            checkName: '请核对您的电话号码：',
            acmCodeContent: '',
            productSkus: [],
            choicesDefault: [10, 20, 30, 50, 100, 200], // 接口出错默认显示套餐内容
            // fenqiTip: '', // 套餐下方资源位
            showDialog: false,
            // sureClickDisabled: false, // 底部按钮绝对禁用
            // confirmBtn: false, // 底部按钮临时禁用 tempClickDisabled 为了使用公用order.js改名
            /* CMS数据--Banner */
            bannerObj: {
                url: '',
                img: ''
            },
            /* CMS数据--dialog,自带默认值 */
            dialogInfo: {
                title: '话费充值须知',
                content: '',
                btn: '我知道了',
                singleBtn: true
            },
            dialogContent: ['月初月末为话费充值高峰期，运营商充值存在不稳定因素，若遇到充值问题请等待一段时间再次尝试或联系客服人员协助解决'],
            /* header数据 */
            barConfig: {
                action: 'switchDialog', // 右侧按钮点击事件
                h5: {
                    icon: 'https://img.aiyoumi.com/static/img/201707/03104614454.png' // 图⽚地址
                },
                app: {
                    rightBtn: 'custom', // 右侧按钮类型
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        imageUrl: 'https://img.aiyoumi.com/static/img/201707/03104614454.png' // 图⽚地址
                    }
                }
            },
            credtDialogShow: false
        }
    },
    computed: {
        // ...mapState({
        //     storeCouponCode: state => state.couponCode
        // }),
        ...mapState({
            storeChargeAcm: state => state.chargeAcm,
            storeSkuId: state => state.skus.id,
            activityIds: state => state.activityIds,
            sceneType: state => state.sceneType
        }),
        telNum: {
            get() {
                return this.storeChargeAcm
            },
            set(val) {
                this.handleTel(val)
                // let temp = val.replace(/\s/g, '').replace(/(^\w{3})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')
                // this.saveVirtualData({
                //     chargeAcm: temp
                // })
            }
        },
        realTelNum() {
            return this.telNum.split(' ').join('')
        },
        isTelLen11() {
            return this.realTelNum.length === 11
        },
        btnDisabled() {
            return !(this.isTelLen11 && this.realLocation && this.storeSkuId)
        },
        // showLocation() {
        //     return this.telNum.length == 13 && this.location
        //     // if (this.telNum.length == 13 && this.location) {
        //     //     return true
        //     // } else {
        //     //     return false
        //     // }
        // },
        bannerUrl() {
            return this.bannerObj.url || 'javascript:;'
        }
        // clickAbled() {
        //     return !this.sureClickDisabled && !this.confirmBtn
        // }
    },
    components: {
        axdImage,
        hybridHeader,
        detailFooter,
        'axd-dialog': dialog
    },
    mounted() {
        this.initData()

        let that = this
        window.switchDialog = function() {
            that.showDialog = !that.showDialog
        }
    },
    watch: {
        isTelLen11(curVal, oldVal) {
            if (curVal) {
                this.confirmBtn = false
                let checkResult = this.regCheckTelNum(this.realTelNum)
                if (checkResult) {
                    this.setRquireData()
                } else {
                    this.locationRes = '暂不支持此号码充值'
                }
            }
        }
    },
    methods: {
        ...mapMutations([
            'saveVirtualData'
        ]),
        // ...mapMutationsConfirm([
        //     'saveSkuId'
        // ]),
        // ...mapMutations([
        //     'CONFIRM_INIT'
        // ]),
        /* 初始化数据 */
        initData() {
            this.productId = this.$route.params.productId || ''
            this.setCmsData()
            this.setRquireData()
        },
        /* 初始化CMS数据 */
        setCmsData() {
            renderData({
                alias: 'app_telRecharge'
            }).then((res) => {
                // res = res.ret || res
                if (res.success && res.result && res.result.blocks && res.result.blocks.length) {
                    let blocks = res.result.blocks
                    let counter = 0
                    for (; counter < blocks.length; counter++) {
                        if (blocks[counter].blockType == 'full_column') {
                            this.bannerObj = JSON.parse(blocks[counter].objList)[0]
                        } else if (blocks[counter].blockType == 'extend') {
                            let temp = JSON.parse(blocks[counter].objList)
                            Object.assign(this.dialogInfo, temp)
                            this.dialogContent = this.dialogInfo.content
                            this.dialogInfo.content = ''
                        }
                    }
                } else {
                    // cms接口异常通栏
                    console.log('cms接口异常, 通栏及弹窗数据获取失败。通栏不显示，弹窗使用默认数据')
                }
            })
        },
        handleTel(val) {
            let temp = val.replace(/\s/g, '').replace(/(^\w{3})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')
            this.saveVirtualData({
                chargeAcm: temp
            })
        },
        /* 初始化用户、话费数据 */
        setRquireData() {
            this.locationRes = this.locationOff.text1 // 查询中
            this.realLocation = ''
            // 新人专享入参特殊
            let param = {
                'productId': this.productId,
                'targetTel': this.realTelNum
            }

            if (this.$route.query.activeType === 'chance') {
                let { xrdt, xrid, activeType } = this.$route.query
                param = Object.assign(param, { data: xrdt, sign: xrid, activeType })
            }
            getReactDetailInfo(param).then((res) => {
                if (typeof res == 'string') {
                    res = JSON.parse(res)
                }

                if (res.success) {
                    let result = res.result
                    // 实物和虚拟商品跳转
                    let {
                        productAllVo: {
                            content = '',
                            productType = '',
                            productPhone: {
                                phoneBills = []
                            },
                            productSkus,
                            activityId
                        },
                        uid,
                        telephone
                    } = result
                    // let productType = res.productAllVo.productType || ''
                    if (productType == 'real') {
                        this.$router.replace({
                            path: '/pages/mall/product/' + this.productId
                        })
                    } else if (productType == 'virtual') {
                        this.$router.replace({
                            path: '/pages/mall/virtual/detail/' + this.productId
                        })
                    }
                    this.content = content
                    this.isLogin = !!uid
                    // this.csrfToken = res.productAllVo.productPhone.csrfToken || ''

                    // 用户登录显示用户绑定手机号
                    if (!this.telNum && telephone) {
                        this.handleTel(telephone)
                        // this.telNum = this.formateTel(res.telephone)
                    }

                    // 新接口结构解析代码
                    // let billList = res.productAllVo.productPhone.phoneBills || []
                    // let skuList = res.productAllVo.productSkus || []

                    if (phoneBills && phoneBills.length) {
                        // 归属地
                        let location = phoneBills[0].location || ''
                        this.realLocation = location
                        this.locationRes = location || this.unLocation()
                        // 初始化默认充值金额对应的sku、price信息，以及充值套餐信息
                        this.getProductSkus(productSkus, phoneBills, location)
                    } else {
                        // 未知归属地
                        this.locationRes = this.unLocation()
                        // 清空choices
                        this.productSkus = []
                    }
                    this.saveVirtualData({
                        source: 'tel',
                        activityIds: activityId ? [activityId] : [],
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
                }
            })
        },
        unLocation() {
            return this.realTelNum ? this.locationOff.text2 : ''
        },
        getProductSkus(skuList, billList, location) {
            // 初始化默认充值金额对应的sku、price信息，以及充值套餐信息
            let skuLen = skuList.length
            let tempArr = []
            for (let i = 0; i < skuLen; i++) {
                let billObj = billList[i]
                let skuObj = skuList[i]
                let goodsMoney = billObj.goodsMoney / 1000
                let price = this.formatePrice(skuObj.price, 100)
                let skuid = skuObj.id
                let item = {
                    amount: goodsMoney,
                    price: price,
                    id: skuid
                }
                if (goodsMoney == this.chargeAmount) {
                    this.chooseAmount(item)
                    // this.skuId = skuid
                    // this.price = price
                }
                tempArr.push(item)
            }
            this.productSkus = tempArr
        },
        regCheckTelNum(telNum) {
            // telNum = telNum.split(' ').join('')
            if (!(/^1\d{10}$/.test(telNum))) {
                this.$_toast('请输入有效手机号')
                return false
            }
            return true
        },
        clearTelNum() {
            this.saveVirtualData({
                chargeAcm: ''
            })
        },
        /* 弹窗开关 */
        switchDialog(data) {
            this.showDialog = !this.showDialog
        },
        /* 充值套餐相关 */
        chooseAmount(item) {
            let rechargeTitle = `【${this.realLocation}】${item.amount}元话费充值`
            this.saveVirtualData({
                rechargeTitle: rechargeTitle,
                skus: item
            })
            this.chargeAmount = item.amount
            // this.price = item.price
            // this.skuId = item.skuid
            // this.getCoupon(this.skuId)
        },
        /* 立即充值 */
        goRecharge() {
            // if (!this.isLogin) {
            //     AXD.util.login()
            //     return
            // }
            if (!this.regCheckTelNum(this.realTelNum)) {
                return
            }
            if (!this.storeSkuId) {
                this.$_toast('请选择充值套餐')
                return false
            }
            this.saveVirtualData({
                token: 'y' // 确认页刷新token值丢失返回上一页
            })
            // 确认页选取分期需要skuId
            // this.saveSkuId(this.storeSkuId)

            let params = {
                activityIds: this.activityIds,
                // goodsType: this.goodstype,
                num: 1,
                skuId: this.storeSkuId
            }
            params = JSON.stringify(params)
            // 跳确认页
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
        },
        isActive(amount) {
            return this.chargeAmount == amount ? 'area-choice_unit_active' : ''
        },
        formatePrice(price, unit) {
            let priceInt = parseInt(price / unit)
            let priceFloat = (price / unit).toFixed(2)
            if (priceFloat == priceInt) {
                return priceInt
            } else {
                return priceFloat
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

input {
    border-radius: 0;
    background-color: #fff;
    border: none;
    -webkit-user-select: auto;
    line-height: 100%;
}

.area-input {
    width: 100%;
    height: px2rem(152);
    padding: px2rem(32) px2rem(32) 0;
    background-color: #fff;
    position: relative;

    .input_telnum {
        display: block;
        width: px2rem(650);
        height: px2rem(60);
        font-size: px2rem(60);
        color: $auiTextColorImportant;
    }

    ::-webkit-input-placeholder {
        /* WebKit browsers */
        font-size: px2rem(50);
        color: $auiTextColorLight;
    }

    :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        font-size: px2rem(50);
        color: $auiTextColorLight;
    }

    ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        font-size: px2rem(50);
        color: $auiTextColorLight;
    }

    :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        font-size: px2rem(50);
        color: $auiTextColorLight;
    }

    .telnum_location {
        position: absolute;
        left: px2rem(32);
        bottom: px2rem(32);
        margin-top: px2rem(-20);
        font-size: $auiFontSizeLevel7;
        line-height: px2rem(24);
        color: $auiTextColorLight;
        opacity: 0.99;
    }

    p {
        position: relative;
    }

    .icon-delete {
        font-size: $auiFontSizeLevel6;
    }

    .icon_close {
        display: inline-block;
        position: absolute;
        top: px2rem(37);
        right: px2rem(20);
        width: px2rem(50);
        height: px2rem(50);
        line-height: px2rem(50);
        text-align: center;
    }
}

.area-choice {
    position: relative;
    padding: px2rem(40) px2rem(30) px2rem(30) px2rem(32);
    background-color: #fff;

    &:before {
        content: '';
        width: 100%;
        height: 1px;
        background-color: $auiBgColorDefault;
        position: absolute;
        left: 0;
        top: 0;
        transform: scaleY(0.8);
    }

    .area-choice_unit {
        display: block;
        float: left;
        margin-right: px2rem(10);
        width: px2rem(222);
        height: px2rem(120);
        border-radius: px2rem(4);
        border: 1px solid $auiLineColorLight;
        margin-bottom: px2rem(15); // padding-top: px2rem(28);

        p {
            text-align: center;
        }

        &:nth-child(3n) {
            margin-right: px2rem(0);
        }
    }

    .choice_amount {
        margin-top: px2rem(28);
        font-size: $auiFontSizeLevel2;
        color: $auiTextColorImportant;
        letter-spacing: 0;
        line-height: px2rem(36);
        margin-bottom: 0;
    }

    .choice_amount_default {
        font-size: $auiFontSizeLevel2;
        color: $auiLineColorLight;
        letter-spacing: 0;
        line-height: px2rem(120);
        margin-bottom: 0;
    }

    .choice_price {
        margin-top: 0;
        font-size: $auiFontSizeLevel7;
        color: $auiTextColorGeneral;
        letter-spacing: 0;
        line-height: px2rem(24);
    }

    .tip_fenqi {
        margin-top: 0;
        font-size: $auiFontSizeLevel7;
        color: $auiTipsColor;
        letter-spacing: 0;
    }

    .area-choice_unit_active {
        border: 1px solid $auiTipsColor;

        p {
            color: $auiTipsColor;
        }
    }
}

.area_foot {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: px2rem(100);
    z-index: 200;
}

.btn_charge {
    width: 100%;
    height: px2rem(100);
    line-height: 2.13333rem;
    text-align: center;
    border-width: 0;
    outline: 0;
    -webkit-appearance: none;
    background-color: #ffd72d;
    font-size: px2rem(36);
    color: #222;
}

.btn_charge_disabled {
    color: #666666;
    background-color: #f3d76f;
}

.tip_accountcheck {
    width: 100%;
    height: px2rem(70);
    position: absolute;
    left: 0;
    bottom: px2rem(99);
    line-height: px2rem(70);
    background-color: #fff5d8;
    font-size: $auiFontSizeLevel5;
    color: $auiTipsColor;
    text-align: center;
}

.aui-page {
    overflow-x: hidden;
    padding-bottom: px2rem(70);
}

.aui-content {
    padding-bottom: px2rem(180);
}

.aui-fixedbottom .aui-btn_disabled {
    color: $auiTextColorGeneral;
    background-color: #f3d76f;
}

.text_overflow_show {
    width: px2rem(550);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.text_left {
    text-align: left;
}

.charge-tips {
    padding: px2rem(32);
    color: #ccc;
    ::v-deep span {
        display: block;
        font-size: px2rem(26);
        margin-bottom: px2rem(14);
    }
    ::v-deep p {
        font-size: px2rem(24);
        line-height: 1.2em;
    }
}

.pufaDialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -65%);
    -webkit-transform: translate(-50%, -65%);
    width: px2rem(530);
    max-height: px2rem(720);
    padding: px2rem(50) px2rem(35) 0;
    background-color: #fff;
    border-radius: px2rem(12);
    z-index: 1010;

    .pufaDialog__bd {
        max-height: px2rem(485);
        padding-bottom: 0;
        margin-bottom: px2rem(26);
        font-size: px2rem(36);
        text-align: center;
        color: #666666;
        line-height: px2rem(40);

        img {
            width: px2rem(68);
            height: px2rem(144);
            margin: 0 auto px2rem(35);
        }
    }

    .btn_pufa {
        width: px2rem(300);
        line-height: px2rem(84);
        margin: px2rem(30) auto;
    }

    span {
        position: absolute;
        left: 50%;
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
        bottom: px2rem(-120);
        width: px2rem(70);
        height: px2rem(70);
        // background: url('../img/close.png') 0 center no-repeat;
        background-size: cover;
    }
}
</style>
