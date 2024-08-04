<template>
    <div class="pwd-cell">
        <div class="title">
            <slot name="title"></slot>
        </div>
        <input-sixcode v-if="code" @focus="typing" @error="error" @complete="complete" :type="type"></input-sixcode>
        <input-card v-else :cardSize="cardSize" @focus="typing" @complete="complete"></input-card>
        <div class="text_box">
            <slot></slot>
        </div>
        <div class="error__tips">
            {{errorinfo}}
        </div>
    </div>
</template>
<script>
import inputSixcode from './six_code.vue'
import inputCard from './id_card.vue'

export default {
    name: 'aym_input',
    props: {
        code: {
            type: Boolean,
            default: true
        },
        cardSize: {
            type: Number,
            default: 4
        },
        type: {
            type: String
        },
        tips: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            errorinfo: ''
        }
    },
    components: {
        inputSixcode,
        inputCard
    },
    watch: {
        tips(to) {
            this.errorinfo = to
        }
    },
    methods: {
        typing() {
            if (this.errorinfo) {
                this.errorinfo = ''
            }
            this.$emit('focusInput')
        },
        error(data) {
            this.errorinfo = '输入有误，请重新输入'
        },
        complete(data) {
            this.$emit('complete', data)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';
.pwd-cell {
    padding: px2rem(40) 0 px2rem(40);
}
.error__tips {
    min-height: px2rem(50);
    text-align: center;
    margin-top: px2rem(50);
    font-size: px2rem(28);
    color: #FF3D43;
}

.title {
    color: $auiTextColorGeneral;
    font-size: $auiFontSizeLevel4;
    text-align: center;
    margin-top: px2rem(40);
}

.text_box {
    text-align: right;
    margin-right: px2rem(50);
    margin-top: px2rem(6);
    color: $auiLinkColorDefault;
    font-size: $auiFontSizeLevel6;
    a {
        color: $auiLinkColorDefault;
        font-size: $auiFontSizeLevel6;
    }
}
</style>
