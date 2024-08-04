<!--
    created by zhaozhisheng on 05/23/2017
    使用请注意
    1、这个header样式依赖AUI，所以使用时请自觉引入AUI
    2、APP下右侧按钮自定义事件（也就是除了分享、关闭之外的），请在自己的组件中先将事件定义在window变量下，然后再向本组件传递window下变量名。生命window变量时，注意this指向已经变了，不要用。
    3、app原生头参数说明如下
    {
        visible: true, // 是否显示bar
        color: '#ffffff', // 背景颜色
        leftbuttonVisible: '', // 导航栏左（返回）按钮是否显示
        leftbuttonAction: '', // 左侧点击按钮响应事件,为空则APP浏览器执行默认的 history.back
        rightbuttonVisible: , // 右侧按钮是否显示
        rightbutton: 'close', // 右侧按钮close share custom
        shareInfo: { // 当导航栏右按钮为分享按钮时的分享内容
            title: '招集令，分期爱自己',
            info: '招集令(原爱学贷)-年轻人超爱的分期购物商城',
            img: 'https://img.aiyoumi.com/null/2017524/164422601/20170524164422_400x400.png',
            url: ''
        },
        rightbuttonInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
            showType: 'IMAGE', // TEXT:文字 IMAGE:图片
            imageUrl: '', // 图⽚地址
            textColor: '', // #ff0000颜色 showType=TEXT
            text: '', // 展示文字内容 showType=TEXT
            action: '' // 点击右侧按钮执⾏的js函数名,记得定义window全局变量
        }
    }
    4、added by wangxiaoxiang 新增enforce参数，是否强制使用app/h5头部。
    5、update by zhaozhisheng 更新上面的enforce参数处理逻辑。
 -->
<template>
    <header class="aui-navbar" v-if="showH5Bar"  :style="{backgroundColor: formatedConfigH5.color}">
        <a class="aui-navbar__back" href="javascript:;" @click="clickHandler('left')">
            <i class="icon-back"></i>
        </a>
        <a class="aui-navbar__tools" href="javascript:;" @click="clickHandler('right')" v-if="formatedConfigH5.rightBtnShow">
            <span v-if="!formatedConfigH5.isIcon" class="font30">{{formatedConfigH5.text}}</span>
            <img v-else :src="formatedConfigH5.icon" alt=" ">
        </a>
        <slot name="tabs">
          <h1 class="aui-navbar__title">
              {{formatedConfigH5.title}}
          </h1>
        </slot>
    </header>
