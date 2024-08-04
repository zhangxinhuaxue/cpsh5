<template>
    <div>
        <div class="repayment-list">
            <ul>
                <li v-for="(item, index) in config.months">
                    <div class="date">
                        {{config.dateList[index] | formatDate }}
                    </div>
                    <div class="text">
                        <div>
                            <p class="p1">{{config.monthPay | formatMoney}}</p>
                            <p class="p2">
                                <span v-for="(item, index) in config.cost" v-if="item.value != 0">{{item.type}}{{item.value | formatMoney}}</span>
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {
    formatMoney
} from 'src/libs/util'
export default {
    name: 'repaymentList',
    props: {
        config: {
            type: Object
        }
    },
    filters: {
        formatMoney,
        formatDate(date) {
            if (date === undefined) {
                return ''
            } else {
                return date.replace(/-/g, '.').substring(5, 10)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
@import 'src/assets/styles/rem.scss';
@import 'src/assets/styles/mixins.scss';
$designWidth: 750;
.repayment-list{
  margin-top: px2rem(20);
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
            line-height: px2rem(140);
            font-size: $auiFontSizeLevel4;
            font-weight: 700;
            // text-align: center;
            text-indent: 5.5%;
            position: relative;
            float: left;
            overflow: hidden;
            &:after{
              content: '';
              display: inline-block;
              height: px2rem(15);
              width: px2rem(15);
              border-radius: 50%;
              position: absolute;
              background-color: #ffd72d;
              top: px2rem(62.5);
              right: px2rem(18.5);
            }
            &:before {
              content: '';
              display: inline-block;
              height: 110%;
              border-right: px2rem(3) solid #ffd72d;
              position: absolute;
              top: 0;
              right: px2rem(25);
            }
          }
      }
  }
}
</style>
