<!--
    Create by sunxj on 07/14/17
 -->
<template>
    <div>
        <share-img v-if="config.isShowResource === 'y'" :shareInfo="shareInfo"></share-img>
        <div v-if="config.isShowRecommend === 'y'">
            <h3 v-if="config.recTitle" class="rec-title">{{config.recTitle}}</h3>
            <productlist v-if="proList && proList.length" :dt="proList"></productlist>
        </div> 
        <column-ban v-if="columnList && columnList.length" :columnArr="columnList"></column-ban>
        <!-- 弹出层 -->
        <dialog-ban v-if="isDialog" :dialogInfo="dialogInfo" @complete="closeDialog" @popShare="popShare"></dialog-ban>
        <!-- 分享面板 -->
        <share-panel :isShow="isShow" @closePopShare="closePopShare"></share-panel>
    </div>
</template>
<script>
import shareImg from './share.vue'
import productlist from 'src/module/common/productList/index.vue'
import columnBan from './columnBan.vue'
import dialogBan from './dialogImg.vue'
import sharePanel from 'components/sharePanel/index.vue'
import { createShareByItemId } from 'components/sharePanel/api'
import { getProdListByName } from 'src/store/modules/activity'
import { getRecommendList } from 'src/store/modules/trade/payResult'
import { AXD, setLocalStorage } from 'src/libs/util'
import {
    renderData
} from 'src/store/api'
export default {
    name: 'REC',
    props: {
        config: {
            type: Object
        }
    },
    data() {
        return {
            parentsName: '.aui-content',
            proList: [],
            columnList: [],
            isShow: false
        }
    },
    computed: {
        tradeId() {
            return this.$route.params.tradeId
        },
        shareInfo() {
            return this.config.share
        },
        dialogInfo() {
            return this.config.popup
        },
        isDialog() {
            let reg = /(pages\/(trade|loan|bill|common))/
            if (!this.getLocalStorageTradeId() && this.dialogInfo.show == 'y') {
                return true
            } else if (reg.test(this.config.fromPath) && this.dialogInfo.show == 'y') {
                return true
            } else {
                return false
            }
        }
    },
    mounted() {
        let id1 = this.config.templateId[0]
        let id2 = this.config.templateId[1]
        if (id1) {
            this.getProData(id1)
        }
        if (id2) {
            this.getColumnData(id2)
        }
    },
    methods: {
        getProData(listId) {
            getRecommendList({
                listId: listId
            }).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    this.proList = result
                }
            })
        },
        getColumnData(id) {
            let that = this
            getProdListByName({
                type: 'id',
                idOrName: id,
                needAll: 'true'
            }, (res) => {
                if (res.success && res.result) {
                    let result = res.result
                    let list = []
                    for (let item of result) {
                        if (item.status === 'y' || item.productId == 0) {
                            let url = item.url ? item.url : '/pages/mall/product/' + item.productId
                            let obj = {
                                img: item.productImgUrl,
                                url
                            }

                            list.push(obj)
                        }
                    }
                    that.columnList = list
                }
            })
        },
        closeDialog() {
            this.dialogInfo.show = 'n'
            let localStorage = window.localStorage
            localStorage.removeItem('resultTradeId')
            setLocalStorage('resultTradeId', this.tradeId)
        },
        getLocalStorageTradeId() {
            let localTradeId = window.localStorage.getItem('resultTradeId') || ''
            return this.tradeId == localTradeId
        },
        getCmsData() {
            let _this = this
            return new Promise((resolve, reject) => {
                renderData({ alias: 'siteshare' }, ({ success, result, resultDes, code }) => {
                    if (success) {
                        let shareData = {}
                        result.blocks.map((item) => {
                            if (item.objListArray) {
                                item.objList = item.objListArray
                            } else if (typeof item.objList === 'string') {
                                item.objList = JSON.parse(item.objList)
                            }
                            if (item.blockType == 'extend') {
                                shareData.code = item.objList && item.objList.activityCode
                            }
                            if (item.blockType == 'share') {
                                shareData.share = {
                                    title: item.title,
                                    desc: item.desc,
                                    img: item.img,
                                    url: item.url
                                }
                            }
                        })
                        resolve(shareData)
                    }
                })
            })
        },
        // 弹出分享面板
        popShare(url) {
            let _this = this
            _this.getCmsData().then((res) => {
                createShareByItemId({
                    activityCode: res.code,
                    itemId: _this.tradeId
                }).then(({ success, code, result, resultDes }) => {
                    if (success) {
                        if (result) {
                            let _url = url + '&shareId=' + result.id
                            window.AXDShareConfig = {
                                'title': res.share.title,
                                'info': res.share.desc,
                                'url': _url,
                                'img': res.share.img
                            }
                            // 在app下才显示分享面板, 非app下直接链接跳转
                            if (AXD.util.isapp()) {
                                _this.isShow = true
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
                })
            })
        },
        closePopShare() {
            this.isShow = false
        }
    },
    components: {
        shareImg,
        productlist,
        dialogBan,
        columnBan,
        sharePanel
    }
}
</script>
<style lang="scss" scoped>
@import './style.scss';

.rec-title {
    text-align: center;
    font-weight: normal;
    font-size: $auiFontSizeLevel5;
    color: $auiTextColorGeneral;
    margin: px2rem(40) 0 px2rem(24);
}
</style>
