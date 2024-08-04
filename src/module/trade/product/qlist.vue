<!--
    Created by hity on 12/05/2017
-->
<template>
    <div class="aui-page" id="product-question-list">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content" :class="{blank: showBlank}">
            <template v-if="!showBlank">
                <p class="qa-title">
                    <span class="qa-title__name">{{productName}}</span>
                    <span class="qa-title__count">
                        <em>{{initInfo.questionCount}}个</em>问题
                    </span>
                </p>
                <ul class="qa-list">
                    <li class="qa-list__block" v-for="item in initInfo.questionList" @click="goDetail(item.questionId)">
                        <p class="qa-list__q">{{item.question}}</p>
                        <template v-if="item.lastAnswer">
                            <p class="qa-list__a">{{item.lastAnswer}}</p>
                            <p class="qa-list__opr">
                                <span class="qa-list__date">{{item.lastAnswerTime}}</span>
                                <span class="qa-list__count">{{item.reply}}个回答
                                    <span class="icon-arrow2"></span>
                                </span>
                            </p>
                        </template>
                        <template v-else>
                            <p class="qa-list__a qa-list__a_blank">暂无回答，快来抢沙发！</p>
                        </template>
                    </li>
                </ul>
                <p class="qa-list__bottom-tips">{{bottomTxt}}</p>
            </template>
            <template v-else>
                <p class="qa-title">
                    <span class="qa-title__name">{{productName}}</span>
                </p>
                <div class="hint">
                    <span class="blank-img"></span>
                    <p>还没有人提问，来提出第一个问题吧！</p>
                </div>
            </template>
            <a class="aui-btn aui-btn_primary qa-btn" :class="{validFail: validFail}" href="javascript:void(0);" @click="goAsk">问问大家</a>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import { getQuestionList, checkQuestion } from 'store/modules/trade/product'
import BottomScrolling from 'src/libs/scrollToBottom'
import { AXD } from 'src/libs/util'

