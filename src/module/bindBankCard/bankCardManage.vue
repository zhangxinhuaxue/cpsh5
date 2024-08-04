<template>
<div class="aui-page banklist">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div class="bankcard_list">
            <ul>
                <li v-for="(item, index) in bankCardList" :key="index">
                    <span class="bank_icon">
                        <img :src="item.bankIcon" alt="">
                    </span><span class="bank_name">{{item.bankName}}</span><span class="card_num">尾号{{item.cardNo|tailNum}}</span>
                    <a href="javascript:;" class="changeTel" @click="changeTel(item)">更改手机号</a>
                </li>
            </ul>
        </div>
        <div class="noBankCard" v-show="addFlag">
            <p class="tips">您还没有添加银行卡</p>
            <a href="javascript:;" class="addBtn" @click="addBank">去添加</a>
        </div>
    </div>
</div>
</template>
<script>
import { AXD, tailNum } from 'src/libs/util'
import { getUserBankList } from 'src/store/modules/rrh'
import {getAuthInfo} from 'store/modules/bankbind/bank'
export default {
    name: 'bankCardManage',
    filters: {
        tailNum
    },
    computed: {
        selectCardId() {
            return this.selectIndex || this.cardId
        }
    },
    data() {
        return {
            addFlag: false,
            bankCardList: [],
            selectIndex: null,
            cardId: this.$route.query.cardId,
            toUrl: this.$route.query.toUrl,
            barConfig: {
                action: 'addBank', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    icon: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/201907/15160923391.png'
                },
                app: {
                    rightBtnShow: true,
                    leftbuttonAction: '',
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'IMAGE', // TEXT:文字 IMAGE:图片
                        imageUrl: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/201907/15160923391.png'
                    }
                }
            }
        }
    },
    computed: {},
    mounted() {
        this.getBankCards()
        window.addBank = () => {
            this.addBank()
        }
    },
    methods: {
        changeTel(item) {
            this.$router.push({
                path: '/pages/bankCard/changePhone',
                query: {
                    bankCardId: item.id
                }
            })
        },
        getBankCards() {
            getUserBankList().then(res => {
                if (res.success && res.result) {
                    if (res.result.length) {
                        this.bankCardList = res.result
                        this.addFlag = false
                    } else {
                        this.addFlag = true
                        this.bankCardList = []
                    }
                } else if (res.code === '-1999') {
                    AXD.util.login()
                }
            })
        },
        /**
         * 新增银行卡
         */
        addBank() {
            getAuthInfo({}).then(res => {
                if (res.success) {
                    this.$router.push({
                        path: '/pages/bankCard/add',
                        query: {
                            toUrl: '/pages/bankCard/manage'
                        }
                    })
                } else {
                    let dialog = this.$createDialog({
                        type: 'confirm',
                        content: res.resultDes || '未实名认证用户，暂无法绑定银行卡',
                        onMaskClick: (hide) => {
                            hide()
                        },
                        onConfirm: () => {
                            AXD.util.goAuth({
                                backUrl: encodeURIComponent(window.location.href),
                                authItem: 1,
                                channel: 'aym_finance'
                            }, true)
                        },
                        onCancel: () => {
                            dialog.hide()
                        }
                    }).show()
                }
            })

        }
    }
}
</script>
<style lang="scss" scoped>
@import 'style.scss';
$designWidth: 750;
body {
    background-color: #f3f3f3;
}

.banklist {
    box-sizing: border-box;
    .bankcard_list {
        margin-top: px2rem(20);
        ul {
            list-style: none;
            li {
                width: 100%;
                height: px2rem(128);
                line-height: px2rem(128);
                padding-left: px2rem(30);
                background-color: #fff;
                position: relative;
                .bank_icon {
                    display: inline-block;
                    width: px2rem(64);
                    height: px2rem(64);
                    vertical-align: middle;
                }
                .bank_name {
                    font-size: px2rem(32);
                    margin-left: px2rem(16);
                    color: #333;
                    vertical-align: middle;
                }
                .card_num {
                    margin-left: px2rem(16);
                    font-size: px2rem(24);
                    color: #666;
                    vertical-align: middle;
                }
                .changeTel {
                    font-size: px2rem(28);
                    font-weight: 400;
                    text-align: right;
                    color: #4286ff;
                    line-height: px2rem(40);
                    position: absolute;
                    right: px2rem(32);
                    top: px2rem(44);
                }
                &:after {
                    content: "";
                    width: px2rem(718);
                    height: 1px;
                    background-color: #d8d8d8;
                    position: absolute;
                    left: px2rem(32);
                    bottom: 0;
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                }
            }
            li:last-child {
                &:after {
                    content: "";
                    width: 1%;
                    height: 1px;
                    background-color: #fff;
                    position: absolute;
                    left: px2rem(32);
                    bottom: 0;
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                }
            }
        }
    }
    .noBankCard {
        margin-top: px2rem(314);
        background: url('img/white.png') center 0 no-repeat;
        background-size: px2rem(320) auto;
        padding-top: px2rem(314);
        text-align: center;
        .tips {
            font-size: px2rem(32);
            font-weight: 600;
            text-align: center;
            color: #999999;
            line-height: px2rem(45);
            margin-bottom: px2rem(40);
        }
        .addBtn {
            width: px2rem(169);
            height: px2rem(80);
            line-height: px2rem(80);
            opacity: 1;
            background: #4286ff;
            border-radius: px2rem(4);
            color: #fff;
            font-size: px2rem(32);
            display: inline-block;
        }
    }
}

</style>
