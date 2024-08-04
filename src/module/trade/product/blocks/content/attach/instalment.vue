<!--
    Created by hity on 05/19/17
-->
<template>
    <div class="aui-cell">
        <p class="instalment" @click="popup()">
            <span class="com-img-icon" :style="{ backgroundImage: 'url(' + instalment.thumbImg + ')'}"></span>
            {{instalment.txt|limitString(30)}}
            <span class="com-more-icon more"></span>
        </p>
    </div>
</template>
<script>
// import { mapState } from 'vuex'
import createPopup from 'src/module/trade/product/blocks/common/createPopup'

export default {
    mixins: [createPopup],
    props: {
        instalment: Object
    },
    data() {
        return {
            config: {
                title: '爱又米分期',
                type: 'instalment'
            }
        }
    }
    // computed: {
    //     ...mapState('trade', {
    //         instalment: state => state.product.initData.instalment
    //     })
    // }
}
</script>

<style lang="scss" scoped>
    @import 'src/style.scss';
    .instalment {
        @include flexbox();
        @include flexVert();
        font-size: $auiFontSizeLevel5;
        line-height: px2rem(96);
        color: $auiTextColorGeneral;
        width: 100%;
        height: px2rem(96);
        .com-img-icon {
            flex: none;
            display: inline-block;
            width: px2rem(112);
            height: px2rem(96);
            margin-right: px2rem(12);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% auto;
        }
    }
</style>
