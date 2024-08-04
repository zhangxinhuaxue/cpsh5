<!--
    created by yangjun in May 18, 2017
-->
<template>
    <div class="panel">
        <ul class="panel__header">
            <li class="panel__selection" :class="{'panel__selection_isSelected': selIndex === 1}" @click='selectFn(1)'><span>商品详情</span></li>
            <!-- <li class="panel__selection" :class="{'panel__selection_isSelected': selIndex === 2}" @click='selectFn(2)'><span>热门推荐</span></li> -->
            <li class="panel__selection" :class="{'panel__selection_isSelected': selIndex === 3}" @click='selectFn(3)'><span>常见问题</span></li>
        </ul>
        <div v-if="panelShow" class="panel__content">
            <detail :class="{'panel__contentItem_isSelected': selIndex === 1}"></detail>
            <!-- <div class="panel__contentItem panelReco" :class="{'panel__contentItem_isSelected': selIndex === 2}">
                <reco :dt="productVoList" v-if="productVoList&&productVoList.length" class="mt20"></reco>
            </div> -->
            <qa :class="{'panel__contentItem_isSelected': selIndex === 3}"></qa>
        </div>
    </div>
</template>
<script>
import detail from './detail.vue'
// import reco from 'src/module/common/productList/index.vue'
import qa from './questions_answers.vue'
import { getTopListNew, getRecoPro, burPoint } from 'store/modules/trade/product'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'panel',
    data() {
        return {
            selIndex: 1,
            panelShow: false,
            productVoList: []
        }
    },
    created() {
        this.$nextTick(function() {
            document.querySelector('.aui-content').addEventListener('scroll', this.setPanelShow, false)
        })
    },
    watch: {
        panelShow(newValue) {
            if (newValue) {
                document.querySelector('.aui-content').removeEventListener('scroll', this.setPanelShow, false)
            }
        }
    },
    computed: {
        ...mapState('trade/product', {
            productId: state => state.initData.desc.productId
        })
    },
    mounted() {
        this.setPanelShow()
    },
    methods: {
        selectFn(index) {
            if (index == 2) {
                // 打点
                burPoint({mark: 'product_hot_tab'})
                if (!(this.productVoList && this.productVoList.length)) {
                    // 获取接口所需数据
                    // this.getRecoId()
                    this.getRecoList()
                }
            }
            this.selIndex = index
        },
        setPanelShow() {
            let offsetTop = document.querySelector('.panel').offsetTop
            let scrollTop = document.querySelector('.aui-content').scrollTop
            let windowHeight = window.innerHeight

            if (windowHeight + scrollTop > offsetTop) {
                this.panelShow = true
            }
        },
        getRecoList() {
            getRecoPro({productId: this.productId}).then(({
                success,
                result,
                resultDes
            }) => {
                if (success && result && result.length) {
                    this.productVoList = result.map((item) => {
                        // item.goodCornerUrl = item.corner
                        // item.tag = item.tags
                        item.statisticsString = 'mark=product_hot'
                        return item
                    })
                } else {
                    if (resultDes) {
                        this.$_toast(resultDes)
                    }
                }
            })
        }
    },
    components: {
        detail, // 商品详情
        // reco, // 热门推荐
        qa // 常见问题
    }
}
</script>

<style lang="scss" scoped>
    @import 'src/style.scss';
    .panel{
        margin-top: px2rem(20);
        &__header {
            height: px2rem(96);
            background-color: #FFF;
            border-bottom: px2rem(1) solid rgba(204,204,204,.3);
        }
        &__selection {
            float: left;
            width: 50%;
            font-size: $auiFontSizeLevel5;
            color: $auiTextColorGeneral;
            text-align: center;
            span {
                display: inline-block;
                line-height: px2rem(92);
                padding: 0 px2rem(4);
            }
            &_isSelected {
                color: $auiTipsColor;
                span {
                    border-bottom: px2rem(4) solid $auiTipsColor;
                }
            }
        }
        &__content {
            overflow: hidden;
            min-height: px2rem(900);
        }
        &__contentItem {
            display: none;
            &_isSelected {
                display: block;
            }
        }
    }
</style>
