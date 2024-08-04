<!--
    Created by Liujuanjuan on 03/04/2019
-->
<template>
    <div class="aui-page service">
        <hybrid-header :config="barConfig" />
        <div class="aui-content" ref="scrollEl">
            <div
                class="aui-cell aui-cell_auto service__alert"
                v-if="noticeMsg!=''"
                ref="serviceAlert"
                v-html="noticeMsg"
            ></div>
            <div class="service__content" ref="serviceCon">
                <div class="aui-cells" v-if="autoService.length>0">
                    <div class="service__title">
                        <span>自助服务</span>
                    </div>
                    <div class="aui-cell aui-cell_auto auto-service">
                        <div
                            class="auto-service__item"
                            v-for="(service, index) in autoService"
                            :key="index"
                            @click="handleServiceClick(service.redirectUrl,index+1, service.content, $event)"
                        >
                            <img class="auto-service__icon" :src="service.imageUrl" alt />
                            <p class="auto-service__item--title">{{service.content}}</p>
                        </div>
                    </div>
                </div>
                <div class="aui-cells" v-if="questions.length>0">
                    <div class="service__title">
                        <span>猜你想问</span>
                    </div>
                    <div class="questions__container" v-for="(category,i) in questions" :key="i">
                        <template v-if="category.questionList && category.questionList.length>0">
                            <div class="question title" :class="{open:category.questionOpen}" ref="gridRow" @click="getMore(category,i)">
                                <img class="question__icon" :src="category.imageUrl" alt />
                                <div>{{category.content}}</div>
                                <div class="arrow" v-if="category.questionList && category.questionList.length>questionNum"></div>
                            </div>
                            <div class="questions">
                                <div class="question" v-for="(question,index) in category.questionList.slice(0,category.questionOpen?category.questionList.length:questionNum)" :key="index" @click="showDetail(question.answer)">
                                    <div class="title">{{question.question}}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="service__footer" ref="serviceFoo">
                <a href="javascript:;" class="half" @click="openImFn">
                    <div class="service__icon"></div>
                    <div class="service__txt">在线客服</div>
                </a>
            </div>
        </div>
        <action-sheets class="question__detail" :isPop="modalshow" @complete="modalshow = false">
            <div slot="title" class="question__header">
                <a href="javascript:;" class="question__close" @click="modalshow = false">取消</a>
                <div class="question__title">{{modalInfo.title}}</div>
            </div>
            <div
                slot="menu"
                class="question__content"
                ref="questionCon"
                @click="cb"
                v-html="modalInfo.content"
            ></div>
            <div slot="btn" class="aui-cells question__footer">
                <div
                    class="aui-cell aui-cell_access"
                    v-for="(item,i) in modalInfo.relate"
                    :key="i"
                    @click="showDetail(item.docid)"
                >
                    <template v-if="modalInfo.relate.length>0">
                        <div class="aui-cell__bd">{{item.link_name}}</div>
                        <div class="aui-cell__ft"></div>
                    </template>
                </div>
                <div class="aui-cell">
                    <div class="aui-cell__bd">还没解决问题？</div>
                    <div class="aui-cell__ft question__contact" @click="openImFn">在线客服</div>
                </div>
            </div>
        </action-sheets>
    </div>
</template>
<script>
import { AXD, parseQuery } from 'libs/util'
import { setTimeout } from 'timers'
import actionSheets from 'components/actionsheets/index.vue'
import { getCsFacade, questionAnswer, selfServiceBuryPoint, csFacadeBuryPoint } from 'src/store/modules/help'
import sensors from '@ac/sensors'
import { newSobotIm } from 'src/libs/im'

