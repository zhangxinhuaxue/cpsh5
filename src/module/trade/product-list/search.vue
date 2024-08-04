<template>
    <div class="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-content">
              <div class="search-box">
                <div class="search">
                  <span class="icon-search"></span>
                  <input type="text" autofocus="autofocus"
                  v-model.trim="message"
                  :placeholder="keyword"
                  @keyup.enter="go">
                  <a href="javascript:;" class="go" @click="go">搜索</a>
                </div>
                <div v-if="history.length > 0" class="history-box">
                  <div class="box-title">
                    <i class="history"></i>
                    <span>历史记录</span>
                    <a href="javascript:;" @click='cleanHistory' class="clean">清除历史</a>
                  </div>
                  <div class="box">
                    <a href="javascript:;" v-for="item in history" @click='tolist(item)'>{{ item }}</a>
                  </div>
                </div>
                <div class="box-title">
                  <i class="hot"></i>
                  <span>热门推荐</span>
                </div>
                <div class="box">
                  <a href="javascript:;"
                  @click='tolist(item)'
                  v-for="item in hot"
                  >{{item}}</a>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
/* global  localStorage history */
import hybridHeader from 'components/header/hybridheader.vue'
import {getHotWords} from 'store/modules/trade/product'
import {isSupportLocalStorage, setLocalStorage} from 'libs/util'
export default {
    name: 'search',
    data() {
        return {
            barConfig: {
                h5: {
                    title: '搜索',
                    rightBtnShow: false // 是否显示右侧按钮
                },
                app: {
                    title: '搜索'
                }
            },
            hot: [],
            history: [],
            message: '',
            keyword: ''
        }
    },
    created() {
        this.init()
    },
    components: {
        hybridHeader
    },
    methods: {
        toback() {
            history.back()
        },
        cleanHistory() {
            this.$_toast({
                txt: '历史记录已清除~',
                callback: () => {
                    this.history = []
                    localStorage.removeItem('history')
                }
            })
        },
        init() {
            if (localStorage.getItem('history')) {
                this.history = JSON.parse(localStorage.getItem('history'))
            }
            getHotWords().then((data) => {
                if (data.success) {
                    this.keyword = data.result.hotSearchKey
                    data.result.hotWords.map((item) => {
                        if (item.name) {
                            this.hot.push(item.name)
                        }
                    })
                }
            })
        },
        tolist(o) {
            let index = this.history.indexOf(o)
            if (index >= 0) {
                this.history.splice(index, 1)
            }
            this.history.unshift(o)
            setLocalStorage('history', JSON.stringify(this.history))
            this.$router.push({
                name: 'productList',
                query: {text: o}
            })
        },
        go() {
            if (isSupportLocalStorage()) {
                this.tolist(this.message || this.keyword)
            } else {
                this.$_toast('请取消浏览器无痕浏览模式，或取消cookie禁用')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/styles/mixins.scss';
@import 'src/style.scss';
    .view{
      height: 100%;
    }
    .search-box{
      // padding-top: px2rem(90);
      height: 100%;
      background: #fff;
    }
    .search{
        @include hairline(top);
        width: 100%;
        padding: px2rem(20) px2rem(10);
        height: px2rem(100);
        background: #fff;
        & ~ .container {
            $top1: 90;
            & > .aui-page{
                top: px2rem(130);
            }
            & .buttons-tab{
                &:before{
                    background-color:#fff;
                }
            }
        }
        .icon-search{
            position: absolute;
            top: px2rem(28);
            left: px2rem(20);
        } 
        input{
            padding:px2rem(10) 0 px2rem(10) px2rem(69);
            line-height: px2rem(30);
            height: px2rem(60);
            border-radius: px2rem(45);
            // border: 1px solid #dedede;
            // background: #e7e7e7;
            border: none;
            width: 85%;
            display: block;
            float: left;
            font-size: $auiFontSizeLevel4;
            background: #fff;
        }
        .go{
            line-height: px2rem(60);
            display: inline-block;
            color: #222;
            float: right;
            font-size: $auiFontSizeLevel5;
            padding-right: px2rem(40);
        }
    }
    // .history-box{
    //   padding-top: px2rem(90);
    // }
    .box-title{
        background: #f7f7f7;
        padding: 0 px2rem(32);
        font-size: $auiFontSizeLevel5;
        span{
            height: px2rem(80);
            line-height: px2rem(80);
            display: inline-block;
            color: #222;
        }
        a.clean{
            color: #F99E00;
            float: right;
            line-height: px2rem(80);
            display: inline-block;
            font-size: $auiFontSizeLevel6;
        }
        i{
            vertical-align:sub;
            display: inline-block;
            width: px2rem(30);
            height: px2rem(30);
            background-size: 100% 100%;
            &.history{
                @include img2x('./img/history');
            }
            &.hot{
                @include img2x('./img/hot');
            }
        }
    }
    .box{
        padding: px2rem(20) px2rem(15);
        background: #fff;
        font-size: 0;
        a{
            border: px2rem(1) solid #E4E4E4;
            display: inline-block;
            border-radius: px2rem(30);
            // height: px2rem(60);
            line-height: px2rem(60);
            outline:0;
            -webkit-appearance: none;
            text-align: center;
            color: #666;
            font-size: $auiFontSizeLevel5;
            padding: 0 px2rem(30);
            margin: px2rem(15);
            max-width: 95%;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
</style>
