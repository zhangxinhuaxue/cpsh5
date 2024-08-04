<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <div class="contact-moduel">
                <div class="shop-logo">
                    <img :src="logoImgUrl" />
                    <!-- <axd-image :src="logoImgUrl"></axd-image> -->
                </div>
                <h2 class="shop-name">{{shopName}}</h2>
                <p class="shop-pro-total">总商品{{productNum}}件</p>
                <a
                    href="javascript:;"
                    class="aui-btn_border collection-btn"
                    @click="collectShop"
                >{{collectionText}}</a>
                <div class="aui-cells">
                    <div class="aui-cell_auto align_top" v-if="desc">
                        <div class="aui-cell__hd">店铺介绍</div>
                        <div class="aui-cell__bd">
                            <p v-if="isSlice" class="desc">
                                {{desc | limitString(78)}}
                                <span
                                    v-if="isArrow"
                                    class="icon-arrow2 arrow_down"
                                    @click="changeDesc"
                                ></span>
                            </p>
                            <p v-else class="desc">
                                {{desc}}
                                <span class="icon-arrow2 arrow_up" @click="changeDesc"></span>
                            </p>
                        </div>
                    </div>
                    <div class="aui-cell_auto align_top">
                        <div class="aui-cell__hd">店铺名称</div>
                        <div class="aui-cell__bd">
                            <p class="eli-ofw">{{shopName}}</p>
                        </div>
                    </div>
                    <div class="aui-cell_auto align_top">
                        <div class="aui-cell__hd">店铺地址</div>
                        <div class="aui-cell__bd">
                            <p>{{address}}</p>
                        </div>
                    </div>
                    <div class="aui-cell_auto aui-cell_access" @click="telPhone(phone)">
                        <div class="aui-cell__hd">服务电话</div>
                        <div class="aui-cell__bd">
                            <p>{{phone}}</p>
                        </div>
                        <div class="aui-cell__ft"></div>
                    </div>
                    <div class="aui-cell_auto aui-cell_access" @click="goLicense">
                        <div class="aui-cell__hd">工商执照</div>
                        <div class="aui-cell__bd"></div>
                        <div class="aui-cell__ft"></div>
                    </div>
                    <div class="aui-cell_auto">
                        <a
                            href="javascript:;"
                            class="aui-btn aui-btn_primary mt20"
                            @click="openImFn"
                        >在线客服</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import axdImage from 'src/components/image/index.vue'
import { AXD } from 'libs/util'
import { collectSpopMixin } from '../common/assets/collect-shop'
import { getMerchantInfoByKey } from 'src/module/common/assets/im-info'
import { loadInit, openIm, newSobotIm } from 'src/libs/im'

export default {
    name: 'groupList',
    mixins: [collectSpopMixin],
    data() {
        return {
            barConfig: {
                reset: '',
                app: {
                    color: '#F7F7F7'
                },
                h5: {
                    color: '#f7f7f7'
                }
            },
            IMtype: 'callphone',
            isSlice: true,
            sdkParams: null,
            sobotUrl: ''
        }
    },
    computed: {
        phone() {
            return this.clientPhone || this.merchantPhone
        },
        collectionText() {
            if (this.favorited) {
                return '已收藏'
            } else {
                return '收藏'
            }
        },
        isArrow() {
            if (this.desc && this.desc.length > 38) {
                return true
            } else {
                return false
            }
        }
    },
    components: {
        hybridHeader,
        axdImage
    },
    created() {
        let me = this
        if (!this.shopId) {
            this.$router.go(-1)
        }
        this.preloadIm()
    },
    methods: {
        preloadIm() {
            if (!this.isApp) return

            // 嘉兴客服已废弃
            // loadInit(window, document, 'script', 'https://kfmcs.jiaxincloud.com/mcs.js', '_JIAXIN')

            // 获取智齿客服机器人URL
            newSobotIm(res => (this.sobotUrl = res))
        },
        // collectShop() {
        //     this.collectHandle(this.favorited)
        // },
        changeDesc() {
            this.isSlice = !this.isSlice
        },
        telPhone(phone) {
            window.location.href = 'tel:' + phone
        },
        goLicense() {
            if (!this.uid) {
                AXD.util.login()
                return false
            }
            this.$router.push({
                name: 'shopLicense',
                params: {
                    shopId: this.shopId
                }
            })
        },
        openImFn() {
            if (!this.isApp) {
                window.location.href = aixuedai.appDownloadUrl
                return
            }
            if (!this.uid) {
                AXD.util.login()
                return false
            }

            let params = {
                productId: '',
                merchantId: ''
            }
            // 打开客服
            // openIm(params)
            window.location.href = this.sobotUrl
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mt20 {
    margin-top: px2rem(20);
}
.contact-moduel {
    position: relative;
    margin: px2rem(80) px2rem(32) px2rem(28);
    background-color: #fff;
    @include border-radius(px2rem(16));
    padding: px2rem(120) 0 px2rem(20);
}

.shop-logo {
    width: px2rem(160);
    height: px2rem(160);
    overflow: hidden;
    @include border-radius(100%);
    position: absolute;
    top: px2rem(-80);
    left: 50%;
    margin-left: px2rem(-80);
}

.shop-name {
    font-size: $auiFontSizeLevel2;
    text-align: center;
    width: px2rem(500);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0 auto;
}

.shop-pro-total {
    text-align: center;
    font-size: $auiFontSizeLevel7;
    color: $auiTextColorAssistant;
}

.collection-btn {
    width: px2rem(222);
    margin: px2rem(12) auto 0;
    display: block;
    font-size: $auiFontSizeLevel5;
}
.eli-ofw {
    width: px2rem(395);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.aui-cells {
    padding: 0 px2rem(43) 0 px2rem(11);
    @include border-radius(px2rem(20));
    .aui-cell_auto {
        padding-right: 0;
    }
    .align_top {
        align-items: flex-start;
    }
    .aui-cell__hd {
        width: px2rem(206);
        color: $auiTextColorAssistant;
    }
    .desc {
        position: relative;
        span {
            transform: rotateZ(90deg);
            font-size: px2rem(24);
            position: absolute;
            right: 0;
            bottom: 0;
            &.arrow_down {
                transform: rotateZ(90deg);
            }
            &.arrow_up {
                transform: rotateZ(-90deg);
            }
        }
    }
}
</style>
