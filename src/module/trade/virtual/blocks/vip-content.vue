<!--
 * @Description: 部分游戏充值需要帐号/服务区/类型
 * @Author: sunxj
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-01-10 11:15:17
 * @LastEditors: sunxj
 -->
<template>
<div class="aui-cells aui-cells_form">
    <div class="aui-cell page-account_height" v-if="passShow">
        <div class="aui-cell__hd">
            <label class="aui-label">通行证帐号</label>
        </div>
        <div class="aui-cell__bd">
            <input class="aui-input input_ft" type="text" v-model.trim="passcard" placeholder="请输入通行证" />
        </div>
    </div>
    <div class="aui-cell page-account_height">
        <div class="aui-cell__hd">
            <label class="aui-label">充值账号</label>
        </div>
        <div class="aui-cell__bd">
            <input class="aui-input input_ft" type="text" v-model.trim="chargeAcm" placeholder="请输入充值帐号" />
        </div>
    </div>
    <template v-if="largeAreaShow">
        <axd-popselect @back="setLargeAreaData" :labels="largeAreaLabels" :objArr="chargeGameList" :selected="chargeGameName"></axd-popselect>
    </template>
    <template v-if="areaShow">
        <axd-popselect @back="setareaData" :labels="areaLabels" :objArr="curRegionList" :selected="chargeRegionName"></axd-popselect>
    </template>
    <template v-if="serverShow">
        <axd-popselect @back="setServerData" :labels="serverLabels" :objArr="curServerList" :selected="chargeserverName"></axd-popselect>
    </template>
    <template v-if="typeShow">
        <axd-popselect @back="setTypeData" :labels="typeLabels" :objArr="chargeTypeList" :selected="chargetypeName"></axd-popselect>
    </template>
</div>
</template>
<script>
import popSelect from 'src/module/trade/common/blockselect.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/virtual')

export default {
    name: 'game-vip',
    props: {
        chargeData: {
            type: Object
        },
        specialName: {
            type: Object
        }
    },
    data() {
        return {
            productSkus: {
                index: this.index
            },
            areaLabels: {
                needCells: false,
                title: '请选择游戏分区',
                name: '游戏分区',
                content: '请选择'
            },
            typeLabels: {
                needCells: false,
                title: '请选择充值类型',
                name: '充值类型',
                content: '请选择'
            },
            serverLabels: {
                needCells: false,
                title: '请选择服务器',
                name: '所在服务器',
                content: '请选择'
            }
        }
    },
    filters: {
        formatName(name) {
            if (name.indexOf(':') > -1) {
                return name.split(':')[1]
            } else {
                return name
            }
        },
        formatPrice(val, discount) {
            let num = discount || 100
            let discountVal = parseFloat(val) * num
            if (discountVal % 10000 == 0) {
                return discountVal / 10000
            } else {
                return (discountVal / 10000).toFixed(2)
            }
        }
    },
    computed: {
        ...mapState({
            chargeGameName: state => state.chargegame,
            chargeRegionName: state => state.chargeregion,
            chargeserverName: state => state.chargeserver,
            chargetypeName: state => state.chargetype,
            storeChargeAcm: state => state.chargeAcm,
            storePasscard: state => state.passcard
        }),
        passcard: {
            get() {
                return this.storePasscard
            },
            set(val) {
                this.saveVirtualData({
                    passcard: val
                })
            }
        },
        chargeAcm: {
            get() {
                return this.storeChargeAcm
            },
            set(val) {
                this.saveVirtualData({
                    chargeAcm: val
                })
            }
        },
        passShow() {
            let name = this.chargeData.name
            let str1 = this.specialName.name1
            return name && str1 && name.indexOf(str1) > -1
        },
        largeAreaShow() {
            return this.chargeData.chargeGame && this.chargeData.chargeGame.name
        },
        areaShow() {
            return this.chargeData.chargeRegion && this.chargeData.chargeRegion.length
        },
        serverShow() {
            return this.chargeData.chargeServer && this.chargeData.chargeServer.length
        },
        typeShow() {
            return this.chargeData.chargeType && this.chargeData.chargeType.length
        },
        chargeGameList() {
            let names = this.chargeData.chargeGame ? this.chargeData.chargeGame.name : ''
            return names
        },
        chargeRegionList() {
            return this.chargeData.chargeRegion || []
        },
        chargeServerList() {
            return this.chargeData.chargeServer || []
        },
        curRegionList() {
            let list = []
            // let gameList = this.chargeData.chargeGame ? this.chargeData.chargeGame : ''
            let regionList = this.chargeRegionList
            let regionLen = regionList.length
            if (regionLen === 1) {
                list = regionList[0].name
            } else if (regionList && regionLen && this.chargeGameName) {
                for (let items of regionList) {
                    if (items.gameName === this.chargeGameName) {
                        list = items.name
                        break
                    }
                }
            }
            return list
        },
        curServerList() {
            let list = []
            let regionList = this.chargeRegionList
            let serverList = this.chargeServerList
            let serverLen = serverList.length
            if (serverLen === 1) {
                list = serverList[0].name
            } else if (serverList && serverLen && this.chargeRegionName) {
                for (let items of serverList) {
                    if (items.regionName === this.chargeRegionName) {
                        list = items.name
                        break
                    }
                }
            }
            return list
        },
        chargeTypeList() {
            return this.chargeData.chargeType
        },
        largeAreaLabels() {
            let largeAreaLabels = {
                needCells: false,
                title: '请选择游戏分区',
                name: '游戏名称',
                content: '请选择'
            }
            let name = this.chargeData.name
            if (name && name.indexOf(this.specialName.name2) > -1) {
                largeAreaLabels.name = '游戏大区'
            }
            return largeAreaLabels
        }
    },
    mounted() {},
    methods: {
        ...mapMutations([
            'saveVirtualData'
        ]),
        selectAmount(item, i) { // 选择面额
            this.productSkus.index = i
            this.saveVirtualData({
                skus: item
            })
        },
        setLargeAreaData(data) {
            if (this.chargeGameName !== data.content) {
                let obj = {
                    chargegame: data.content
                }

                if (this.chargeRegionList.length > 1) {
                    obj.chargeregion = ''
                }

                this.saveVirtualData(obj)
            }
        },
        setareaData(data) {
            if (this.chargeRegionName !== data.content) {
                let obj = {
                    chargeregion: data.content
                }

                if (this.chargeRegionList.length > 1) {
                    obj.chargeserver = ''
                }

                this.saveVirtualData(obj)
            }
        },
        setTypeData(data) {
            this.saveVirtualData({
                chargetype: data.content
            })
        },
        setServerData(data) {
            this.saveVirtualData({
                chargeserver: data.content
            })
        }
    },
    components: {
        'axd-popselect': popSelect
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
::-webkit-input-placeholder {
    /* WebKit browsers */
    font-size: px2rem(28);
}

:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-size: px2rem(28);
}

::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-size: px2rem(28);
}

:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    font-size: px2rem(28);
}

.page-account_height {
    height: px2rem(152);
}
.input_ft {
    font-size: $auiFontSizeLevel1;
    height: px2rem(80);
    line-height: px2rem(80);
}
</style>
