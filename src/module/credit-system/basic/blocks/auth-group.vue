<template>
  <m-cell-group v-if="styleList.length">
        <template v-for="(item, index) in styleList">
        <m-cell
            :key="'auth' + index"
            :title="item.itemName"
            :value="item.status | getValue(item.creditItem, resetItem)"
            :placeholder="item.status | getPlaceholder(item.creditItem)"
            isLink
            :disabled="!item.click"
            @click="goAuth(item, channel)">
            <i slot="icon" class="auth-icon" :class="'auth-icon_' + item.creditItem"></i>
        </m-cell>
        </template>
    </m-cell-group>
</template>

<script>
export default {
    props: {
        styleList: {
            type: Array,
            default: function() {
                return []
            }
        },
        channel: {
            type: String
        },
        ocrIsFirst: {
            type: Boolean,
            default: false
        },
        resetItem: {
            type: String,
            default: () => ''
        }
    },
    filters: {
        getValue(status, creditItem, resetItem) {
            let text = '认证'
            if (creditItem === '7' || creditItem === '8') {
                text = '提交'
            }
            return (status === '1' && creditItem !== resetItem) ? `已${text}` : ''
        },
        getPlaceholder(status, creditItem) {
            let text = '认证'
            if (creditItem === '7' || creditItem === '8') {
                text = '提交'
            }
            return `未${text}`
        }
    },
    methods: {
        goAuth(item, channel) {
            let { creditItem, itemName, click } = item
            if (this.ocrIsFirst && creditItem !== '1001') {
                this.$_toast('请先通过实名验证')
                return
            }
            if (!click) {
                this.$_toast(`你已${itemName}过了`)
                return
            }
            this.$emit('goAuth', creditItem, channel)
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
::v-deep .mui-cell__ft_placeholder {
    color: red;
}
// ::v-deep .mui-cell__bd {
//     font-size: $auiFontSizeLevel3;
// }
.auth-icon {
    display: block;
    width: px2rem(64);
    height: px2rem(64);
    margin-right: px2rem(16);
    background-image: url('../../assets/images/auth-icon.png');
    background-repeat: no-repeat;
    background-size: px2rem(320) px2rem(64);
    
}
.auth-icon_1001,
.auth-icon_10 {
    background-position: 0 0;
}
.auth-icon_8 {
    background-position: px2rem(-64) 0;
}
.auth-icon_1002 {
    background-position: px2rem(-128) 0;
}
.auth-icon_6 {
    background-position: px2rem(-192) 0;
}
.auth-icon_7 {
    background-image: url('../../assets/images/auth-icon-address.png');
    background-size: px2rem(64) px2rem(64);
    background-position: center;
}
</style>