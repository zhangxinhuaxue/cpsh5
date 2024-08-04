<!--
    created by zhaozhisheng on 05/10/2017
 -->
<template>
    <div class="area_acmcode">
        <div class="aui-cells aui-cells_form" v-show="showInput">
            <div class="aui-cell">
                <div class="aui-cell__hd">
                    <label class="aui-label">推荐码</label>
                </div>
                <div class="aui-cell__bd">
                    <input @change="back" class="aui-input" type="tel" placeholder="若没有可不填写" v-model="acmCode">
                </div>
            </div>
        </div>
        <p class="btn_acm">
            <span @click="setRecmCode">
                {{recommandTip}}
            </span>
        </p>
    </div>
</template>
<script>
export default {
    props: {},
    data() {
        return {
            showInput: false,
            acmCode: ''
        }
    },
    computed: {
        recommandTip() {
            return this.showInput ? '不填推荐码' : '填写推荐码'
        }
    },
    components: {},
    mounted() {},
    methods: {
        back() {
            this.$emit('back', this.acmCode)
        },
        setRecmCode() {
            this.acmCode = ''
            if (this.showInput) {
                this.back()
            }
            this.showInput = !this.showInput
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.area_acmcode {
    position: relative;
    margin-bottom: px2rem(50);
}

.btn_acm {
    text-align: right;
    span {
        line-height: px2rem(70);
        font-size: $auiFontSizeLevel7;
        color: $auiLinkColorDefault;
        padding-right: px2rem(30);
    }
}
</style>
