<script>
// 引入要添加的所有组件
import share from 'components/share/index.vue'
import download from 'components/download/index.vue'
import rule from './rule.vue'
import anav from './nav-bar.1.vue'
import coupon from './coupon.vue'
import primarykv from './primarykv.vue'
import fullcolumn from './fullcolumn.vue'
import moreexcite from './moreexcite.vue'
import productlist from './product_list/index.vue'
import extended from './extended.vue'
import groupbuying from './groupbuying.vue'
import seckill from './seckill.vue'
import slide from './slide.vue'
import navigation from './navigation.vue'
import lottery from 'components/lottery/lottery.vue'
import hotzone from './hotzone.vue'
import flashsale from './flashsale.vue'
import couponseckill from './couponseckill.vue'
import countdown from './countdown.vue'
import bottommenu from './bottommenu.vue'
import browsecountdown from './browsecountdown.vue'
import credit from './credit.vue'

export default {
    name: 'smartcoms',
    props: {
        cmsData: Object,
        extendData: String,
        lazyParents: String, // 兼容一些情况下不是window下的scroll事件不触发图片懒加载
        // 自定义登录参数
        customObj: Object
        // nowTime: Number,
        // subTime: Number
    },
    methods: {
        init() {
            let coms = []
            let me = this
            // 存储楼层相关信息
            let obj = {
                nameList: [],
                listClass: 'floor',
                bgColor: '',
                bgSelectedColor: '',
                bgSelectedTextColor: '',
                fontColor: ''
            }

            if (this.cmsData) {
                // 是否唤起app打开页面, 在cms扩展模块配置isaweak
                if (this.cmsData.isAppBrowse === 'y') {
                    require('src/libs/awakeapp')
                }
                // 判断是否只添加商品列表到楼层，兼容老数据
                let onlyPro = this.isOnlyProduct(this.cmsData.blocks)
                // console.log(onlyPro)
                let floorIndex = -1
                this.cmsData.blocks.map((item, index) => {
                    // item.index = index
                    if (item.floorShow && item.floorShow === 'y') {
                        floorIndex++
                        item.floorIndex = floorIndex
                    }
                    if (item.objListArray) {
                        item.objList = item.objListArray
                    } else if (typeof item.objList === 'string' && item.blockType !== 'lottery') {
                        item.objList = JSON.parse(item.objList)
                    }

                    switch (item.blockType) {
                        case 'activity_credit':
                            coms.push([credit, {
                                config: item,
                                alias: this.cmsData.template.alias
                            }])
                            break
                        case 'primary_kv':
                            item.useHeight = true
                            coms.push([primarykv, {
                                config: item
                            }])
                            me.insertFloorTitle(item, obj)
                            break
                        case 'activity_rule':
                            coms.push([rule, {
                                config: item
                            }])
                            break
                        case 'coupon':
                            coms.push([coupon, {
                                config: item,
                                couponList: item.objList,
                                customLoginParam: me.customObj
                            }])
                            me.insertFloorTitle(item, obj)
                            break
                        case 'more_excite':
                            item.useHeight = true
                            coms.push([moreexcite, {
                                config: item,
                                lazyParents: this.lazyParents
                            }])
                            me.insertFloorTitle(item, obj)
                            break
                        case 'full_column':
                            item.useHeight = true
                            coms.push([fullcolumn, {
                                config: item,
                                customLoginParam: me.customObj
                            }])
                            me.insertFloorTitle(item, obj)
                            break
                        case 'floor_position':
                            obj.bgColor = item.bgColor
                            obj.bgSelectedColor = item.bgSelectedColor
                            // bgSelectedTextColor为新增字段，为兼容老数据加一个判断，默认红色
                            obj.bgSelectedTextColor = item.bgSelectedTextColor ? item.bgSelectedTextColor : 'ff0000'
                            obj.fontColor = item.fontColor

                            coms.push([anav, {
                                config: obj,
                                cmsData: this.cmsData
                            }])
                            break
                        case 'product_zone':
                            // item.subTime = this.subTime
                            coms.push([productlist, {
                                titleImage: item.titleImg,
                                templateId: item.plistId,
                                config: item,
                                onlyPro: onlyPro
                                // nowTime: this.nowTime
                            }])

                            if (onlyPro) {
                                obj.nameList.push(item.title)
                            } else {
                                me.insertFloorTitle(item, obj)
                            }
                            break
                        case 'share':
                            coms.push([share, {
                                config: item
                            }])
                            break
                        case 'extend':
                            // 如果在扩展模块中配置了底部按钮导航
                            if (item.objList && item.objList.showBottomMenu && item.objList.bottomMenu) {
                                coms.push([require('./custom/bottommenu.vue').default, {
                                    listName: item.objList.bottomMenu
                                }])
                            }

                            if (me.extendData && me.extendData.name === 'invite') {
                                coms.push([require('./custom/singleinvite.vue').default, {
                                    config: me.extendData
                                }])
                            } else {
                                coms.push([extended, {
                                    config: item.objList
                                }])
                            }

                            if (item.objList.isaweak && this.cmsData.isAppBrowse === 'n') {
                                require('src/libs/awakeapp')
                            }
                            break
                        // case 'group_buying':
                        //     coms.push([groupbuying, {
                        //         config: item,
                        //         tabList: item.objListArray
                        //     }])
                        //     me.insertFloorTitle(item, obj)
                        //     break
                        // case 'seckill':
                        //     coms.push([seckill, {
                        //         config: item,
                        //         tabList: item.objListArray
                        //     }])
                        //     me.insertFloorTitle(item, obj)
                        //     break
                        case 'slide':
                            coms.push([slide, {
                                config: item
                            }])
                            me.insertFloorTitle(item, obj)
                            break
                        case 'navigation':
                            coms.push([navigation, {
                                config: item
                            }])
                            break
                        case 'lottery':
                            coms.push([lottery, {
                                config: {
                                    token: item.objList,
                                    title: item.title,
                                    floorShow: item.floorShow
                                },
                                customLoginParam: me.customObj
                            }])
                            me.insertFloorTitle(item, obj)
                            break
                        case 'hot_zone':
                            if ((/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/).test(item.title)) {
                                coms.push([require('./custom/togglehz.vue').default, {
                                    config: item,
                                    cmsData: this.cmsData
                                }])
                            } else {
                                coms.push([hotzone, {
                                    config: item
                                }])
                            }
                            me.insertFloorTitle(item, obj)
                            break
                        case 'flash_sale':
                            // item.subTime = this.subTime
                            coms.push([flashsale, {
                                config: item,
                                customLoginParam: me.customObj
                            }])
                            break
                        case 'bottom_nav':
                            coms.push([bottommenu, {
                                config: item
                            }])
                            break
                        case 'coupon_seckill':
                            coms.push([couponseckill, {
                                config: item,
                                customLoginParam: me.customObj
                            }])
                            break
                        case 'countdown':
                            // item.subTime = this.subTime
                            coms.push([countdown, {
                                config: item
                            }])
                            break
                        case 'browse_countdown':
                            // item.subTime = this.subTime
                            coms.push([browsecountdown, {
                                config: item
                            }])
                            break
                        default:
                            // statements_def
                            break
                    }
                })
            }
            return coms
        },
        // 插入模块标题
        insertFloorTitle(item, obj) {
            if (item.floorShow && item.floorShow === 'y') {
                let {index, title, blockType} = item
                obj.nameList.push({
                    title,
                    // blockIndex: index,
                    blockType
                })
            }
        },
        // 判断是否只有商品列表会加入到楼层
        isOnlyProduct(data) {
            let flag = true
            data.map((item) => {
                if (item.floorShow) {
                    flag = false
                }
            })
            return flag
        }
    },
    render(h) {
        // h 为 createElement 函数，接受三个参数
        // tag
        // data
        // children

        let coms = this.init()
        return h('div', {}, coms.map((item) => {
            return h(item[0], {
                attrs: item[1]
            })
        }))
    }
}
</script>
