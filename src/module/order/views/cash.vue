<template>
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-content">
                <m-tabbar
                    v-model="tabbarIndex"
                    :fixed="false"
                    class="tabbar"
                    @change="onIndexChange"
                >
                    <m-tabbar-item>
                        <span slot="label">全部</span>
                    </m-tabbar-item>
                    <m-tabbar-item>
                        <span slot="label">处理中</span>
                    </m-tabbar-item>
                    <m-tabbar-item>
                        <span slot="label">已放款</span>
                    </m-tabbar-item>
                    <m-tabbar-item>
                        <span slot="label">已还清</span>
                    </m-tabbar-item>
                </m-tabbar>
                <div class="order-list">
                    <div
                        v-for="(item,index) in activeList"
                        :key="tabbarIndex+'_'+index"
                        class="order-item"
                    >
                        <cashItem v-if="item.status != 0" :itemData="item" @click="toPageOrderDetail(item)">
                            <m-button
                                v-if="item.voucherFlag===1 || item.voucherFlag===4"
                                @click.stop="uploanVoucher(item.id)"
                                slot="ft"
                                type="plain"
                                size="middle"
                                class="order__ft_btn"
                            >上传消费凭证</m-button>
                        </cashItem>
                    </div>
                    <div v-if="activeItem.list.length===0" class="order-empty">
                        <div class="icon"></div>
                        <p>暂时还没有订单哦</p>
                    </div>
                    <template v-else>
                        <div class="loadding_foot_1" v-if="activeItem.hasNext" @click="getMoreData">
                            点击加载更多
                            <p class="loadding_bottom"></p>
                        </div>
                        <div class="loadding_foot" v-else>
                            已无更多
                            <p class="loadding_bottom"></p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { AXD } from 'src/libs/util'
import { cashOrderList } from 'src/store/modules/order'
import { Tabbar as mTabbar, TabbarItem as mTabbarItem } from '@fe/buss-ui'
import cashItem from '../common/cash-item.vue'

