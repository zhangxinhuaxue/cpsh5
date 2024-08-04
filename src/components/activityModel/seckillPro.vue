<template>
    <a @click="gotoDetail">
        <span class="time-tip" :style="tipStyle">{{tipTxt}}</span>
        <div class="content">
            <span class="img-wid"><img :src="pro.productImg" class="J_lazyload"/></span>
            <div class="infos">
                <h3>{{pro.productName?pro.productName:"已下架"}}</h3>
                <p class="price">
                    <span class="s1" :style="priceTxtStyle">{{tabInfo.priceText}}</span>
                        <span class="s2" :style="{color: '#' + this.tabInfo.priceTextColor}"><i>¥</i>{{price}}</span>
                        <span class="s3" :style="{color: '#' + this.tabInfo.limitTextColor}">({{limitTxt[0]}}<i>{{pro.limit}}</i>{{limitTxt[1]}})</span>
                </p>
                <p class="origin-price">{{tabInfo.origPriceText}}:¥{{origPrice}}</p>
                <div class="buy-btn" :style="btnStyle">{{btnTxt}}</div>
            </div>
        </div>
    </a>
</template>

<script>
    import {formatColor, formatMoney} from 'src/libs/util'
    import {saveAym} from 'src/store/api'
    export default {
        name: 'seckillpro',
        data() {
            return {
                tomorrowTab: {},
                tipStyle: {},
                tipTxt: '',
                btnStyle: {},
                btnTxt: '',
                start: this.pro.startTime.replace(/\-/g, '\/'),
                end: this.pro.endTime.replace(/\-/g, '\/'),
                url: 'javascript:;',
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
            tabInfo: {},
            sysTime: ''
        },
        mounted: function() {
            // 提示条样式，文字 && 按钮样式，文字 && 跳转链接
            if (this.start < this.sysTime && this.end > this.sysTime) { // 秒杀中
                this.tipStyle = {
                    color: formatColor(this.tabInfo.ingTextColor),
                    backgroundColor: formatColor(this.tabInfo.ingTextBgColor)
                }
                this.tipTxt = this.tabInfo.ingText
                this.btnStyle = {
                    color: formatColor(this.tabInfo.ingBtnTextColor),
                    backgroundColor: formatColor(this.tabInfo.ingBtnColor)
                }
                this.btnTxt = this.tabInfo.ingBtnText
                this.url = '/pages/mall/product/' + this.pro.pid
            } else if (this.start > this.sysTime) { // 秒杀前
                this.tipStyle = {
                    color: formatColor(this.tabInfo.beforeTextColor),
                    backgroundColor: formatColor(this.tabInfo.beforeTextBgColor)
                }
                if (this.tabInfo.beforeText.indexOf('HHMMSS') > -1) {
                    var systemTime = +new Date(this.sysTime)
                    var subTime = new Date(systemTime) - (+new Date())
                    var startTime = +new Date(this.start)
                    this.countDown(startTime, subTime)
                } else {
                    this.tipTxt = this.tabInfo.beforeText
                }
                this.btnStyle = {
                    color: formatColor(this.tabInfo.beforeBtnTextColor),
                    backgroundColor: formatColor(this.tabInfo.beforeBtnColor)
                }
                this.btnTxt = this.tabInfo.beforeBtnText
                this.url = '/pages/mall/product/' + this.pro.pid
            } else if (this.end < this.sysTime) { // 秒杀结束
                this.tipStyle = {
                    color: formatColor(this.tabInfo.afterTextColor),
                    backgroundColor: formatColor(this.tabInfo.afterTextBgColor)
                }
                this.tipTxt = this.tabInfo.afterText
                this.btnStyle = {
                    color: formatColor(this.tabInfo.afterBtnTextColor),
                    backgroundColor: formatColor(this.tabInfo.afterBtnColor)
                }
                this.btnTxt = this.tabInfo.afterBtnText
                this.url = ''
            }

            // 限制文案
            if (this.limitTxt.indexOf('KC') > -1) {
                this.limitTxt = this.tabInfo.limitText.split('KC')
            } else {
                var txt = '限量,件'
                this.limitTxt = txt.split(',')
            }
        },
        methods: {
            countDown(endTime, subTime) {
                // console.log(endTime, subTime + " === seckill")
                var that = this
                // 加上系统时间 与当前时间差值
                var cDateTime = new Date(+new Date() + subTime)
                var tDateTime = new Date(endTime)
                var timeDiff = (tDateTime - cDateTime) / 1000

                // 倒计时结束
                if (timeDiff <= 0) {
                    return
                }
                var oneMin = 60
                var oneHour = 60 * 60
                var oneDay = 60 * 60 * 24
                var totalDay = this.getTwoNum(Math.floor(timeDiff / oneDay))
                var totalHour = this.getTwoNum(Math.floor((timeDiff - totalDay * oneDay) / oneHour))
                var totalMin = this.getTwoNum(Math.floor((timeDiff - totalDay * oneDay - totalHour * oneHour) / oneMin))
                var totalSec = this.getTwoNum(Math.floor((timeDiff - totalDay * oneDay - totalHour * oneHour - totalMin * oneMin)))
                var outStr = totalHour + ':' + totalMin + ':' + totalSec + ''

                this.tipTxt = outStr + this.tabInfo.beforeText.split('HHMMSS')[1]
                setTimeout(function() {
                    that.countDown(endTime, subTime)
                }, 1000)
            },
            getTwoNum(num) {
                return num < 10 ? '0' + num : num
            },
            getNewDate(date, fmt) {
                var o = {
                    'M+': date.getMonth() + 1, // 月份
                    'd+': date.getDate(), // 日
                    'h+': date.getHours(), // 小时
                    'm+': date.getMinutes(), // 分
                    's+': date.getSeconds(), // 秒
                    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
                    'S': date.getMilliseconds() // 毫秒
                }
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
                for (var k in o) {
                    if (new RegExp('(' + k + ')').test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
                    }
                }
                return fmt
            },
            gotoDetail() {
                if (this.url) {
                    let newUrl = window.location.origin + this.url
                    if (window.aixuedai.isUavoApp === 'n') {
                        window.location.href = newUrl
                    } else {
                        saveAym(encodeURIComponent(newUrl))
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
