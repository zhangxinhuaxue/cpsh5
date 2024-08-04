<template>
    <div class="inputbox">
        <input class="inputbox__real" ref="realInput" type="tel" pattern="[0-9]*" :maxlength="count" v-model="code">
        <div class="inputbox__view" @click="setInputFocus">
            <!-- 点点点 -->
            <div v-if=" type === 'dot' " v-for="(item,index) in count" class="inputbox__item" :class="{dot: codeArr[index]}">
            </div>
            <!-- 明文 -->
            <div v-if=" type === 'visible' " v-for="(item,index) in count" class="inputbox__item">
                {{code[index]}}
            </div>
        </div>
    </div>
</template>
<script>
export default {

    name: 'input_ui',
    props: {
        type: {
            type: String,
            default: 'dot'
        }
    },
    data() {
        return {
            code: '',
            count: 6
        }
    },
    computed: {
        codeArr() {
            let len = this.code.length
            return Array.from({
                length: len
            }, () => true)

            // return arr.fill(true) es6 fill not transcoded
        },
        codeLength() {
            return this.code.length
        }
    },
    watch: {
        codeLength(to, form) {
            this.$emit('focus')
            if (to === 6) {
                this.validCode()
            }
        }
    },
    methods: {
        setInputFocus() {
            let inputObj = this.$refs.realInput
            inputObj.focus()
            this.$emit('focus')
        },
        validCode() {
            // 验证输入的数值是否正确
            if (/^\d+$/g.test(this.code)) {
                this.$emit('complete', this.code)
            } else {
                this.$emit('error', this.code)
                // this.errorinfo = '输入错误，请重新输入'
                // this.code = ''
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';

.inputbox__real {
    float: left; // height: 1px;
    opacity: 0;
    text-indent: -999rem; // 隐藏input文字
    margin-left: -100%; // 隐藏input光标
    width: 200%; // 保留inputDOM在页面可视区域内
}

.inputbox {
    position: relative;
    width: 100%; // height: px2rem(165);
    margin: 0 auto;
    padding: px2rem(5);
    .inputbox__view {
        margin: 0 auto;
        text-align: center;
        .inputbox__item {
            display: inline-block;
            width: px2rem(110);
            height: px2rem(110);
            line-height: px2rem(110);
            vertical-align: middle;
            background: #fff;
            border: 1px solid #d8d8d8;
            margin-left: -1px;
            position: relative;
            &.dot {
                line-height: px2rem(110);
                &:before {
                    position: absolute;
                    content: '';
                    display: inline-block;
                    width: px2rem(18);
                    height: px2rem(18);
                    border-radius: 50%;
                    background-color: #000;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
}

</style>
