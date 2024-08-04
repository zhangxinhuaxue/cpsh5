<template>
    <div class="inputbox">
        <input type="text" class="aui-input card-input" :placeholder="placeholder" :maxlength="cardSize" v-model="card" @input="typing">
    </div>
</template>
<script>
export default {
    name: 'idCardInput',
    props: {
        cardSize: {
            type: Number,
            default: 4
        }
    },
    data() {
        return {
            card: ''
        }
    },
    computed: {
        placeholder() {
            if (this.cardSize == 4) {
                return '请输入身份证后4位'
            } else {
                return '请输入身份证号码'
            }
        }
    },
    watch: {
        card(curVal) {
            let temp = curVal.replace(/\s/g, '').replace(/(^\w{6})(?=\w)/g, '$1 ').replace(/(\w{8})(?=\w)/g, '$1 ')
            this.card = temp
        }
    },
    methods: {
        typing() {
            this.$emit('focus')
            this.$emit('complete', this.card)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';
.inputbox {
    margin: px2rem(60) px2rem(50) 0;
    border: 1px solid #E4E4E4;
    background-color: #fff;
    .card-input {
        display: block;
        background: #fff;
        text-align: center;
        height: px2rem(110);
        padding: px2rem(15) 0;
        line-height: px2rem(80);
        font-size: px2rem(48);
    }
    ::-webkit-input-placeholder {
        /* WebKit browsers */
        font-size: $auiFontSizeLevel4;
    }
    :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        font-size: $auiFontSizeLevel4;
    }
    ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        font-size: $auiFontSizeLevel4;
    }
    :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        font-size: $auiFontSizeLevel4;
    }
}
</style>
