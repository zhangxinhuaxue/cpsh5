<template>
    <div class="aui-page">
        <div class="aui-content">
            <span :class="currentData.className" class="res-icon"></span>
            <div class="res-title">{{currentData.title}}</div>
            <a :href="jumpUrl" class="aui-btn aui-btn_primary" :class="{'aui-btn_disabled':disable}">{{btnText}}</a>
        </div>
    </div>
</template>
<script type="text/javascript">
import {
    getChsiResult
} from 'src/store/modules/common/credit'
import { isSupportLocalStorage } from 'libs/util'
export default {
    name: 'chsiResult',
    data() {
        return {
            jumpUrl: 'javascript:;',
            resultType: 1,
            disable: true,
            btnCount: 5,
            0: {
                className: 'icon-fail',
                title: '身份验证未通过'
            },
            1: {
                className: 'icon-success',
                title: '验证成功'
            }
        }
    },
    computed: {
        currentData() {
            return this[this.resultType] || {}
        },
        btnText() {
            return `返回${this.btnCount > 0 ? `（${this.btnCount}）` : ''}`
        }
    },
    mounted() {
        window.sessionStorage.removeItem('goChsi')
        this.init()
    },
    methods: {
        init() {
            getChsiResult(this.$route.query).then((res) => {
                if (res.success) {
                    this.resultType = res.result.type
                    this.jumpUrl = res.result.backUrl
                    if (!this.jumpUrl) {
                        return
                    }
                    this.disable = false
                    let timer = setInterval(() => {
                        if (this.btnCount > 0) {
                            this.btnCount--
                        } else {
                            clearInterval(timer)
                            window.location.href = res.result.backUrl
                        }
                    }, 1000)
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        }
    }

}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-content {
    bottom: auto;
    margin-top: px2rem(20);
    padding: px2rem(80) 0 px2rem(60);
    background-color: #fff;
    text-align: center;
}

.res-icon {
    display: block;
    margin: 0 auto px2rem(30);
    font-size: px2rem(120); 
}

.res-title {
    margin-bottom: px2rem(48);
    font-size: $auiFontSizeLevel2;
    color: $auiTextColorImportant;
    line-height: px2rem(34);
}
</style>
