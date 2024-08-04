<template lang="html">
    <div class="clearfix hb-single-nopadding">
        <a class="hongbao-btn" href="javascript:;" @click="receiveIt()">
            <span class="img-wid">
                <template>
                    <axd-image :src="config.img"></axd-image>
                </template>
            </span>
        </a>
    </div>
</template>

<script>
import {
    AXD
} from 'src/libs/util'
import {
    receiveDXCoupon
} from 'src/store/modules/activity'
import axdToast from 'components/toast/index'
import axdImage from 'src/components/image/index.vue'
export default {
    name: 'telecom',
    props: {
        config: Object
    },
    data() {
        return {

        }
    },
    components: {
        axdImage
    },
    methods: {
        receiveIt() {
            console.log(this)
            let getIdReg = new RegExp('(^|&)id=([^&]*)(&|$)', 'i')
            let regRes = window.location.search.substr(1).match(getIdReg)
            let id = regRes ? regRes[2] : ''
            receiveDXCoupon({
                sourceId: id
            }, (data) => {
                if (data.code === '10010' || data.code === '-1999') {
                    AXD.util.login()
                    return
                } else if (data.code === '10020') {
                    AXD.util.addBasicInfo()
                    return
                }
                if (!data.success) {
                    axdToast(data.resultDes || '领取失败')
                } else {
                    axdToast('领取成功，快去取现吧')
                }
            })
        }
    }
}
</script>

<style lang="scss">
@import '../style';
.hb-single-nopadding {
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
    a {
        display: block;
        width: 100%;
        text-align: center;
        .img-wid {
            display: block;
            img {
                width: 100%;
            }
        }
    }
}
</style>
