<template>
    <actionsheet :isPop="isPop" @complete="closePop">
        <div slot="title" v-if="list.title" class="aui-actionsheet__cell">{{list.title}}</div>
        <div slot="menu" v-for="(item, index) in list.list" :key="index" v-if="item.name" @click="choosePop(item, index)" :class="['aui-actionsheet__cell', {selected:selectIndex == index}]">{{item.name}}</div>
        <slot name="btn" v-if="isShowBtn">
            <div slot="btn">
                <a href="javascript:;" class="aui-actionsheet_default" @click="closePop">取消</a>
            </div>
        </slot>
    </actionsheet>
</template>
<script>
import actionsheet from './index.vue'
export default {
    props: {
        list: {
            type: Object,
            default: () => {
                return {
                    title: '',
                    list: []
                }
            },
            required: false
        },
        selectIndex: {
            default: -1,
            required: false
        },
        isPop: {
            type: Boolean,
            default: false,
            required: true
        },
        isShowBtn: {
            type: Boolean,
            default: false
        }
    },
    components: {
        actionsheet
    },
    data() {
        return {}
    },
    methods: {
        choosePop(item, index) {
            this.$emit('complete', item, index)
        },
        closePop() {
            this.$emit('complete')
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.selected {
    color: var(--auiTipsColor);
}

.selected::after {
    font-family: aui!important;
    content: "\e934";
    display: inline-block;
    position: absolute;
    right: px2rem(32);
    font-size: px2rem(26);
}
</style>