export default {
    name: 'question-list',
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            // 是否完成数据初始化
            isInitDataDone: false,
            // 初始化信息
            initInfo: {
                questionCount: '', // 问题总数
                questionList: [
                    // {
                    //     lastAnswer: '',
                    //     lastAnswerTime: '',
                    //     question: '',
                    //     questionId: 0,
                    //     reply: 0 // 回答数
                    // }
                ]
            },
            // 问题资格验证是否失败
            validFail: false,
            // 滚动到底部实例对象
            bottomInstance: {},
            // 滚动容器
            scrollContainer: null
        }
    },
    created() {
        this._getQListData()
        this.$nextTick(() => {
            // 绑定下拉加载
            this._bindScroll()
        })
    },
    components: {
        hybridHeader
    },
    computed: {
        productId() {
            return this.$route.query.productId
        },
        productName() {
            return this.$route.query.productName
        },
        showBlank() {
            return this.isInitDataDone && !this.initInfo.questionList.length
        },
        // 瀑布流数据是否加载完成
        isListDone() {
            let {
                questionCount,
                questionList
            } = this.initInfo

            return questionCount && (questionCount - questionList.length) <= 0
        },
        // 根据内容状态给出不同的底部提示语
        bottomTxt() {
            if (!this.isListDone) {
                return '加载中...'
            }
            if (this.isTurnPageNeeded && this.isListDone) {
                return '已经到底了，你有什么想问的么？'
            }
            return ''
        },
        // 内容是否超出了一屏
        isTurnPageNeeded() {
            if (!this.scrollContainer) {
                return false
            }
            if (this.scrollContainer && (this.scrollContainer.scrollHeight - window.innerHeight) > 100) {
                return true
            }
            return false
        }
    },
    watch: {
        // 瀑布流数据加载完成，销毁滚动到底部的监听
        isListDone(newValue) {
            if (newValue) {
                this.bottomInstance.destroy && this.bottomInstance.destroy()
            }
        }
    },
    methods: {
        _bindScroll() {
            this.scrollContainer = document.querySelector('.aui-content')
            this.bottomInstance = new BottomScrolling({
                scrollContainer: this.scrollContainer,
                callback: this._turnPage
            })
        },
        // 滚动到底部，调用的翻页函数
        _turnPage() {
            // list长度小于等于记录总数时，返回，不处理
            if (this.isListDone) {
                return false
            }
            let start = this.initInfo.questionList.length
            this._getQListData(start)
        },
        _getQListData(start = 0, size = 10) {
            getQuestionList({
                productId: this.productId,
                start,
                size
            }).then(({ success, result, resultDesc }) => {
                this.isInitDataDone = true
                if (success && result) {
                    let { questionList = [], questionCount } = result

                    if (start) {
                        this.initInfo.questionList.splice(start, questionList.length, ...questionList)
                    } else {
                        this.initInfo = Object.assign(this.initInfo, {
                            questionCount: AXD.util.stringToNumber(questionCount),
                            questionList
                        })
                    }
                } else {
                    resultDesc && this.$_toast(resultDesc)
                }
            })
        },
        // 跳转到详情页
        goDetail(questionId) {
            this.$router.push({
                name: 'productQdetail',
                query: {
                    questionId,
                    productId: this.productId
                }
            })
        },
        // 跳转到提问页
        goAsk() {
            if (this.validFail) {
                return
            }
            checkQuestion({
                productId: this.productId
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.$router.push({
                        name: 'productQaInput',
                        query: {
                            productName: this.productName,
                            productId: this.productId
                        }
                    })
                } else {
                    if (code === '404') {
                        AXD.util.login()
                    } else {
                        if (code === '401' || code === '405') {
                            this.validFail = true
                        }
                        resultDes && this.$_toast(resultDes)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.qa-title {
    display: flex;
    justify-content: space-between;
    padding: px2rem(35) px2rem(32) px2rem(25);
    font-size: px2rem(28);
    line-height: px2rem(36);
    background-color: #fff;
    border-top: 1px solid #E4E4E4;
    .qa-title__name {
        width: px2rem(453);
        @include nLineLimit(1);
        color: #222222;
    }
    .qa-title__count {
        color: #101010;
        em {
            color: #F99E00;
        }
    }
}

.aui-content {
    padding-bottom: px2rem(160);
    .qa-list__bottom-tips {
        padding-top: px2rem(30);
        text-align: center;
        font-size: px2rem(26);
        color: #999999;
        line-height: px2rem(34);
    }
}

.qa-list__block {
    padding: px2rem(30) px2rem(32);
    margin-top: px2rem(20);
    background-color: #fff;
    &>* {
        position: relative;
        padding-left: px2rem(48);
        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: px2rem(40);
            height: px2rem(30);
            background-size: 100% auto;
            background-repeat: no-repeat;
            background-position: center center;
        }
    }
    .qa-list__q {
        font-size: px2rem(30);
        color: #222222;
        line-height: px2rem(38);
        margin-bottom: px2rem(30);
        font-weight: bold;
        @include nLineLimit(2);
        &::before {
            top: px2rem(2); // 设计微调
            background-image: url(img/question.png);
        }
    }
    .qa-list__a {
        position: relative;
        font-size: px2rem(26);
        color: #222222;
        line-height: px2rem(34);
        @include nLineLimit(2);
        &::before {
            background-image: url(img/answer.png);
        }
    }
    .qa-list__a_blank {
        color: #999999;
        &::before {
            background-image: none;
        }
    }
    .qa-list__opr {
        display: flex;
        justify-content: space-between;
        font-size: px2rem(22);
        margin-top: px2rem(40);
        .qa-list__date {
            color: #999999;
        }
        .qa-list__count {
            position: relative;
            color: #F99E00; // padding-right: px2rem(20);
            .icon-arrow2 {
                font-size: px2rem(20);
                vertical-align: middle;
            }
        }
    }
}

.qa-btn {
    position: fixed;
    bottom: px2rem(40);
    left: 50%;
    transform: translate(-50%, 0);
    background: #FFE352;
    border-radius: px2rem(100);
    width: px2rem(345);
    height: px2rem(90);
}

.validFail {
    background-color: $auiTextColorLight;
}

.blank {
    .qa-title__name {
        width: 100%;
    }
    .hint {
        padding-top: px2rem(300);
        display: flex;
        flex-direction: column;
        align-items: center;
        .blank-img {
            display: block;
            width: px2rem(200);
            height: px2rem(200);
            background: url(img/null.png) no-repeat center center;
            background-size: 100% auto;
        }
        p {
            text-align: center;
            font-size: px2rem(28);
            color: #999999;
            line-height: px2rem(100);
        }
    }
}
</style>
