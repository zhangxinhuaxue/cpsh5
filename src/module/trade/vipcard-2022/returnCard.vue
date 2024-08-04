<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <p class="title">可申请退款订单</p>
            <div v-if="orderInfo.orderId">      
                <div class="ordList">
                    <dl>
                        <dt><img :src="orderInfo.imgUrl" alt=""></dt>
                        <dd class="d1">
                            <p class="name">{{orderInfo.productName}}</p>
                            <p class="info">订单号：{{orderInfo.orderId}}</p>
                            <p class="info">下单时间：{{orderInfo.buyTime}}</p>
                        </dd>
                        <dd class="d2">
                            <span :class="colName">{{toStr(orderInfo.hasRefund)}}</span>
                        </dd>
                    </dl>
                </div>
                <p class="refresh" v-if="orderInfo.hasRefund === 2" @click="onRefresh(orderInfo.orderId)">刷新订单状态</p>
                <div class="btnBox" v-if="orderInfo.hasRefund === 0">
                    <span class="cancle" @click="onCancle">取消</span>
                    <span class="return" @click="onReturn">申请退款</span>
                </div>
            </div>
            <div class="nodata" v-else>当前暂无可退款订单！</div>
        </div>
    </div>
</template>
<script>
import { getOrderList, returnCard } from 'store/modules/trade/vipcard'
import { AXD } from 'src/libs/util'
export default {
    name: 'index',
    data() {
        return {
            barConfig: {
                action: 'close', // 右侧按钮点击事件， 必须是window变量
                app: {
                    leftbuttonVisible: false,
                    rightBtnShow: true,
                    rightBtn: 'close'
                }
            },
            orderInfo: {},
            returnMoney: 149,
            colName: 'col_red' // col_grey
        }
    },
    created() {
        this.getOrderInfo('')
        window.close = function() {
            if (this.isApp) {
                axdApp.close()
            }
        }
    },
    methods: {
        onRefresh(orderId) {
            this.getOrderInfo(orderId)
        },
        toStr(status) {
            switch (status) {
                case 0:
                    return ''
                    break;
                case 1:
                    return '已退款'
                    break;
                case 2:
                    return '退款中'
                    break;
                case 3:
                    return '退款失败'
            }
        },
        getOrderInfo(orderId) {
            getOrderList({ orderId }).then(res => {
                if (res.success) {
                    // this.orderInfo = {
                    //     buyTime: "2022-02-15 17:39:44",
                    //     hasRefund: 0,
                    //     id: 11,
                    //     imgUrl: "https://img.aiyoumi.com/cpsImg/4ade7df7322e0510b595802d2fb21a3f.png",
                    //     orderId: "202202151738261001499",
                    //     payMoney: 710,
                    //     productName: "会员年卡",
                    //     refundMoney: 706
                    // }
                    this.orderInfo = res.result
                    this.returnMoney = Math.floor((res.result.refundMoney / 1000) * 100) / 100
                    
                    if (this.orderInfo.hasRefund === 2) {
                        this.colName = 'col_red'
                    } else {
                        this.colName = 'col_grey'
                    }
                } else {
                    if (res.code === '-1999' || res.code === '-1997') {
                        AXD.util.login()
                    }
                }
            })
        },
        onCancle() {
            if (this.isApp) {
                axdApp.close()
            }
        },
        onReturn() {
            this.$_confirm({
                content: `该订单可退金额为${this.returnMoney}元，确认要申请退款`,
                confirmBtn: '确认',
                cancelBtn: '取消',
                onConfirm:()=>{
                    returnCard({ orderId: this.orderInfo.orderId }).then(res => {
                        if (res.success) {
                            this.$_toast(res.resultDes)
                        } else {
                            this.$_toast(res.resultDes)
                        }
                        this.getOrderInfo('')
                    })
                },
                onCancel:()=>{}
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.title {
    height: px2rem(86);
    line-height: px2rem(86);
    background: #FFFFFF;
    font-size: px2rem(28);
    padding: 0 px2rem(32);
    font-weight: 400;
    color: #222222;
    border-bottom: px2rem(1) solid #E4E4E4;
}
.nodata {
    padding: px2rem(50) 0;
    font-size: px2rem(28);
    text-align: center;
}
.ordList {
    height: px2rem(248);
    background: #fff;
    padding: px2rem(44) px2rem(32);
    img {
        width: px2rem(160);
        height: px2rem(160);
        display: inline-block;
        // border: px2rem(1) solid red;
    }
    dt, dd {
        display: inline-block;
        vertical-align: top;
    }
    dt {
        margin-right: px2rem(24);
    }
    .d1 {
        width: px2rem(400);
    }
    .d2 {
        width: px2rem(100);
        text-align: center;
        span {
            font-size: px2rem(24);
            padding-top: px2rem(64);
            display: inline-block;
        }
        .col_red {
            color: #FF3E00;
        }
        .col_grey {
            color: #999;
        }
        
    }
    
    .name {
        height: px2rem(40);
        font-size: px2rem(28);
        font-weight: 500;
        color: #222222;
        line-height: px2rem(40);
        margin: px2rem(20) 0 px2rem(12) 0;
    }
    .info {
        font-size: px2rem(24);
        font-weight: 400;
        color: #666666;
        line-height: px2rem(33);
    }
}
.refresh {
    font-size: px2rem(24);
    display: block;
    color: #4286FF;
    text-align: center;
    padding: px2rem(30) 0;
}
.btnBox{
    margin: px2rem(56) 0 0 0;
    text-align: center;
    span {
        display: inline-block;
        text-align: center;
        width: px2rem(327);
        height: px2rem(88);
        border-radius: px2rem(4);
        border: px2rem(1) solid #E6E6E6;
        font-size: px2rem(32);
        font-weight: 600;
        color: #333333;
        line-height: px2rem(88);
        margin-right: px2rem(32);
        vertical-align: middle;
    }
    .cancle {
        background: #FFFFFF;
    }
    .return {
        background: #4286FF;
        color: #fff;
        margin-right: px2rem(0);
    }
}
</style>

