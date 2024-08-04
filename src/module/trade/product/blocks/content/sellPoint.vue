<!--
    Created by hity on 05/15/17
-->
<template>
    <div class="quality-wrap">
        <ul class="quality" @click="popup()">
            <li v-for="item in sellPoint.slice(0, 4)">
                <span class="com-img-icon" :style="{ backgroundImage: 'url(' + item.defaultImg + ')'}"></span>
                {{item.name}}
            </li>
        </ul>
        <span class="com-more-icon more" @click="popup()"></span>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import createPopup from 'src/module/trade/product/blocks/common/createPopup'

export default {
    mixins: [createPopup],
    data() {
        return {
            config: {
                title: '服务',
                type: 'sellPoint'
            }
        }
    },
    computed: {
        ...mapState('trade', {
            sellPoint: state => state.product.initData.sellPoint,
            firstScreenDone: state => state.product.interactData.firstScreenDone
        })
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/style.scss';
    .quality-wrap {
        position: relative;
        height: px2rem(60);
        margin-left: px2rem(32);
        padding-right: px2rem(32);
        .quality {
            position: relative;
            @include flexbox();
            width: 100%;
            height: 100%;
            li {
                @include flexbox();
                flex: none;
                @include flexVert();
                margin-right: px2rem(36);
                font-size: $auiFontSizeLevel7;
                color: $auiTextColorGeneral;
                line-height: px2rem(60);
                height: px2rem(60);
                span {
                    flex: none;
                }
                .com-img-icon {
                    display: inline-block;
                    width: px2rem(22);
                    height: px2rem(60);
                    margin-right: px2rem(12);
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: 100% auto;
                }
            }
        }
        .com-more-icon {
            height: px2rem(60);
        }
    }
</style>
