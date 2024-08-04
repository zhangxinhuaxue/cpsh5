<!--
    Create by sunxj on 08/09/17
 -->
<template>
    <div @touchmove.prevent>
        <div class="aui-mask"></div>
        <div class="dialog-ban">
            <div class="dialog-ban_pos">
                <div class="dialog-img_radius" @click="goUrl(dialogInfo.url, $event)">
                    <axd-image :src="dialogInfo.img"></axd-image>
                </div>
                <span @click="close" class="dialog-ban_close"></span>
            </div>
        </div>
    </div>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { resetHeader } from 'components/header/resetHeader'
import { AXD } from 'src/libs/util'
import {
    saveAym
} from 'src/store/api'
export default {
    name: 'dialog-img',
    props: {
        dialogInfo: {
            type: Object
        }
    },
    data() {
        return {}
    },
    methods: {
        goUrl(url) {
            resetHeader()
            if (url.match(/popShare=true/)) {
                saveAym(url + '&toAction=share')
                this.$emit('popShare', url)
            } else {
                saveAym(url + '&toAction=gourl')
                window.location.href = url
            }
        },
        close() {
            this.$emit('complete')
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss" scoped>
@import './style.scss';

.dialog-ban {
    position: fixed;
    top: 44%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: px2rem(530);
    height: auto;
    z-index: 1001;

    &_pos {
        position: relative;
    }

    &_img {
        border-radius: px2rem(12);
        overflow: hidden;
        background-color: #fff;
    }

    &_close {
        position: absolute;
        width: px2rem(70);
        height: px2rem(70);
        display: inline-block;
        background: url('./ico_close.png') no-repeat 0 0;
        background-size: cover;
        bottom: px2rem(-160);
        left: px2rem(230);
        cursor: pointer;
    }

    .dialog-img_radius {
        border-radius: px2rem(12);
        overflow: hidden;
    }
}
</style>