export default {
    name: 'keepAlive_cashOrder',
    data() {
        return {
            tabbarIndex: 0,
            source: this.$route.query.source,
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
            all: {
                list: [],
                page: 0,
                hasNext: true
            },
            handing: {
                list: [],
                page: 0,
                hasNext: true
            },
            loaned: {
                list: [],
                page: 0,
                hasNext: true
            },
            payed: {
                list: [],
                page: 0,
                hasNext: true
            },
            start: 1,
            loadding: 0 // 0 加载中 1.加载完毕 2 已无更多
        }
    },
    computed: {
        activeType() {
            return {
                0: 'all',
                1: 'handing',
                2: 'loaned',
                3: 'payed'
            }[this.tabbarIndex]
        },
        activeItem() {
            return this[this.activeType]
        },
        activeList() {
            return this[this.activeType]['list']
        }
    },
    components: {
        cashItem,
        // mIcon,
        // mButton,
        mTabbar,
        mTabbarItem
    },
    mounted() {
        this.getData()
    },
    methods: {
        onIndexChange(newIndex, oldIndex) {
            if (this.activeList.length) {
                return
            }
            this.getData()
        },
        getData() {
            // pageSize  startIndex statusType
            // all-所有，handing-处理中，payed-已还清，loaned-已放款
            cashOrderList({
                pageSize: 30,
                startIndex: this.activeItem.page,
                statusType: this.activeType
            }).then(res => {
                if (res.success) {
                    let resList = (res.result && res.result.list) || []
                    this.activeItem.list = this.activeItem.list.concat(resList)
                    if (res.result.total <= this.activeItem.list.length) {
                        this.activeItem.hasNext = false
                    }
                    return
                }
                if (res.code === '10010' || res.code === '-1999') {
                    AXD.util.login()
                    return
                }
                this.$_toast(res.resultDes)
            })
        },
        getMoreData() {
            this[this.activeType].page += 1
            this.getData()
        },
        // loaddingDate() {
        // this.initList()
        // },
        toPageOrderDetail(e) {
            this.$router.push({
                name: 'cashDetailNormal',
                query: {
                    loanId: e.orderId,
                    type: e.oidBiz
                }
            })
        },
        goGoods() {
            this.$router.replace({
                name: 'orderGoods'
            })
        },
        submitOrder(order) {
            if (this.isApp) {
                window.location.href = order.toUrl
            } else {
                this.$_toast({
                    txt: '请下载招集令app完成后续认证',
                    callback() {
                        window.location.href = aixuedai.appDownloadUrl
                    }
                })
            }
        },
        // 上传消费凭证
        uploanVoucher(loanId) {
            this.$router.push({
                name: 'voucher',
                query: {
                    type: 'edit',
                    loanId
                }
            })
        },
        // 查看消费凭证
        viewVoucher(loanId) {
            this.$router.push({
                name: 'voucher',
                query: {
                    type: 'view',
                    loanId
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

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
            bottom: 0px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: $auiColorPrimary;
        }
    }
}

.order-list {
    font-size: px2rem(26);
    padding: px2rem(30) px2rem(32) 0;

    .order-item {
        margin-bottom: px2rem(30);

        .hd {
            padding: 0 px2rem(20);
            line-height: px2rem(70);
            background: #ebebeb;
            border-radius: 6px 6px 0 0;
        }

        .bd {
            background: #fff;
            padding: 0 px2rem(20);
            border-radius: 0 0 6px 6px;

            .item {
                padding: px2rem(40) 0;
                color: #222;

                .preview {
                    width: px2rem(127);
                    height: px2rem(127);
                    margin-right: px2rem(32);
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: px2rem(60);

                    &.youzidai {
                        background-image: url('../img/youzidai.png');
                    }

                    &.succ {
                        background-image: url('../img/succ.png');
                    }

                    &.loan {
                        background-image: url('../img/qudianhua.png');
                    }

                    &.gradloan {
                        background-image: url('../img/biyejin.png');
                    }

                    &.miniloan {
                        background-image: url('../img/duandai.png');
                    }
                }

                .price {
                    margin-left: px2rem(48);
                }
            }

            .action {
                padding: px2rem(30) 0;

                .aui-btn_small-bg {
                    line-height: px2rem(50);
                    font-size: px2rem(28);
                    height: px2rem(50);
                    padding: 0 px2rem(28);
                    margin-left: px2rem(15);
                    min-width: px2rem(170);
                    text-align: center;

                    &.weaken {
                        border: 1px solid #999;
                        background: #fff;
                        color: #999;
                    }
                }
            }
        }
    }

    .loadding_foot {
        color: #cccccc;
        text-align: center;
        height: px2rem(90);
        padding: px2rem(14) px2rem(28);
        font-size: px2rem(28);
    }

    .loadding_foot_1 {
        color: #222;
        height: px2rem(90);
        text-align: center;
        padding: px2rem(14) px2rem(28);
        font-size: px2rem(28);
    }
}

.icon_route {
    position: relative;
    top: px2rem(15);
    width: px2rem(114);
    height: px2rem(40);
    @include img2x('../img/tag');
    background-size: 100% 100%;
}

.order-empty {
    padding-top: px2rem(200);
    text-align: center;

    .icon {
        display: inline-block;
        width: px2rem(190);
        height: px2rem(200);
        background: url('../img/empty.png') no-repeat;
        background-size: 100% 100%;
    }

    p {
        padding: px2rem(14) 0 px2rem(36);
        line-height: px2rem(42);
        color: $auiTextColorAssistant;
        font-size: px2rem(28);
    }
}

/*tabbar*/
::v-deep .m-tabbar {
    line-height: px2rem(96);
    padding: 0 px2rem(32);
    color: #717172;

    .m-tabbar__label {
        font-size: px2rem(28);
    }

    .m-tabbar__item_on {
        color: #424243;
        font-weight: bold;

        span {
            display: inline-block;
            padding: 0 px2rem(12);
            border-bottom: px2rem(4) solid #ffe352;
        }
    }
}
</style>
