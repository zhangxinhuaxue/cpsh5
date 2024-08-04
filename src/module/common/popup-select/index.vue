<template>
    <popup :isPop="isShow">
        <div class="popup-select" slot="content">
            <div class="popup-select__hd">
                <a class="close" href="javascript:;" @click="close">
                    <span class="icon-close1"></span>
                </a>
                <h3>{{title}}</h3>
            </div>
            <div class="popup-select__bd">
                <slot name="tips">
                    <div class="popup-select__tips">
                        <p>请选择实际资金用途，禁止用于非消费场景</p>
                        <p>招集令保留核实的权利</p>
                    </div>
                </slot>
                <div class="popup-select__list">
                    <div class="popup-select__item" v-for="(item, index) in list" @click="chooseLoanReason(index)">{{item}}</div>
                </div>
            </div>
        </div>
    </popup>
</template>
<script>
import popup from 'components/popup/index.vue'
export default {
    name: 'popup-select',
    props: {
        isShow: {
            type: Boolean
        },
        title: {
            type: String,
            default: '消费用途'
        },
        reasonList: {
            type: Array
        },
        listLength: {
            type: Number
        }
    },
    data() {
        return {
            curReason: ''
        }
    },
    computed: {
        list() {
            let arr = []
            if (this.listLength !== undefined) {
                this.reasonList.length = this.listLength
            }
            this.reasonList.forEach((item, index) => {
                if (typeof item === 'object') {
                    arr.push(item.purposeName)
                } else {
                    arr.push(item)
                }
            })
            return arr
        }
    },
    methods: {
        chooseLoanReason(index) {
            this.curReason = this.list[index]
            this.$emit('chooseReason', this.curReason)
        },
        close() {
            this.$emit('popupSelectClose')
        }
    },
    components: {
        popup
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.popup-select {
    .popup-select__hd {
        display: flex;
        height: px2rem(96);
        line-height: px2rem(96);
        padding: 0 px2rem(32);
        position: relative;
        text-align: center;
        .close {
            display: inline-block;
            width: px2rem(96);
            line-height: px2rem(96);
            position: absolute;
            left: 0;
            top: 0;
            span {
                font-size: px2rem(32);
            }
        }
        & h3 {
            width: 100%;
            line-height: px2rem(96);
            text-align: center;
            font-weight: normal;
            font-size: px2rem(32);
            color: #666;
        }
        &:after {
            @include hairline(bottom);
        }
    }
    .popup-select__tips {
        height: px2rem(130);
        padding: px2rem(30) px2rem(15);
        background-color: #f7f7f7;
        font-size: px2rem(24);
        text-align: center;
        color: #999;
    }
    .popup-select__list {
        max-height: px2rem(576);
        overflow: auto;
    }
    .popup-select__item {
        height: px2rem(96);
        line-height: px2rem(96);
        text-align: center;
        font-size: px2rem(34);
        color: #222222;
        @include hairline(bottom);
    }
}
</style>
