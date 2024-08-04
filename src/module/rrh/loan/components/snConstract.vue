<!-- 抱米花对接苏宁金融， 贷款签约页面需要自动弹出合同内容， 合同需要强制阅读 -->
<template>
    <popup :isPop="show">
        <div class="container" slot="content">
            <div class="content">
                <iframe v-for="item in contract" class="iframe" frameborder="0" :src="item.viewUrl" :key="item.tempNo"></iframe>
            </div>
            <div class="bottom">
                <div class="tip">
                    <i :class="styleAgree" @click="isAgree = !isAgree"></i> 我已阅读并同意{{contractName}}
                </div>
                <m-button type="primary" :disabled="!allowConfirm" @click="confirm">{{btnInfo}}</m-button>
            </div>
        </div>
    </popup>
</template>
<script>
import popup from 'src/components/popup/index.vue'
export default {
    name: 'snConstract',
    props: {
        isShow: {
            type: Boolean,
            required: true,
            default: false
        },
        contract: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            show: false,
            allowConfirm: false,
            time: 3,
            isAgree: true,
            styleNode: null
        }
    },
    computed: {
        btnInfo() {
            return this.time ? `我已阅读完成并同意 (${this.time}s)` : '我已阅读完成并同意'
        },
        styleAgree() {
            return this.isAgree ? 'icon-agree' : 'icon-disagree'
        },
        contractName() {
            return this.contract.reduce((tal, item) => {
                tal.push('《' + item.tempName + '》')
                return tal
            }, []).join('、')
        }
    },
    mounted() {
        let styleNode = document.createElement('style')
        styleNode.type = 'text/css'
        styleNode.appendChild(document.createTextNode('.mui-toast {z-index: 1010}'))
        document.head.appendChild(this.styleNode = styleNode)
    },
    beforeDestory() {
        document.head.removeChild(this.styleNode)
    },
    watch: {
        isShow(newValue, oldValue) {
            if (newValue) {
                this.show = true
                this.time = 3
                this.allowConfirm = false
                let that = this
                let interval = setInterval(() => {
                    if (!--that.time) {
                        this.allowConfirm = true
                        clearInterval(interval)
                    }
                }, 1000)
            }
        }
    },
    components: {
        popup
    },
    methods: {
        confirm() {
            if (!this.allowConfirm) {
                return false
            }
            if (this.isAgree) {
                this.$emit('complete')
                this.show = false
            } else {
                this.$_toast('请同意并阅读相关协议')
            }
        }
    }
}
</script>
<style scoped lang="scss">
@import 'src/style.scss';
.content {
    max-height: px2rem(800);
    overflow-y: auto;
}
.iframe {
    width: 100%;
    height: px2rem(2000);
}
.icon-agree {
    vertical-align: middle;
    display: inline-block;
    width: px2rem(24);
    height: px2rem(24);
    @include img2x('../../styles/imgs/checked');
    background-size: 100%;
}
.icon-disagree {
    vertical-align: middle;
    display: inline-block;
    width: px2rem(24);
    height: px2rem(24);
    @include img2x('../../styles/imgs/dischecked');
    background-size: 100%;
}
body.aym {
    .icon-agree {
        @include img2x('../../styles/imgs_old/checked');
    }
}
.tip {
    line-height: px2rem(32);
    font-size: px2rem(24);
    margin: px2rem(30) px2rem(32) 0 px2rem(32);
}
::v-deep .mui-btn {
    margin: px2rem(32) 0 0;
    max-width: 100%;
}
</style>