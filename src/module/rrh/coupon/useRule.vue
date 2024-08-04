<template>
    <div class="container">
        <div class="rulePart">
            <p class="title">咨询服务费优惠券适用规则：</p>
            <p class="pb10">1、限招集令取现订单使用；</p>
            <p class="pb10">2、领取咨询服务费优惠券后，可在取现页面选择该优惠券使用，使用后咨询服务费按优惠券面值折扣减免，总计减免金额不超过优惠券设定的上限；</p>
            <p class="pb10">3、每笔取现订单限使用1张优惠券，且折扣券与现金券不可叠加使用；</p>
            <p class="pb10">4、优惠券仅限指定产品、金额、期数可用；</p>
            <p class="pb10">5、因网络原因，可能会存在优惠券延迟到账的情况，可稍后再查询，若因用户单方面原因（如账户被冻结，违规操作，过期未使用等）导致领取的优惠券无法使用的，平台将不再补发优惠券或延长优惠券使用期限；</p>
            <p class="pb10">6、在优惠券领取过程中，如用户出现违规行为（如恶意套取、刷单、作弊等）平台将取消领取资格并有权撤销违规交易，如给平台造成损失的，平台保留向违规用户追究法律责任的权力；</p>
            <p class="pb10">7、招集令平台在法律允许的范围之内对本活动拥有最终解释权。</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'couponRule',
    data() {
        return {
            couponObj: this.$route.query.couponItemObj
        }
    }
}
</script>
<style lang="scss">
body {
    background-color: #fff;
}
.container {
    .rulePart {
        background: #fff;
        font-size: px2rem(28);
        line-height: px2rem(42);
        padding: px2rem(20) px2rem(40) px2rem(80) px2rem(40);
        color: #666;
        .pb10 {
            padding-bottom: px2rem(10);
        }
        .title {
            font-size: px2rem(32);
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height: px2rem(45);
            padding: px2rem(40) 0 px2rem(20) 0;
        }
    }
}
</style>
