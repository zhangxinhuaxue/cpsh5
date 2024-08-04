<!--
    Created by yangjun on 20171204
-->
<template>
    <div class="aui-page" id="qDetail">
        <qa-header :config="headerConfig"></qa-header>
        <div class="aui-content">
            <p class="qDetail__tip">累计完成10个有效回答，您即可获得一份礼包</p>
            <div class="qDetail__content">
                <!-- 问题 -->
                <div class="qDetail__q">
                    <p>
                        <span class="qDetail__q-headerimg"></span>
                        <span class="qDetail__q-name">{{allInfo.questionUser}}</span>
                        <span class="qDetail__q-time">{{allInfo.questionTime}}</span>
                    </p>
                    <h3>
                        <span class="qDetail__q-icon-q"></span>
                        <p>{{allInfo.question}}</p>
                    </h3>
                </div>
                <!-- 回答列表 -->
                <div class="qDetail__q qDetail__a" v-for="item in answerList" v-if="!showBlank">
                    <p>
                        <span class="qDetail__q-headerimg"></span>
                        <span class="qDetail__q-name">{{item.answerUser}}</span>
                        <span class="qDetail__q-time">{{item.answerTime}}</span>
                    </p>
                    <h3>
                        <span class="qDetail__q-icon-q qDetail__q-icon-a"></span>
                        <p>{{item.answer}}</p>
                    </h3>
                </div>
                <!-- 空白提示 -->
                <div class="qDetail__null" v-if="showBlank">
                    <span class="qDetail__null-icon"></span>
                    <p>还没人回答呢</p>
                </div>
                <p v-if="!isListDone" class="qDetail__loadtxt">加载中...</p>
            </div>
            <!-- 加载提示 -->
            <div @click="toAnswer" :class="['aui-btn','aui-btn_primary','qDetail__btn',{'aui-btn_weaken aui-btn_disabled':disabledBtn}]">我来回答</div>
        </div>
        <axd-dialog :showDialog="showDialog" :dialogInfo="dialogInfo" @mainClick="dialogFn"></axd-dialog>
    </div>
