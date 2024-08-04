<template>
    <div id="downloadBox" v-if="isH5" v-show="show" class="d-outterbox" :class="[classA]" style="position:fixed;background-color:#fff;">
        <div class="download-box clearfix">
            <div class="icon-closed J_closeDownload" @click="closeDownload"> </div>
            <a class="download-btn" href="javascript:;" @click="download">立即下载</a>
            <div class="icon-logo"> <img v-bind:src="content.url" alt="" /> </div>
                <div class="download-text">
                    <div class="text1">{{content.name}} </div>
                    <div class="text2">{{content.subhead}}</div>
                </div>
            </div>
        </div>
</template>
<script type="text/javascript">
import { getDownLoad } from 'src/store/api'
import hub from 'assets/js/hub'
export default {
    props: {
        classname: String
    },
    data() {
        return {
            isH5: (aixuedai.isUavoApp === 'n'),
            show: false,
            content: {},
            classA: this.classname
        }
    },
    beforeMount() {
        if (this.isH5) {
            this.getDownload()
        }
    },
    methods: {
        notify() {
            this.name = 'change name'
        },
        closeDownload() {
            let self = this
            this.show = false
            // 使用nextTick异步，不会阻塞show的数据绑定更新。否则在执行pageCss的时候需要隐藏的元素依旧是显示的，导致计算错误
            this.$nextTick(function() {
                self.pageCss()
                hub.$emit('downloadClosed')
            })
        },
        getDownload() {
            let self = this
            getDownLoad((res) => {
                if (res.success) {
                    self.content = res.result
                    self.show = true
                    this.$nextTick(function() {
                        self.pageCss()
                        hub.$emit('downloadLoaded')
                    })
                }
            })
        },
        pageCss() {
            let downloadElem = document.querySelector('#downloadBox')
            let height = 0

            if (downloadElem && downloadElem.style.display !== 'none') {
                height = downloadElem.getBoundingClientRect().height
            }
            document.querySelector('body').style.paddingTop = height + 'px'
        },
        download() {
            // 下载app按钮埋点
            let url = window.location.href + '?action=download'
            window.location.href = aixuedai.appDownloadUrl
        }
    }
}
</script>
<style lang="scss">
.d-outterbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
}

.download-box {
    padding: .2963rem;
    background: #373737;
    color: #fff;
    position: relative;
}

.download-box .icon-closed {
    position: absolute;
    top: 0;
    right: 0;
    display: inline-block;
    width: .88889rem;
    height: .88889rem;
    background: url(icon-close.png) no-repeat;
    background-size: 100%;
}

.download-box .icon-logo {
    display: inline-block;
    float: left;
    width: 1.62963rem;
    height: 1.62963rem;
    margin-top: .12882rem;
}

.download-box .icon-logo img {
    width: 100%;
    height: 100%;
}

.download-box .download-text {
    margin-right: 3.86473rem;
    margin-left: 1.80354rem;
    overflow: hidden;
    text-align: center;
    white-space: nowrap;
}

.download-box .download-text .text1 {
    font-size: .65185rem;
    color: #fff;
}

.download-box .download-text .text2 {
    font-size: .56296rem;
    color: #fff;
}

.download-box .download-btn {
    color: #472906;
    float: right;
    display: inline-block;
    font-size: .59259rem;
    margin-top: .2963rem;
    margin-right: .88889rem;
    background: #ffc427;
    padding: .14815rem .2963rem;
    border-radius: .14815rem;
}
</style>
