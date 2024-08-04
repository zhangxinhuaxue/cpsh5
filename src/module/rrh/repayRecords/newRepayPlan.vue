<template>
<div class="cart_page">
    <h3 class="planHead"><span :class="isCurrent ? 'on' : ''" @click="onRepayPart('repay')">剩余未还</span><span :class="isCurrent ? '' : 'on'"  @click="onRepayPart('repayed')">已还记录</span></h3>
    <div v-show="isCurrent">
        <m-cell-group>
            <m-cell size="xlarge" v-for="item in repayList" :key="item.id" @click="onChoose(item)">
                <template #title>
                    ¥{{item.amount | formatMoneyK}}<span class="tags" v-if="item.delay">逾期</span>
                    <p slot="subTitle" class="subtt">还款日：{{item.repayDate}}</p>
                </template>
                <template slot="icon">
                    <m-icon class="icon__check" :class="{ 'icon__check--active' : item.isCheck }" slot="value" :type="item.isCheck ? 'checkbox_checked' : 'checkbox_unchecked' "></m-icon>
                </template>
            </m-cell>
        </m-cell-group>
        <section class="cart_footer">
            <div class="pay-block">
                <div class="detail">
                    <m-icon @click="onCheckAll" class="icon__check vertical" :class="{ 'icon__check--active' : allChecked }" slot="value" :type="allChecked ? 'checkbox_checked' : 'checkbox_unchecked' "></m-icon>
                    <span class="vertical">全选</span>
                    <span class="vertical total">合计：<label>¥{{totalMoney | formatMoneyK}}</label></span>
                </div>
                <span :class="['btn-pay', {disabled: false}]" @click="payFn">还款</span>
            </div>
        </section>
    </div>
    <div v-show="!isCurrent">
        <m-cell-group v-if="repayedList.length">
            <m-cell size="xlarge" v-for="item in repayedList" :key="item.id">
                <template #title>
                    ¥{{item.amount | formatMoneyK}}<span class="tags" v-if="item.delay">逾期</span>
                    <p slot="subTitle" class="subtt">还款日：{{item.repayDate}}</p>
                </template>
            </m-cell>
        </m-cell-group>
        <empty v-show="emptyFlag" text="暂时没有数据哦"></empty>
    </div>
