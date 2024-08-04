<template>
    <m-modal :isShow="isShow"
        ref="modal2"
        :title="title"
        @close="hideModal"
        @mask-click="hideModal">
        <div slot="content" class="content">
            <p class="select-title">已选择</p>
            <p class="select-items">
                <span class="select-item" 
                    v-for="(item, index) in selectItem" 
                    :key="index" 
                    @click="tabChange(index)"
                    :class="{'tab_active': index === activeTab}">{{item}}
                </span>
            </p>
            <div class="list" v-for="(list, index) in dataList" :key="index" v-show="activeTab === index">
                <div v-for="(item, idx) in list.list" class="list-item" :key="idx" @click="select(item, index)">
                    <!-- <div class="list-item-hd">
                        <span v-if="index3 === 0">{{key}}</span>      
                    </div> -->
                    <span>{{item[list.name]}}</span>
                </div>
            </div>    
        </div>
    </m-modal>
</template>
<script>
export default {
    name: 'credit-area',
    props: {
        dataList: {
            type: Array,
            default: function() {
                return []
            }
        },
        title: {
            type: String,
            default: '选择省份地区'
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            activeTab: 0,
            selectItem: ['请选择']
        }
    },
    methods: {
        handleClick(event) {
            if (this.link) {
                if (!this.disabled) {
                    this.$router.push({
                        name: this.link
                    })
                }
            } else {
                this.$emit('click', event)
            }
        },
        hideModal() {
            this.$emit('areaClose')
        },
        tabChange(index) {
            this.activeTab = index
        },
        select(item, index) {
            this.$emit('areaSelect', item, index)
            this.selectItem.splice(index, this.selectItem.length - index)
            this.selectItem.push(item[this.dataList[index].name])
            if (index !== this.dataList.length - 1) {
                this.selectItem.push('请选择')
            }
            if (this.activeTab === this.dataList.length - 1) {
                this.activeTab = 0
                this.hideModal()
                return
            }
            this.activeTab++
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
::v-deep .mui-modal__content {
    max-height: px2rem(990);
}
.content{
    text-align: left;
}
.select-title {
    padding: px2rem(26) px2rem(32) px2rem(14);
    font-size: $auiFontSizeLevel7;
    color: $auiTextColorAssistant;
}
.select-items {
    background-color: #fafafa;
    font-size: $auiFontSizeLevel5;
    padding: 0 px2rem(35);
    display: flex;
}
.select-item {
    margin-right: px2rem(50);
    line-height: px2rem(80);
    height: px2rem(80);
    position: relative;
    max-width: px2rem(200);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.list {
    height: px2rem(740);
    padding-top: px2rem(20);
    font-size: $auiFontSizeLevel6;
    color: $auiTextColorGeneral;
    overflow-y: scroll;
}
.list-item {
    padding: 0 px2rem(32);
    line-height: px2rem(80);
    display: flex;
}
// .list-item-hd {
//     color: $auiTextColorAssistant;
//     min-width: px2rem(58);
// }
.tab_active {
    color: var(--auiTipsColor);
}
.tab_active:after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: px2rem(4);
    bottom: 0;
    background-color: var(--auiTipsColor);
}
</style>
