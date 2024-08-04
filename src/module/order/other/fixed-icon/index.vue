<template>
    <div class="fixedicon-wrap" v-if="iconShow">
        <div class="icon" v-if="iconSwitch" @click="toShare">
            <img :src="iconImg" alt="icon"/>
        </div>
            <share-panel v-if="iconSwitch" :isShow="panelShow" @closePopShare="closePopShare"></share-panel>
        </div>
</template>
<script type="text/javascript">
import { createShareByItemId } from 'components/sharePanel/api'
import { tradeShareConfig } from './api'
import sharePanel from 'components/sharePanel/index.vue'
import {
    AXD
} from 'src/libs/util'
import {
    renderData
} from 'src/store/api'
export default {
    props: {
        config: Object
    },
    data() {
        return {
            iconSwitch: true,
            panelShow: false,
            iconImg: '',
            code: '',
            link: '',
            shareConfig: null,
            tid: '',
            isSend: false
        }
    },
    created() {
        this.tid = this.$route.query.tId || this.$route.query.id
        this.getCmsData()
        this.getConfig()
    },
    computed: {
        iconShow() {
            // 待发货 待收货， 显示小浮标
            if (this.config.status === 'WAIT_SELLER_SEND_GOODS' || this.config.status === 'WAIT_BUYER_CONFIRM_GOODS') {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        getCmsData() {
            let _this = this
            return new Promise((resolve, reject) => {
                renderData({ alias: 'siteshare' }, ({ success, result, resultDes, code }) => {
                    if (success) {
                        result.blocks.map((item) => {
                            if (item.objListArray) {
                                item.objList = item.objListArray
                            } else if (typeof item.objList === 'string') {
                                item.objList = JSON.parse(item.objList)
                            }
                            if (item.blockType == 'extend') {
                                _this.code = item.objList && item.objList.activityCode
                            }
                        })
                        resolve()
                    }
                })
            })
        },
        getConfig() {
            let _this = this
            tradeShareConfig({
                tradeId: _this.tid
            }).then(({ success, result }) => {
                if (success) {
                    if (result) {
                        let { imgUrl, isShow, link, shareConfig } = result
                        _this.iconSwitch = isShow
                        _this.iconImg = imgUrl
                        _this.link = link
                        _this.shareConfig = shareConfig
                    }
                }
            })
        },
        toShare() {
            let _this = this
            if (_this.link) {
                window.location.href = _this.link
            } else {
                if (_this.isSend) {
                    return false
                }
                _this.isSend = true
                createShareByItemId({
                    activityCode: _this.code,
                    itemId: _this.tid
                }).then(({ success, code, result, resultDes }) => {
                    if (success) {
                        if (result) {
                            let _url = ''
                            if (_this.shareConfig.url) {
                                _url = _this.shareConfig.url.split('?')[0] + '?shareId=' + result.id
                            }
                            Object.assign(_this.shareConfig, { url: _url })
                            window.AXDShareConfig = _this.shareConfig
                            // 在app下才显示分享面板, 非app下直接链接跳转
                            if (AXD.util.isapp()) {
                                _this.panelShow = true
                            } else {
                                window.location.href = _url
                            }
                        }
                    } else {
                        if (code === '-1999') {
                            AXD.util.login()
                        } else {
                            this.$_toast(resultDes)
                        }
                    }
                    _this.isSend = false
                })
            }
        },
        closePopShare() {
            this.panelShow = false
        }
    },
    components: {
        sharePanel
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.icon {
    width: px2rem(86);
    height: px2rem(86);
    position: fixed;
    right: px2rem(10);
    top: px2rem(290);
}
</style>
