import { formatImgWH, formatColor, formatNum, formatImg, formatComplexMoney } from 'src/libs/util'
let productMixin = {
    data() {
        return {}
    },
    computed: {
        isOne() {
            return this.blockType === 'product_one'
        },
        isTwoH() {
            return this.blockType === 'product_two-horizontal'
        },
        isTwoV() {
            return this.blockType === 'product_two-vertical'
        },
        isThree() {
            return this.blockType === 'product_three'
        },
        isFour() {
            return this.blockType === 'product_four'
        },
        // 处理选择一行两个模板或者一行三个模板，但是数量并不能整除的
        addClass() {
            let len = this.productList.length
            if ((this.isTwoV || this.isTwoH) && len % 2) return 'notTwo'
            if (this.isThree && len % 3) return 'notThree'
        },
        // 定义不同模板需要的商品尺寸图，节约流量
        resizeW() {
            if (this.isOne) return 280
            if (this.isTwoV) return 350
            if (this.isTwoH) return 170
            if (this.isThree) return 230
        },
        // 价格颜色
        favPriceColor() {
            return {
                'color': formatColor(this.config.favPriceColor)
            }
        },
        monthPayColor() {
            return {
                'color': formatColor(this.config.monthPayColor)
            }
        },
        monthPayTxt() {
            return this.config.monthPayTxt
        },
        // 普通按钮样式
        normalBtnStyle() {
            let { buttonColor, buttonTxtColor } = this.config
            return {
                'color': buttonTxtColor ? formatColor(buttonTxtColor) : '#fff',
                'background-color': buttonColor ? formatColor(buttonColor) : '#FF3E00'
            }
        },
        // 普通按钮文案
        normalBtnTxt() {
            return this.config.buttonTxt || '立即购买'
        },
        // 预售，价格体系，活动氛围配置对象
        extJsonObj() {
            return this.config.extJsonObj
        },
        // 开抢状态
        beginBuyStatusTxt() {
            return this.config.extJsonObj.beginBuyStatusTxt || '立即购买'
        },
        // 开抢样式
        beginBuyStyle() {
            let { beginBuyStatusTxtColor, beginBuyStatusTxtBgColor } = this.config.extJsonObj
            // 没有配置就用常规样式
            if (beginBuyStatusTxtColor) {
                return {
                    'color': formatColor(beginBuyStatusTxtColor),
                    'background-color': formatColor(beginBuyStatusTxtBgColor)
                }
            } else {
                return this.normalBtnStyle
            }
        },
        // 预热状态
        preHeatStatusTxt() {
            return this.config.extJsonObj.preHeatStatusTxt || 'HH:mm后开抢'
        },
        preHeatStyle() {
            let { preHeatStatusTxtBgColor, preHeatStatusTxtColor } = this.config.extJsonObj
            if (preHeatStatusTxtColor) {
                return {
                    'color': formatColor(preHeatStatusTxtColor),
                    'background-color': formatColor(preHeatStatusTxtBgColor)
                }
            } else {
                return {
                    'color': '#fff',
                    'background-color': '#41A964'
                }
            }
        },
        // 预售状态
        preSellStatusTxt() {
            return this.config.extJsonObj.preSellStatusTxt || '元预定'
        },
        presellStyle() {
            let { preSellStatusTxtColor, preSellStatusTxtBgColor } = this.config.extJsonObj

            // 兼容配置错误情况，返回普通按钮颜色
            if (preSellStatusTxtColor) {
                return {
                    'color': formatColor(preSellStatusTxtColor),
                    'background-color': formatColor(preSellStatusTxtBgColor)
                }
            } else {
                return this.normalBtnStyle
            }
        },
        // 预售前后购买状态
        buyStatusTxt() {
            return this.config.extJsonObj.buyStatusTxt || '立即购买'
        },
        buyStatusStyle() {
            let { buyStatusTxtBgColor, buyStatusTxtColor } = this.config.extJsonObj
            if (buyStatusTxtColor) {
                return {
                    'color': formatColor(buyStatusTxtColor),
                    'background-color': formatColor(buyStatusTxtBgColor)
                }
            } else {
                return this.normalBtnStyle
            }
        },
        // 售罄状态 通用
        stockoutTxt() {
            return this.config.extJsonObj.soldOutStatusTxt || '补货中'
        },
        stockoutStyle() {
            let { soldOutStatusTxtBgColor, soldOutStatusTxtColor } = this.config.extJsonObj
            if (soldOutStatusTxtColor) {
                return {
                    'color': formatColor(soldOutStatusTxtColor),
                    'background-color': formatColor(soldOutStatusTxtBgColor)
                }
            } else {
                return {
                    'color': '#fff',
                    'background-color': '#A1A1A1'
                }
            }
        }
    },
    methods: {
        // detailUrl(id) {
        //     return id ? ('/pages/mall/product/' + id) : 'javascript:;'
        // },
        showPrice(summary) {
            return +summary.showPrice === 1
        },
        gotoDetail(id) {
            if (window.aixuedai.isUavoApp === 'n') {
                window.location.href = id ? ('/pages/mall/product/' + id) : 'javascript:;'
            } else {
                let pageUrl = window.location.origin + '/pages/mall/product/' + id
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: pageUrl,
                        rootPage: 0
                    },
                    callback() { }
                })
            }
        },
        // 是否缺货,价格体系&&预售读取活动库存，其他读取真实库存
        isStockout({ activityTypeFormat, stock, summary: { totalAvail } }) {
            stock = parseInt(stock)
            totalAvail = parseInt(totalAvail)
            if (activityTypeFormat == 'discount_ing' || activityTypeFormat == 'discount_before' || activityTypeFormat == 'presale_ing') {
                return !isNaN(stock) && stock <= 0
            } else {
                return !isNaN(totalAvail) && totalAvail <= 0
            }
        },
        // 预售按钮状态
        formarPresaleBtnStyle({ activityTypeFormat }) {
            if (activityTypeFormat == 'presale_ing') {
                return this.presellStyle
            } else {
                return this.buyStatusStyle
            }
        },
        // 预售价格描述文案
        formatPresaleTxt({ activityTypeFormat, deposit }) {
            if (activityTypeFormat == 'presale_ing') {
                return formatNum(deposit) + this.preSellStatusTxt
            } else {
                return this.buyStatusTxt
            }
        },
        // 价格体系预告时间
        formatDiscountStarTimeTxt({ startTime }) {
            let finalString
            let parts = startTime.split(' ')
            let ymd = parts[0].split('-')
            let hms = parts[1].split(':')
            finalString = this.preHeatStatusTxt.replace(/MM/, ymd[1])
                .replace(/dd/, ymd[2])
                .replace(/hh/, hms[0])
                .replace(/mm/, hms[1])
                .replace(/ss/, hms[2])

            return finalString
        },
        // 处理展示价格
        filterPrice({ activityTypeFormat, discountPrice, presalePrice, summary }) {
            // 折扣开始前，折扣抢购中都是折扣价格
            if (activityTypeFormat == 'discount_ing' || activityTypeFormat == 'discount_before') {
                return formatNum(discountPrice)
            } else if (activityTypeFormat == 'presale_ing') { // 预售期间是预售价格
                return formatComplexMoney(presalePrice, 100)
            } else { // 其他情况都用常规价格
                return formatNum(summary.price)
            }
        },
        // 处理月供
        filterMonth({ activityTypeFormat, monthPay, summary }) {
            let money = 0
            // 折扣前，折扣抢购中，预售进行中用特殊月供字段
            if (activityTypeFormat == 'discount_ing' || activityTypeFormat == 'discount_before' || activityTypeFormat == 'presale_ing') {
                money = monthPay
            } else {
                money = summary.monthprice
            }
            return formatComplexMoney(money, 100)
        },
        // 预售场景，原售价变为原价
        filterOrigin({ activityTypeFormat, monthPay, summary }) {
            if (activityTypeFormat == 'presale_ing') {
                return formatNum(summary.price)
            } else {
                return formatNum(summary.originPrice)
            }
        },
        // 处理预售价格文案
        filterPresalePriceTxt(pro) {
            if (pro.activityTypeFormat == 'presale_ing') {
                return '预售价'
            } else {
                return this.favPriceTxt(pro)
            }
        },
        filterName({ shortName, summary }) {
            return shortName || summary.name
        },
        // 将px转化为rem
        computedSize(px) {
            // $px*320/$designWidth/20 + rem;
            return (px * 320 / 750 / 20) + 'rem'
        },
        cornerStyle(url) {
            if (!url) {
                return
            }
            if (url) {
                let widthAndHeight = formatImgWH(url)
                let backgroundImage = 'url(' + formatImg(url) + ')'
                let width
                let height

                if (widthAndHeight.length > 1) {
                    width = this.computedSize(widthAndHeight[0])
                    height = this.computedSize(widthAndHeight[1])

                    return {
                        width,
                        height,
                        backgroundImage
                    }
                } else {
                    return {
                        backgroundImage
                    }
                }
            }
        },
        btnStyle(pro) {
            // console.log(pro.activityType)
            // 缺货样式
            let stockout = this.isStockout(pro)
            if (stockout) {
                return this.stockoutStyle
            }

            let { activityTypeFormat } = pro
            // 常规
            if (activityTypeFormat === 'normal') {
                return this.normalBtnStyle
            }
            // 氛围
            if (activityTypeFormat === 'atmosphere') {
                return this.beginBuyStyle
            }
            // 折扣预热前，进行中，结束
            if (activityTypeFormat === 'discount_normal' || activityTypeFormat === 'discount_ing' || activityTypeFormat === 'discount_over') {
                return this.beginBuyStyle
            }
            // 折扣预热中
            if (activityTypeFormat === 'discount_before') {
                return this.preHeatStyle
            }
            // 预售中
            if (activityTypeFormat === 'presale_ing') {
                return this.presellStyle
            }
            // 预售结束可买
            if (activityTypeFormat === 'presale_over') {
                return this.buyStatusStyle
            }
        },
        btnTxt(pro) {
            let stockout = this.isStockout(pro)
            if (stockout) {
                return this.stockoutTxt
            }
            if (!this.showPrice(pro.summary)) {
                return '立即预约'
            }
            let { activityTypeFormat } = pro
            if (activityTypeFormat === 'normal') {
                return this.normalBtnTxt
            }
            if (activityTypeFormat === 'atmosphere') {
                return this.beginBuyStatusTxt
            }
            if (activityTypeFormat === 'discount_normal' || activityTypeFormat === 'discount_ing' || activityTypeFormat === 'discount_over') {
                return this.beginBuyStatusTxt
            }
            if (activityTypeFormat === 'discount_before') {
                return this.formatDiscountStarTimeTxt(pro)
            }
            if (activityTypeFormat === 'presale_ing') {
                return this.formatPresaleTxt(pro)
            }
            if (activityTypeFormat === 'presale_over') {
                return this.buyStatusTxt
            }
        },
        // 价格描述文案，例： 优惠价，处理预售场景之外的商品 预售特殊处理了不在这
        favPriceTxt({ activityType, activityTypeFormat }) {
            if (activityType === 'vip') {
                return '会员价'
            }
            return this.config.favPriceTxt
        },
        // 有角标并且不是一行四个的样式
        showCorner(pro) {
            return pro.summary.corner && this.blockType !== 'product_four'
        },
        showSeaAmoy(pro) {
            // 下发数据展示海淘&&模块可以展示海淘标签
            return (this.isOne || this.isTwoH) && pro.summary.isSeaAmoy === 'y'
        },
        monthsNum({ monthCount }) {
            return this.isOne ? monthCount + '期' : monthCount
        },
        // 一行一个，两个竖版，三个可展示券标志
        showCpIcon({ cpFlag }) {
            // console.log(this.isOne, this.isTwoV)
            if ((this.isOne || this.isTwoV || this.isThree) && cpFlag === 'y') return true
        },
        // 一行两个横版，普通和会员商品不展示购买按钮
        showBtn({ activityType }) {
            if ((activityType === 'vip' || activityType == 'normal') && this.isTwoH) return false
            return true
        },
        // 一行一个&&一行两个&&一行四个展示原价，其他情况不展示
        // 一行四个是VIP不展示原价
        showOriginPrice(pro) {
            if (this.config.priceRand.indexOf('origPrice') <= -1) return false
            if (!this.isOne && !this.isTwoV && !this.isFour) return false
            if (this.isFour && pro && pro.activityType === 'vip') return false
            return true
        },
        // 一行两个横向，vip和normal商品展示排序调换
        showProname({ activityType }) {
            return activityType == 'vip' || activityType == 'normal'
        }
    }
}

export { productMixin }