</template>
<script>
import qaHeader from 'src/components/header/hybridheader.vue'
import axdDialog from 'src/module/trade/common/item_dialog/dialog.vue'
import BottomScrolling from 'src/libs/scrollToBottom'
import { AXD } from 'src/libs/util'
import { getAnswerList, checkAnswer } from 'src/store/modules/trade/product'
export default {
    name: 'qDetail',
    components: {
        axdDialog,
        qaHeader
    },
    data() {
        return {
            allInfo: {
                questionUser: '',
                questionId: '',
                questionTime: '',
                question: ''
            }, // 存储获取信息
            answerList: [], // 回答列表
            load: true, // 是否可以请求更多数据
            box: null,
            boxViewHeight: 0,
            boxScrollHeight: 0,
            showDialog: false,
            dialogInfo: {
                title: '',
                content: '',
                btn: '确认',
                singleBtn: true
            },
            headerConfig: {
                h5: {
                    title: '问题详情', // title
                    rightBtnShow: false // 是否显示右侧按钮
                },
                app: {
                    rightBtnShow: false
                }
            },
            bottomInstance: {},
            isListDone: false,
            disabledBtn: false
        }
    },
    created() {
        this.initList()
        this.$nextTick(() => {
            this.bindScroll()
        })
    },
    computed: {
        productId() {
            return this.$route.query.productId
        },
        questionId() {
            return this.$route.query.questionId
        },
        showBlank() {
            return this.isListDone && !this.answerList.length
        }
    },
    watch: {
        isListDone(newValue) {
            if (newValue) {
                this.bottomInstance.destroy && this.bottomInstance.destroy()
            }
        }
    },
    methods: {
        initList() {
            this.getList()
        },
        bindScroll() {
            let scrollContainer = document.querySelector('.qDetail__content')
            this.bottomInstance = new BottomScrolling({
                scrollContainer,
                callback: this.getMore
            })
        },
        // 获取列表
        getList(size = 10) {
            let start = this.answerList.length
            getAnswerList({
                questionId: this.questionId,
                size: size,
                start: start
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    if (typeof result !== 'undefined') {
                        // 数量可能在实时变化，主要需要回答总数这个字段answerCount
                        this.allInfo = result
                        if (typeof result.answerList === 'object') {
                            // 合并列表
                            this.answerList = [...this.answerList, ...result.answerList]
                            this.$nextTick(() => {
                                this.judgelast(start, result.answerList)
                            })
                        } else {
                            this.isListDone = true
                        }
                    } else {
                        this.falseFn()
                    }
                } else {
                    resultDes && this.$_toast(resultDes)
                    this.load = true
                }
            })
        },
        judgelast(start, dataList) {
            // 判断首屏底部提示语句依据
            if (start === 0) {
                this.box = document.querySelector('.qDetail__content')
                this.boxViewHeight = this.box.offsetHeight
                this.boxScrollHeight = this.box.scrollHeight
            }
            // 回答全部展示完毕 另，目前后台返回数据有误，增加一层判断保证正确性
            if (dataList.length < 10 || this.answerList.length >= this.allInfo.answerCount) {
                this.load = false
                this.isListDone = true
                return false
            }
            // 依然可以翻页
            this.load = true
        },
        getMore() {
            if (this.load) {
                this.load = false
                this.getList()
            }
        },
        // 回答问题
        toAnswer() {
            // 校验是否具有资格
            checkAnswer({
                questionId: this.questionId,
                productId: this.productId
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    let { question, questionId } = this.allInfo
                    // 参数固定，不可改
                    this.$router.push({
                        name: 'productQaInput',
                        query: {
                            qOra: 'a',
                            productId: this.productId,
                            question: question,
                            questionId: questionId
                        }
                    })
                } else {
                    if (code == '404') {
                        AXD.util.login()
                    } else {
                        if (resultDes) {
                            this.dialogInfo.content = resultDes
                            this.dialogFn()
                            if (code == '403') {
                                this.disabledBtn = true
                            }
                        }
                    }
                }
            })
        },
        dialogFn() {
            this.showDialog = !this.showDialog
        },
        falseFn(msg) {
            this.$_toast({
                txt: '网络错误,请重试',
                callback: () => {
                    this.$router.go(-1)
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
#qDetail {
    padding-bottom: px2rem(70);
    height: 100%;
    .aui-content {
        padding-top: px2rem(70);
        padding-bottom: 0;
    }
}

.qDetail {
    &__tip {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        font-size: px2rem(28);
        line-height: px2rem(70);
        color: #F99E00;
        background-color: #FFF9E1;
        padding-left: px2rem(32);
        z-index: 1;
    }
    &__content {
        height: 100%;
        overflow-y: auto;
    }
    &__q {
        background-color: #fff;
        &>p {
            position: relative;
            height: px2rem(94);
            padding: px2rem(20) px2rem(32);
        }
        &-headerimg {
            float: left;
            width: px2rem(54);
            height: px2rem(54);
            background: url(./img/header@3x.png) no-repeat center center;
            background-size: cover;
            margin-right: px2rem(17);
        }
        &-name {
            float: left;
            line-height: px2rem(54);
            color: #222;
            font-size: px2rem(28);
        }
        &-time {
            position: absolute;
            right: px2rem(32);
            top: px2rem(20);
            color: #999;
            font-size: px2rem(24);
            line-height: px2rem(54);
        }
        h3 {
            padding: 0 px2rem(32) px2rem(40) px2rem(79);
            position: relative;
            p {
                font-size: px2rem(30);
                color: #222;
                line-height: px2rem(38);
            }
        }
        &-icon-q {
            position: absolute;
            left: px2rem(32);
            top: px2rem(2);
            width: px2rem(41);
            height: px2rem(30);
            background: url(./img/question.png) no-repeat center center;
            background-size: cover;
        }
        &-icon-a {
            background-image: url(./img/answer.png)
        }
    }
    &__a {
        margin-top: px2rem(20);
        h3 p {
            // overflow: hidden;
            display: block;
            font-size: px2rem(26);
            font-weight: normal;
        }
        &:last-child {
            margin-bottom: px2rem(20)
        }
    }
    &__loadtxt {
        font-size: px2rem(26);
        color: #999;
        line-height: px2rem(94);
        text-align: center;
        margin-bottom: px2rem(160);
    }
    &__btn {
        position: fixed;
        bottom: px2rem(40);
        left: 50%;
        width: px2rem(345);
        transform: translateX(-50%);
    }
    &__null {
        position: relative;
        padding-top: px2rem(538);
        font-size: px2rem(28);
        color: #999;
        line-height: px2rem(32);
        text-align: center;
        &-icon {
            position: absolute;
            left: 50%;
            top: px2rem(300);
            width: px2rem(200);
            height: px2rem(200);
            transform: translateX(-50%);
            background: url(./img/null.png) no-repeat center center;
            background-size: cover;
        }
    }
}
</style>
