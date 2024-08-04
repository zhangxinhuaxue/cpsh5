<!--
    世界杯竞猜定制模块
    需要配置： 热区模块，标题为世界杯截至竞猜的时间，格式为：YYYY-MM-DD HH:MM:SS
              扩展模块，配置stopGuessBg为停止竞猜的背景图片
-->
<template>
    <div>
        <div id="seckill-wrap" style="display:none;"></div>
        <hot-zone v-show="showHotZone" :config="config"></hot-zone>
        <axd-image v-show="!showHotZone" :src="imgUrl"></axd-image>
    </div>
</template>

<script>
import Seckill from 'src/libs/seckill'
import hotZone from '../hotzone.vue'
import axdImage from 'src/components/image/index.vue'
import { getSystime } from 'store/modules/trade/product'
export default {
    name: 'toggleHz',
    props: {
        config: Object,
        cmsData: Object
    },
    data() {
        return {
            showHotZone: true,
            imgUrl: null
        }
    },
    created() {
        this.initEndBg()
    },
    mounted() {
        this.initCountDown()
    },
    methods: {
        initEndBg() {
            this.imgUrl = this.cmsData.blocks.filter((item) => {
                return item.blockType === 'extend' && item.objList && item.objList.stopGuessBg
            })[0].objList.stopGuessBg
        },
        initCountDown() {
            new Seckill({
                el: document.querySelector('#seckill-wrap'),
                during: 1000,
                template: '<span class="block">$h$h</span>:<span class="block">$m$m</span>:<span class="block">$s$s</span> <span class="txt">$isIng{后结束}</span>',
                endTime: this.config.title,
                startTime: '2018-01-01 00:00:00',
                getServerTime: () => {
                    return new Promise((resolve, reject) => {
                        getSystime().then(({ success, result }) => {
                            resolve({
                                success,
                                serverTime: result
                            })
                        })
                    })
                },
                endSeckillCb: () => {
                    this.showHotZone = false
                }
            }).init()
        }
    },
    components: {
        hotZone,
        axdImage
    }
}
</script>