</div>
</template>
<script>
import empty from '../common/empty.vue'
import { repayTaskList, repayTask } from 'src/store/modules/rrh'
import { AXD, formatMoneyK, formatDateTime } from 'src/libs/util'
export default {
    name: 'newRepayPlan',
    components: {
        empty
    },
    filters: {
        formatMoneyK,
        formatDateTime
    },
    data() {
        return {
            isApp: aixuedai.isUavoApp == 'y',
            totalMoney: 0,
            emptyFlag: false,
            isCurrent: true,
            allChecked:false, // 是否全选
            isCheckArr:[], // 双向数据绑定的数组，我是用的id
            repayList: [],
            repayedList: []
        }
    },
    mounted () {
        this.getRepayTaskList()
    },
    methods: {
        getRepayTaskList() {
            repayTaskList({}).then(res => {
                if (res.success) {
                    if (res.result) {
                        this.repayedList = res.result.paidTaskList
                        this.repayList = res.result.unpayTaskList
                        console.log(res.result.unpayTaskList)
                        let len = this.repayList.length
                        let num = 0
                        this.repayList.forEach((item) => {
                            item.repayDate = formatDateTime(parseInt(item.repayDate), 'yyyy-MM-dd', '-')
                            if (item.delay) {
                                this.$set(item, 'isCheck', true)
                                this.totalMoney += Number(item.amount)
                            } else {
                                this.$set(item, 'isCheck', false)
                                num ++
                            }
                        })
                        this.repayedList.forEach((item) => {
                            item.repayDate = formatDateTime(parseInt(item.repayDate), 'yyyy-MM-dd', '-')
                        })
                        if (num === len) {
                            this.repayList[0].isCheck = true
                            this.totalMoney = Number(this.repayList[0].amount)
                        }

                        !this.repayedList.length && (this.emptyFlag = true)
                    }
                } else {
                    if (res.code === '-1999') {
                        AXD.util.login()
                    } else {
                        _t.$_toast(res.resultDes)
                    }
                }
            })
        },
        onRepayPart(type) {
            if (type === 'repay') {
                this.isCurrent = true
            } else {
                this.isCurrent = false
            }

        },
        callPayment(token, pms) {
            window.location.href = aixuedai.webCashUrl + '/h5cashier/repay?payInfo=' + encodeURIComponent(pms)
        },
        onCheckAll() {
            this.totalMoney = 0
            this.allChecked = !this.allChecked
            if (this.allChecked) {
                this.repayList.forEach((item) => {
                    item.isCheck = this.allChecked
                    this.totalMoney += Number(item.amount)
                })
            } else {
                this.totalMoney = 0
                this.repayList.forEach((item) => {
                    item.isCheck = this.allChecked
                })
            }
            this.onPush()
        },
        onPush() {
            this.isCheckArr = []
            // 选中的装进数组isCheckArr
            this.repayList.forEach((item) => {
                if (item.isCheck) {
                    this.isCheckArr.push(parseInt(item.id))
                }
            })
        },
        onChoose(item) {
            item.isCheck = !item.isCheck
            if (item.isCheck) {
                this.totalMoney += Number(item.amount)
            } else {
                this.totalMoney -= Number(item.amount)
                this.allChecked = false
            }
            this.onPush()

            console.log(this.isCheckArr.length + '========' + this.repayList.length)
            if (this.isCheckArr.length === this.repayList.length) {
                console.log('come')
                this.allChecked = true
            } else {
                this.allChecked = false
            }
        },
        payFn() {
            this.onPush()

            let _t = this
            if (_t.isCheckArr.length === 0) {
                _t.$_toast('请至少选择一笔账单进行还款')
                return false
            }

            console.log(_t.isCheckArr)
            repayTask({
                planIdList: _t.isCheckArr.join(',')
            }).then(res => {
                console.log(res)
                if (res.success) {
                    _t.callPayment(res.result.accessToken, res.result.parameters)
                } else {
                    if (res.code === '-1999') {
                        AXD.util.login()
                    } else {
                        _t.$_toast(res.resultDes)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.planHead {
    width: px2rem(750);
    height: px2rem(88);
    line-height: px2rem(88);
    background: #fff;;
    opacity: 1;
    span {
        width: px2rem(375);
        display: inline-block;
        text-align: center;
        font-size: px2rem(28);
        color: #666666;
        vertical-align: top;
        font-weight: 400;
    }
    .on {
        border-bottom: px2rem(4) solid #4286ff;
        font-size: px2rem(32);
        font-weight: 600;
        color: #333333;
    }
}
::v-deep .mui-cell_xlarge .mui-cell__hd_icon {
    width: px2rem(60);
    padding-top: px2rem(20);
}
.icon__check {
    color: #cccccc;
    font-size: px2rem(44);
    &--active {
        color: #4286FF;
    }
}
.vertical {
    vertical-align: middle;
}
.total {
    float: right;
    label {
        color: #FF3E00;
        font-size: px2rem(32);
    }
}
.tags {
    width: px2rem(82);
    height: px2rem(32);
    display: inline-block;
    text-align: center;
    line-height: px2rem(32);
    opacity: 1;
    background: #ff3e00;
    border-radius: px2rem(4);
    color: #fff;
    font-size: px2rem(22);
    margin-left: px2rem(24);
}
.subtt {
    color: #999;
    font-size: px2rem(24);
}
.cart_footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2rem(100);
    line-height: px2rem(100);
    z-index: 2;
    border-top: px2rem(1) solid #ccc;
}
.pay-block {
    background-color: #fff; // box-shadow: #ddd 0 0 px2rem(30);
    height: 100%;

    .detail {
        float: left;
        padding: 0 px2rem(32);
        width: px2rem(570);
        height: 100%;
        position: relative;

        span {
            font-size: px2rem(28);
            color: #222;
        }

        p {
            position: absolute;
            right: px2rem(32);
            top: 50%;
            transform: translateY(-50%);
            font-size: px2rem(28);
            line-height: 1.2;

            i {
                font-size: px2rem(32);
                color: #E31436;
            }

            em {
                display: block;
                font-size: px2rem(20);
                line-height: 1.6;
                color: #666;
                font-style: normal;
                text-align: right;
            }
        }
    }

    .btn-pay {
        float: right;
        width: px2rem(180);
        height: 100%;
        font-size: px2rem(32);
        line-height: px2rem(100);
        text-align: center;
        letter-spacing: px2rem(2);
        font-weight: 600;
        background-color: #4286FF;
        color: #fff;

        &.disabled {
            background-color: #f2f2f2;
            color: #ccc;
        }
    }
   body.aym {
        .icon-bg {
            float: right;
            width: px2rem(180);
            height: 100%;
            font-size: px2rem(32);
            line-height: px2rem(100);
            text-align: center;
            letter-spacing: px2rem(2);
            font-weight: 600;
            background-color: #FFE24D;
            color: #333;

            &.disabled {
                background-color: #f2f2f2;
                color: #ccc;
            }
        }
    }
    &.del {
        .detail {
            padding-left: px2rem(86);
            padding-top: 0;
            line-height: px2rem(100);

            span {
                display: block;
                font-size: px2rem(28);
                color: #222;
            }
        }

        .btn-pay {
            font-size: px2rem(32);
            color: #474747;
            background-color: #FFE352;
        }

        .icon-radio {
            height: 100%;
        }
    }
}
.mui-cells {
    padding-bottom: px2rem(124);
}
// .cart_page {
//     position: relative;
//     width: px2rem(750);
//     border: px2rem(1) solid #f2f2f2;
//     height: px2rem(60);
//     line-height: px2rem(60);
//     text-align: center;
//     width: px2rem(420);
//     margin-bottom: px2rem(30);
//     margin-top: px2rem(16);
// }
</style>
