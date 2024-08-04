<template>
    <m-page>
        <hybrid-header slot="header" :config="barConfig"></hybrid-header>
        <p class="bank_desc">
            认证绑卡支持列表
        </p>
        <m-cell-group class="mt0">
            <template v-for="item in itemList">
            <m-cell
                :title="item.bankName"
                :key="item.bankCode"
                size="middle">
                <axd-image slot="icon" class="icon" :src="item.bankIcon" alt=" " :lazy="false"></axd-image>
            </m-cell>
            </template>
        </m-cell-group>
    </m-page>
    <!-- <div class="aui-page bankbind">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <p class="bank_desc">
                认证绑卡支持列表
            </p>
            <div class="aui-cells aui-cells_radio">
                <label class="aui-cell aui-check__label" v-for="(item, index) in itemList">
                    <div class="aui-cell__hd">
                        <axd-image class="icon" :src="item.bankIcon" alt=" " :lazy="false"></axd-image>
                    </div>
                    <div class="aui-cell__bd">
                        <p :bankcode="item.bankCode"> {{item.bankName}} </p>
                    </div>
                </label>
            </div>
        </div>
    </div> -->
</template>
<script>
import {
    bandList
} from 'store/modules/bankbind/bank'
import axdImage from 'src/components/image/index.vue'
export default {
    name: 'add',
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightbuttonVisible: false
                }
            },
            itemList: []
        }
    },
    components: {
        axdImage
    },
    mounted() {
        this.getBankList()
    },
    methods: {
        getBankList() {
            bandList().then((res) => {
                if (res.success && res.result.length) {
                    this.itemList = res.result
                } else {
                    this.$_toast(res.result.message)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.bank_desc {
    padding: px2rem(30) px2rem(32) px2rem(16);
    font-size: px2rem(24);
    color: #999999;
}
.mt0 {
    margin-top: 0;
}
.bankbind {
    .bank_desc {
        padding: px2rem(30) px2rem(32) px2rem(16);
        font-size: px2rem(24);
        color: #999999;
    }
    .aui-cells {
        margin-top: 0;
    }
    .icon {
        width: px2rem(64);
        height: px2rem(64);
        margin-right: px2rem(22);
    }
    .aui-cells_radio {
        .aui-cell__hd {
            img {
                margin-right: px2rem(32);
                width: px2rem(54);
                height: px2rem(54);
            }
        }
    }
}
</style>
