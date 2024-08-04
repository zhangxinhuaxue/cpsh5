<!--
    Created dongyusi on 07/2018
-->
<template>
    <m-dialog ref="dialog" type="confirm" confirmBtn="继续获取" cancelBtn="放弃额度" @cancel="dialogCancel">
        <div>
            仅差一步，即可获得最高20000元额度，确定要放弃额度吗？
        </div>
    </m-dialog>
</template>
<script>
import { setHeader, resetHeader } from '../common/setHeader'
export default {
    name: 'credit-back-dialog',
    props: {
        backUrl: {
            type: String,
            default: ''
        }
    },
    mounted() {
        setHeader({
            leftbuttonAction: 'creditBasicBack'
        })
        window.creditBasicBack = () => {
            this.showDialogComp()
        }
    },
    methods: {
        showDialogComp() {
            this.$refs.dialog && this.$refs.dialog.show()
        },
        dialogCancel() {
            if (this.backUrl) {
                resetHeader(() => {
                    window.location.replace(this.backUrl)
                })
                return
            }
            axdApp.send({
                module: 'webview',
                method: 'close'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.page {
    background-color: #fff;
}

.title {
    padding: px2rem(34) px2rem(51) px2rem(80);
    h1 {
        font-size: px2rem(52);
    }
    p {
        color: $auiTextColorAssistant;
        font-size: $auiFontSizeLevel5;
    }
    b {
        color: $auiTextColorImportant;
    }
}

.mui-btn {
    margin-top: px2rem(30);
}
</style>
