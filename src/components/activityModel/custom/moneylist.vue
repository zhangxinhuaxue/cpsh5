<!--累计赚钱列表-->
<template>
    <div class="list-money">
        <div>
            <span>¥ <b>{{sumAmount}}</b></span>
            <a v-on:click="getMoney">{{btnTxt}}<i></i></a>
        </div>

        <ul>
            <li v-for="(item, index) in dataList" :key="index">
                <time>{{item.time}}</time>
                <p>{{item.desc}}</p>
                <span>￥{{item.money}}</span>
            </li>
            <section v-if="showAll">
                <a href="/invite/record.html">查看全部</a>
            </section>
        </ul>
    </div>
</template>

<script>
import {AXD} from 'libs/util'
import {_post} from 'src/store/base'
import axdToast from 'components/toast/index'

export default {
    name: 'moneylist',
    data() {
        return {
            dataList: [],
            userId: 0,
            sumAmount: 0,
            remainAmount: 0,
            btnTxt: '提现',
            showAll: false,
            withdraw: '/invite/withdraw.html',
            getShareData: '/graduate/active/getShareData'
        }
    },
    beforeMount() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            // Get the money data
            let me = this
            _post(me.getShareData, {}, (data) => {
                data = data.ret || data
                if (data.success) {
                    data = data.result || data
                    if (data.userId) {
                        me.userId = data.userId
                    }
                    me.sumAmount = data.sumAmout
                    me.remainAmount = data.remainAmout

                    // Set the txt of money button
                    if (me.sumAmount >= 50) {
                        me.btnTxt = '￥' + me.remainAmount + '元可提现'
                    } else {
                        me.btnTxt = '提现'
                    }

                    // Hide the 'show all' button
                    if (me.sumAmount == 0) {
                        me.showAll = false
                    } else {
                        me.showAll = true
                    }

                    data.transferList = data.transferList || []
                    data.friendList = data.friendList || []

                    let listArr = data.transferList.concat(data.friendList)
                    let len = listArr.length
                    me.dataList = []
                    for (let i = 0; i < len; i++) {
                        me.dataList.push({
                            time: listArr[i].modifyTime.substring(0, listArr[i].modifyTime.indexOf(' ')),
                            money: listArr[i].amount / 1000,
                            desc: listArr[i].desc === undefined
                                ? listArr[i].amount / 1000 + '元打到了您的现金余额账户里'
                                : listArr[i].invitedPhone + listArr[i].desc
                        })
                    }
                } else {
                    axdToast(data.resultDes)
                }
            })
        },
        getMoney() {
            if (this.userId) {
                if (!this.sumAmount) {
                    axdToast('还没有赚到钱呐')
                    return
                }
                if (this.sumAmount < 50) {
                    axdToast('达到50元才能提现哦')
                    return
                }
                if (!this.remainAmount) {
                    window.location.href = 'zjl://go?page=cashwithdrawal&needback=true&needlogin=true'
                    return
                }

                _post(this.withdraw, {}, (data) => {
                    data = data.ret || data

                    if (data.success) {
                        axdToast('提现成功')
                        this.fetchData()

                        setTimeout(function() {
                            if (aixuedai.isUavoApp === 'y') {
                                window.location.href = 'zjl://go?page=cashwithdrawal&needback=true&needlogin=true'
                            } else {
                                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.aixuedai.axd'
                            }
                        }, 2000)
                    } else {
                        if (data.code == '-1999') {
                            AXD.util.login()
                        } else {
                            axdToast(data.resultDes)
                        }
                    }
                })
            } else {
                AXD.util.login()
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @import 'src/assets/styles/style.scss';
    $designWidth: 750;
    .list-money {
        width: px2rem(710);
        margin: px2rem(30) auto 0;
        overflow: hidden;
        border-radius: px2rem(30);
        background: url(data:image/png;base64,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) #fffaf4 no-repeat;
        background-position: center px2rem(20);
        background-size: 80%;

        ul {
            border-top: dashed 1px #fc6c01;
            margin-top: px2rem(40);
            padding-bottom: px2rem(40);

            li {
                position: relative;
                padding-left: px2rem(40);
            }
            time {
                font-size: px2rem(23);
                color: #fc6c01;
                font-weight: bold;
            }
            p {
                font-size: px2rem(20);
                color: #666;
            }
            span {
                font-size: px2rem(36);
                color: #fc6c01;
                position: absolute;
                right: px2rem(31);
                bottom: px2rem(10);
            }
        }

        div {
            position: relative;
            margin-top: px2rem(120);
            a {
                color: #ff583d;
                border: solid 1px #ff583d;
                border-radius: 15px;
                // width: px2rem(140);
                height: px2rem(50);
                line-height: px2rem(50);
                font-size: px2rem(26);
                background-position: 80% center;
                padding-left: px2rem(20);
                padding-right: px2rem(50);
                display: inline-block;
                position: absolute;
                right: px2rem(40);
                top: px2rem(10);
                i {
                    position: absolute;
                    right: px2rem(10);
                    top: px2rem(11);
                    width: px2rem(35);
                    height: px2rem(30);
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAOCAMAAAD+MweGAAAAgVBMVEX+/v3+mYj9vLL////9fWj9z8f+fWr8/fz8/v390sv+3Nf+ycD9cVn+/P79rJ7+b1n9koD95+L+xbr9l4X9z8b8yb/9xr79jHj8cFj7/P7939v82dP8npD9nI3+koH9iHP9gGr9alT+7ej+t7H8s6T7rqH7qJr9pZj8o5P8alH9ZU+7SXJjAAAAjklEQVQI103O2Q6DIBBA0amigBULRcB96d7+/wd2sNRwQni4CczAZSQk3xGtQGprjoExdnDQcEohoEIUDazzIeY+sL6S2OMNJRcQwVcn3vp/GGV40rQosSSV16u7/ZdKTpOUvNNXEQo/I4U7MPiV7IZDx16IFG1l25CxloGHxQ11nSG8vOcMSi9kly+y+wKw8gmqPsKKfAAAAABJRU5ErkJggg==) #fffaf4 no-repeat;
                }
            }
            span {
                color: #ff003c;
                display: inline-block;
                font-size: px2rem(26);
                padding-left: px2rem(40);
                b {
                    font-size: px2rem(50);
                }
            }
        }

        section a {
            display: block;
            text-align: center;
            text-decoration: underline !important;
            color: #333;
            font-size: px2rem(25);
            line-height: px2rem(50);
            margin-top: px2rem(20);
        }
    }
    .money-bg {
        position: relative;
        span {
            font-size: px2rem(30);
            color: #fe4747;
            position: absolute;
            bottom: 0;
            left: 26%;
        }
        b {
            font-size: px2rem(95);
            color: #fe4747;
        }
    }
</style>
