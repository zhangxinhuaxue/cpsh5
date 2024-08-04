<template>
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-content">
                <div class="aui-cols status-tab aui-split_line">
                    <div class="aui-col-1" @click="changeStatus('')"><a :class="{'ac':searchStatus==''}" href="javascript:;">全部</a></div>
                    <div class="aui-col-1" @click="changeStatus('WAIT_BUYER_PAY')"><a :class="{'ac':searchStatus=='WAIT_BUYER_PAY'}" href="javascript:;">待付款</a></div>
                    <div class="aui-col-1" @click="changeStatus('WAIT_SELLER_SEND_GOODS')"><a :class="{'ac':searchStatus=='WAIT_SELLER_SEND_GOODS'}" href="javascript:;">待发货</a></div>
                    <div class="aui-col-1" @click="changeStatus('WAIT_BUYER_CONFIRM_GOODS')"><a :class="{'ac':searchStatus=='WAIT_BUYER_CONFIRM_GOODS'}" href="javascript:;">待收货</a></div>
                </div>
                <order v-if="groups.length" :groups="groups" :wholeDataDone="wholeDataDone" @refreshInit="refreshInit"></order>
                <order-empty v-else></order-empty>
            </div>
        </div>
    </div>
</template>
<script>
import { getOrderList } from 'src/store/modules/order'
import order from '../common/order-new.vue'
import orderEmpty from '../common/empty.vue'
import { AXD } from 'src/libs/util'
import throttle from 'lodash/throttle'
export default {
    name: 'keepAlive_goodsOrder',
    data() {
        let st = this.$route.query.status
        return {
            barConfig: {
                action: '', // 右侧按钮点击事件， 必须是window变量
                leftAction: '',
                h5: {},
                app: {
                    rightBtnShow: true,
                    leftbuttonAction: '',
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#000000', // #ff00000颜色 showType=TEXT
                        text: '' // 展示文字内容 showType=TEXT
                    }
                }
            },
            searchStatus: st === '1' ? 'WAIT_BUYER_PAY' : st === '2' ? 'WAIT_SELLER_SEND_GOODS' : st === '3' ? 'WAIT_BUYER_CONFIRM_GOODS' : '',
            start: 0,
            size: 5,
            groups: [],
            total: 0,
            wholeDataDone: false,
            listLoading: false,
            elem: window,
            getOrderListDebounced: null
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.hideAppBar()
        })
    },
    beforeMount() {
        this._getOrderList()
        this.$nextTick(() => {
            let elem = document.querySelector('.aui-content')
            this.elem = elem == null ? window : elem
            this.setFriendEventHandle()
        })
    },
    beforeDestroy() {
        this.elem.removeEventListener('scroll', this.moreList, false)
        this.elem.removeEventListener('touchmove', this.moreList, false)
    },
    components: {
        order,
        orderEmpty
    },
    methods: {
        refreshInit() {
            this.changeStatus(this.searchStatus, 'refresh')
        },
        // // 防抖 且首次执行
        // debounceStart(fn, delay, ctx) {
        //     let immediate = true
        //     let movement = null
        //     return function() {
        //         let args = arguments

        //         // 开关打开时，执行任务
        //         if (immediate) {
        //             fn.apply(ctx, args)
        //             immediate = false
        //         }
        //         // 清空上一次操作
        //         clearTimeout(movement)

        //         // 任务开关打开
        //         movement = setTimeout(function() {
        //             immediate = true
        //         }, delay)
        //     }
        // },

        setFriendEventHandle() {
            // this.getOrderListDebounced = this.debounceStart(this._getOrderList, 2000, this)
            // this.getOrderListDebounced = this._getOrderList

            // 瀑布流展示内容
            this.elem.addEventListener('scroll', this.moreList, false)
            this.elem.addEventListener('touchmove', this.moreList, false)
        },
        moreList: throttle(function() {
            if (this.wholeDataDone || this.friendsListLoading) {
                return
            }
            let targetElem = document.querySelector('.continue')
            if (!targetElem) {
                return
            }

            let offsetTop = this._getElementPosition(targetElem)
            let scrollTop = typeof this.elem.scrollTop == 'number' ? this.elem.scrollTop : this.elem.scrollY
            let windowHeight = window.innerHeight

            if (windowHeight + scrollTop > offsetTop) {
                // this.getOrderListDebounced()
                this._getOrderList()
            }
        }, 300),
        _getElementPosition(elem) {
            let y = 0
            while (elem != null) {
                y += elem.offsetTop
                elem = elem.offsetParent
            }
            return y
        },
        hideAppBar() {
            if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'configNavigationBar',
                    params: {
                        visible: false
                    },
                    callback: function(data) {
                        // window.location.href = 'zjl://WebView/hideCloseButton'
                    }
                })
            }
        },

        goCash() {
            this.$router.replace({
                name: 'orderCash'
            })
        },

        changeStatus(status, type) {
            if (status === this.searchStatus && type != 'refresh') {
                return
            }
            this.searchStatus = status || ''

            this.wholeDataDone = false
            this.listLoading = false
            this.start = 0
            this.groups = {}

            this._getOrderList()
        },

        _getOrderList() {
            this.listLoading = true
            getOrderList({ status: this.searchStatus, start: this.start, size: this.size }).then(({ code, success, resultDes, result }) => {
                if (code === '10010' || code === '-1999') {
                    AXD.util.login()
                    this.listLoading = false
                    return
                }
                if (!success) {
                    this.$_toast(resultDes)
                } else {
                    if (result && result.list && result.list.length > 0) {
                        if (!this.start) {
                            this.groups = result.list
                        } else {
                            this.groups = this.groups.concat(result.list)
                        }
                        this.start += this.size
                        this.total = result.total
                        if (this.start >= this.total) {
                            this.wholeDataDone = true
                        }
                    }
                }
                this.listLoading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

.aui-content {
    overflow-x: hidden;
}

.aui-navbar__tab {
    color: $auiTextColorGeneral;
    padding: 0 px2rem(4);
    margin: 0 px2rem(16);
    display: inline-block;

    &.ac {
        position: relative;
        color: #222;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: $auiColorPrimary;
        }
    }
}

.status-tab {
    height: px2rem(90);
    line-height: px2rem(90);
    background: #fff;

    .aui-col-1 {
        font-size: px2rem(28);
        text-align: center;

        a {
            display: inline-block;
            color: $auiTextColorGeneral;
            padding: 0 px2rem(8);

            &.ac {
                position: relative;
                color: #222;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: $auiColorPrimary;
                }
            }
        }
    }

    &.aui-split_line {
        &:after {
            top: auto;
            bottom: -2px;
        }
    }
}
</style>
