<template>
    <div>
        <axd-loading :show="showLoading" message="加载中..."></axd-loading>
        <div v-if="!showLoading">
            <axd-sharelogo></axd-sharelogo>
            <axd-download v-if="showDownload === 'y'"></axd-download>
            <div class="page" id="pageContent">
                <smart-coms :cmsData="cmsData"></smart-coms>
            </div>
            <axd-totop></axd-totop>
        </div>
        <axd-errortip v-if="isError"></axd-errortip>
    </div>
</template>
<script>
import Vue from 'vue'
import axdDownload from 'components/download/index.vue'
import totop from 'components/totop/index.vue'
import sharelogo from 'components/activityModel/sharelogo.vue'
import axdLoading from 'components/loading/index.vue'
import {
    renderData
} from 'src/store/api'
import smartComs from 'components/activityModel/smartComs.vue'
import lazyload from 'src/libs/lazyload'
import lazyajax from 'src/libs/lazyajax'
import errortip from 'src/module/errortip.vue'
import {initNav} from 'components/bottomnav/init'

Vue.use(lazyload)
Vue.use(lazyajax)

export default {
    name: 'activity',
    data() {
        return {
            showLoading: true,
            showDownload: 'y',
            allComponents: [],
            appVersion: window.aixuedai.appVersion + '',
            isH5: (aixuedai.isUavoApp === 'n'),
            cmsData: null,
            isError: false
        }
    },
    beforeMount() {
        this.showLoading = true
        initNav(this.$router)
        this.fetchData()

        // 如果是领取红包的操作，需要的登录后页面进行刷新
        window.onAxdLogin = () => {
            axdApp.refresh()
        }
    },
    methods: {
        fetchData() {
            let param = {
                alias: 'putuiguang',
                type: '/cms'
            }
            if (!param.alias) {
                this.noData()
                return
            }

            renderData(param, (data) => {
                if (data.success) {
                    this.showData(data.result)
                } else {
                    this.noData()
                }
            })
        },
        showData(data) {
            setTimeout(() => {
                this.showLoading = false
            }, 0)

            this.cmsData = data
            this.showDownload = data.template.isDownload
            document.title = data.template.title
        },
        noData() {
            this.showLoading = false
            this.isError = true
        }
    },
    components: {
        axdLoading,
        smartComs,
        axdDownload,
        'axd-totop': totop,
        'axd-sharelogo': sharelogo,
        'axd-errortip': errortip
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
body {
    width: 16rem;
    margin: 0 auto;
}

.page {
    position: relative;
    .main-image {
        padding-top: 0;
    }
    .list li .info .buy-btn {
        background-color: #d8002f;
    }
}

.g-tip-div {
    width: 100%;
    height: auto;
    background-color: rgba(255, 255, 255, 0);
    position: fixed;
    top: 40%;
    left: 0;
    text-align: center;
    z-index: 11000;
    .g-tip {
        color: #fff;
        font-size: px2rem(30);
        background-color: rgba(0, 0, 0, 0.7);
        padding: 10px;
        width: auto;
        height: auto;
        display: inline-block;
        @include border-radius(4px);
    }
}
</style>
