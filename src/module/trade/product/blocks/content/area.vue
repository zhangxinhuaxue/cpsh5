<!--
    Created by hity on 07/31/17
-->
<template>
    <div v-if="hasJdSku">
        <p class="area aui-cell" @click="areaPopup()">
            配送至
            <span class="areaTips">{{areaInfo}}</span>
            <em class="stockState">{{stockState}}</em>
            <span class="com-more-icon more"></span>
        </p>
        <p v-if="stockState =='无货'" class="area-warning">{{noStockTips}}</p>
        <p v-if="stockState =='限售'" class="area-warning">{{limitStockTips}}</p>
    </div>
</template>
<script>

import Vue from 'vue'
import textEnum from 'libs/text.enum'
import { getdeliverList } from 'store/modules/address'
import { setLocalStorage } from 'libs/util'
import createPopup from 'src/module/trade/product/blocks/common/createPopup'
import { createNamespacedHelpers } from 'vuex'
import _AreaPicker from 'src/module/common/components/area.vue'
import _Loading from 'components/loading/index.vue'

const { mapState, mapMutations, mapActions } = createNamespacedHelpers('trade/product')

export default {
    mixins: [createPopup],
    data() {
        return {
            config: {
                title: '配送至',
                type: 'areaList'
            },
            openPopup: false,
            hasArea: false,
            areaPickerInstance: {},
            // popup的附加功能
            exObj: {
                txt: '选择其他区域',
                func: () => {
                    this.popupAreaPicker()
                    this.closePopup()
                }
            },
            isInit: false
        }
    },
    created() {
        this.init()
    },
    computed: {
        ...mapState({
            skuId: state => state.interactData.trade.skuId,
            productType: state => state.initData.shop.type,
            productNum: state => state.interactData.trade.productNum,
            area: state => state.interactData.jd.area,
            stockState: state => state.initData.jd.stockState,
            uid: state => state.initData.user.uid,
            areaList: state => state.interactData.jd.areaList,
            noStockTips: state => state.interactData.jd.noStockTips,
            limitStockTips: state => state.interactData.jd.limitStockTips,
            storeSkuSet: state => state.initData.trade.skuSet,
            areaUpdateDone: state => state.interactData.jd.areaUpdateDone
        }),
        iconObj() {
            let obj = {}
            obj.name = this.hasArea ? 'icon-back' : 'icon-close1'
            if (this.hasArea) {
                obj.func = this.newAreaBack
            } else {
                obj.func = null
            }
            return obj
        },
        hasJdSku() {
            return this.skuId > 0 && this.productType == 'JD'
        },
        areaInfo() {
            let street = this.area.street ? this.area.street : ''
            let address = this.area.address ? this.area.address : ''
            return this.area.province + this.area.city + this.area.district + street + address
        }
    },
    watch: {
        skuId(newValue) {
            if (newValue && this.areaUpdateDone) {
                this.handleAreaStockState(newValue, this.area, this.productNum)
            }
        },
        area(newValue) {
            if (newValue) {
                if (!this.isInit) {
                    // 找到地址对应的mainSku
                    this.getValidSkuByArea({
                        skuIds: this.storeSkuSet.filter(({ avail, hold }) => (avail - hold)).map(item => item.id).join(','),
                        area: newValue.districtCode
                    }).then(() => {
                        this.isInit = true
                    })
                }
                if (this.areaUpdateDone) {
                    this.handleAreaStockState(this.skuId, newValue, this.productNum)
                }
            }
        },
        productNum(newValue) {
            if (newValue && this.areaUpdateDone) {
                this.handleAreaStockState(this.skuId, this.area, newValue)
            }
        }
    },
    methods: {
        ...mapActions([
            'getStockState',
            'getValidSkuByArea'
        ]),
        ...mapMutations([
            'updateInteractData'
        ]),
        areaPopup() {
            if (this.hasArea) {
                this.popup()
            } else {
                this.popupAreaPicker()
            }
        },
        popupAreaPicker() {
            let pickerInstance = this.areaPickerInstance
            let me = this
            // 加载areaPicker组件

            if (!pickerInstance.$el) {
                let loadingInstance = this.createdLoading()
                let AreaPicker = Vue.extend(_AreaPicker)
                pickerInstance = new AreaPicker({
                    el: document.createElement('div'),
                    propsData: {
                        areaPopShow: false,
                        iconObj: this.iconObj,
                        // area初始化结束
                        initCompleteCb: () => {
                            loadingInstance.show = false
                        }
                    },
                    methods: {
                        close() {
                            me.areaPickerInstance.areaPopShow = false
                        },
                        confirm(tData) {
                            let data = tData[2]
                            if (data && data.districtCode != me.area.districtCode) {
                                me.updateInteractData({
                                    targetKey: 'jd',
                                    area: data
                                })
                                // 用户交互的地址，存本地
                                setLocalStorage('area', JSON.stringify(data))
                            }
                            me.areaPickerInstance.areaPopShow = false
                        }
                    }
                })
                pickerInstance.$el.id = 'area-picker'
                document.querySelector('.aui-page').appendChild(pickerInstance.$el)
                this.areaPickerInstance = pickerInstance
            }
            this.areaPickerInstance.areaPopShow = true
        },
        createdLoading() {
            let Loading = Vue.extend(_Loading)
            let loadingInstance = new Loading({
                el: document.createElement('div'),
                propsData: {
                    show: true,
                    message: textEnum.LOADING
                }
            })
            loadingInstance.$el.id = 'loading'
            document.querySelector('.aui-page').appendChild(loadingInstance.$el)
            return loadingInstance
        },
        handleAreaStockState(skuId, area, num) {
            this.getStockState({
                skuId: skuId,
                area: area.districtCode,
                num: num
            })
        },
        getAreaList(area) {
            let me = this
            getdeliverList().then(function(data) {
                if (data.success && data.result && data.result.deliverList && data.result.deliverList.length > 0) {
                    let list = data.result.deliverList
                    me.updateInteractData({
                        targetKey: 'jd',
                        areaList: list
                    })
                    // 不存在本地地址时，使用默认列表地址
                    if (!(area && area.districtCode)) {
                        me.updateInteractData({
                            targetKey: 'jd',
                            area: list[me.getAreaFromAddressId(list, -1)]
                        })
                    }
                    me.hasArea = true
                }
            })
        },
        getAreaFromAddressId(areaList, addressId) {
            if (!addressId || addressId == -1) {
                return 0
            }
            for (let i = 0; i < areaList.length; i++) {
                let item = areaList[i]
                if (item.id == addressId) {
                    return i
                }
            }
            return 0
        },
        init() {
            let me = this
            let area = JSON.parse(window.localStorage.getItem('area'))

            // 如果本地存在地址，则为选中地址
            if (area && area.districtCode) {
                // 如果地址非地址列表中，则直接使用其为库存地址
                me.updateInteractData({
                    targetKey: 'jd',
                    area: area
                })
            } else {
                // 初始的区域地址
                me.updateInteractData({
                    targetKey: 'jd',
                    area: {
                        city: '杭州市',
                        cityCode: '330100',
                        district: '西湖区',
                        districtCode: '330106',
                        id: -1,
                        province: '浙江省',
                        provinceCode: '330000'
                    }
                })
            }

            if (me.uid) {
                me.getAreaList(area)
            }
        },
        newAreaBack() {
            this.popup()
            this.areaPickerInstance.areaPopShow = false
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
    .area {
        position: relative;
        padding: 0 px2rem(32);
        margin: px2rem(20) auto;
        height: px2rem(96);
        font-size: $auiFontSizeLevel5;
        line-height: px2rem(96);
        color: #666;
        background-color: #fff;
        .areaTips {
            margin-left: px2rem(84);
            @include nLineLimit(1);
            width: px2rem(350);
            line-height: 140%;
        }
        .stockState {
            position: absolute;
            top: 0;
            right: px2rem(80);
            color: #F99E00;
        }
    }
    .area-warning {
        z-index: 10;
        position: fixed;
        bottom: px2rem(100);
        width: 100%;
        font-size: px2rem(28);
        line-height: px2rem(70);
        color: #F99E00;
        background: #FFFAE1;
        text-align: center;
    }
</style>
