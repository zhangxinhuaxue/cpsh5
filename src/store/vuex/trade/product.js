/**
 *
 * @author:      heting
 * @dateTime:    2017-05-18
 */
import { formatImg } from 'src/libs/util'
import {
    getReactDetailInfo,
    getCouponTipList,
    getCouponListV3,
    getCpsSource,
    getCartCount,
    getSpec,
    getStockState,
    getValidSkuByArea
} from 'store/modules/trade/product'
import {
    getlocalCartNum
} from 'src/module/trade/product/blocks/common/common.js'
import { getDateTime } from 'src/libs/util'
import { Toast } from '@fe/buss-ui'

const state = {
    defaultData: {
        defaultImg: require('src/module/trade/product/img/default.gif'),
        defaultShopLogo: require('src/module/trade/product/img/shop-logo.jpg')
    },
    initData: {
        user: {
            uid: '',
            eduCode: 0 // 用户及商品状态码：1015:商品为教育商品，无资格购买；1014:认证后才能购买
        },
        desc: {
            productId: 0, // 商品id
            bannerImgs: [],
            content: '', // 商品详情
            imgUrl: '', // 商品图片
            name: '', // 商品名称
            priceTags: 0, // 商品价格标签
            nameTags: 0, // 商品名称标签
            isAxd: 'y', // 是否为自营商品
            merchantIdStr: '', // 商户id
            isSeaAmoy: false, // 是否为海淘商品
            tax: 0, // 海淘的税费
            productType: 'real' // 商品类型
        },
        trade: {
            isUndercarriage: false, // 商品是否已下架
            buyType: 'normal', // 商品购买类型 normal, seckill, teambuy
            stock: 1, // 商品库存
            status: 'y', // 商品是否在架，y为在架，n为下架
            cartCount: 0, // 默认购物车数量
            instalmentType: '', // 商品分期类型：购物车需要
            buyLimit: 0, // 限购：购物车使用
            minPrice: 0, // 商品最小价格
            originPrice: 0, // 商品原价
            minDiscountPrice: 0, // 最小活动价格
            features: [], // 商品的特性分类
            skuSet: [], // 商品sku分布库
            skuImgs: [], // sku图片库
            buyMininum: 0, // 商品起售最小值
            cartStatus: 'y', // 是否可加入购物车
            showSumSale: '0', // 销量
            prefer: 0, // A+会员默认sku优惠金额
            isReservation: false // 是否预约商品3
        },
        shop: {
            isCollected: false, // 是否收藏
            id: 0,
            productTotal: 0,
            logo: '', // 店铺logo
            name: '', // 店铺名称
            type: '', // JD京东商品 'JD'
            isShow: false, // 是否展现店铺
            merchantPhone: '', // 商铺电话
            clientPhone: '' // 客服电话
        },
        // 卖点
        sellPoint: [],
        // sellPoint: [{
        //     name: '', // 名称
        //     defaultImg: '', // 默认图
        //     detail: '', // 介绍
        //     detailImg: '' // 详情图
        // }],
        // 分期资源位
        instalment: {
            isShow: true, // 是否展示
            txt: '', // 文字描述
            thumbImg: '', // 缩略图
            detailImg: '', // 详情图
            detailUrl: '' // 详情链接
        },
        // 悬浮标签
        suspensionTag: {},
        // 红包
        coupon: {
            isShow: true, // 是否展示
            tipsList: [], // 资源位txt
            hasVip: false, // 当前用户是否会员
            list: [] // 红包列表
        },
        // 促销
        sales: {
            isShow: true, // 是否展示
            txt: '',
            url: '',
            imgUrl: '',
            saleImgUrl: ''
        },
        // A+会员相关
        activity: {
            id: '', // 需要在下单时传, 活动id
            member: false, // 是否是A+会员，不登录情况也为false
            title: '', // 备用字段
            bufferTimeStart: '', // 预热开始时间
            remindSwitch: 0, // note: limittime 提醒开关 0为不打开，1为打开
            timeEnd: '', // 活动结束
            timeStart: '', // 活动开始
            nowTime: '', // 服务器时间
            beforeBgColor: '#59CA80', // note: limittime 活动开始前的背景色值
            ingBgColor: '#EF3E56', // note: limittime 活动进行中的背景色值
            state: '', // note: limittime 活动状态 before活动前 ing活动中
            adUrl: '',
            finalDiscountPrice: 0, // note: 仅限砍价使用 bargain
            list: [] // note: 仅限N件任选使用 npxe
        },
        seckill: {
            isSeckillFlag: false,
            displaySeckillNum: 0,
            isEnd: false,
            endDate: '',
            startDate: ''
        },
        // 限时抢购相关信息
        limitSeckill: {
            copyPid: '',
            startTime: '',
            endTime: '',
            productId: '',
            productIsDel: 'n',
            showStock: 0
        },
        teambuy: {
            isOver: false, // 是否已经过期
            num: 0,
            originPrice: 0,
            price: 0,
            tbId: 0, // 团购id
            originProductId: 0,
            userName: 'm',
            leftNum: 0,
            serverTime: '',
            endTime: '',
            createUserTel: '',
            open: '',
            productId: 0
        },
        jd: {
            mainSkuId: 0, // 京东商品的主skuid
            spec: '', // 京东商品的规格参数
            stockState: '' // 区域库存状态
        },
        // limittime: {
        //     bufferTimeStart: '', // 预热开始时间
        //     id: '', // 活动id
        //     remindSwitch: 0, // 提醒开关 0为不打开，1为打开
        //     timeEnd: '', // 活动结束
        //     timeStart: '', // 活动开始
        //     nowTime: '', // 服务器时间
        //     beforeBgColor: '#59CA80', // 活动开始前的背景色值
        //     ingBgColor: '#EF3E56', // 活动进行中的背景色值
        //     state: '', // 活动状态 before活动前 ing活动中
        //     adUrl: ''
        // },
        // bargain: {
        //     finalDiscountPrice: 0
        // },
        // npxe: {
        //     activityId: 0,
        //     list: []
        // },
        presale: {
            deposit: '', // 定金（单位:分）    number
            depositDiscounts: '', // 定金优惠（单位:分）  number
            depositEnd: '', // 定金结束时间  string
            retainageEnd: '', // 尾款结束时间  string
            retainageStart: '', // 尾款开始时间  string
            shipTime: '', // 发货时间（天）
            minPrice: 0,
            skuPrices: [],
            minOrgPrice: 0
        }
        // ,
        // chance: {
        //     activityId: ''
        // }
    },
    interactData: {
        reservationStatus: 0, // 预约商品状态
        firstScreenDone: false,
        trade: {
            price: 0,
            discountPrice: 0, // 活动价格
            popupObj: null,
            popupFrom: '',
            isSkuPopOpen: false,
            choosedSku: {},
            skuId: 0,
            productNum: 1,
            skuImgSwiperShow: false,
            skuImgList: [],
            skuImgIndex: 0
        },
        seckill: {
            canBuy: false, // 是否可以购买
            btnTxt: '即将开始' // 按钮文案
        },
        limitSeckill: {
            state: 'before', // 限时抢购状态：before || selling || over
            stock: '', // 剩余库存，用于显示还剩多少件
            showStock: '', // 显示库存，用于参加限时抢购的商品展示进度条使用
            showInfo: true // 是否显示
        },
        teambuy: {
            createTeambuy: 'y', // 是否新开团
            recordId: 0, // 拼团推荐id
            tbId: 0 // 团购id
        },
        jd: {
            skuInfo: '',
            area: {
                street: '',
                streetCode: '',
                address: '',
                city: '杭州市',
                cityCode: '330100',
                district: '西湖区',
                districtCode: '330106',
                id: -1,
                province: '浙江省',
                provinceCode: '330000'
            },
            areaList: [],
            noStockTips: '所选地区暂时缺货，先看看别的吧',
            limitStockTips: '该商品在该地区暂不支持销售，非常抱歉',
            areaUpdateDone: false
        },
        presale: {
            price: 0,
            originPrice: 0
        }
    }
}
// getter
const getters = {
    price: state => {
        if (state.initData.trade.buyType == 'presale') {
            return state.initData.presale.minPrice
        } else {
            return state.interactData.trade.price ? state.interactData.trade.price : state.initData.trade.minPrice
        }
    },
    discountPrice: state => {
        return state.interactData.trade.discountPrice ? state.interactData.trade.discountPrice : state.initData.trade.minDiscountPrice
    },
    isUndercarriage: state => {
        return !Number(state.initData.trade.stock) || (state.initData.trade.status == 'n')
    },
    curStock: state => {
        return state.interactData.limitSeckill.stock ? state.interactData.limitSeckill.stock : state.initData.trade.stock
    },
    curShowStock: state => {
        return state.interactData.limitSeckill.showStock ? state.interactData.limitSeckill.showStock : state.initData.limitSeckill.showStock
    }
}

