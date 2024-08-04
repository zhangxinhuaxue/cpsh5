<!--
    Create by sunxj on 08/23/17
 -->
<template>
    <div>
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-content" ref="pageContent">
                <vir-ban></vir-ban>
                <!-- 搜索 -->
                <vir-search @operation="isListShow" @search="goSearch"></vir-search>
                <template v-if="listShow">
                    <vir-tab @select="selectTab" :tabList="tabList" :tabIndex="tabIndex"></vir-tab>
                    <game-list v-if="tabIndex == 0" :hotList="gameHotList" :gameList="gameList" :sideShow="isSideShow"></game-list>
                    <vip-list v-if="tabIndex == 1" :vipList="vipList"></vip-list>
                    <mobile-list v-if="tabIndex == 2" :mobileList="mobileList"></mobile-list>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import virBan from './banner.vue'
import virSearch from './search.vue'
import virTab from './tab.vue'
import gameList from './game_list.vue'
import vipList from './vip_list.vue'
import mobileList from './mobile_list.vue'
import { getVirtualList } from 'store/modules/trade/virtual'
export default {
    name: 'virtualList',
    data() {
        return {
            barConfig: {
                reset: ''
            },
            saveSearchName: '',
            recoverySearchName: '',
            listShow: false,
            isSideShow: true,
            tabIndex: 0,
            gameHotList: [],
            gameList: [],
            vipList: [],
            mobileList: [],
            defaultTab: this.$route.query.tab,
            dataReady0: false, // gameDataReady
            dataReady1: false, // vipDataReady
            dataReady2: false // mobileDataReady
        }
    },
    computed: {
        tabList() {
            if (this.mobileList.length) {
                return ['端游充值', '会员充值', '手游充值']
            } else {
                return ['端游充值', '会员充值']
            }
        }
    },
    activated() {
        this.barConfig.reset += '1'
    },
    mounted() {
        let param = {
            name: ''
        }
        this.getVirtualList(param)
    },
    methods: {
        getVirtualList(param) {
            this.listShow = false
            getVirtualList(param).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    let gclist = result.gclist || []
                    let gset = result.gset || []
                    let vlist = result.vlist || []
                    let mglist = result.mgList || []
                    if (mglist && mglist.length) {
                        this.tabIndex = 2
                        this.dataReady2 = true
                    }

                    if (vlist && vlist.length) {
                        this.tabIndex = 1
                        this.dataReady1 = true
                    }

                    if ((gclist && gclist.length) || (gset && gset.length)) {
                        this.tabIndex = 0
                        this.dataReady0 = true
                    }

                    if (this.defaultTab && this['dataReady' + this.defaultTab]) {
                        this.tabIndex = parseInt(this.defaultTab)
                    }

                    this.gameHotList = gclist
                    this.gameList = gset
                    this.vipList = vlist
                    this.mobileList = mglist
                } else {
                    this.gameHotList = []
                    this.gameList = []
                    this.vipList = []
                    this.mobileList = []
                }

                this.listShow = true
            })
        },
        selectTab(i) {
            this.tabIndex = i
        },
        isListShow(b) {
            this.listShow = b
        },
        goSearch(name) {
            if (name) {
                this.isSideShow = false
            } else {
                this.isSideShow = true
            }
            let param = {
                name
            }
            this.getVirtualList(param)
        }
    },
    components: {
        hybridHeader,
        virBan,
        virSearch,
        virTab,
        gameList,
        vipList,
        mobileList
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.cell-img_width {
    width: px2rem(70);
    height: px2rem(70);
    margin-right: px2rem(56);
    overflow: hidden;
}

.virtual-title {
    font-size: $auiFontSizeLevel5;
    display: inline-block;
    max-width: px2rem(320);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    vertical-align: middle;
}

.virtual-desc {
    color: $auiTextColorLight;
    font-size: $auiFontSizeLevel7;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.aui-cell_access.select .cc6 {
    color: $auiTextColorGeneral;
}

.mt0 {
    margin-top: 0;
}

.virtual-tag_red {
    background-color: #f66045;
    margin-left: px2rem(28);
    height: px2rem(28);
    overflow: hidden;
    vertical-align: middle;
}
</style>
