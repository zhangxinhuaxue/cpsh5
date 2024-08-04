<template lang="html">
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-content">
                <ul class="logistics-list">
                    <li v-for="item of logisticsList">
                        <div class="item-hd">
                            <span class="logistics-name">{{item.companyName}}</span>
                            <span class="logistics-id">{{item.outId}}</span>
                            <span class="logistics-info" @click="goLogisticsDetail(item.logisticsId)">
                                共{{item.sumNum}}件商品
                                <span class="icon-arrow2"></span>
                            </span>
                        </div>
                        <div class="item-ft">
                            <ul class="product-list">
                                <li v-for="product of item.skuVoList">
                                    <img :src='formatImg(product.imgurl)' />
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import { getLogisticsList } from 'src/store/modules/order'
export default {
    data() {
        return {
            barConfig: {
                app: {
                    visible: false
                },
                h5: {
                    rightBtnShow: false,
                    enforce: true
                }
            },
            logisticsList: []
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            getLogisticsList({
                tid: this.$route.query.tid
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    this.logisticsList = result || []
                } else {
                    this.$_toast(resultDes)
                }
            })
        },
        goLogisticsDetail(logisticsId) {
            this.$router.push({
                path: '/pages/order/express',
                query: {
                    id: logisticsId
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.logistics-list {
    width: 100%;
    overflow: hidden;
    & > li {
        color: #999;
        background: #fff;
        margin-bottom: px2rem(20);
        .item-hd {
            padding: 0 px2rem(32);
            font-size: px2rem(26);
            margin-bottom: px2rem(34);
            padding-top: px2rem(25);
            .logistics-name {
                color: #ffb626;
                margin-right: px2rem(15);
            }
            .logistics-id {
                color: #222;
            }
            .logistics-info {
                position: relative;
                padding-right: px2rem(30);
                float: right;
                .icon-arrow2 {
                    position: absolute;
                    top: px2rem(-13);
                    right: px2rem(0);
                    &::before {
                        font-size: px2rem(20);
                        font-weight: normal;
                    }
                }
            }
        }
        .item-bd {
            padding: 0 px2rem(32);
            font-size: px2rem(26);
            line-height: px2rem(37);
            margin-bottom: px2rem(30);
        }
        .item-ft {
            position: relative;
            padding-left: px2rem(32);
            padding-top: px2rem(30);
            padding-bottom: px2rem(50);
            &::before {
                position: absolute;
                top: 0;
                left: px2rem(32);
                content: '';
                width: 100%;
                height: 1px;
                background-color: #e4e4e4;
                margin: auto;
                @include onepxline();
            }
        }
    }
}

.product-list {
    display: flex;
    width: 100%;
    overflow-x: scroll;
    li {
        border: 1px solid #e4e4e4;
        margin-right: px2rem(20);
    }
    img {
        width: px2rem(116);
        height: auto;
        max-height: px2rem(116);
    }
}
</style>
