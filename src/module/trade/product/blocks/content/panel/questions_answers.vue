<!--
    created by yangjun in May 18, 2017
-->
<template>
    <div class="panelQa panel__contentItem">
        <h3>购买须知</h3>
        <p class="panelQa__question">1. 活动通用规则</p>
        <p class="panelQa__answer">1.1. 活动发放的奖品或赠品不得折现；<br/>
            1.2.    在参加活动的过程中，如果出现非正常交易行为（包含但不限于违反活动规则、作弊领取、恶意套现、网络攻击、虚假交易、刷信誉等行为），招集令将取消用户的参与资格，并有权取消非正常交易，并保留追究法律责任的权利；<br/>
            1.3.    招集令将依法开展运营活动，如活动受不可抗力影响的，招集令有权暂停或终止活动，无需进行赔偿或补偿。不可抗力包括但不限于自然灾害、政府行为、网络异常或系统故障。<br/>
        </p>

        <p class="panelQa__question">2. 关于异常订单</p>
        <p class="panelQa__answer">活动期间，如有任何不正当或影响其他消费者公平参与机会的行为（包括但不限于使用他人身份信息或他人账户购物、非自用目的的购买行为、使用非真实信息购买以及机器批量操作等作弊行为），招集令均有权取消该类用户的活动资格，有权取消交易订单，并有权采取拒绝发货、追回货物、冻结账户、冻结账户资金等措施。如果根据相关判断条件判定：多笔订单为同一用户支付的情况，招集令平台有权关闭全部订单不予发货。<br/>
        （备注：招集令账号、手机号、手机终端、身份信息、收货详情，其中任意一项存在相同/相似，均视为同一用户）
        </p>

        <p class="panelQa__question">3. 关于签收事宜</p>
        <p class="panelQa__answer">3.1. 签收时请务必当着快递员的面验收货物，查看产品、赠品等是否完好及齐全，如放弃验货的，视为认可货物完好无损；<br/>
            3.2.    请您验货时注意仔细检查，若您查看时出现：货物有损坏、漏发、商品有划痕等情况，请将快递单上“签收”字样划去，签上“拒签”，写明原因给快递员带走即可。一旦签收，即代表您已经清点并确认了所有产品，包括随机配件和赠品，签收后招集令平台恕不受理事后提出的有关产品、配件、赠品的缺失以及外观损伤等问题，感谢您的理解和支持；<br/>
            3.3.    若遇到快递坚持要求您先签收后验货的情形，您签字之后先不要将快递单交付快递员，待拆包检查确认无误之后再将快递单交付快递员；<br/>
            3.4.    与您同住的家人或您授权的其他人代收的，视为您本人签收，您不得因非本人亲自签收而主张权利；<br/>
            3.5.    如果您未与招集令商城客服人员进行沟通及协调同意，出现拒签行为，您需承担商品的运费成本。拒签产生的退款退货订单，您需要把运费打款至招集令平台指定账号后，即可进行后续退款退货流程，请知悉。
        </p>

        <p class="panelQa__question">4. 关于7天无理由退换货</p>
        <p class="panelQa__answer">4.1. 有效期：7天无理由退换货的7天，是按照您物流签收起计算时间，满168小时为7天。例如您在6月1日12点整签收了商品，您最晚需在6月7日12点整前提交7天无理由退货申请，或最晚在6月15日12点整前联系售后客服协商换货申请，超出前述时限后则不能享受线上退换货服务，请您关注交易进程；<br/>
        4.2.    条件：7天无理由退货产品需要产品包装、附件等资料齐全且完好，不影响二次销售。例如：手机可以正常开关机（未激活），屏幕没有磨损或损坏，机身无损坏、划痕或进液行为等；无Rooting记录；说明书、三联贴（IMEI贴）、保修卡（务必保持空白）、手机盒内隔板、手机机身背面主机标贴、入网许可标识等均请保存完好，若您无法提供上述所有物件或上述物件破损，可能会导致退货失败。建议自签收产品次日起您将原包装及原包装内所有物料保留至少15天。任何情形下，一旦发生人为损坏则不支持退换货。
        </p>
        <br/>
        <br/>
    </div>
</template>

<script>
export default {
    name: 'qa'
}
</script>

<style lang="scss" scoped>
    @import 'src/style.scss';
    .panelQa {
        padding: px2rem(32);
        background-color: #fff;
        font-size: $auiFontSizeLevel7;
        &__question {
            color: $auiTextColorImportant;
            line-height: px2rem(80);
        }
        &__answer {
            color: $auiTextColorAssistant;
        }
    }
    h3 {
        text-align: center;
    }
</style>
