<!--
    created by zhaozhisheng on 05/10/2017
 -->
<template>
    <div v-show="showDialog" @touchmove.prevent>
        <div class="aui-mask"></div>
        <div class="aui-dialog">
            <div class="aui-dialog__hd" v-if="dialogInfo.title"><strong class="aui-dialog__title">{{dialogInfo.title}}</strong></div>
            <div class="aui-dialog__bd">
                {{dialogInfo.content}}
                <slot name="content"></slot>
            </div>
            <div class="aui-dialog__ft">
                <a v-if="!dialogInfo.singleBtn" href="javascript:;" class="aui-dialog__btn aui-dialog__btn_default" @click="subClick">{{dialogInfo.subBtn | textFilter('sub')}}</a>
                <a href="javascript:;" class="aui-dialog__btn aui-dialog__btn_primary" @click="mainClick">{{dialogInfo.btn | textFilter('main')}}</a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        dialogInfo: {
            type: Object
        },
        showDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    filters: {
        textFilter(data, type) {
            if (type == 'main') {
                return data || '主操作'
            } else if (type == 'sub') {
                return data || '辅助操作'
            }
        }
    },
    computed: {},
    components: {},
    mounted() {},
    methods: {
        subClick() {
            this.$emit('subClick', 'subClick')
        },
        mainClick() {
            this.$emit('mainClick', 'mainClick')
        }
    }
}
</script>
