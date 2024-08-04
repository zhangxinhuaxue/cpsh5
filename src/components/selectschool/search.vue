<template>
    <div class="search-wrap" :class="{'searchStyle':isSearch}">
        <div class="search" :class="{'pseudo-search':!isSearch}">
            <div class="search-box" @click="fnFocus">
                <input v-model="iptText" type="text" name="" maxlength="20" ref="inputEle" @input="inputHandle" @compositionstart="compositionstartHandle" @compositionend="compositionendHandle">
                <span v-show="!isSearch" @click="fnFocus" class="placeholder icon-search"><span>搜索学校名称</span></span>
                <span v-show="isSearch" class="del-btn" @click="inputClear">
                    <span class="icon-delete"></span>
                </span>
            </div>
            <div v-show="isSearch" class="cancel-btn" @click="cancel">取消</div>
        </div>
        <div class="search-list" v-show="isSearch">
            <div class="aui-cells">
                <div class="aui-cell" v-for="item in list" @click="searchSelect(item)">
                    <div class="aui-cell__bd" ref="nameEle" v-html="showName(item)">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import { schoolSerach, schoolSerachApp } from './api'
import { testChinese } from './common'
export default {
    name: 'search',
    data() {
        return {
            isSearch: false,
            iptText: '',
            isLock: true,
            list: []
        }
    },
    watch: {},
    created() {},
    beforeMount() {},
    mounted() {},
    methods: {
        fnFocus() {
            let me = this
            this.isSearch = true
            this.$emit('search', this.isSearch)
            this.$refs.inputEle.focus()
        },
        cancel() {
            this.isSearch = false
            this.iptText = ''
            this.list = []
            this.$emit('search', this.isSearch)
        },
        inputClear() {
            this.iptText = ''
            this.list = []
            this.$refs.inputEle.focus()
        },
        inputHandle(e) {
            let _me = this
            // 只有当直接输入结束并且长度大于0，才请求数据 (要做中文校验)
            if (this.isLock && this.iptText.trim().length > 0) {
                // 根据输入关键字获取学校列表
                if (_me.check()) {
                    this.schoolSearch({ schoolName: this.iptText }).then((data) => {
                        if (data.success) {
                            if (data.result && data.result.length > 0) {
                                _me.list = data.result
                            }
                        }
                    })
                }
            } else {
                this.list = []
            }
        },
        compositionstartHandle(e) {
            this.isLock = false
        },
        compositionendHandle(e) {
            this.isLock = true
        },
        searchSelect(item) {
            this.$emit('searchSelect', item)
        },
        showName(item) {
            if (this.iptText.trim() === '') {
                return
            }
            let tpl = `<span>${this.iptText}</span>`
            return item.schoolName.replace(new RegExp(this.iptText), tpl)
        },
        check() {
            if (!testChinese(this.iptText)) {
                return false
            }
            return true
        },
        schoolSearch(params) {
            if (this.isApp) {
                return schoolSerachApp(params)
            } else {
                return schoolSerach(params)
            }
        }
    },
    components: {},
    updated() {
        if (this.list.length > 0) {
            this.$refs.nameEle.forEach((item) => {
                let s = item.querySelector('span')
                if (s) {
                    s.style.color = '#FFB626'
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/rem.scss';
$designWidth: 750;
.search-wrap {
    width: 100%;
    height: px2rem(100);
    padding: px2rem(20) 0 0;
    .search {
        display: flex;
        width: 100%;
        height: px2rem(70); // line-height: px2rem(70);
        input {
            width: px2rem(530);
            height: px2rem(60);
            padding: px2rem(10) px2rem(20);
            font-size: px2rem(26);
            color: #222;
            border: none;
            background-color: transparent;
            vertical-align: bottom;
            position: static;
        }
    }
    .search-box {
        width: px2rem(600);
        height: px2rem(60);
        line-height: px2rem(60);
        margin-left: px2rem(32);
        position: relative;
        border-radius: px2rem(4);
        background-color: #f7f7f7;
        .del-btn {
            display: flex;
            width: px2rem(60);
            height: px2rem(60);
            line-height: px2rem(60); // padding: 0 px2rem(20);
            justify-content: center;
            position: absolute;
            top: 0;
            right: 0;
        }
        .icon-delete {
            font-size: px2rem(26);
            &:before {
                color: #D8D8D8;
                line-height: px2rem(60);
            }
        }
    }
    .cancel-btn {
        // width: 100%;
        height: px2rem(60);
        line-height: px2rem(60);
        font-size: px2rem(26);
        color: #222;
        padding: 0 px2rem(32);
        text-align: center;
    }
    .pseudo-search {
        width: px2rem(686);
        height: px2rem(70);
        position: relative;
        background-color: #fff;
        border-radius: px2rem(4);
        margin: 0 auto;
        .search-box {
            width: 100%;
            height: px2rem(70);
            padding-left: 0;
            background-color: #fff;
            border-radius: px2rem(4);
            input {
                width: 100%;
                height: px2rem(70);
                background-color: transparent;
            }
        }
        .placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #999;
            font-size: px2rem(26);
            span {
                font-size: px2rem(26);
            }
        }
        .icon-search:before {
            margin-right: px2rem(8); // vertical-align: middle;
        }
    }
}

.searchStyle {
    background-color: #fff;
}

.aui-cells {
    margin-top: 0;
    padding-top: px2rem(30);
    .aui-cell__bd {
        color: #101010;
    }
}
</style>
