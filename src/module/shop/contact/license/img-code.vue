<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div>
        <div class="img_code">
            <img :src="codeSrc"><a @click="setCode">换一换</a>
        </div>
        <div class="code-input">
            <input type="text" placeholder="请输入验证码" class="aui-input" maxlength="4" v-model.trim="code">
        </div>
        <a href="javascript:;" class="aui-btn aui-btn_primary" :class="{'aui-btn_disabled': !isClick}" @click="complate">完成</a>
    </div>
</template>
<script>
import { checkImgCode } from 'store/modules/shop/index'
export default {
    name: 'imgCode',
    data() {
        return {
            codeSrc: '',
            code: '',
            isClick: false

        }
    },
    watch: {
        code(val) {
            if (val.length > 0) {
                this.isClick = true
            } else {
                this.isClick = false
            }
        },
        codeSrc(val) {
            return val
        }
    },
    beforeMount() {
        this.setCode()
    },
    methods: {
        setCode() {
            this.codeSrc = '/shop/vcode?time=' + new Date().getTime()
            this.code = ''
        },
        complate() {
            if (!this.isClick) {
                return false
            }
            let code = this.code
            if (!/^[A-Za-z\d]{4}$/.test(code)) {
                this.axdToast('图形验证码输入不正确')
                return false
            }
            checkImgCode({ code }).then((res) => {
                if (res.success) {
                    this.$emit('complate', code)
                } else {
                    this.axdToast(res.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.img_code {
    text-align: center;
    margin-top: px2rem(115);
    img {
        width: px2rem(202);
        vertical-align: bottom;
        display: inline-block;
        @include border-radius(px2rem(12));
    }
    a {
        color: $auiLinkColorDefault;
        font-size: $auiFontSizeLevel5;
        vertical-align: bottom;
        margin-left: px2rem(20);
    }
}

.code-input {
    width: px2rem(502);
    margin: px2rem(110) auto px2rem(40);
    font-size: $auiFontSizeLevel5;
    border-bottom: 1px solid $auiLineColorLight;
    padding: px2rem(16) 0;
    input {
        text-align: center;
    }
}
</style>
