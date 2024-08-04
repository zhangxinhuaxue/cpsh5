<!--
    created by yangjun in May 11, 2017
-->

<template>
    <div class="teambuy">
        <a :href="teambuyRule.url">
            <axd-image :src="teambuyRule.img" :lazy="false"></axd-image>
        </a>
        <axd-image :src="teambuyStep.img" :lazy="false"></axd-image>
        <div class="teambuy__list" v-if="listShow">
            <h6 class="teambuy__listName">以下小伙伴正在发起拼团，您可以直接参与</h6>
            <ul>
                <li class="teambuy__listItem" v-for="pro in teambuyProList">
                    <teambuy-pro :pro="pro" :skuPopupInstance="skuPopupInstance"></teambuy-pro>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
/* global  localStorage */
import { mapState, mapMutations } from 'vuex'
import axdImage from 'src/components/image/index.vue'
import { renderData } from 'src/store/api'
import { getTeambuyProList } from 'src/store/modules/trade/product'
import teambuyPro from './teambuy_part_pro.vue'

export default {
    name: 'teambuy',
    props: {
        skuPopupInstance: {
            type: Object
        }
    },
    data() {
        return {
            teambuyRule: {},
            teambuyStep: {},
            teambuyProList: [],
            timeDiff: 0,
            listShow: true
        }
    },
    components: {
        axdImage,
        'teambuy-pro': teambuyPro
    },
    mounted() {
        this.getTipAndStep()
        // open=n 推荐团关闭 || 链接带参recordId 是通过分享参加推荐团的，推荐团关闭
        if (this.teambuy.open === 'n' || this.$route.query.recordId) {
            this.listShow = false
        } else {
            this.getProList()
        }
        if (this.$route.query.recordId) {
            this.updateInteractData({
                targetKey: 'teambuy',
                recordId: this.$route.query.recordId
            })
        }
    },
    computed: {
        ...mapState('trade', {
            teambuy: state => state.product.initData.teambuy
        })
    },
    methods: {
        ...mapMutations('trade/product', [
            'updateInteractData'
        ]),
        getProList() {
            let param = {
                productId: this.teambuy.productId
            }
            getTeambuyProList(param).then((data) => {
                if (data.success && data.result && data.result.length) {
                    this.teambuyProList = data.result
                    this.listShow = true
                } else {
                    this.listShow = false
                }
            })
        },
        getTipAndStep() {
            let that = this
            let param = {
                alias: 'feb-pintuan',
                type: '/cms'
            }

            renderData(param, (data) => {
                if (data.success) {
                    let blocks = data.result.blocks
                    for (let i = 0; i < blocks.length; i++) {
                        if (blocks[i].title === 'pintuan_h5_gorule') {
                            that.teambuyRule = blocks[i].objListArray[0]
                        }
                        if (blocks[i].title === 'pintuan_h5_process') {
                            that.teambuyStep = blocks[i].objListArray[0]
                        }
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scope>
@import 'src/style.scss';
img {
    display: block;
    width: 100%;
}
.teambuy{
    margin-bottom: px2rem(20);
    &__list {
        background-color: #fff;
        padding: 0 px2rem(32) px2rem(35);
        margin-top: px2rem(20);
    }
    &__listName {
        font-size: $auiFontSizeLevel7;
        font-weight: normal;
        text-align: center;
        line-height: px2rem(84);
        color: #888;
    }
    &__listItem {
        position: relative;
        border: px2rem(2) solid #ffd72d;
        border-radius: px2rem(10);
        // overflow: hidden;
        margin-bottom: px2rem(10);
    }
}
</style>
