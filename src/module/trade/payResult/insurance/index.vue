<!--
   created by sunchunmei on Sep 14, 2018
   desc: 支付成功加借款人意外保险
 -->
<template>
    <div class="aui-cells">
        <div class="aui-cell aui-cell__insurance">
            <div><axd-image :src="insuranceImgUrl"></axd-image></div>
            <div class="aui-cell__insurance--tips">
                <h3 class="title">借款人意外伤害保险</h3>
                <p class="comment">您是否愿意为您所支付（¥{{ moneyForIns | money }}）分期金额购买一份意外保险？</p>
            </div>
        </div>
    </div>
</template>
<script>
import axdImage from 'components/image/index.vue'
export default {
    name: 'insurance',
    props: {
        moneyForIns: Number,
        gid: String
    },
    data() {
        return {
            insuranceImgUrl: require('./images/img-insurance.png')
        }
    },
    components: {
        axdImage
    },
    mounted() {
        console.log(this.gid)
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.aui-cells {
    margin-bottom: px2rem(20)
}
.aui-cell__insurance {
    height: auto;
    padding: 0;
}
.aui-cell__insurance--tips {
    padding: px2rem(30) 0 px2rem(20) px2rem(40);
    .title {
        font-size: $auiFontSizeLevel2;
        margin-bottom: px2rem(10);
    }
    .comment {
        color: $auiTextColorAssistant;
        font-size: $auiFontSizeLevel5;
        margin-bottom: px2rem(20)
    }
    .aui-btn_primary {
        width: px2rem(200);
        height: px2rem(60);
        line-height: px2rem(60);
        font-size: $auiFontSizeLevel6;
        float: left;
    }
}
</style>
