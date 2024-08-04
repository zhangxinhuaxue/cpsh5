<template>
    <div>
        <div v-for="(value,index) in info" :class="{active:value.currentPhase}">
            阶段{{index|indexDic}}{{value.payment|formatNum}}{{value.currentPhase?'(待付款)':''}}
            <p v-if="index===1" class="tips">
                {{showTips[0]|dateFormat(`MM月dd日hh:mm${showTips[1]}`)}}
            </p>
        </div>
    </div>
</template>
<script>
export default {

    name: 'presale-step',
    props: {
        info: [Object, Array]
    },
    filters: {
        indexDic(value) {
            return {
                0: '一:定金¥',
                1: '二:尾款¥'
            }[value]
        }
    },
    data() {
        return {}
    },
    computed: {
        showTips() {
            let { payStartTime, payEndTime, currentPhase } = this.info[1]
            if (currentPhase) {
                return [payEndTime, '前需支付完毕，超时订单关闭且无法退还定金']
            }
            return [payStartTime, '开始支付']
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
div {
    color: #222;
    font-size: px2rem(28);
}

.active {
    color: #ff6161;
    font-size: px2rem(32);
}

.tips {
    font-size: px2rem(24);
    color: #999;
    line-height: 1;
}
</style>
