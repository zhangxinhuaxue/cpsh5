<!--
* @Author   dongyusi
* @DateTime 2017-12-25
* @Description 刷脸失败结果页
-->
<template>
    <div class="aui-page">
        <div class="aui-content">
            <h2>人脸检测未通过</h2>
            <p>请保持光线充足，确保脸部再识别区域内(999)</p>
            <axd-image :src="resPic" :lazy="false" class="pic"></axd-image>
            <button class="aui-btn aui-btn_primary" @click="goBiopsy">再刷一次</button>
            <button class="aui-btn aui-btn_weaken" @click="goBind" v-if="!binkHide">银行卡验证</button>
        </div>
    </div>
</template>
<script type="text/javascript">
import axdImage from 'src/components/image/index.vue'
import { resetHeader } from 'src/components/header/resetHeader'

export default {
    name: 'biopsyBankcard',
    data() {
        return {
            tradeId: this.$route.query.tradeId,
            gId: this.$route.query.gId,
            resPic: require('./zhuangtai1.png'),
            binkHide: this.$route.query.canApplyBank == false
        }
    },
    components: {
        axdImage
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            // window.axdBackFunc = resetHeader()
            resetHeader()
        },
        // 刷脸
        goBiopsy() {
            axdApp.send({
                module: 'credit',
                method: 'livenessCheck',
                params: {
                    source: 'huotiPost',
                    recordSound: false
                },
                callback: (res) => {
                    if (!res.data.actionFailed && res.data.result.biopsyStatus == 'success') {
                        if (this.tradeId) {
                            this.$router.replace({
                                name: 'orderGoods'
                                // ,
                                // query: {
                                //     tId: this.tradeId,
                                //     gId: this.gId,
                                //     source: 'cashier'
                                // }
                            })
                        } else {
                            this.$router.go(-1)
                        }
                    }
                }
            })
        },
        // 绑卡
        goBind() {
            let toUrl = encodeURIComponent(`/pages/order/goodsDetail?id=${this.tradeId}&source=cashier`)
            this.$router.replace({
                name: 'addBankCard',
                query: {
                    toUrl: toUrl
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
$designWidth: 1080;
.aui-content {
    background: url('./bg.png') no-repeat 0 0;
    background-size: 100% 100%;
    text-align: center;
    padding-top: px2rem(235);
    h2 {
        margin: 0 px2rem(52.5);
        padding-bottom: px2rem(45);
        font-size: px2rem(78);
        color: #fff;
        font-weight: normal;
        border-bottom: 1px solid #fff;
    }
    p {
        margin: px2rem(90) auto px2rem(50);
        color: #fff;
        font-size: px2rem(38);
    }
}

.pic {
    margin: 0 auto px2rem(50);
    width: px2rem(246);
}

button.aui-btn {
    width: px2rem(540);
    height: px2rem(120);
    border-radius: px2rem(10);
    font-size: px2rem(40);
}

.aui-btn_weaken {
    margin-top: px2rem(30);
}
</style>
