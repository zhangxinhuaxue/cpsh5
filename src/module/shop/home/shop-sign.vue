<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="sign-cell" :style="backgroundImgUrl ? '' : 'backgroundColor: #f99e00'">
        <axd-share :config="shareConfig"></axd-share>
        <axd-image v-if="backgroundImgUrl" :src="backgroundImgUrl"></axd-image>
        <div class="sign-cell_opacity" :style="backgroundImgUrl ? '' : 'background: none'">
            <div class="sign-cell_l">
                <div class="shop_logo"><img :src="logoImgUrl"></div>
                <div class="shop_info">
                    <p class="name">{{ shopName }}</p>
                    <p class="total">总商品{{ productNum }}件</p>
                </div>
            </div>
            <div class="sign-cell_r">
                <div class="shop_collection">
                    <a class="fr" :class="favorited ? 'aui-btn_small' : 'aui-btn_small-bg'" @click="collectShop">{{ collectionText }}</a>
                    <p class="shop_collection-total">{{ favoriteNum }}次收藏</p>
                </div>
                <div class="shop_share" v-if="isApp" @click="share">
                    <p class="icon-share"></p>
                    <p>分享</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axdShare from 'components/share/index.vue'
import axdImage from 'components/image/index.vue'
import { AXD } from 'libs/util'
import { appShare } from 'libs/share'
import { collectShop } from 'store/modules/shop/index'
import { collectSpopMixin } from '../common/assets/collect-shop'
export default {
    name: 'sign',
    mixins: [collectSpopMixin],
    data() {
        return {
            shareDefault: {
                title: '这家店铺不错',
                img: 'https://img.aiyoumi.com/static/img/201709/27094341305.jpg'
            },
            isCollectDefault: null,
            isCollect: null
        }
    },
    computed: {
        collectionText() {
            if (this.favorited) {
                return '已收藏'
            } else {
                return '收藏'
            }
        },
        shareConfig() {
            let shareObj = {
                title: this.shareDefault.title,
                desc: '便宜有好货，都在[' + this.shopName + ']这家店~',
                url: window.location.href,
                img: this.shareDefault.img
            }
            return shareObj
        },
        // 联想外放分享提示不可用
        isLenovo() {
            return navigator.userAgent.toLowerCase().indexOf('com.subaxd.axd') > -1
        }
    },
    components: {
        axdImage,
        axdShare
    },
    methods: {
        share() {
            if (this.isLenovo) {
                this.axdToast('暂时无法分享')
                return
            }
            if (this.isApp) {
                appShare()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.fr {
    float: right;
}

.sign-cell {
    width: 100%;
    height: px2rem(228);
    position: relative;
    background-color: #fff;
    overflow: hidden;
    .sign-img {
        height: px2rem(228);
    }
    &_opacity {
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: px2rem(114) px2rem(32) 0;
    }
    &_l {
        float: left;
    }
    &_r {
        float: right;
        margin-top: px2rem(17);
    }
    .shop_logo {
        display: inline-block;
        vertical-align: top;
        width: px2rem(90);
        height: px2rem(90);
        overflow: hidden;
        background-color: #fff;
    }
    .shop_info {
        display: inline-block;
        vertical-align: top;
        color: #fff;
        .name {
            font-size: 0.68267rem;
            width: px2rem(330);
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .total {
            font-size: 0.512rem;
        }
    }
    .shop_collection {
        display: inline-block;
        vertical-align: top;
        font-size: px2rem(22);
        vertical-align: bottom;
        &-total {
            color: #fff;
            text-align: right;
            margin-top: px2rem(34);
        }
        .aui-btn_small-bg,
        .aui-btn_small {
            padding: 0 px2rem(22);
            height: px2rem(30);
            line-height: px2rem(30);
            font-size: px2rem(22);
            overflow: hidden;
        }
        .aui-btn_small {
            background-color: #fff;
            border: 1px solid $auiLineColorLight;
        }
    }
    .shop_share {
        display: inline-block;
        vertical-align: bottom;
        margin-left: px2rem(14);
        padding-left: px2rem(30);
        position: relative;
        &:before {
            content: '';
            position: absolute;
            height: px2rem(60);
            width: 1px;
            background-color: #fff;
            opacity: .5;
            left: 0;
            top: 0;
        }
        .icon-share {
            font-size: px2rem(32);
            padding-left: px2rem(4);
            &:before {
                color: #fff;
            }
        }
        p:nth-child(2) {
            font-size: px2rem(22);
            color: #fff;
        }
    }
}
</style>