export default {
    name: 'help',
    data() {
        return {
            noticeMsg: '',
            modalshow: false,
            modalInfo: {
                title: '',
                content: '',
                relate: []
            },
            autoService: [],
            questions: [],
            questionOpen: false,
            questionNum: 4,
            imData: {
                refMerchantId: '',
                platform: '',
                productId: ''
            },
            barConfig: {
                leftAction: 'back',
                h5: {
                    visible: false,
                    rightBtnShow: false
                },
                app: {
                    visible: true,
                    rightBtnShow: false
                }
            },
            isApp: aixuedai.isUavoApp === 'y',
            sobotUrl: ''
        }
    },
    components: {
        actionSheets
    },
    mounted() {
        // 加载首页数据
        getCsFacade().then(res => {
            if (res.success) {
                for (let item of res.result) {
                    switch (item.configType) {
                        case '1':
                            this.noticeMsg = item.content
                            break
                        case '2':
                            this.autoService.push(item)
                            break
                        case '3':
                            item.questionOpen = false
                            this.questions.push(item)
                            break
                    }
                }
            } else {
                this.$_toast(res.resultDes)
            }
        })
        if (!this.isApp && process.env.NODE_ENV === 'production') {
            setTimeout(() => {
                window.location.href = aixuedai.h5WebUrl + '/activity/activity-download-main/index?appto=zjl%3A%2F%2F'
            }, 5000)
        }
    },
    updated() {
        // 原生获取屏幕高度
        let vWidth = document.body.clientWidth
        let vHeight = document.body.clientHeight
        let scrollEl = this.$refs.scrollEl.clientHeight
        let serviceAlert = this.$refs.serviceAlert ? this.$refs.serviceAlert.clientHeight : 0
        let serviceCon = this.$refs.serviceCon.clientHeight
        if (serviceAlert + serviceCon > scrollEl) {
            this.$refs.serviceFoo.style.position = 'fixed'
        }
        this.$refs.questionCon.style.setProperty('--vWidth', vWidth)
        this.$refs.questionCon.style.setProperty('--vHeight', vHeight)
    },
    methods: {
        cb: function(event) {
          const path = event.path || (event.composedPath && event.composedPath())
          if (event.target.nodeName === 'B' && path[1].nodeName === 'A') {
            event.preventDefault()
            this.goUrl(path[1].href)
          }
        },
        // 自助服务 埋点
        handleServiceClick(url, position, content, event) {
            sensors.quick('trackHeatMap', event.target, {
                $element_content: content
            })
            selfServiceBuryPoint({ position }).then(res => {
                // url = 'zjl://user/bankList?loginFirst=true&amp;backToHome=false'
                // url = 'zjl://home/showTab?tabIndex=0'
                this.goUrl(url)
            })
        },
        goUrl(url) {
            const urlArr = url.split('://')
            if (!this.isApp) {
                if (urlArr[0] === 'axd') {
                    window.location.href = aixuedai.appDownloadUrl
                } else {
                    window.location.href = url
                }
            } else {
                if (urlArr[0] === 'axd') {
                    // 原生页面
                    const urlArr2 = url.split('?')
                    if (urlArr2.length <= 1) {
                        return false
                    }
                    const rootPage = parseQuery(urlArr2[1]).tabIndex
                    axdApp.send({
                        module: 'navigation',
                        method: 'goPage',
                        params: {
                            page: 'root',
                            loginFirst: false,
                            closeToRoot: true,
                            rootPage
                        },
                        callback() {}
                    })
                } else {
                    // 普通页面
                    AXD.util.goURL({ url })
                }
            }
        },
        // 问题详情
        showDetail(question) {
            this.modalshow = false
            questionAnswer({ question }).then(res => {
                const data = res && res.result && res.result.item ? res.result.item : {}
                this.modalshow = !this.modalshow
                this.modalInfo.title = data.question_title
                this.modalInfo.content = data.answer_desc
                this.modalInfo.relate = data.link_question_list
            })
        },
        // 问题展开事件
        getMore(category, i) {
            if (category.questionList && category.questionList.length <= this.questionNum) return
            if (!category.questionOpen) {
                this.$refs.scrollEl.scrollTop = Number(this.$refs.gridRow[i].parentElement.parentElement.offsetTop + this.$refs.gridRow[i].offsetTop)
            }
            category.questionOpen = !category.questionOpen
        },
        openImFn() {
            AXD.util.isLogin().then(() => {
                // 获取智齿客服机器人URL
                newSobotIm(res => {
                    window.location.href = res
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.service {
    color: #424243;
    .question__detail {
        line-height: px2rem(44);
        .question {
            &__header {
                @include hairline(bottom);
                background: #fff;
                padding: px2rem(26) px2rem(32);
            }
            &__title {
                font-size: px2rem(36);
            }
            &__close {
                font-size: 0;
                float: right;
                width: px2rem(32);
                height: px2rem(32);
                background-size: contain;
                background-repeat: no-repeat;
                @include img2x(img/close_icon);
            }
            &__content {
                padding: px2rem(40) px2rem(32);
                font-size: $auiFontSizeLevel5;
                color: #717172;
                --vWidth: 375;
                --vHeight: 667;
                --qusHeaderH: calc(96 * 320 / 750 / 20);
                --qusFooterH: calc(208 * 320 / 750 / 20);
                --conHeight: calc(var(--vHeight) * 2 / 3 * 320 / var(--vWidth) / 20);
                --FinHeight: calc(var(--conHeight) - var(--qusHeaderH) - var(--qusFooterH));
                max-height: calc(var(--FinHeight) * 1rem);
                overflow: auto;
                ::v-deep img {
                    max-width: 100%;
                    width: auto;
                }
            }
            &__footer {
                margin: px2rem(40) 0 px2rem(48);
            }
            &__contact {
                color: #f18800;
                padding-left: px2rem(48);
                height: px2rem(36);
                line-height: px2rem(36);
                background-size: contain;
                background-repeat: no-repeat;
                @include img2x(img/contact_icon);
            }
        }
    }

    &__alert {
        background: #fffadf;
        width: 100%;
        line-height: px2rem(36);
        color: #f18800;
        font-size: $auiFontSizeLevel5;
        span {
            @include nLineLimit(2);
        }
    }

    &__title {
        width: 100%;
        height: px2rem(32);
        margin: px2rem(34) px2rem(32);
        color: #131314;

        span {
            position: relative;
            display: table-cell;
            padding-left: px2rem(40);
            font-size: px2rem(56);
            transform: scale(0.5);
            transform-origin: 0 0;
            height: px2rem(56);
            line-height: px2rem(56);
            border-left: px2rem(16) solid #ffe513;
        }
    }
    &__content {
        padding-bottom: px2rem(136);
        .aui-cells:first-child {
            margin-top: 0;
        }

        .auto-service {
            padding: 0 0 px2rem(40);
            flex-wrap: wrap;
            // justify-content: space-around;
            text-align: center;

            &::before {
                left: 0;
            }

            &__icon {
                margin: 0 auto;
                width: px2rem(100);
                height: px2rem(100);
            }

            &__item {
                flex-basis: px2rem(242);
                margin-top: px2rem(40);
                padding: 0 px2rem(20);

                &--title {
                    margin-top: px2rem(12);
                    font-size: $auiFontSizeLevel7;
                    line-height: px2rem(32);
                    color: #424243;
                    @include nLineLimit(2);
                }
            }
        }

        .questions__container {
            text-align: center;
            display: flex;
            .questions {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
            }

            .question {
                @include boxShadow(1px, -1px, 0px, 0px, rgba(236, 236, 236, 1));
                font-size: $auiFontSizeLevel7;
                flex: 1 0 px2rem(269);

                .title {
                    padding: px2rem(32) px2rem(10);
                }

                &__icon {
                    width: px2rem(68);
                    height: px2rem(68);
                    margin: 0 auto;
                }

                &.title {
                    flex: 0 0 px2rem(188);
                    padding: px2rem(28) px2rem(20);
                    border: none;
                    font-size: $auiFontSizeLevel5;
                    line-height: px2rem(36);

                    &.open {
                        .arrow {
                            transform: rotate(180deg);
                        }
                    }

                    &::before {
                        display: none;
                    }

                    .arrow {
                        width: px2rem(28);
                        height: px2rem(14);
                        margin: px2rem(22) auto;
                        transition: transform 0.2s;
                        background-size: contain;
                        background-repeat: no-repeat;
                        @include img2x(img/arrow_icon);
                    }
                }
            }
        }
    }

    &__footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: px2rem(116);
        padding: px2rem(14);
        background: #fff;
        text-align: center;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);

        .service__icon {
            margin: 0 auto;
            width: px2rem(52);
            height: px2rem(52);
            background-size: contain;
            background-repeat: no-repeat;
            @include img2x('img/service_icon');
        }

        .service__txt {
            margin-top: px2rem(4);
            font-size: $auiFontSizeLevel7;
            line-height: px2rem(33);
            color: #f18800;
        }
    }
}
</style>