</template>
<script>
/* global history */
import { getShareList } from 'src/libs/share'
export default {
    props: {
        config: {
            type: Object
        }
    },
    data() {
        return {
            isApp: window.aixuedai.isUavoApp === 'y',
            showH5Bar: true,
            shareUrl: '',
            appConfig: {}
        }
    },
    watch: {
        config: {
            handler(curVal, oldValue) {
                if (this.isApp && !this.showH5Bar) {
                    this.setAppBar()
                }
            },
            deep: true
        }
    },
    computed: {
        formatedConfigH5() {
            if (typeof this.config !== 'undefined') {
                let h5Visible = true
                let btnShow = true
                let isIcon = true
                let h5Icon = 'https://img.aiyoumi.com/null/2017615/101826940/20170615101826_50x50.png' // 右侧图标
                let h5Text = '关闭'
                let h5title = ''
                let backgroundColor = '#fff'
                if (this.config.h5) {
                    h5Visible = this.config.h5.visible == undefined ? true : this.config.h5.visible
                    btnShow = this.config.h5.rightBtnShow == undefined ? true : this.config.h5.rightBtnShow
                    isIcon = this.config.h5.icon == undefined ? true : this.config.h5.icon
                    h5Icon = this.config.h5.icon || h5Icon
                    h5Text = this.config.h5.text || h5Text
                    h5title = this.config.h5.title || h5title
                    backgroundColor = this.config.h5.color || backgroundColor
                }

                return {
                    visible: h5Visible, // 是否显示
                    title: h5title || document.title, // title
                    rightBtnShow: btnShow, // 是否显示右侧图标
                    isIcon: isIcon, // 图标or文字
                    icon: h5Icon, // 右侧图标
                    text: h5Text, // 右侧文案
                    color: backgroundColor // 背景颜色
                }
            } else {
                return {
                    visible: true, // 是否显示
                    title: document.title, // title
                    rightBtnShow: false // 是否显示右侧图标
                }
            }
        },
        formatedConfigApp() {
            if (typeof this.config !== 'undefined') {
                // 下载地址 找不到就跳官网
                let downLoadUrl = aixuedai ? aixuedai.appDownloadUrl : 'https://www.zhaojiling.com'

                /* 基础显示要素 */
                let barShowFlag = true
                let leftBtnShowFlag = true
                let rightBtnShowFlag = true
                let backgroundColor = '#ffffff'
                let rightbuttonType = 'close'
                let leftbuttonAction = ''
                if (this.config.app) {
                    barShowFlag = this.config.app.visible == undefined ? true : this.config.app.visible
                    leftBtnShowFlag = this.config.app.leftbuttonVisible == undefined ? true : this.config.app.leftbuttonVisible
                    rightBtnShowFlag = this.config.app.rightBtnShow == undefined ? true : this.config.app.rightBtnShow
                    backgroundColor = this.config.app.color || backgroundColor
                    rightbuttonType = this.config.app.rightBtn || rightbuttonType
                    leftbuttonAction = this.config.app.leftbuttonAction || leftbuttonAction
                }

                /* 右键显示要素 */
                let rightbuttonInfoParams = {
                    showType: 'IMAGE',
                    imageUrl: 'https://img.aiyoumi.com/null/2017615/101826940/20170615101826_50x50.png',
                    textColor: '#000',
                    text: '关闭 ',
                    action: this.config.action || ''
                }

                if (this.config.app && this.config.app.rightBtnInfo) {
                    Object.assign(rightbuttonInfoParams, this.config.app.rightBtnInfo)
                }

                /* 分享信息 */
                let shareInfoParams = {
                    title: '招集令，分期爱自己',
                    info: '招集令(原爱学贷)-年轻人超爱的分期购物商城',
                    img: 'http://img.aiyoumi.com/null/201601220/205329861/20161220205329.png',
                    url: downLoadUrl,
                    channel: this.appConfig.shareInfo == undefined ? [] : this.appConfig.shareInfo.channels
                }
                if (this.config.app && this.config.app.shareInfo) {
                    Object.assign(shareInfoParams, this.config.app.shareInfo)
                }

                return {
                    visible: barShowFlag, // 是否显示bar
                    color: backgroundColor, // 背景颜色
                    leftbuttonVisible: leftBtnShowFlag, // 导航栏左（返回）按钮是否显示
                    leftbuttonAction: leftbuttonAction, // 左侧点击按钮响应事件
                    rightbuttonVisible: rightBtnShowFlag, // 右侧按钮是否显示
                    rightbutton: rightbuttonType, // 右侧按钮close share custom
                    shareInfo: shareInfoParams, // 分享参数
                    rightbuttonInfo: rightbuttonInfoParams // 右侧按钮显示参数
                }
            } else {
                return {
                    visible: true,
                    color: '#ffffff',
                    leftbuttonVisible: true,
                    leftbuttonAction: '',
                    rightbuttonVisible: true,
                    rightbutton: 'close'
                }
            }
        },
        formatedImgArr() {
            let imgArr = []
            if (typeof this.config !== 'undefined') {
                imgArr = this.config.imgUrls || []
            }

            return {
                imgUrls: imgArr
            }
        }
    },
    mounted() {
        if (this.isApp) {
            let h5enforce = (typeof this.config !== 'undefined' && typeof this.config.h5 !== 'undefined' && this.config.h5.enforce)
            if (h5enforce) {
                this.showH5Bar = true
                this.hideAppBar()
            } else {
                this.showH5Bar = false
                this.setAppBar()
            }
        } else {
            if (!this.formatedConfigH5.visible) {
                this.showH5Bar = false
            }
        }
    },
    methods: {
        clickHandler(btnType) {
            let func
            if (btnType == 'left') {
                func = this.config && this.config.leftAction ? this.config.leftAction : ''
            } else {
                func = this.config && this.config.action ? this.config.action : ''
            }

            if (func) {
                window[func]()
            } else {
                if (this.isApp) {
                    axdApp.send({
                        module: 'webview',
                        method: 'goBack',
                        params: {},
                        callback: function(data) {}
                    })
                } else {
                    history.back()
                }
            }
        },
        setAppBar(obj) {
            Object.assign(this.appConfig, this.formatedConfigApp)

            if (this.appConfig.rightbutton == 'share' && this.shareUrl !== this.appConfig.shareInfo.url) {
                let url = this.appConfig.shareInfo.url
                this.shareUrl = this.appConfig.shareInfo.url
                getShareList({ url }).then(res => {
                    this.appConfig.shareInfo.channels = res

                    axdApp.send({
                        module: 'webview',
                        method: 'configNavigationBar',
                        params: this.appConfig,
                        repeat: true,
                        callback: function(data) {}
                    })
                })
            } else {
                axdApp.send({
                    module: 'webview',
                    method: 'configNavigationBar',
                    params: this.appConfig,
                    repeat: true,
                    callback: function(data) {}
                })
            }

            if (this.formatedImgArr.imgUrls.length) {
                axdApp.send({
                    module: 'tools',
                    method: 'cacheImages',
                    params: this.formatedImgArr,
                    callback: function(data) {}
                })
            }
        },
        hideAppBar() {
            axdApp.send({
                module: 'webview',
                method: 'configNavigationBar',
                params: {
                    visible: false
                },
                repeat: true,
                callback: function(data) {
                    // window.location.href = 'zjl://WebView/hideCloseButton'
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
@import 'src/assets/styles/rem.scss';
$designWidth: 750;
.font28 {
    font-size: $auiFontSizeLevel5;
}

.font30 {
    font-size: $auiFontSizeLevel4;
}

.font32 {
    font-size: $auiFontSizeLevel3;
}

.aui-navbar__tools {
    img {
        width: px2rem(40);
        height: px2rem(40);
        margin-top: px2rem(24);
    }
}

// .aui-navbar {
//     z-index: 99;
// }
</style>
