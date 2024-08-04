<template>
    <!-- 积分明细-获取&支出 -->
    <section class="points pointsDetail" ref="box">
        <div class="pointsDetail__content">
            <span @click="switchType" :class="{'selected': type===1}"><i>获得</i></span>
            <span @click="switchType" :class="{'selected': type===2}"><i>支出</i></span>
        </div>
        <dl v-for="list in outputList">
            <!-- 月份&当月获取/支出总积分数 -->
            <dt>
                <span>{{list.year}}年{{list.month}}月</span>
                <span>本月共{{type===1?'获得':'支出'}}{{list.score}}积分</span>
            </dt>
            <dd v-for="item in list.dayList">
                <div>
                    <p>{{item.description}}</p>
                    <p>{{item.createTime}}</p>
                </div>
                <span>{{item.score}}</span>
            </dd>
        </dl>
        <!-- 空提示 -->
        <div class="points__none points" v-show="noPoints">
            <p>当前暂无积分{{type===1?'获得':'支出'}}~</p>
            <p>先去积分中心逛逛吧</p>
        </div>
    </section>
</template>

<script>
/* global sessionStorage */
import { scoreList, scoreMonth } from 'store/modules/user-points'
import { AXD, isSupportSessionStorage } from 'src/libs/util'
import Vue from 'vue'
export default {
    name: 'pointsDetail',
    data() {
        return {
            type: 2, // 1表示获取，2表示支出
            start: 0, // 0为默认，以当前list最后一个对象的ID为下一次的起始值，不是按数量，note: 需注意!
            outputList: [], // 输出页面循环使用的list
            originList: [], // 初始list合集，未分月份
            noMore: false, // 停止懒加载
            moreLoading: false, // 请求中
            noPoints: false // 没有明细记录
        }
    },
    created() {
        window.onscroll = () => {}
        // 特殊处理，进来先把之前的缓存清空，因为用户很可能在退出这个页面之后做积分获取或消耗的动作，
        // 所以缓存必须局限在当前页面操作中使用
        sessionStorage.removeItem('up_pointsListzGet')
        sessionStorage.removeItem('up_pointsListPay')
        this.switchType()
    },
    methods: {
        init() {
            // 初始化获取积分记录
            scoreList({
                size: 20,
                type: this.type,
                lastId: this.start
            }).then(({success, result, code, resultDes}) => {
                this.moreLoading = false
                if (success) {
                    // 没有列表，展示空提示
                    if (!result.list || !result.list.length) {
                        this.noPoints = true
                        return
                    }
                    this.originList = [...this.originList, ...result.list]
                    // 大于20再做监听
                    if (result.total > 20) {
                        this.scrollEvent()
                    }
                    // 整合list，按月重新组合
                    this.traversalList()
                    // 如果list长度等于下发总长度，停止懒加载
                    if (this.originList.length >= result.total) {
                        this.noMore = true
                    }
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    // 错误的情况，直接停止懒加载
                    this.noMore = true
                }
            })
        },
        traversalList() {
            // 重置输出list
            this.outputList = []
            this.originList.forEach((item) => {
                let createTime = item.createTime.replace(/-/g, '/')
                let month = (new Date(createTime)).getMonth() + 1
                let year = (new Date(createTime)).getFullYear()
                let date = year + (month > 9 ? month.toString() : '0' + month)
                let oriIndex = this.outputList.findIndex((item) => {
                    return item.month === month && item.year === year
                })
                if (oriIndex !== -1) {
                    this.outputList[oriIndex].dayList.push(item)
                } else {
                    // 没有新建月份对象
                    this.outputList.push({
                        month,
                        year,
                        date,
                        score: 0,
                        dayList: [item]
                    })
                }
            })
            this.getMonthScore()
        },
        getMonthScore() {
            // 获取月份积分总数，参数=月份,月份,月份...
            let params = this.outputList.map(({date}) => {
                return date
            })
            params = params.join(',')
            scoreMonth({
                month: params,
                type: this.type
            }).then(({success, result, code, resultDes}) => {
                if (success) {
                    this.setMonthScore(result)
                } else {
                    if (code == 10001 || code == 10002) {
                        AXD.util.smsLogin()
                        return
                    }
                    this.$_toast(resultDes)
                }
            })
        },
        setMonthScore(list) {
            // 添加到outputList对应月份对象里
            this.outputList.forEach(item => {
                list.forEach(({month, total}) => {
                    if (item.date == month) {
                        item.score = total
                    }
                })
            })
            if (isSupportSessionStorage()) {
                this.saveData()
            }
        },
        saveData() {
            let name = this.type === 1 ? 'up_pointsListzGet' : 'up_pointsListPay'
            sessionStorage.setItem(name, JSON.stringify({
                originList: this.originList,
                outputList: this.outputList,
                noMore: this.noMore
            }))
        },
        switchType() {
            window.scrollTo(0, 0)
            // 切换列表，重置数据
            this.noPoints = false
            this.type = this.type === 1 ? 2 : 1
            let name = this.type === 1 ? 'up_pointsListzGet' : 'up_pointsListPay'
            let sessionData = JSON.parse(sessionStorage.getItem(name))
            this.noMore = false
            // 如果有数据，使用缓存数据
            if (sessionData) {
                let { originList, outputList, noMore } = sessionData
                this.originList = originList
                this.outputList = outputList
                this.start = originList.length
                this.moreLoading = false
                this.noMore = noMore
                if (!this.noMore) {
                    this.scrollEvent()
                }
            } else {
                // 没有重新请求
                this.start = 0
                this.originList = []
                this.outputList = []
                this.moreLoading = true
                this.init()
            }
        },
        scrollEvent() {
            window.onscroll = () => {
                let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100 && !this.moreLoading && !this.noMore) {
                    this.loadMore()
                }
            }
        },
        loadMore() {
            this.moreLoading = true
            let i = this.originList.length - 1
            this.start = this.originList[i].id
            this.init()
        }
    }
}
</script>

<style lang="scss">
.pointsDetail {
    padding-top: px2rem(100);
    &__content {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        line-height: px2rem(100);
        background-color: #fff;
        font-size: px2rem(32);
        color: #424243;
        display: flex;
        z-index: 1;
        span {
            flex: 1;
            text-align: center;
            i {
                display: inline-block;
                line-height: px2rem(98);
                font-style: normal;
            }
            &.selected {
                i {
                    border-bottom: px2rem(4) solid #4286FF;
                    font-weight: bold;
                }
            }
        }
    }
    dl {
        dt {
            display: flex;
            justify-content: space-between;
            font-size: px2rem(24);
            color: #717172;
            padding: 0 px2rem(32);
            line-height: px2rem(72);
        }
        dd {
            background-color: #fff;
            padding: px2rem(32);
            height: px2rem(144);
            display: flex;
            justify-content: space-between;
            p {
                font-size: px2rem(28);
                line-height: px2rem(36);
            }
            p:first-child {
                color: #424243;
                margin-bottom: px2rem(10);
            }
            p:last-child {
                color: #D0D0D0;
            }
            span {
                font-size: px2rem(32);
                color: #424243;
                line-height: px2rem(80);
            }
        }
    }
}
</style>

