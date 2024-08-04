<!--
    Created by hity on 05/15/17
-->
<template>
    <div class="sell">
        <ul>
            <li v-for="item in sellPoint">
                <dl>
                    <dt><span class="icon" :style="{backgroundImage: 'url(' + item.detailImg + ')'}"></span>{{item.name}}</dt>
                    <dd>{{item.detail}}</dd>
                </dl>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('trade/product', {
            sellPoint: state => state.initData.sellPoint
        })
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/style.scss';
    ul {
        padding: px2rem(8) px2rem(32);
    }
    li {
        margin-bottom: px2rem(40);
    }
    dt {
        height: px2rem(28);
        font-size: $auiFontSizeLevel5;
        line-height: 100%;
        color: $auiTextColorImportant;
        .icon{
            display: inline-block;
            vertical-align: top;
            width: px2rem(28);
            height: px2rem(28);
            margin-right: px2rem(10);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% auto;
        }
    }
    dd {
        font-size: $auiFontSizeLevel7;
        color: $auiTextColorGeneral;
        line-height: px2rem(30);
        padding: px2rem(10) 0 0 px2rem(38);
    }
</style>
