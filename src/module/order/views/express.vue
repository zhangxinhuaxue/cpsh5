<template lang="html">
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-content">
                <div class="statusBar">
                    <b class="fs32">{{info.companyName}}</b>
                    <p>运单编号：{{info.outId}}</p>
                    <p>物流状态：{{info.status}}</p>
                </div>
                <div class="process">
                    <div class="title aui-split_line">物流信息</div>
                    <div class="body">
                        <ul>
                            <li v-for="(item, index) in info.traces" class="item">
                                <div class="date"></div>
                                <div class="text">
                                    <p class="p1">{{item.desc}}</p>
                                    <p class="p2">{{item.createTime | dateFormat}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    expressStatus
} from 'src/store/modules/order'
export default {
    data() {
        return {
            barConfig: {
                app: {
                    visible: false
                },
                h5: {
                    rightBtnShow: false,
                    enforce: true
                }
            },
            info: {}
        }
    },
    filters: {
        esFormat(v) {
            let status = ''
            switch (v) {
                case 'ON_THE_WAY':
                    status = '在途中'
                    break
                case 'LAN_PIECE':
                    status = '等待揽件'
                    break
                case 'PIE_PIECE':
                    status = '正在揽件'
                    break
                default:
                    status = '在途中'
            }
            return status
        }
    },
    created() {
        this.getExpress()
    },
    methods: {
        getExpress() {
            expressStatus({
                logisticId: this.$route.query.id
            }).then(res => {
                if (res.success) {
                    this.info = res.result
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.statusBar {
    background: #4286FF;
    padding: px2rem(46) px2rem(32) px2rem(40);
    line-height: px2rem(46);
    color: #fff;

}

.process {
    margin-top: px2rem(20);
    //background: #fff;
    .title {
        line-height: px2rem(96);
        padding-left: px2rem(32);
        background: #fff;
      &.aui-split_line:after {
            top: auto;
            bottom: -2px;
        }
    }
    .body {
        margin-top: px2rem(20);
        padding-left: px2rem(32);

      //background-color: #fff;
        ul {
            li {
                // height: px2rem(180);
                overflow: hidden;
                position: relative;
                /*第一个元素*/
                &:first-child {
                    .date {
                        &:before {
                            top: px2rem(50);
                        }
                        &:after {
                            width: px2rem(30);
                            height: px2rem(30);
                            left: px2rem(1);
                            background-color: #4286FF;
                        }
                    }
                    .text {
                        color: $auiTextColorImportant;
                    }
                }
                /* 最后一个元素 */
                &:last-child {
                    .text {
                        @include hairline-remove(bottom);
                    }
                    .date {
                        &:before {
                            height: px2rem(50);
                        }
                    }
                }
                /*唯一一个元素*/
                &:only-child {
                    .date {
                        &:before {
                            border-right: none;
                        }
                    }
                }
                .text {
                    float: left;
                    width: 86%;
                    margin-left: 13%;
                    // height: px2rem(180);
                    @include hairline(bottom);
                    position: relative;
                    top: 50%;
                    line-height: px2rem(34);
                    padding: px2rem(20) px2rem(20) px2rem(20) px2rem(10);
                    color: $auiTextColorAssistant;
                    .p1 {
                        font-size: px2rem(28);
                        display: -webkit-box;
                    }
                    .p2 {
                        margin-top: px2rem(10);
                        font-size: $auiFontSizeLevel7;
                    }
                }
                .date {
                    // height: px2rem(180);
                    // line-height: px2rem(180);
                    float: left;
                    width: 13%;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    font-size: $auiFontSizeLevel4;
                    font-weight: 700; // text-align: center;
                    text-indent: 5.5%;
                    overflow: hidden;
                    &:after {
                        content: '';
                        display: inline-block;
                        height: px2rem(20);
                        width: px2rem(20);
                        border-radius: 50%;
                        position: absolute;
                        background-color: #ccc;
                        top: px2rem(50);
                        left: px2rem(6);
                    }
                    &:before {
                        content: '';
                        display: inline-block;
                        height: 110%;
                        border-right: px2rem(2) solid #ccc;
                        position: absolute;
                        top: 0;
                        left: px2rem(15);
                    }
                }
            }
        }
    }
}
</style>
