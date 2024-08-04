<!--
    Create by sunxj on 08/30/17
 -->
<template>
    <div>
        <section class="virtual-search" ref="searchBox">
            <div class="virtual-search_bd">
                <span class="icon-search"></span>
                <input type="text" class="aui-input" placeholder="搜索游戏或会员" v-model.trim="searchName" @focus="toFocus" @blur="toBlur" ref="searchIpt" />
                <span v-if="closeShow" @click="clearInput" class="icon-delete"></span>
            </div>
            <span v-if="searchBtnShow" class="virtual-search_btn" @click="search">搜索</span>
        </section>
        <div v-show="cancelShow" class="search_recovery" ref="cancelBox" :style="'height:' + differH + 'px'" @click="recoveryInput"></div>
    </div>
</template>
<script>
export default {
    name: 'virtualSearch',
    props: {
        recoverySearchName: String
    },
    data() {
        return {
            searchName: '',
            saveSearchName: '',
            searchBtnShow: false,
            cancelShow: false,
            differH: 0
        }
    },
    computed: {
        closeShow() {
            if (this.searchName) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        recoverySearchName(val) {
            this.searchName = val
        }
    },
    methods: {
        toFocus() {
            this.searchBtnShow = true
            this.$emit('operation', false)
            let screenH = document.body.clientHeight
            let searchBox = this.$refs.searchBox
            let searchBoxTop = searchBox.offsetTop
            let searchBoxH = searchBox.offsetHeight
            this.differH = screenH - searchBoxTop - searchBoxH
            this.cancelShow = true
        },
        toBlur() {
            if (!this.searchName) {
                this.searchBtnShow = false
                this.$emit('operation', true)
                this.cancelShow = false
            }
        },
        clearInput() {
            this.searchName = ''
            this.saveSearchName = ''
            this.searchBtnShow = false
            this.cancelShow = false
            this.$emit('search', '')
        },
        search() {
            this.saveSearchName = this.searchName
            this.cancelShow = false
            this.$emit('search', this.searchName)
        },
        recoveryInput() {
            this.searchName = this.saveSearchName
            this.$emit('operation', true)
            this.$refs.searchIpt.blur()
            this.cancelShow = false
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.virtual-search {
    padding: px2rem(20) px2rem(32);
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
     ::-webkit-input-placeholder {
        /* WebKit browsers */
        color: $auiTextColorAssistant;
    }
     :-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: $auiTextColorAssistant;
    }
     ::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: $auiTextColorAssistant;
    }
     :-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: $auiTextColorAssistant;
    }
    &_bd {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        position: relative;
        background-color: #fff;
        border-radius: px2rem(34);
        -webkit-border-radius: px2rem(34);
        height: px2rem(60);
        font-size: $auiFontSizeLevel7;
        padding: px2rem(10) px2rem(45) px2rem(8) px2rem(76);
        .icon-search,
        .icon-delete {
            font-size: $auiFontSizeLevel5;
            position: absolute;
            top: px2rem(16);
        }
        .icon-search {
            left: px2rem(44);
        }
        .icon-delete {
            right: px2rem(19);
        }
    }
    &_btn {
        width: px2rem(70);
        text-align: right;
        margin-left: px2rem(16);
        font-size: $auiFontSizeLevel4;
    }
}

.search_recovery {
    background-color: #fff;
}
</style>