// actions 数据接口管理
const actions = {
    getStockState({ commit, state }, params) {
        getStockState(params).then((data) => {
            if (data.success) {
                commit('updateInitData', {
                    targetKey: 'jd',
                    stockState: data.result
                })
                if (data.result == '限售') {
                    state.interactData.trade.isSkuPopOpen && Toast.show(state.interactData.jd.limitStockTips)
                }
                if (data.result == '无货') {
                    state.interactData.trade.isSkuPopOpen && Toast.show(state.interactData.jd.noStockTips)
                }
            }
        })
    },
    getValidSkuByArea({ commit }, params) {
        return new Promise((resolve, reject) => {
            getValidSkuByArea(params).then((data) => {
                if (data.success) {
                    commit('updateInitData', {
                        targetKey: 'jd',
                        mainSkuId: data.result
                    })
                }
                commit('updateInteractData', {
                    targetKey: 'jd',
                    areaUpdateDone: true
                })
                resolve()
            })
        })
    },
    getSpecInfo({ commit }, params) {
        getSpec(params).then((data) => {
            if (data.success) {
                commit('updateInitData', {
                    targetKey: 'jd',
                    spec: data.result
                })
            }
        })
    },
    // 获取初始化的产品数据
    getProductData({ commit }, params) {
        return new Promise((resolve, reject) => {
            getReactDetailInfo(params).then((data) => {
                if (data.success) {
                    let {
                        productAllVo: {
                            productType
                        }
                    } = data.result
                    if (productType == 'real') {
                        commit('initUser', data.result)
                        commit('initDesc', data.result)
                        commit('initTradeProduct', data.result)
                        commit('initShop', data.result)
                        commit('initJdProduct', data.result)
                        commit('initSeckill', data.result)
                        commit('initLimitSeckill', data.result)
                        commit('initTeambuy', data.result)
                        // commit('initLimittime', data.result)
                        // A+会员
                        commit('initActivity', data.result)
                        // 砍价
                        // commit('initBargain', data.result)
                        // N件任选
                        // commit('initNpxe', data.result)
                        // 预售
                        commit('initPresale', data.result)
                        // 新人专享
                        // commit('initChance', data.result)
                        commit('initReservation', data.result)
                        resolve(data)
                    } else {
                        resolve(productType)
                    }
                } else {
                    reject()
                }
            })
        })
    },
    // 获取初始化的cps资源位数据
    getCpsSourceData({ commit }, params) {
        return new Promise((resolve, reject) => {
            getCpsSource(params).then((data) => {
                if (data.success) {
                    commit('initSellingPoint', data.result)
                    commit('initInstalment', data.result)
                    commit('initSales', data.result)
                    // commit('initCouponSource', data.result)
                    commit('initNpxePoints', data.result)
                    commit('initSuspensionTag', data.result)
                    resolve()
                } else {
                    reject()
                }
            })
        })
    },
    getCouponSorceData({ commit }, params) {
        getCouponTipList(params).then((data) => {
            if (data.success) {
                commit('initCouponSource', data.result)
            }
        })
    },
    // 获取初始化的红包列表数据
    getCouponListData({ commit }, params) {
        return new Promise((resolve, reject) => {
            getCouponListV3(params).then((data) => {
                if (data.success) {
                    commit('initCouponList', data.result)
                    resolve()
                } else {
                    // commit('initCouponList', data)
                    reject(data)
                }
            })
        })
    },
    // 获取初始化的购物车商品数量
    getCartCountData({ commit }, params) {
        getCartCount(params).then((data) => {
            let cartCount = 0
            if (data.success) {
                cartCount = Number(data.result)
            }
            commit('initTradeCartCount', cartCount + getlocalCartNum())
        })
    }
}

