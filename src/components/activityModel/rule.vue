<template>
    <div type="rule">
        <div class="rule-btn" @click="showRule" :style="topDistance">规则<span class="tips"></span></div>
        <div v-show="show" class="dialog-rule" @touchmove.prevent>
            <div class="dialog-box" :style="styleDialogBox">
                <div class="tilte" :style="styleTitle">
                    {{ config.name }}
                </div>
                <div class="rule-box">
                    <div class="rule-content" v-html="config.contentTxt" @touchmove.prevent=" touchMove($event)" @touchstart.prevent=" touchStart($event)" @touchend.prevent=" touchEnd($event)" :style="{backgroundColor: contentBgColor, color: contentTxtColor, 'transition-timing-function': 'ease-out', 'transform': 'translate(0px, ' + moveDistanceY  + 'px) translateZ(0px)'}">
                    </div>
                </div>
                <div class="foot">
                    <div class="footbtn" :style="styleBtn" @click="closeRule">
                        {{ config.buttonTxt }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    formatColor
} from 'src/libs/util'

export default {
    name: 'rule',
    props: {
        config: Object
    },
    data() {
        return {
            show: false,
            styleDialogBox: {
                backgroundColor: formatColor(this.config.bgColor)
            },
            styleTitle: {
                color: formatColor(this.config.nameColor)
            },
            /* styleContent: {
                backgroundColor: formatColor(this.config.contentBgColor),
                color: formatColor(this.config.contentTxtColor)
            }, */
            contentBgColor: formatColor(this.config.contentBgColor),
            contentTxtColor: formatColor(this.config.contentTxtColor),
            styleBtn: {
                backgroundColor: formatColor(this.config.buttonColor),
                color: formatColor(this.config.buttonTxtColor)
            },
            curPosition: {},
            moveDistanceY: 0,
            startPos: {},
            lastMoveDistanceY: 0
        }
    },
    computed: {
        topDistance() {
            let ej = this.config.extJsonObj
            if (ej && ej.topDistance) {
                return {
                    top: window.hotcss.px2rem(ej.topDistance, 750) + 'rem'
                }
            }
        }
    },
    methods: {
        showRule() {
            this.show = true
        },
        closeRule() {
            this.show = false
        },
        touchMove(e) {
            let eleRuleBox = document.querySelector('.rule-box')
            let eleRuleContent = document.querySelector('.rule-content')

            let touch = e.touches[0]
            this.curPosition = {
                x: touch.pageX,
                y: touch.pageY
            }

            let moveY = this.lastMoveDistanceY + this.curPosition.y - this.startPos.y
            let limitHeight = eleRuleBox.offsetHeight - eleRuleContent.offsetHeight

            if (moveY >= 0) {
                this.moveDistanceY = 0
            } else if (moveY <= limitHeight) {
                this.moveDistanceY = limitHeight
            } else {
                this.moveDistanceY = moveY
            }
        },
        touchStart(e) {
            let touch = e.touches[0]
            this.startPos = {
                x: touch.pageX,
                y: touch.pageY
            }
        },
        touchEnd(e) {
            this.lastMoveDistanceY = this.moveDistanceY
        }
    }
}
</script>
<style lang="scss">
@import 'style.scss';

