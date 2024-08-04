<!--
 * @Author: sunxj
 * @Date: 2019-09-05 14:09:03
 * @LastEditTime: 2019-09-17 14:36:15
 * @LastEditors: sunxj
 * @Description: credit contract
 -->
<template>
    <div>
        <p v-if="isAym" class="protocol">
            <label>
                <input class="checkbox__original" type="checkbox" v-model="checked" />
                <m-icon class="checkbox-icon" :type="iconClass"></m-icon>我已阅读并同意
            </label>
            <span @click="goProto('SY_sxsq')">《招集令分期服务授信协议》 </span>
            <span v-if="!creditAuthContract.tempSigned && creditAuthContract.tempNo" class="link" @click="showContractDetail(creditAuthContract.tempNo)">《个人征信授权书》</span>
        </p>
    </div>
</template>

<script>
import { contractPath } from 'src/libs/util'
export default {
    props: {
        platform: String,
        creditAuthContract: Object
    },
    data() {
        return {
            checked: false,
            // 合同模板路径
            relativePath: window.location.hostname.indexOf('app') > -1 ? '/app/user/contract/viewTemplate/' : '/h5/user/contract/viewTemplate/'
        }
    },
    computed: {
        // 不显示微贷授信协议
        isAym() {
            return this.platform === 'aiyoumi'
        },
        iconClass() {
            return this.checked ? 'checkbox_checked' : 'checkbox_unchecked'
        }
    },
    watch: {
        checked(newVal) {
            this.$emit('changeChecked', newVal)
        }
    },
    methods: {
        // 查看服务协议
        showContractDetail(name) {
            const url = this.relativePath + name
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: window.location.origin + url,
                        closeToRoot: false
                    },
                    callback() {}
                })
            } else {
                window.location.href = url
            }
        },
        goProto(id) {
            let contractUrl = `${contractPath}${id}?clientCode=credit_aiyoumi`
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: contractUrl,
                        isOutSiteUrl: false
                    },
                    callback: function(ret) {}
                })
            } else {
                window.location.href = contractUrl
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.mt0{
    margin-top: 0;
    text-align: left;
}
.protocol {
    font-size: $auiFontSizeLevel6;
    line-height: px2rem(80);
    padding: 0 px2rem(32);
    color: #222;
    span {
        color: #007FFF;
    }
}
.checkbox {
    display: flex;
    align-items: center;
    padding: px2rem(20) px2rem(28) px2rem(20) px2rem(32);
    font-size: px2rem(24);
    color: #999;
    span {
        color: #007FFF;
        cursor: pointer;
    }
}
.checkbox-icon {
    color: #4286FF;
    font-size: px2rem(32);
    margin-right: px2rem(6);
}
body.aym {
    .checkbox-icon {
        color: #FFE550;
    }
}
.checkbox__original {
    display: none;
}
.checkbox__bd {
    flex: 1;
    white-space: nowrap;
    overflow:hidden;//隐藏文字
    text-overflow:ellipsis;//显示 ...
    white-space:nowrap;
}
.checkbox__ft {
    color: #ccc;
    text-align: right;
    width: px2rem(110);
    margin-left: px2rem(20);
    .arrow2-icon {
        font-size: px2rem(24);
    }
}
</style>
