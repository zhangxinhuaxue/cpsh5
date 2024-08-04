<template>
    <div class="agreement">
        <m-icon
            :type="value ? 'checkbox_checked' : 'checkbox_unchecked'"
            class="icon-checkbox"
            :class="{'active': value}"
            @click="handleToggle"
        ></m-icon>
        我已阅读并同意
        <span v-for="(item,index) in listProtocol" :key="index" class="color-link"
                     @click="goProtocol(item.value)"
        >{{item.label}}</span>
    </div>
</template>

<script>
import {h5Origin} from "src/libs/domain";

export default {
    name: "Agreement",
    props: {
        value: {
            type: Boolean,
            default: false
        },
        listProtocol:{
            type:Array,
            deafult(){
                return [
                    // label,value
                ]
            }
        },
        descText:{
            type:String,
            default:'开通即视为同意'
        }


    },
    data() {
        return {}
    },
    methods: {
        goProtocol(templateName) {
            let contractUrl = `${h5Origin}/h5/user/contract/viewTemplate/${templateName}`
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: contractUrl,
                        isOutSiteUrl: false
                    },
                    callback: function (ret) {
                    }
                })
            } else {
                this.resetHref(contractUrl)
            }
        },
        handleToggle() {
            this.$emit('input', !this.value)
        }
    }
}
</script>

<style lang="scss" scoped>
$colorPrimary: #4286ff;

.agreement {
    color: #999999;
    line-height: px2rem(32);
    font-size: px2rem(24);
    padding: px2rem(32);
    text-align: left;

    .icon-checkbox {
        margin-right: px2rem(10);
        color: #ccc;
        font-size: px2rem(32);
        vertical-align: sub;
        &.active{
            color: $colorPrimary;
        }
    }
}

.color-link {
    color: $colorPrimary;
}
</style>
