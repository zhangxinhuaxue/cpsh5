<template>
    <popup :isPop="isShow">
        <div class="popup-select" slot="content">
            <div v-if="title" class="popup-select_hd">
                <a class="close" href="javascript:;" @click="close">
                    <span class="icon-close1"></span>
                </a>
                <h3>{{title}}</h3>
            </div>
            <div class="popup-select_bd">
                <slot name="tips"></slot>
                <div class="popup-select_list">
                    <div class="popup-select_item" :class="{'popup-select_item__choose': item.key === chosedItem}" v-for="(item, index) in itemList" @click="chooseItem(index)">{{item.value}}</div>
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
            default: ''
        },
        itemList: {
            type: Array
        },
        listLength: {
            type: Number
        },
        chosedItem: {
            type: String
        }
    },
    data() {
        return {
            curItem: ''
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
        chooseItem(index) {
            this.curItem = this.itemList[index]
            this.$emit('chooseItem', this.curItem)
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
    .popup-select_hd {
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
    .popup-select_tips {
        height: px2rem(130);
        padding: px2rem(30) px2rem(15);
        background-color: #f7f7f7;
        font-size: px2rem(24);
        text-align: center;
        color: #999;
    }
    .popup-select_list {
        max-height: px2rem(616);
        overflow: auto;
    }
    .popup-select_item {
        height: px2rem(88);
        line-height: px2rem(88);
        text-align: center;
        font-size: px2rem(34);
        color: #222222;
        position: relative;
        @include hairline(top);
        &__choose{
            color: #ffb626;
            &::after{
                content: '';
                position: absolute;
                width: px2rem(26);
                height: px2rem(26);
                @include img2x('./imgs/chosed');
                background-size: 100% 100%;
                right: px2rem(40);
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
