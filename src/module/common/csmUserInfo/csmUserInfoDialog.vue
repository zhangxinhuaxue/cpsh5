<template>
    <div v-show="show">
        <div class="aui-mask"></div>
        <div class="aui-dialog">
            <div class="aui-dialog__bd">
                请先补充身份信息，以继续取现
            </div>
            <div class="aui-dialog__ft aui-dialog__ft-lineheight">
                <a href="javascript:;" class="aui-dialog__btn aui-dialog__btn_default" @click="cancel">
                    取消
                </a>
                <a href="javascript:;" class="aui-dialog__btn aui-dialog__btn_primary" @click="confirm" >
                    好的
                </a>
            </div>
        </div>
    </div>
</template>
<script>
import {
    saveAym
} from 'src/store/api'
export default {
    props: ['show'],
    methods: {
        cancel() {
            saveAym(`${this.$route.path}?btn=cancelSuppInfo`)
            this.$emit('close')
        },
        confirm() {
            saveAym(`${this.$route.path}?btn=suppInfo`)
            this.$emit('close')
            this.$router.push({
                path: this.$route.path + '/userInfoSupp'
            })
        }
    }

}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-dialog__bd:first-child{
    color: #666666;
    font-size: px2rem(28);
    line-height: px2rem(42);
    padding: px2rem(64) 0;
}
</style>
