<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content" v-load-more="init">
            <div class="aui-cells" v-if="collectList.length">
                <div class="aui-cell_auto" v-for="item in collectList" :key="item.id">
                    <div class="aui-cell__hd">
                        <axdImage :src="item.logoImgUrl? item.logoImgUrl : 'https://img.aiyoumi.com/static/img/201709/27110458046.png'" lazyParents=".aui-content"></axdImage>
                    </div>
                    <div class="aui-cell__bd">
                        <p>{{item.name}}</p>
                        <p>{{item.productNum}}件商品</p>
                    </div>
                    <div class="aui-cell__ft">
                        <!-- <router-link :to="{name: 'shopHome', params: {shopId: item.id}}" class="aui-btn_small-bg">进入店铺</router-link> -->
                        <a class="aui-btn_small-bg" @click="goShopUrl(item.id)">进入店铺</a>
                    </div>
                </div>
            </div>
            <bottom-tips v-if="!hasNext"></bottom-tips>
            <div class="mt200" v-if="isEmpty">
                <shop-empty name="empty">
                    <p slot="title" class="page-empty_title">还没有收藏店铺哦</p>
                    <div slot="btns" class="page-empty_btns">
                        <a href="javascript:;" class="aui-btn_border" @click="goHome">去发现好店</a>
                    </div>
                </shop-empty>
            </div>
            <error-page v-if="isError"></error-page>
        </div>
    </div>
</template>
<script>
import axdImage from 'components/image/index.vue'
import shopEmpty from 'components/empty_ui/index.vue'
import errorPage from '../common/error-tips.vue'
import bottomTips from '../common/bottom-tips.vue'
import { getMyCollection } from 'store/modules/shop/index'
import { appDownloadUrl } from 'libs/util'
export default {
    name: 'myCollection',
    data() {
        return {
            barConfig: {},
            page: 1,
            size: 20,
            hasNext: true,
            collectList: [],
            isError: false,
            isEmpty: false,
            path: '/pages/shop/index/'
        }
    },
    components: {
        axdImage,
        // loadMore,
        shopEmpty,
        errorPage,
        bottomTips
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            if (!this.hasNext) {
                return false
            }
            let params = {
                page: this.page,
                size: this.size
            }
            getMyCollection(params).then((res) => {
                if (!res.success) {
                    this.isError = true
                    return false
                }
                if (!res.result || !res.result.totalCount) {
                    this.isEmpty = true
                    return false
                }
                let result = res.result
                this.collectList = [...this.collectList, ...result.result]
                this.hasNext = result.hasNext
                this.page = result.nextPage
            })
        },
        getMore() {
            this.init()
        },
        goShopUrl(id) {
            let pageUrl = window.location.origin + '/pages/shop/index/' + id
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: pageUrl,
                        rootPage: 0
                    },
                    callback() {}
                })
            } else {
                window.location.href = pageUrl
            }
        },
        goHome() {
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goPage',
                    params: {
                        page: 'root', // 原生页面标识
                        loginFirst: false, // 是否需要先登录再跳转
                        closeToRoot: true, // 返回（或者关闭）至首页
                        rootPage: 0 // 当需要返回至首页时标识具体的首页页面0:商城首页1:专题3:取现4:我的,
                    }
                })
            } else {
                window.location.href = appDownloadUrl
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mt200 {
    margin-top: px2rem(200);
}

.aui-cell__hd {
    margin-right: px2rem(28);
    width: px2rem(100);
    height: px2rem(100);
}

.aui-cell__bd p:first-child {
    font-size: $auiFontSizeLevel4;
}

.aui-cell__bd p:last-child {
    color: $auiTextColorAssistant;
}
</style>
