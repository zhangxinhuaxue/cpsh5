<!--
    Created by yangjun on 20171204
-->
<template>
    <div class="aui-page" id="qainput" v-if="product">
        <qa-header :config="headerConfig"></qa-header>
        <div class="aui-content">
            <h3 v-if="product.qOra==='q'" class="qainput__name">{{product.productName}}</h3>
            <h3 v-else class="qainput__question">
                <span class="qainput__icon-q"></span>
                <p>{{product.question}}</p>
            </h3>
            <div class="qainput__textarea">
                <textarea v-model="txt" autofocus :placeholder="defaultTxt" wrap="soft" width="100%"></textarea>
            </div>
            <p class="qainput__tip">{{tip}}</p>
            <div @click="subFn" :class="['aui-btn', 'aui-btn_primary',{'aui-btn_primary aui-btn_disabled':disabledBtn}]">{{btnTxt}}</div>
        </div>
        <axd-dialog :showDialog="showDialog" :dialogInfo="dialogInfo" @mainClick="finishSub"></axd-dialog>
    </div>
</template>
<script>
/* global  localStorage */
import qaHeader from 'src/components/header/hybridheader.vue'
import axdDialog from 'src/module/trade/common/item_dialog/dialog.vue'
import { AXD, setLocalStorage } from 'src/libs/util'
import { submitAnswer, submitQuestion } from 'src/store/modules/trade/product'
export default {
    name: 'qaInput',
    components: {
        axdDialog,
        qaHeader
    },
    data() {
        return {
            showDialog: false,
            dialogInfo: {
                title: '',
                content: '回答成功！你的回答正在审核中，预计半天~1天完成',
                btn: '确认',
                singleBtn: true
            },
            product: {
                qOra: 'q',
                question: '',
                questionId: '',
                product: '',
                productId: ''
            }, // 存储query信息
            tipShow: false, // 字数限制提示信息是否展示
            tip: '', // 字数限制提示文案
            txt: '', // 用户输入内容
            btnTxt: '', // 根据提问或回答，按钮文案变化
            disabledBtn: true,
            headerConfig: {
                h5: {
                    title: '问题详情', // title
                    rightBtnShow: false // 是否显示右侧按钮
                },
                app: {
                    rightBtnShow: false
                }
            },
            defaultTxt: '向买过的人提问，4～50个字'
        }
    },
    created() {
        this.initData()
    },
    watch: {
        txt(newVal, oldVal) {
            // 清楚空格和换行
            newVal = newVal.replace(/\s+/g, '').replace(/<\/?.+?>/g, '').replace(/[\r\n]/g, '')
            let len = newVal.length
            if (len >= 1) {
                this.disabledBtn = false
            } else {
                this.disabledBtn = true
            }
            if (len < 50) {
                this.tip = ''
            } else {
                this.tip = '已达字数上限50字，不可再输入'
                this.txt = newVal.substring(0, 50)
            }
            // 只存储最近一次的输入内容
            let setData = {
                id: this.product.qOra === 'q' ? this.product.productId : this.product.questionId,
                txt: this.txt
            }
            setLocalStorage('aym_qa_txt', JSON.stringify(setData))
        }
    },
    methods: {
        initData() {
            // 没有参数报错返回上一页
            let queryInfo = this.$route.query
            queryInfo ? (this.product = queryInfo) : this.falseFn()
            // 如果参数信息存在，先校验是问是答，默认为问
            if (this.product) {
                let { qOra, productName, question, productId, questionId } = this.product
                if (typeof qOra == 'undefined') {
                    qOra = 'q'
                    this.product.qOra = qOra
                }
                let localData = JSON.parse(localStorage.getItem('aym_qa_txt'))
                if (qOra === 'q') {
                    // 校验参数是否齐全，不齐全=>报错返回上一页
                    if (!productName || !productId) {
                        this.falseFn()
                    }
                    // 获取用户之前输入数据,是问题就校验productId是否一致
                    if (localData && (localData.id == this.product.productId)) {
                        this.txt = localData.txt
                    }
                    this.headerConfig.h5.title = document.title = '提交提问'
                    this.btnTxt = '提问'
                } else {
                    // 校验参数是否齐全，不齐全=>报错返回上一页
                    if (!productId || !question || !questionId) {
                        this.falseFn()
                    }
                    // 获取用户之前输入数据,，是回答就校验questionID
                    if (localData && (localData.id == this.product.questionId)) {
                        this.txt = localData.txt
                    }
                    this.headerConfig.h5.title = document.title = '我来回答'
                    this.btnTxt = '回答'
                    this.defaultTxt = '我来回答吧，4~50字'
                }
            }
        },
        subFn() {
            if (this.disabledBtn) {
                return false
            }
            this.verifyRepeat(() => {
                // 根据参数，确定提交接口
                this.product.qOra === 'q' ? this.subQuestion() : this.subAnswer()
            })
        },
        // 提交提问
        subQuestion() {
            let { productId } = this.product
            submitQuestion({
                productId: productId,
                question: this.txt
            }).then(({ success, code, resultDes }) => {
                if (success) {
                    this.dialogInfo.content = '发布成功！你的提问正在审核中，预计半天~1天完成'
                    this.showDialog = true
                } else {
                    if (code == '404') {
                        AXD.util.login()
                    } else {
                        if (code === '401') {
                            this.disabledBtn = true
                        }
                        resultDes && this.$_toast(resultDes)
                    }
                }
            })
        },
        // 提交回答
        subAnswer() {
            let { productId, questionId } = this.product
            let param = {
                productId: productId,
                questionId: questionId,
                answer: this.txt
            }
            submitAnswer(param).then(({ success, code, resultDes }) => {
                if (success) {
                    this.showDialog = true
                } else {
                    if (code == '404') {
                        AXD.util.login()
                    } else {
                        if (code == '403') {
                            this.disabledBtn = true
                        }
                        resultDes && this.$_toast(resultDes)
                    }
                }
            })
        },
        verifyRepeat(callback) {
            this.txt = this.txt.replace(/\s+/g, '').replace(/<\/?.+?>/g, '').replace(/[\r\n]/g, '')
            // 校验为空
            if (this.txt === '') {
                this.$_toast('请先填写内容')
                return false
            }
            if (this.txt.length <= 4) {
                this.tip = '字数太少了，至少4字以上'
                return false
            }
            // 校验重复文本
            let txt = this.txt.split('')
            let count = 0
            txt.forEach((word, index) => {
                let next = txt[index + 1]
                if (next) {
                    if (word === next) {
                        count += 1
                    } else {
                        count = 0
                    }
                }
            })
            if (count >= 5) {
                this.$_toast('重复文本较多，请做修改')
                return false
            }
            // 校验是否为纯数字
            let reg = /^[0-9]*$/
            if (reg.test(this.txt)) {
                this.$_toast('文本为纯数字，请修改')
                return false
            }
            // 校验是否都是特殊符号
            let regEn = /^[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】]*$/
            if (regEn.test(this.txt)) {
                this.$_toast('请输入正确文本')
                return false
            }
            callback && callback()
        },
        // 完成提交之后，把文本清空，返回上一页
        finishSub() {
            this.txt = ''
            localStorage.removeItem('aym_qa_txt')
            this.$router.go(-1)
        },
        // 错误执行
        falseFn() {
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
<style lang="scss" scoped>
@import 'src/style.scss';
h3 {
    border-top: px2rem(1) solid #e4e4e4;
}

.qainput {
    &__name {
        line-height: px2rem(96);
        font-size: px2rem(28);
        color: #222;
        padding: 0 px2rem(32);
        background-color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: px2rem(30);
    }
    &__question {
        position: relative;
        background-color: #fff;
        padding: px2rem(32);
        padding-left: px2rem(82);
        margin-bottom: px2rem(30);
        p {
            font-size: px2rem(30);
            color: #222;
            line-height: px2rem(46);
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }
    &__icon-q {
        position: absolute;
        left: px2rem(32);
        top: px2rem(40);
        width: px2rem(41);
        height: px2rem(30);
        background: url(./img/question.png) no-repeat center center;
        background-size: cover;
    }
    &__textarea {
        width: px2rem(750);
        height: px2rem(300);
        padding: px2rem(20) px2rem(30);
        background-color: #fff;
        textarea {
            width: 100%;
            height: 100%;
            resize: none;
            border: none;
            tap-highlight: transparent;
            font-size: px2rem(28);
            line-height: px2rem(36);
            caret-color: #FFE352;
        }
    }
    &__tip {
        font-size: px2rem(26);
        color: #FF3F3F;
        height: px2rem(78);
        line-height: px2rem(78);
        text-align: center;
    }
}
</style>
