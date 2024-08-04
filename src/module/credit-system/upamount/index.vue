<!--
 * @Author: wzy
 * @Description: 补录提额入口页
 * @Date: 2020-10-23
 -->
<template>
    <m-page>
        <p class="amount-tips">补充以下任意信息，即可快速提额</p>
        <m-cell-group v-if="amountList.length">
            <template  v-for="(item, index) in amountList">
                <m-cell size="xlarge" class="auth-cell" :key="index">
                    <div slot="icon" class="icon-bg" :class="'icon-' + item.type"></div>
                    <template slot="title">
                        <p class="item-name">{{item.name}}</p>
                        <p class="item-des">{{item.dese}}</p>
                    </template>
                    <slot>
                        <m-button
                            slot="value"
                            size="xsmall"
                            @click="goAmount(item.type)">
                            {{item.button}}
                        </m-button>
                    </slot>
                </m-cell>
            </template>
        </m-cell-group>
    </m-page>
</template>
<script>
import { getBuluFirst } from 'src/store/modules/credit-system'
import { authOrigin } from 'src/libs/domain'
import { resetHeader } from '../common/setHeader'
export default {
    name: 'credit-upamount',
    data() {
        return {
            backUrl: decodeURIComponent(this.$route.query.backUrl || ''),
            amountConfig: {
                marr: {
                    type: 'marr',
                    button: '去完成',
                    name: '完成婚姻状况',
                    dese: '最高提额500元'
                },
                job: {
                    type: 'job',
                    button: '去完成',
                    name: '完善工作信息',
                    dese: '最高提额500元'
                },
                live: {
                    type: 'live',
                    button: '去完成',
                    name: '完善居住状况',
                    dese: '最高提额500元'
                },
                contacts: {
                    type: 'contacts',
                    button: '去完成',
                    name: '完善联系人',
                    dese: '最高提额500元'
                }
            },
            amountList: []
        }
    },
    mounted() {
        this.initStatus()
    },
    methods: {
        initStatus() {
            getBuluFirst().then(res => {
                if (res.success) {
                    if (res.result.showList.length > 0) {
                        res.result.showList.forEach(item => {
                            this.amountList.push(this.amountConfig[item])
                        })
                    } else {
                        this.$_toast('目前暂无需要信息补录', () => {
                            window.location.href = this.backUrl
                        })
                    }
                }
            })
        },
        goAmount(type) {
            if (type === 'contacts') {
                this.log({type: 'button-logic-link', name: 'raisepage-button-contacts', desc: '完善联系人', extendData:jumpUrl})
            } else if (type === 'live') {
                this.log({type: 'button-logic-link', name: 'raisepage-button-live', desc: '完善居住状况', extendData:jumpUrl})
            } else if (type === 'job') {
                this.log({type: 'button-logic-link', name: 'raisepage-button-work', desc: '完善工作信息', extendData:jumpUrl})
            } else if (type === 'marr') {
                this.log({type: 'button-logic-link', name: 'raisepage-button-marriage', desc: '完成婚姻状况', extendData:jumpUrl})
            }
            let jumpUrl = `${authOrigin}/views/part?type=${type}&backUrl=${encodeURIComponent(window.location.href)}`
            window.location.href = jumpUrl
            resetHeader(() => {
                window.location.href = jumpUrl
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.amount-tips {
    background-color: #fefbe6;
    line-height: px2rem(80);
    padding-left: px2rem(32);
    font-size: px2rem(28);
    color: #F18800;
}
.mui-cells {
    margin-top: 0;
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

.icon-bg {
    width: px2rem(80);
    height: px2rem(80);
    margin-right: px2rem(30);
    background-image: url('../assets/images/amount-icon.png');
    background-repeat: no-repeat;
    background-size: px2rem(300) px2rem(500);
}
body.aym {
    .icon-bg {
        background-image: url('../assets/images_old/amount-icon.png')
    }
}
.icon-job {
    background-position: px2rem(-10) px2rem(-310);
}
.icon-marr {
    background-position: px2rem(-210) px2rem(-210);
}
.icon-live {
     background-position: px2rem(-110) px2rem(-310);
}
.icon-contacts {
     background-position: px2rem(-210) px2rem(-310);
}
</style>
