<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div ref="tab">
        <div :class="{'scroll_isfixed': isFixed}" :style="isFixed ? 'top:' + fixedTop + 'px' : ''">
            <ul class="aui-tab_main"  @click="selectTab($event)">
                <li v-for="(t, index) in tabs" :class="{'cur': index === tabCurIndex}" :key="'mainTab' + index"><span :data-index="index">{{t}}</span></li>
            </ul>
        </div>
        <ul class="aui-tab_main" v-if="isFixed">
            <li><span>&nbsp;</span></li>
        </ul>
    </div>
</template>
<script>
import { throttle } from '../common/assets/throttle'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('shop')
export default {
    name: 'tab',
    props: {
        tabIndex: Number
    },
    data() {
        return {
            fixedTop: 0,
            isFixed: false,
            tabs: ['首页', '全部', '上新']
            // tabCurIndex: 0
        }
    },
    computed: {
        ...mapState({
            tabCurIndex: state => state.mainTabIndex
        })
    },
    mounted() {
        if (this.tabCurIndex !== 1) {
            this.$nextTick(() => {
                this.scroll()
            })
        }
    },
    watch: {
        tabCurIndex(curVal) {
            if (curVal === 1) {
                this.isFixed = false
            }
        }
    },
    methods: {
        ...mapMutations([
            'saveMainTabIndex'
        ]),
        scroll() {
            let scrollBox = document.querySelector('.aui-content')
            let scrollBoxOffsetTop = scrollBox.offsetTop
            let tab = this.$refs.tab
            let tabOffsetTop = tab.offsetTop
            this.fixedTop = scrollBoxOffsetTop - 1
            this.isFixed = scrollBox.scrollTop >= tabOffsetTop

            scrollBox.addEventListener('scroll', throttle((e) => {
                this.isFixed = this.tabCurIndex !== 1 && e.target.scrollTop >= tabOffsetTop
            }, 100))
        },
        selectTab(event) {
            let target = event.target
            if (target.nodeName.toLowerCase() === 'span') {
                let i = ~~target.dataset.index
                // this.$emit('select', i)
                this.saveMainTabIndex(i)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';
.scroll_isfixed {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 11;
    transform: translate3d(0, 0, 0);
}

.aui-tab_main {
    @include flexbox();
    text-align: center;
    background-color: #fff;
    position: relative;
    font-size: $auiFontSizeLevel5;
    color: $auiTextColorGeneral;
    padding: 0 px2rem(20);
    color: $auiTextColorGeneral;
    overflow: hidden;
    &:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e4e4e4;
        -webkit-transform-origin: 100% 100%;
        transform-origin: 100% 100%;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
    }
    li {
        @include flex(1);
        cursor: pointer;
        span {
            display: inline-block;
            padding: px2rem(23) 0;
            border-bottom: px2rem(5) solid #fff;
            width: px2rem(120);
        }
        &.cur {
            span {
                border-bottom-color: #FFD72D;
                color: $auiTextColorImportant;
            }
        }
    }
    .text_indent {
        text-indent: -999em;
    }
}
</style>
