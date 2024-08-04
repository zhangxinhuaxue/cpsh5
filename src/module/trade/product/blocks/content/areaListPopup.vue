<!--
    Created by hity on 05/15/17
-->
<template>
    <div class="areaList">
        <label :class="{active: item.id == area.id}" v-for="(item, index) in areaList" :key="item.id" class="aui-cell aui-cell_auto" :for="index" @click="chooseAddress(item)">
            <div class="address-item">
                {{item.province + item.city + item.district + (item.street ? item.street : '') + item.address}}
            </div>
            <span v-if="item.id == area.id" class="icon-check2"></span>
        </label>
    </div>
</template>
<script>
import { setLocalStorage } from 'libs/util'
import { mapState, mapMutations } from 'vuex'
export default {
    computed: {
        ...mapState('trade/product', {
            area: state => state.interactData.jd.area,
            areaList: state => state.interactData.jd.areaList
        })
    },
    methods: {
        ...mapMutations('trade/product', [
            'updateInteractData'
        ]),
        chooseAddress(area) {
            this.updateInteractData({
                targetKey: 'jd',
                area: area
            })
            // 用户交互的地址，存本地
            setLocalStorage('area', JSON.stringify(area))
            this.$emit('closePopup')
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
    .areaList {
        label {
            font-size: px2rem(28);
            color: #222222;
            line-height: px2rem(36);
            padding-top: px2rem(24);
            padding-bottom: px2rem(24);
            @include flexbox();
            @include flexVert();
            .address-item {
                width: px2rem(550);
                @include nLineLimit(2);
            }
            .icon-check2 {
                position: absolute;
                right: px2rem(32);
                font-size: px2rem(24);
                line-height: px2rem(36);
                &::before {
                    color: #F99E00;
                    font-size: px2rem(24);
                    line-height: px2rem(36);
                }
            }
        }
        .active {
            color: #F99E00;
        }
    }
</style>