// mutations 状态转换 和 数据适配
const mutations = {
    // ****** 初始化数据处理 *******
    initUser(state, product) {
        let {
            uid,
            eduCode
        } = product
        state.initData.user.uid = uid
        state.initData.user.eduCode = eduCode || 0
    },
    initDesc(state, product) {
        let {
            productAllVo: {
                productType,
                id,
                content,
                imgUrl,
                name,
                priceTags,
                tags,
                merchantIdStr,
                productReal: {
                    productImgs,
                    isAxd,
                    isSeaAmoy,
                    taxFee
                }
            }
        } = product

        imgUrl = formatImg(imgUrl)

        // banner图片的处理，如果后台未配置，则取商品图
        let bannerImgs = []
        if (productImgs && productImgs.length > 0) {
            productImgs.forEach((item, index) => {
                if (item.url) {
                    let tItem = {
                        img: formatImg(item.url),
                        url: 'javascript:void(0);'
                    }
                    bannerImgs.push(tItem)
                }
            })
        }
        if (bannerImgs.length == 0) {
            bannerImgs.push({
                img: imgUrl,
                url: 'javascript:void(0);'
            })
        }

        // 存state
        Object.assign(state.initData.desc, {
            content,
            imgUrl,
            name,
            priceTags: priceTags ? priceTags.split(',') : undefined,
            nameTags: tags ? tags.split(',') : undefined,
            bannerImgs,
            productId: id,
            isAxd,
            merchantIdStr,
            isSeaAmoy: isSeaAmoy == 'y',
            tax: taxFee ? Number(taxFee) : 0,
            productType
        })
    },
    initTradeProduct(state, product) {
        let {
            productAllVo: {
                preSaleNum,
                stock,
                status,
                instalment,
                buyLimit,
                minPrice,
                originPrice,
                productSkus,
                productReal: {
                    extType,
                    skuShowVoes
                },
                minDiscountPrice,
                buyMininum,
                cartStatus,
                activityId,
                showSumSale,
                prefer
            },
            skuImgs
        } = product

        // 存state
        Object.assign(state.initData.trade, {
            preSaleNum, // 已预定xx件
            stock,
            status,
            instalmentType: instalment, // 商品分期类型：购物车需要
            buyLimit: extType === 'COUPON' ? 1 : buyLimit, // 限购数量，购物车用
            minPrice, // 商品最小价格
            originPrice, // 商品原价
            features: skuShowVoes, // 商品的特性分类
            skuSet: productSkus, // 商品sku分布库
            skuImgs, // 商品sku图片
            minDiscountPrice, // 最小折扣价
            buyMininum,
            cartStatus: cartStatus === 'y',
            activityId, // 普通场景下免单活动需要
            showSumSale, // 销量
            prefer // A+会员默认sku优惠金额
        })
    },
    initShop(state, product) {
        let {
            productAllVo: {
                shopId,
                productReal: {
                    shopName,
                    extType,
                    shopInfo,
                    clientPhone,
                    merchantPhone
                }
            }
        } = product

        // shopInfo为非必需
        let isShow = Boolean(shopInfo)
        let {
            logoImgUrl,
            favorited,
            productNum
        } = !shopInfo ? {} : shopInfo

        // 存state
        Object.assign(state.initData.shop, {
            isCollected: Boolean(favorited), // 是否收藏
            id: shopId,
            logo: logoImgUrl ? formatImg(logoImgUrl) : state.defaultData.defaultShopLogo, // 店铺logo
            name: shopName, // 店铺名称
            type: extType, // JD京东商品
            isShow,
            productTotal: Number(productNum),
            clientPhone,
            merchantPhone
        })
    },
    initActivity(state, product) {
        // note: 场景：A+会员、砍价、N件任选、新人专享、显示请购
        if (!product.sceneVo || !product.sceneVo.activity) {
            // state.initData.activity = null
            return
        }
        let {
            sceneVo: {
                sceneType,
                activity
            }
        } = product

        Object.assign(state.initData.activity, activity)
        state.initData.trade.buyType = !sceneType ? 'normal' : sceneType

        // note: 特殊处理场景-chance 新人专享
        if (sceneType === 'chance') {
            state.initData.activity.id = activity.id + '_' + activity.chanceId
        }

        // note: 特殊处理场景-limittime 限时请购
        if (sceneType === 'limittime') {
            let {
                nowTime,
                timeEnd,
                timeStart,
                bufferTimeStart,
                remindSwitch,
                resJson
            } = activity

            bufferTimeStart = bufferTimeStart == undefined ? timeStart : bufferTimeStart

            // 当服务器时间在活动预热开始之后与活动结束之前，则正常活动；否则为常规业务
            let isLimitTime = sceneType === 'limittime' && getDateTime(nowTime) > getDateTime(bufferTimeStart) && getDateTime(nowTime) < getDateTime(timeEnd)

            let activityState = getDateTime(nowTime) > getDateTime(timeStart) ? 'ing' : 'before'

            let adUrl = typeof resJson === 'string' ? JSON.parse(resJson).adUrl : resJson.adUrl
            // 存state
            state.initData.trade.buyType = !isLimitTime ? 'normal' : 'limittime'
            state.initData.activity.remindSwitch = remindSwitch === 'yes' ? 1 : 0
            state.initData.activity.adUrl = adUrl
            state.initData.activity.state = activityState
        }
    },
    initSeckill(state, product) {
        if (!product.sceneVo || product.sceneVo.sceneType != 'seckill') {
            return
        }
        let {
            sceneVo: {
                sceneType,
                seckill
            }
        } = product

        // 存state
        Object.assign(state.initData.seckill, seckill)
        state.initData.trade.buyType = !sceneType ? 'normal' : sceneType
    },
    initLimitSeckill(state, product) {
        if (!product.sceneVo || product.sceneVo.sceneType != 'limitSeckill') {
            return
        }
        let {
            sceneVo: {
                sceneType,
                limitSeckill
            }
        } = product

        // 存state
        Object.assign(state.initData.limitSeckill, limitSeckill)
        state.initData.trade.buyType = !sceneType ? 'normal' : sceneType
    },
    initTeambuy(state, product) {
        if (!product.sceneVo || product.sceneVo.sceneType != 'teambuy') {
            return
        }
        let {
            sceneVo: {
                sceneType,
                teambuy
            }
        } = product

        if (!teambuy) {
            teambuy = {}
            teambuy.isOver = true
        }
        // 存state
        Object.assign(state.initData.teambuy, teambuy)
        state.initData.trade.buyType = !sceneType ? 'normal' : sceneType
    },
    initReservation(state, product) {
        let {
            productAllVo: {
                storageMode
            }
        } = product
        state.initData.trade.isReservation = storageMode == 3
    },
    initPresale(state, product) {
        if (!product.sceneVo || product.sceneVo.sceneType != 'presale') {
            return
        }
        let {
            sceneVo: {
                sceneType,
                productPreSaleVo
            }
        } = product

        // 存state
        Object.assign(state.initData.presale, productPreSaleVo)
        state.initData.trade.buyType = !sceneType ? 'normal' : sceneType
    },
    initJdProduct(state, product) {
        let {
            productAllVo: {
                mainSkuId
            }
        } = product

        // 存state
        Object.assign(state.initData.jd, {
            mainSkuId
        })
    },
    // initBargain(state, { sceneVo, productAllVo }) {
    //     if (!sceneVo || sceneVo.sceneType != 'bargain') {
    //         return
    //     }
    //     // let { originPrice } = productAllVo
    //     let { bargain: { finalDiscountPrice }, sceneType } = sceneVo
    //     // 没有下发价格，说明这个活动商品活动已经失效，展示原价
    //     state.initData.trade.buyType = !sceneType ? 'normal' : sceneType
    //     state.initData.bargain.finalDiscountPrice = finalDiscountPrice || 0
    // },
    // N件任选
    // initNpxe(state, { sceneVo }) {
    //     if (!sceneVo || sceneVo.sceneType != 'npxe') {
    //         return
    //     }
    //     let { sceneType } = sceneVo
    //     state.initData.trade.buyType = !sceneType ? 'normal' : sceneType
    //     state.initData.npxe.activityId = sceneVo.npxe.id
    // },
    initNpxePoints(state, { promotionSources }) {
        if (!promotionSources) {
            return
        }
        state.initData.activity.list = promotionSources || []
    },
    // initChance(state, { sceneVo }) {
    //     if (!sceneVo || sceneVo.sceneType != 'chance') return
    //     let { sceneType, chance } = sceneVo
    //     state.initData.chance.activityId = chance ? (chance.id + '_' + chance.chanceId) : ''
    //     state.initData.trade.buyType = !sceneType ? 'normal' : sceneType
    // },
    initSellingPoint(state, cpsSource) {
        let {
            sellPoint
        } = cpsSource

        sellPoint.forEach((item, index) => {
            replaceProperty(item, 'defaultImg', 'url2', 'img')
            replaceProperty(item, 'detail', 'remark')
            replaceProperty(item, 'detailImg', 'url', 'img')
        })
        // 存state
        state.initData.sellPoint = sellPoint
    },
    initInstalment(state, cpsSource) {
        let {
            instSource
        } = cpsSource

        // instalment非必需
        let isShow = Boolean(instSource) // 是否展示
        let {
            customField1,
            customField2,
            customField3,
            value
        } = !instSource ? {} : instSource

        // 存state
        Object.assign(state.initData.instalment, {
            isShow, // 是否展示
            txt: value, // 文字描述
            thumbImg: formatImg(customField1), // 缩略图
            detailImg: formatImg(customField3), // 详情图
            detailUrl: !customField2 ? 'javascript:void(0);' : customField2 // 详情链接
        })
    },
    initSuspensionTag(state, cpsSource) {
        let {
            suspensionTag
        } = cpsSource
        Object.assign(state.initData.suspensionTag, suspensionTag)
    },
    initSales(state, cpsSource) {
        let {
            salesSource,
            saleImgUrl
        } = cpsSource

        // salesSource非必需
        // let isShow = Boolean(salesSource) // 是否展示
        let isShow = false // 20181022 沈凯需求 不再显示文案促销位/
        let [txt, url, imgUrl] = !salesSource ? ['', '', ''] : salesSource.split(';')
        // imgUrl = formatImg(imgUrl)
        // saleImgUrl = formatImg(saleImgUrl)
        // 存state
        Object.assign(state.initData.sales, {
            isShow, // 是否展示
            txt,
            url,
            imgUrl,
            saleImgUrl
        })
    },
    initCouponSource(state, result) {
        // let {
        //     enveSource
        // } = cpsSource

        // enveSource非必需
        // 存state
        Object.assign(state.initData.coupon, {
            isShow: state.initData.coupon.isShow && Boolean(result) && Boolean(result.length), // 是否展示
            tipsList: result
        })
    },
    initCouponList(state, result) {
        let { coupons = [], hasVip = false } = result
        // list非必需
        // 存state
        Object.assign(state.initData.coupon, {
            // isShow: state.initData.coupon.isShow && Boolean(coupons.length), // 是否展示
            // tipsList: tipsList,
            list: coupons,
            hasVip: !!hasVip
        })
    },
    initTradeCartCount(state, cartCount) {
        // 存state
        Object.assign(state.initData.trade, {
            cartCount: Number(cartCount)
        })
    },

    // ****** 交互处理 *******
    // 更新trade初始数据
    updateInitData(state, { targetKey, ...obj }) {
        for (let key in obj) {
            state.initData[targetKey][key] = obj[key]
        }
    },

    // 交互数据更新的统一处理
    updateInteractData(state, { targetKey, ...obj }) {
        for (let key in obj) {
            if (targetKey) {
                state.interactData[targetKey][key] = obj[key]
            } else {
                state.interactData[key] = obj[key]
            }
        }
    }
}

// 属性替换
function replaceProperty(item, targetName, currName, valueType) {
    if (valueType == 'img') {
        item[currName] = formatImg(item[currName])
    }
    item[targetName] = item[currName]

    delete item[currName]
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
