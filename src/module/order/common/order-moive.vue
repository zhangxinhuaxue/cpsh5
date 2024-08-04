<template>
    <div class="order-moive">
        <div class="aui-cols">
            <div class="aui-col-1 c-9">取电影票</div>
            <span class="real-price">{{moiveNum}}张</span>
        </div>
        <div v-if="moiveSms.length" class="moive__bd" :class="{'moive-end': isMoiveEnd}">
            <div v-for="(item, index) in moiveSms" :key="index">{{item.key}}<span>{{item.value | numFourReplace}}</span></div>
        </div>
    </div>
</template>
<script>
import { getTicketIssueQmm } from 'src/store/modules/order'
import { numFourReplace } from 'src/libs/util'
export default {
    name: 'moiveCode',
    props: {
        shop: Object,
        // systimeFunction: Function,
        systimeObj: Object
    },
    data() {
        return {
            isMoiveEnd: false,
            moiveEnd: 0,
            moiveNum: 0,
            extOrderId: '',
            moiveSms: []
        }
    },
    filters: {
        numFourReplace
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.handleSkuPropertiesName()
            this.getSystime()
            this.getTicketNum()
        },
        getTicketNum() {
            getTicketIssueQmm({orderId: this.extOrderId}).then((res) => {
                if (res.success && res.result) {
                    console.log('ad')
                    this.moiveSms = res.result.list
                }
            })
        },
        getSystime() {
            let systime = +new Date(this.systimeObj.serverTime)
            if (systime >= this.moiveEnd) {
                this.isMoiveEnd = true
            }
            // this.systimeFunction().then(res => {
            //     if (res.success) {
            //         let systime = +new Date(res.serverTime)
            //         if (systime >= this.moiveEnd) {
            //             this.isMoiveEnd = true
            //         }
            //     }
            // })
        },
        handleSkuPropertiesName() {
            let orders = this.shop.orders[0]
            let skuPropertiesName = orders.skuPropertiesName || ''
            let parseData = JSON.parse(skuPropertiesName)
            let moviePlayTime = parseData.moviePlayTime
            let time = moviePlayTime.split(' ')
            let date1 = time[0]
            let date2 = time[1].split('~')[1]
            let date = `${date1} ${date2}`
            this.extOrderId = orders.extOrderId
            this.moiveEnd = +new Date(date)
            this.moiveNum = parseData.number
            // let smsList = parseData.sms.split(' ')
            // let moiveSms = []
            // smsList.map((item) => {
            //     let obj = {}
            //     let list = item.split(':')
            //     obj.key = list[0]
            //     obj.val = list[1]
            //     moiveSms.push(obj)
            // })
            // this.moiveSms = moiveSms
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

.order-moive {
    position: relative;
    background-color: #fff;
    padding: px2rem(26) px2rem(32);
    font-size: $auiFontSizeLevel6;
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: px2rem(32);
        right: 0;
        height: 1px;
        background-color: #E4E4E4;
        margin: auto;
        @include onepxline();
    }
    .aui-col-1 {
        color: $auiTextColorImportant;
        font-size: px2rem(34);
        font-weight: 700;
    }
    .real-price {
        color: $auiTextColorGeneral;
        font-size: $auiFontSizeLevel6;
    }
}
.moive__bd {
    position: relative;
    width: px2rem(520);
    border: 1px solid #F2F2F2;
    border-radius: px2rem(6);
    margin: px2rem(50) auto;
    padding: px2rem(14) 0 px2rem(14) px2rem(132);
    color: $auiTextColorLight;
    line-height: px2rem(44);
    span {
        color: $auiTextColorAssistant;
        font-size: $auiFontSizeLevel3;
        vertical-align: middle;
        margin-left: px2rem(22);
    }
}
.moive-end::after {
    content: "";
    display: inline-block;
    width: px2rem(160);
    height: px2rem(160);
    @include img2x('../img/endshow');
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 50%;
    margin-top: px2rem(-78);
    right: px2rem(-41);
}
</style>
