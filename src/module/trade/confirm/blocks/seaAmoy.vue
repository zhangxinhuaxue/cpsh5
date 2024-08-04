<!--  created by hity -->
<template>
    <div>
        <div v-if="idCardTipsState" class="sea-amoy" @click="popup()">
            <i class="icon icon-attetion"></i>
            <p>海淘商品需要提供收件人身份信息用于清关，否则无法发货。</p>
            <span class="icon icon-back-frame"><i class="icon-back"></i></span>
        </div>
        <com-popup @cancel="closePopup()" :isPop="isPopup">
            <axd-sea-amoy-popup @cancel="closePopup()" slot="content" :idCard="idCard" @confirm="confirmNameAndId()"></axd-sea-amoy-popup>
        </com-popup>
    </div>
</template>
<script>
import comPopup from 'components/popup/index.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { hasIdCard } from 'store/modules/trade/confirm'
import axdSeaAmoyPopup from './seaAmoyPopup.vue'
import { AXD } from 'src/libs/util'
export default {
    name: 'product',
    data() {
        return {
            showCard: false, // 初始化的地址，是否有匹配的身份证
            idCard: '',
            isPopup: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        ...mapMutations('trade/confirm', [
            'changeBottomTips'
        ]),
        init() {
            this.getIdCardState(this.addrId)
        },
        getIdCardState(addrId) {
            hasIdCard({
                deliverId: addrId
            }).then(({ success, code, resultDes }) => {
                if (success) {
                    this.showCard = false
                } else {
                    if (code === '-1999' || code === '-2000') {
                        this.$_toast(resultDes)
                        this.showCard = false
                    } else {
                        this.showCard = true
                    }
                }
                this.changeBottomTips({
                    idCard: this.showCard
                })
            })
        },
        popup() {
            this.isPopup = true
        },
        closePopup() {
            this.isPopup = false
        },
        confirmNameAndId() {
            this.closePopup()
            this.getIdCardState(this.addrId)
        }
    },
    computed: {
        ...mapState('address', {
            addrId: state => state.addrSelected.id,
            name: state => state.addrSelected.name
        }),
        ...mapGetters('trade/confirm', [
            'idCardTipsState'
        ])
        // toCheckIdCard() {
        //     return this.addrId + '_' + this.name
        // }
    },
    watch: {
        addrId(newValue) {
            this.getIdCardState(this.addrId)
        }
    },
    components: {
        comPopup,
        axdSeaAmoyPopup
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/mixins.scss';

.sea-amoy {
    background: #FFF5D8;
    position: fixed;
    bottom: px2rem(100);
    padding: px2rem(20) px2rem(30);
    width: 16rem;

    @include flexbox();
    @include flexVert();
    p {
        font-size: px2rem(28);
        color: #F99E00;
        line-height: 129%;
    }

    .icon-attetion {
        margin-right: px2rem(12);
    }

    .icon-back-frame {
        transform: rotate(180deg);
        font-weight: bold;
    }

    i {
        &::before {
            color: #F99E00;
        }
    }
}
</style>
