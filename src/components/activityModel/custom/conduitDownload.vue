<!--
    add by sunxj on 12/06/17
    增加pinypou监测
 -->
<template lang="html">
    <div type="extended">
        <div class="clearfix dlContainer" @click="setDownLoadInfo">
            <img :src="config.img">
        </div>
        <div v-show="inwx" class="mask">
            <img src="//img.aiyoumi.com/static/img/201708/24170914814.png" width="90%">
        </div>
    </div>
</template>

<script>
import {
    AXD
} from 'src/libs/util'
import {
    condiutDownloadCount
} from 'src/store/modules/activity'
import { pinyouMonitor } from 'src/libs/py_monitor'
import axdToast from 'components/toast/index'
import Clipboard from 'clipboard'
export default {
    name: 'telecom',
    props: {
        config: Object
    },
    data() {
        return {
            inwx: false,
            cp: undefined
        }
    },
    computed: {
        isPinyou() {
            return this.config.key && this.config.key === 'pinyou'
        }
    },
    beforeMount() {
        if (this.isPinyou) {
            pinyouMonitor.createScript()
        }
    },
    mounted() {
        this.getDownLoadInfo()
        if (this.isPinyou) {
            this.$nextTick(() => {
                pinyouMonitor.executePy()
            })
        }
    },
    methods: {
        getDownLoadInfo() {
            let me = this
            if (!AXD.util.isWeixin()) {
                condiutDownloadCount({
                    channel: me.config.id
                }, (data) => {
                    new Clipboard('.dlContainer', {
                        text: function(trigger) {
                            return JSON.stringify(data)
                        }
                    })
                    let downloadBtn = document.querySelectorAll('.dlContainer')[0]
                    if ((!!me.config.autoLinkIOS && AXD.util.isiOS()) || (!!me.config.autoLinkAndroid && !AXD.util.isiOS())) {
                        downloadBtn.click()
                    }
                })
            }
        },
        setDownLoadInfo() {
            let me = this
            if (AXD.util.isWeixin()) {
                me.inwx = true
            } else {
                if (me.isPinyou) {
                    pinyouMonitor.executePy('statistics', 'Xzs8T.wv2.yEo2U5Eh1p537E597AQ3d0')
                }
                setTimeout(function() {
                    if (AXD.util.isiOS()) {
                        window.location.href = me.config.iosUrl
                    } else {
                        window.location.href = me.config.androidUrl
                    }
                }, 200)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../style';
$designWidth: 750;
.dlContainer {
    background: #fff;
    img {
        width: 100%;
    }
}
.mask {
    background-color: rgba(0, 0, 0, .8);
    height: 100%;
    width: 100%;
    z-index: 999;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    img {
        width: px2rem(500);
        float: right;
        margin: px2rem(26) px2rem(34) 0 0;
    }
}
</style>
