<!--
    Created by hity on 05/19/17
-->
<template>
    <div v-if="shop.isShow" class="shop">
        <span class="shop__logo" :style="{backgroundImage: 'url(' + shop.logo + ')'}"></span>
        <div class="shop__desc">
            <p class="shop__desc--title">{{shop.name|limitString(20)}}</p>
            <p class="shop__desc--stock">总商品<span>{{shop.productTotal}}</span>件</p>
            <a v-if="!shop.isCollected" class="aui-btn_small shop__desc--collect toCollect" @click="collect()"><span class="icon-collect"></span>收藏</a>
            <a v-if="shop.isCollected" class="aui-btn_small shop__desc--collect" @click="collect()">已收藏</a>
        </div>
        <a class="aui-btn_small shop__go" :href="shopUrl">进店逛逛</a>
    </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
// import {
//     updateShopCollect,
//     updateAppShopCollect
// } from 'store/modules/trade/product'
import { collectShop } from 'store/modules/shop/index'
import {
    AXD
} from 'libs/util'
export default {
    computed: {
        ...mapState('trade/product', {
            shop: state => state.initData.shop,
            uid: state => state.initData.user.uid
        }),
        shopUrl() {
            return '/pages/shop/index/' + this.shop.id
        }
    },
    methods: {
        ...mapMutations('trade/product', [
            'updateInitData'
        ]),
        collect() {
            if (!this.uid) {
                AXD.util.login()
                return
            }
            collectShop({
                'shopId': this.shop.id,
                'add': !this.shop.isCollected
            }).then((data) => {
                data = data.ret || data
                if (data.success) {
                    this.updateInitData({
                        targetKey: 'shop',
                        isCollected: !this.shop.isCollected
                    })
                    if (!this.shop.isCollected) {
                        this.$_toast('已取消收藏')
                    } else {
                        this.$_toast('收藏成功，可在我的收藏中查看哦')
                    }
                } else {
                    if (data.code == '-1999') {
                        AXD.util.login()
                        return
                    }
                    this.$_toast(data.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.shop {
    @include flexbox();
    @include flexVert();
    height: px2rem(184);
    margin: px2rem(20) auto;
    padding: 0 px2rem(32);
    background-color: #fff;
    .shop__logo {
        display: block;
        width: px2rem(120);
        height: px2rem(120);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 100% auto;
    }
    .shop__desc {
        margin: 0 px2rem(20);
        width: px2rem(388);
        overflow: hidden;
        .shop__desc--title {
            font-size: $auiFontSizeLevel5;
            color: $auiTextColorImportant;
            line-height: 120%;
        }
        .shop__desc--stock {
            font-size: $auiFontSizeLevel7;
            color: $auiTextColorAssistant;
            line-height: 166.67%;
            span {
                color: #666;
            }
        }
        .shop__desc--collect {
            display: block;
            width: px2rem(110);
            color: #F99E00;
            border: 1px solid #F99E00;
            text-align: center;
            padding: 0;
            .icon-collect {
                padding-right: px2rem(2);
                font-size: px2rem(20);
                &::before {
                    font-size: px2rem(20);
                    color: #F99E00;
                    font-weight: 900;
                }
            }
        }
    }
    .shop__go {
        text-align: center;
        width: px2rem(140);
        padding: 0;
        color: $auiLinkColorDefault;
        border: 1px solid $auiLinkColorDefault;
    }
}
</style>
