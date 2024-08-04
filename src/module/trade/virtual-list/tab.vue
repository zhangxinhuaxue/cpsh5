<!--
    Create by sunxj on 08/30/17
 -->
<template>
    <div id="virtualTab" ref="tab">
        <div :class="{'scroll_isfixed': isFixed}" :style="isFixed ? 'top:' + fixedTop + 'px' : ''">
            <ul class="virtual-sell_tab">
                <li v-for="(tab, index) in tabList" :class="{'cur': index === tabIndex}" @click="selectTab(index)">
                    <span>{{tab}}</span>
                </li>
            </ul>
        </div>
        <ul class="virtual-sell_tab text_indent" v-if="isFixed">
            <li>
                <span>端游充值</span>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'virtualTab',
    props: {
        tabList: Array,
        tabIndex: Number
    },
    data() {
        return {
            fixedTop: 0,
            isFixed: false
        }
    },
    activated() {
        this.scroll()
    },
    mounted() {
        this.$nextTick(() => {
            this.scroll()
        })
    },
    methods: {
        scroll() {
            let scrollBox = document.querySelector('.aui-content')
            let scrollBoxOffsetTop = scrollBox.offsetTop
            let tab = this.$refs.tab
            let tabOffsetTop = tab.offsetTop
            this.fixedTop = scrollBoxOffsetTop - 1
            if (scrollBox.scrollTop >= tabOffsetTop) {
                this.isFixed = true
            } else {
                this.isFixed = false
            }
            scrollBox.addEventListener('scroll', (e) => {
                if (e.target.scrollTop >= tabOffsetTop) {
                    this.isFixed = true
                } else {
                    this.isFixed = false
                }
            }, false)
        },
        selectTab(i) {
            this.$emit('select', i)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.scroll_isfixed {
    width: 100%;
    position: fixed;
    left: 0;
    z-index: 1;
}

.virtual-sell_tab {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    text-align: center;
    background-color: #fff;
    position: relative;
    font-size: $auiFontSizeLevel5;
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
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        span {
            display: inline-block;
            padding: px2rem(23) 0;
            border-bottom: px2rem(5) solid #fff;
        }
        &.cur {
            span {
                border-bottom-color: $auiTipsColor;
                color: $auiTipsColor;
            }
        }
    }
    .text_indent {
        text-indent: -999em;
    }
}
</style>
