<template>
    <a @click="gotoDetail">
        <span class="time-tip" :style="tipStyle">{{tipTxt}}</span>
        <div class="content">
            <span class="img-wid"><img :src="pro.productImg" class="J_lazyload"/></span>
            <div class="infos">
                <h3>{{pro.productName?pro.productName:"已下架"}}</h3>
                <p class="price">
                    <span class="s1" :style="priceTxtStyle">{{tabInfo.priceText}}</span>
                    <span class="s2" :style="{color: '#' + tabInfo.priceTextColor}"><i>¥</i>{{price}}</span>
                    <span class="s3" :style="{color: '#' + tabInfo.limitTextColor}">({{limitTxt}})</span>
                </p>
                <p class="origin-price">{{tabInfo.origPriceText}}:¥{{origPrice}}</p>
                <div class="buy-btn" :style="btnStyle">{{btnTxt}}</div>
            </div>
        </div>
    </a>
</template>

<script>
    import {formatColor, formatMoney} from 'src/libs/util'
    export default {
        name: 'tomorrow',
        data() {
            return {
                tipStyle: {
                    color: formatColor(this.tabInfo.beforeTextColor),
                    backgroundColor: formatColor(this.tabInfo.beforeTextBgColor)
                },
                tipTxt: '',
                btnStyle: {
                    color: formatColor(this.tabInfo.beforeBtnTextColor),
                    backgroundColor: formatColor(this.tabInfo.beforeBtnColor)
                },
                btnTxt: this.tabInfo.beforeBtnText,
                start: this.pro.startTime.replace(/\-/g, '\/'),
                url: '',
                priceTxtStyle: {
                    color: formatColor(this.tabInfo.priceTextColor),
                    borderColor: formatColor(this.tabInfo.priceTextColor)
                },
                limitTxt: this.tabInfo.limitText,
                price: formatMoney(this.pro.price),
                origPrice: formatMoney(this.pro.origPrice)
            }
        },
        props: {
            pro: {},
            tabInfo: {}
        },
        mounted: function() {
            if (this.tabInfo.beforeText.indexOf('HH') > -1) {
                // console.log(this.start)
                this.tipTxt = this.tabInfo.beforeText.split('HH')[0] + this.getHour(this.start) + this.tabInfo.beforeText.split('HH')[1]
                // console.log(this.start,this.getHour(this.start))
            } else {
                this.tipTxt = this.tabInfo.beforeText
            }
            this.btnStyle = {
                color: formatColor(this.tabInfo.beforeBtnTextColor),
                backgroundColor: formatColor(this.tabInfo.beforeBtnColor)
            }
            this.btnTxt = this.tabInfo.beforeBtnText
            if (this.pro.pid && this.pro.pid !== '') {
                this.url = '/pages/mall/product/' + this.pro.pid
            } else {
                this.url = 'javascript:;'
            }

            // 限制文案
            if (this.limitTxt.indexOf('KC') > -1) {
                this.limitTxt = this.tabInfo.limitText.split('KC')[0] + this.pro.limit + this.tabInfo.limitText.split('KC')[1]
            } else {
                var txt = '限量,件'
                this.limitTxt = txt.split(',')
            }
        },
        methods: {
            getHour(value) {
                return new Date(value).getHours()
            },
            gotoDetail() {
                if (this.url) {
                    let newUrl = window.location.origin + this.url
                    if (window.aixuedai.isUavoApp === 'n') {
                        window.location.href = newUrl
                    } else {
                        axdApp.send({
                            module: 'navigation',
                            method: 'goURL',
                            params: {
                                url: newUrl,
                                rootPage: 0
                            },
                            callback() {}
                        })
                    }
                }
            }
        }
    }
</script>
