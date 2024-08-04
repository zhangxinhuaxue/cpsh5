<!--
    created by Doris on 25/7/2017
 -->
<template>
    <modal :show="show">
        <div slot="content">{{dialogInfo.content}}</div>
        <div slot="buttons" class="aui-dialog__ft">
            <span class="aui-dialog__btn aui-dialog__btn_default" @click="subClick()">{{dialogInfo.subText}}</span>
            <span class="aui-dialog__btn aui-dialog__btn_primary" @click="mainClick()">{{dialogInfo.mainText}}</span>
        </div>
    </modal>
</template>
<script>
import modal from 'components/modal/index.vue'
export default {
    props: {
        dialogInfo: {
            type: Object
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    computed: {},
    components: {
        modal
    },
    mounted() {},
    methods: {
        subClick() {
            this.$emit('subClick')
        },
        mainClick() {
            this.$emit('mainClick', this.dialogInfo.type)
        }
    }
}
</script>
<style lang="scss">
</style>
