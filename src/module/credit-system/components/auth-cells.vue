<!--
 * @Author: sunxj
 * @Date: 2019-05-31 16:45:27
 * @LastEditTime: 2019-09-09 14:44:51
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 -->
<template>
   <m-cell-group v-if="data.length">
    <template  v-for="item in data">
        <m-cell size="xlarge" class="auth-cell" :key="'credit' + item.type">
            <div slot="icon" class="icon-bg" :class="'icon-' + item.type"></div>
            <template slot="title">
                <p class="item-name">{{item.name}}<span v-if="item.nameTitle && (item.type == '9' || item.important)" :class="{'tags_red': item.type == '9' || item.important}">{{item.nameTitle}}</span></p>
                <p class="item-des" v-if="item.dese">{{item.dese}}</p>
            </template>
            <slot>
            <m-button
                slot="value"
                size="xsmall"
                @click="goAmount(item.type, taobaoIsFirst)"
                :class="[getClassName(item.status, item.creditIsOpen)]"
                :disabled="itemStatus(item.status, item.creditIsOpen)">
                {{item.button}}
            </m-button>
            </slot>
        </m-cell>
    </template>
    </m-cell-group>
</template>
<script>
import axdDialog from 'components/dialog/index'
export default {
    name: 'cellsAuth',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        taobaoIsFirst: {
            type: Boolean,
            default: false
        },
        accountIsNormal: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        goAmount(type, taobaoIsFirst = false) {
            // 信用帐号不正常提示''
            if (type !== '1' && !this.accountIsNormal) {
                this.$_alert('您的信用账户存在异常，当前操作无法执行')
                return
            }
            // taobaoIsFirst（表示优先级）: false => 已进行淘宝认证 ； ture => 未进行淘宝认证
            if (!(type === '9' || type === '1') && taobaoIsFirst) {
                this.taobaoDialog()
                return
            }
            this.$emit('back', type)
        },
        taobaoDialog() {
            this.$createDialog({
                type: 'confirm',
                content: '为了更好评估你的信用，请先完成淘宝认证，淘宝认证的额度更高哦',
                confirmBtn: '去淘宝认证',
                onConfirm: () => {
                    this.goAmount('9')
                }
            }).show()
            // let me = this
            // axdDialog({
            //     content: '',
            //     buttons: [{
            //         text: '取消'
            //     }, {
            //         text: '去淘宝认证',
            //         onClick: function() {
            //             me.goAmount('9')
            //         }
            //     }]
            // })
        },
        getClassName(status, isOpen = true) {
            // isOpen 是否开启授信
            // 1.未申请，2.授信中，3.授信通过，4.授信驳回，5.授信关闭(5-1关闭中，5-2关闭时间已过)，99.不可点击
            if (!isOpen || ['2', '3', '5_2', '99'].indexOf(status) > -1) {
                return 'btn-status_disable'
            }
            if (['4'].indexOf(status) > -1) {
                return 'btn-status_passable'
            }
        },
        itemStatus(status, isOpen = true) {
            /* isOpen 是否开启授信
            *  2：授信中，3：授信通过，5_2：授信关闭 关闭时间已过，99：不可点击
            */
            return !isOpen || ['2', '3', '5_2', '99'].indexOf(status) > -1
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mui-cells {
    margin-top: 0;
}
.auth-cell {
    height: px2rem(170);
}
.item-name {
    font-size: $auiFontSizeLevel3;
    color: $auiTextColorImportant;
    margin-bottom: px2rem(10);
    span {
        font-size: px2rem(22);
        color: #fff;
        padding: 0 px2rem(10);
        background-color: #1BC762;
        border-radius: px2rem(17);
        margin-left: px2rem(12);
        position: relative;
        bottom: px2rem(5);
        &.tags_red {
            background-color: #FF3E00;
        }
    }
}

.item-des {
    font-size: $auiFontSizeLevel6;
    color: $auiTextColorAssistant;
}
.auth-cell .btn-status_disable {
    background-color: transparent;
    border: 0;
    color: $auiLineColorLight;
}

.auth-cell .btn-status_passable,
.auth-cell .btn-status_passable:active {
    background-color: transparent;
    border: 0;
    color: $auiLinkColorDefault;
}

.icon-bg {
    width: px2rem(80);
    height: px2rem(80);
    margin-right: px2rem(30);
    background-image: url('../assets/images/amount-icon.png');
    background-repeat: no-repeat;
    background-size: px2rem(300) px2rem(500);
}
.icon-0 {
    background-position: px2rem(-10) px2rem(-210);
}
.icon-1 {
    background-position: px2rem(-110) px2rem(-10);
}
.icon-2 {
     background-position: px2rem(-210) px2rem(-10);
}
.icon-3 {
     background-position: px2rem(-10) px2rem(-110);
}
.icon-4 {
     background-position: px2rem(-10) px2rem(-10);
}
.icon-5 {
     background-position: px2rem(-110) px2rem(-110);
}
.icon-9 {
     background-position: px2rem(-210) px2rem(-110);
}
.icon-13 {
     background-position: px2rem(-110) px2rem(-210);
}
.icon-15 {
     background-position: px2rem(-10) px2rem(-410);
}
.icon-11 {
    background-image: url('../assets/images/amount-icon11.png');
    background-size: cover;
}
.icon-vip{
  background-image: url('../assets/images/amount-iconvip.png');
  background-size: cover;
}
body.aym {
    .icon-bg {
        background-image: url('../assets/images_old/amount-icon.png');
    }
    .icon-11 {
        background-image: url('../assets/images_old/amount-icon11.png');
    }
}
</style>
