<template>
  <div class="aui-popup_content">
    <div class="popup-select__hd">
        <a class="close" href="javascript:;" @click="close">
            <span class="icon-close1"></span>
        </a>
        <h3>{{config.title}}</h3>
    </div>
    <div class="aui-popup__bd">
        <slot name="tip"></slot>
        <div class="repayment-list">
            <ul>
                <li v-for="(item, index) in config.dataList" :key="index">
                    <div class="date">
                        <div>{{index===0? '首期' : `${index + 1}期`}}</div>
                        <div class="day">{{item.repayDate | formatDate }}</div>
                    </div>
                    <div class="text">
                        <div>
                            <p class="p1">￥{{item.actualPay}}</p>
                            <p class="p2" v-if="showFee">
                                {{item.detail}}
                                <m-icon v-if="index===0" type="attetion" class="fee-tip" @click.stop="showFeeInfo"></m-icon>
                            </p>
                        </div>
                    </div>
                </li>
          </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {
    formatMoneyK
} from 'src/libs/util'
export default {
    name: 'repaymentList',
    props: {
        config: {
            type: Object
        },
        rrhzx: {
            type: Object,
            default: () => {}
        },
        showFee: {
            type: Boolean,
            default: false
        }
    },
    filters: {
        formatMoneyK,
        add(n1, n2) {
            let add = parseFloat(n1) + parseFloat(n2)
            return add
        },
        formatDate(date) {
            if (date === undefined) {
                return ''
            } else {
                return date.replace(/-/g, '.').substring(5, 10)
            }
        }
    },
    methods: {
        close() {
            this.$emit('repaymentClose')
        },
        showFeeInfo() {
            this.$createDialog({
                type: 'alert',
                content: this.rrhzx.summaryFeeTip,
                confirmBtn: {
                    text: '我知道了'
                }
            }).show()
        },
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-popup__bd{
  margin-bottom:0!important;
  min-height:0!important;
  background-color: #f7f7f7;
  padding-top: px2rem(16);
}
.popup-select__hd {
    display: flex;
    height: px2rem(96);
    line-height: px2rem(96);
    padding: 0 px2rem(32);
    position: relative;
    text-align: center;
    background-color: #fff;
    .close {
        display: inline-block;
        width: px2rem(96);
        line-height: px2rem(96);
        position: absolute;
        left: 0;
        top: 0;
        span {
            font-size: px2rem(32);
        }
    }
    & h3 {
        width: 100%;
        line-height: px2rem(96);
        text-align: center;
        font-weight: normal;
        font-size: px2rem(32);
        color: #666;
    }
    &:after {
        @include hairline(bottom);
    }
}
.repayment-list{
    background-color: #fff;
    ul{
        li{
          height: px2rem(140);
          overflow: hidden;
            // 第一个元素
          &:first-child{
              .date{
                  &:before {
                    top:50%;
                  }
              }
          }
          // 最后一个元素
          &:last-child{
            .text{
                @include hairline-remove(bottom);
            }
            .date{
                &:before {
                  height: 50%;
                }
            }
          }
          // 唯一一个元素
          &:only-child{
              .date{
                  &:before {
                    border-right: none;
                  }
              }
          }
          .text{
              display: flex;
              align-items: center;
              justify-content: center;
            div{
                width: 100%;
                padding-left: px2rem(10);
            }
            width: 75%;
            height: px2rem(140);
            float: right;
            @include hairline(bottom);
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            .p1{
              line-height: px2rem(30);
              color:$auiTextColorImportant;
              font-size: $auiFontSizeLevel4;
            }
            .p2{
              line-height: px2rem(30);
              margin-top: px2rem(15);
              margin-right: px2rem(15);
              color:$auiTextColorAssistant;
              font-size:$auiFontSizeLevel7;
              i{
                  font-style:normal;
              }
            }
          }
          .date{
            width: 25%;
            height: px2rem(140);
            // line-height: px2rem(140);
            font-size: px2rem(30);
            text-align: center;
            text-indent: 5.5%;
            position: relative;
            float: left;
            overflow: hidden;
            padding-top: px2rem(40);
            .day{
                color: #999;
                font-size: px2rem(24);
            }
            &:after{
              content: '';
              display: inline-block;
              height: px2rem(15);
              width: px2rem(15);
              border-radius: 50%;
              position: absolute;
              background-color: var(--auiColorPrimary);
              top: px2rem(62.5);
              right: px2rem(18.5);
            }
            &:before {
              content: '';
              display: inline-block;
              height: 110%;
              border-right: px2rem(3) solid var(--auiColorPrimary);
              position: absolute;
              top: 0;
              right: px2rem(25);
            }
          }
        }
    }
    .fee-tip{
        font-size: 18px;
        color: #999;
        display: inline-block;
        transform: translate(5px, 2px);
    }
}
</style>
