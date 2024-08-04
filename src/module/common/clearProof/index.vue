<template>
    <div class="aui-page">
        <hybrid-header></hybrid-header>
        <div class="aui-content">
            <div v-if="list.length">
                <div v-for="(item, index) in list" :key="index" class="item">
                    <div class="item_body" flex>
                        <div class="left">
                            <div class="title">
                                结清证明
                            </div>
                            <div class="assist">
                                {{item.applyTime}}
                            </div>
                        </div>
                        <div class="right">
                            <div class="download" @click="downloadProof(item)">下载证明</div>
                        </div>
                    </div>
                </div>
                <div class="loadding_foot_1" v-if="more" @click="showMore">
                    点击加载更多
                    <p class="loadding_bottom"></p>
                </div>
                <div class="loadding_foot" v-else>
                    已无更多
                    <p class="loadding_bottom"></p>
                </div>
                <div class="bottom"></div>
            </div>
            <div v-else>
                <div class="empty"></div>
                <div class="empty-text">您尚未申请结清证明</div>
            </div>
            <div class="submit-box" @click="applyClearProof">
                <button class="submit">申请结清证明</button>
            </div>
        </div>
    </div>
</template>
<script>
import { AXD } from 'src/libs/util'
import { queryRecords, downloadUrl } from 'store/modules/clearProof'
import axdDialog from 'components/dialog/index'
export default {
    name: 'index',
    data() {
        return {
            list: [],
            more: true,
            page: 1,
            pageSize: 10
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.queryRecords()
        },
        queryRecords() {
            queryRecords({
                page: this.page,
                pageSize: this.pageSize
            }).then(res => {
                if (res.success) {
                    if (res.result && res.result.rows && res.result.rows.length) {
                        this.page++
                        this.list = this.list.concat(res.result.rows)
                        if (res.result.rows.length === this.pageSize) {
                            this.more = true
                        } else {
                            this.more = false
                        }
                    } else {
                        this.more = false
                    }
                } else {
                    if (res.code === '-1999') {
                        AXD.util.clearProofLogin()
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        },
        downloadProof(proof) {
            if (proof.ossKey) {
                if (this.isApp) {
                    downloadUrl({
                        ossKey: proof.ossKey
                    }).then(res => {
                        if (res.success) {
                            axdApp.send({
                                module: 'navigation',
                                method: 'goURLWithOuterBrowser',
                                params: {
                                    url: AXD.util.isiOS() ? encodeURIComponent(res.result) : res.result
                                }
                            })
                        } else {
                            this.$_toast(res.resultDes)
                        }
                    })
                } else {
                    window.location.href = '/oscar/settleProof/downloadProof?ossKey=' + proof.ossKey
                }
            } else {
                axdDialog({
                    title: '温馨提示',
                    content: '您申请的结清证明正在努力生成中，请稍后查看',
                    buttons: [{
                        text: '确认'
                    }]
                })
            }
        },
        showMore() {
            if (this.more) {
                this.queryRecords()
            }
        },
        applyClearProof() {
            this.$router.push({
                name: 'clearProofApply'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';
.item{
    background-color: #ffffff;
    font-size: px2rem(30);
    position: relative;
    color: $auiTextColorImportant;
    padding: 0 px2rem(33);
    .item_body{
        height: 100%;
        padding: px2rem(26) 0;
        border-top: 1px solid #e4e4e4;
        position: relative;
        &:active{
            background-color: #ececec
        }
        .left{
            flex: 3;
            line-height: px2rem(50);
        }
        .right{
            flex: 2;
            text-align: right;
            line-height: px2rem(88);
            font-size: px2rem(28);
        }
        .title{
            height: px2rem(42);
            line-height: px2rem(42);

        }
        .assist{
            margin-top: px2rem(12);
            height: px2rem(32);
            line-height: px2rem(32);
            font-size: px2rem(26);
            color: $auiTextColorAssistant;
        }

    }
}
.item:first-child .item_body{
    border-top: none;
    margin-top: px2rem(20);
}
.download{
    display: inline-block;
    width: px2rem(220);
    height: px2rem(60);
    line-height: px2rem(60);
    border: px2rem(2) solid #E4E4E4;
    border-radius: px2rem(100);
    font-size: px2rem(26);
    color: #222222;
    text-align: center;
}
.submit{
    width: px2rem(686);
    height: px2rem(90);
    line-height: px2rem(90);
    font-size: px2rem(36);
    background-color: var(--auiColorPrimary);
    border-radius: px2rem(100);
    color: #FFF;
    border:0
    // left: 50%;
    // transform: translateX(-50%);
}
.submit-box{
    position: fixed;
    bottom: px2rem(0);
    left: 0;
    right:0;
    padding:px2rem(30);
    text-align: center;
    background: #f7f7f7;
}
.empty{
    width: px2rem(400);
    height: px2rem(340);
    @include img2x('./styles/imgs/empty');
    background-size: 100%;
    margin: px2rem(250) auto px2rem(28);
}
.empty-text{
    font-size: px2rem(30);
    text-align: center;
    color: $auiTextColorAssistant;

}
.loadding_foot {
    text-align: center;
    color: #CCCCCC;
    font-size: px2rem(28);
    padding: px2rem(14) px2rem(28);
    .loadding_bottom {
        height:px2rem(20)
    }
}
.loadding_foot_1 {
    color: #222;
    height: px2rem(90);
    text-align: center;
    padding: px2rem(14) px2rem(28);
    font-size: px2rem(28);
}
.bottom {
    height: px2rem(150);
}
</style>