@mixin common-rule($width) {
    .rule-btn {
        position: absolute;
        // display: flex;
        // display: -webkit-flex;
        // display: box;
        font-size: px2rem(24);
        color: #fff;
        width: auto;
        padding: 0 px2rem(6) 0 px2rem(12);
        line-height: px2rem(40);
        height: px2rem(40);
        right: 0;
        top: px2rem(36);
        z-index: 95;
        border-top-left-radius: px2rem(20);
        border-bottom-left-radius: px2rem(20);
        background: rgba(0, 0, 0, 0.4);

        .tips {
            display: inline-block;
            vertical-align: middle;
            margin-left: px2rem(4);
            margin-top: px2rem(-3);
            width: px2rem(26);
            height: px2rem(26);
            background: transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjOGQ2OGI4ZC0zZmQxLTgxNGYtYjhmOS0zYzYwYzkzYjkzYWQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzBDODUxNEJCQUI2MTFFNjg3MjNDQzk0MUUwNUNDQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzBDODUxNEFCQUI2MTFFNjg3MjNDQzk0MUUwNUNDQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA5YWY0ZTNiLTFjZWEtODI0Yy05ZjE1LTczYWQ2MjcwZmZiOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjOGQ2OGI4ZC0zZmQxLTgxNGYtYjhmOS0zYzYwYzkzYjkzYWQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5mysk0AAAB2ElEQVR42rSVMUvDUBDHX8QWh0A1SyI46FQooi4tOEkndXDQTT+FLio4KxQH3fwGujm4qFMH6WImtVACAYWqqUtsJ2mWehcu4bVN3kuGHPz6An13//eOe3fKYDBgWdok/liWFff/DLALbAJLgAF4wCdgA/fADfAb5VwsFpmCN4gQmAIOgENgWnLILnAOXAB/owITEQ7zgAmcJQjOaM8p8Ey+4ynibA54onXIbNtmnuf536VSKUpokXxXKYVjApiW26jgaO12m3U6HZFAcECMsRaki0/RPlCO8+SrLRCKsTLFYryABhyLvBRFSVOdRxQzFMBSLIg8dF0Pb6KqqkygQDFDgfWkR8ObJBBA2+AFVjJ4xMu8gC7brWlaWgGdF+hn1YsCAUe2MZ/P+6thGElj//ACVpIUYfAUqXrhX/IjsCXzqFarabLzwN8AW25PtNt1XVav15lpmmFPEliPYoYCLlATeTQaDeY4jt/0Wq2WTKBGMYd60SXwJupF+Mhw7feFRdekWGxUALvfDvAd5YUdNJfL+a9Y0E2/gG1+8ERNtAXgjvp7GmtSoXzIJto7UAFOaBzKrEt7K3zwuInGpwtH5hWwR40Lh/4s9zBfqRSv44Z+mKIs7V+AAQDOkoR4VBcRPQAAAABJRU5ErkJggg==) 0 center no-repeat;
            background-size: cover;
        }
    }

    .dialog-rule {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 9999;

        .dialog-box {
            width: px2rem(600);
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            background: #ee415d;
            border-radius: px2rem(10);
            position: relative;

            &.no-title {
                background: #ffffc4;
                padding: px2rem(40) px2rem(30);

                .content {
                    text-align: center;

                    p {
                        color: #a20f00;
                        font-size: px2rem(24);
                    }

                    .title {
                        font-weight: 700;
                        font-size: px2rem(30);
                        margin-bottom: px2rem(10);
                    }
                }

                .footbtn {
                    background: #f3543e;
                    color: #fff;
                    border-radius: px2rem(3);
                    width: px2rem(410);
                    margin-top: px2rem(50);
                }
            }

            .tilte {
                color: #fff;
                font-size: px2rem(36);
                text-align: center;
                padding-top: px2rem(26);

                .close-btn {
                    display: inline-block;
                    width: px2rem(50);
                    height: px2rem(50);
                    position: absolute;
                    top: px2rem(-10);
                    right: px2rem(-8);
                    background-size: 100%;
                }
            }

            .rule-box {
                margin-top: px2rem(20);
                background: #fff;
                color: #ee415d;
                font-size: .6rem;
                line-height: .75rem;
                max-height: px2rem(600);

                overflow: hidden;

                /* .rule {
                    color: #a20f00;
                    font-size: px2rem(24);
                    line-height: px2rem(30);
                    margin-bottom: px2rem(10);
                } */
                .rule-content {
                    padding: px2rem(24);
                }
            }

            .foot {
                text-align: center;
            }

            .footbtn {
                display: inline-block;
                padding: px2rem(10) px2rem(30);
                border: px2rem(2) solid #fff;
                font-size: px2rem(20);
                color: #fff;
                background: #ee415d;
                margin: px2rem(30) auto;
                border-radius: px2rem(8);
                white-space: nowrap;
            }
        }
    }
}

@include common-rule(640);
</style>
