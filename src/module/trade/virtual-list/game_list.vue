<!--
    Create by sunxj on 08/30/17
 -->
<template>
    <div>
        <template v-if="!isEmpty">
            <h3 class="virtual-cell_title" ref="hot">热门推荐</h3>
            <div class="aui-cells">
                <router-link v-for="item in hotList" :to="{name: 'virtualDetail', params: {productId: item.productId}}" class="aui-cell_auto aui-cell_textoverflow" :key="item.productId">
                    <div class="aui-cell__hd cell-img_width"><img :src="item.imgThumb" alt=""></div>
                    <div class="aui-cell__bd">
                        <p><span class="virtual-title">{{item.name}}</span><span v-if="item.discount && item.discount != 100" class="aui-tag_bgcolor virtual-tag_red">
{{item.discount | formatNum(10)}}折</span></p>
                        <p class="virtual-desc">{{item.content}}</p>
                    </div>
                </router-link>
            </div>
            <template v-for="lists in gameList">
                <template v-for="(items, key) in lists">
                    <h3 class="virtual-cell_title" :ref="key" :key="key">{{key}}</h3>
                    <div class="aui-cells">
                        <router-link class="aui-cell aui-cell_textoverflow" v-for="t in items" :to="{name: 'virtualDetail', params: {productId: t.productId}}" :key="t.productId">
                            <div class="aui-cell__bd">
                                {{t.name}}
                            </div>
                        </router-link>
                    </div>
                </template>
            </template>
            <aside v-if="sideShow" class="virtual-side">
                <ul>
                    <li v-if="hotList.length" @click="goScroll('hot')" class="icon_stars">热门</li>
                    <template v-for="item in gameList">
                        <li v-for="(val, key) in item" @click="goScroll(key)">{{key}}</li>
                    </template>
                </ul>
            </aside>
        </template>
        <vir-empty v-else></vir-empty>
    </div>
</template>
<script>
import virEmpty from './empty.vue'
export default {
    name: 'gameList',
    props: {
        hotList: Array,
        gameList: Array,
        sideShow: Boolean
    },
    computed: {
        isEmpty() {
            if (this.hotList.length || this.gameList.length) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        goScroll(key) {
            let scrollBox = document.querySelector('.aui-content')
            let tab = document.getElementById('virtualTab')
            let tabOffsetTop = tab.offsetTop
            let tabH = tab.offsetHeight
            let title = this.$refs[key][0] ? this.$refs[key][0] : this.$refs[key]
            let titOffsetTop = title.offsetTop
            scrollBox.scrollTop = titOffsetTop - tabH + 1
        }
    },
    components: {
        virEmpty
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.virtual-side {
    position: fixed;
    bottom: px2rem(30);
    right: 0;
    background-color: transparent;
    padding: px2rem(10) 0;
    z-index: 10;
    ul {
        display: table-cell;
        font-size: px2rem(22);
        height: px2rem(800);
        width: px2rem(44);
        text-align: center;
        line-height: 1em;
        color: $auiTipsColor;
        vertical-align: middle;
        li {
            height: px2rem(30);
            line-height: px2rem(30);
        }
        .icon_stars {
            background: url('./img/xingxing@2x.png') no-repeat 0 0;
            width: px2rem(24);
            height: px2rem(24);
            background-size: 100% auto;
            margin-bottom: px2rem(6);
            text-indent: -999em;
            display: inline-block;
        }
    }
}

.virtual-cell_title {
    color: $auiTextColorAssistant;
    font-weight: normal;
    font-size: $auiFontSizeLevel7;
    line-height: 100%;
    padding-left: px2rem(32);
    padding-top: px2rem(30);
}
</style>
