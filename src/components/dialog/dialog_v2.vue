<!--
    created by zhaozhisheng on 08/18/20174
    使用说明：
    <axd-dialog :showDialog="showDialog" :dialogInfo="dialogInfo" @mainClick="unBindCard" @subClick="showDialog = false">
        <template slot="content">
            // 自定义内容区域
        </template>
    </axd-dialog>
    参变量说明：
    showDialog：显示控制
    dialogInfo: {
        title: '验证码',         // 不传就不显示title部分
        singleBtn: false,        // 按钮是否只有一个，true一个，false两个
        btn: '好的',             // 主按钮文案，右边那个
        subBtn: '取消'           // 辅按钮文案，左边那个
    }
    @mainClick                   // 主按钮点击事件
    @subClick                    // 辅按钮点击事件
 -->
<template>
    <div v-show="showDialog" @touchmove.prevent>
        <div class="aui-mask"></div>
        <div class="aui-dialog">
            <div class="aui-dialog__hd" v-if="dialogInfo.title"><strong class="aui-dialog__title">{{dialogInfo.title}}</strong></div>
            <div class="aui-dialog__bd">
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
            this.$emit('subClick')
        },
        mainClick() {
            this.$emit('mainClick')
        }
    }
}
</script>
<style lang="scss">
.aui-dialog__ft {
    a {
        line-height: 2.13333rem;
    }
}
</style>
