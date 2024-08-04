<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <div class="aui-cells">
                <a @click="goGroupUrl(shopId, '全部商品')" class="aui-cell aui-cell_access">
                    <div class="aui-cell__bd">
                        <p>全部商品</p>
                    </div>
                    <div class="aui-cell__ft">
                    </div>
                </a>
            </div>
            <template v-if="groupList.length" v-for="firstItem in groupList">
                <div class="aui-cells" :class="{'group_first': firstItem.hasChild}">
                    <router-link :to="{name: 'groupProducts', params: {groupId: firstItem.id}, query: {name: firstItem.name}}" class="aui-cell aui-cell_access">
                        <div class="aui-cell__bd">
                            <p>{{firstItem.name}}</p>
                        </div>
                        <div class="aui-cell__ft">
                        </div>
                    </router-link>
                </div>
                <div v-if="firstItem.hasChild" v-for="secondItem in firstItem.children" class="aui-cells group_second">
                    <router-link :to="{name: 'groupProducts', params: {groupId: secondItem.id}, query: {name: secondItem.name}}" class="aui-cell aui-cell_access">
                        <div class="aui-cell__bd">
                            <p>{{secondItem.name}}</p>
                        </div>
                        <div class="aui-cell__ft">
                        </div>
                    </router-link>
                    <div v-if="secondItem.hasChild" class="group_third">
                        <template v-for="thirdItem in secondItem.children">
                            <router-link :to="{name: 'groupProducts', params: {groupId: thirdItem.id}, query: {name: thirdItem.name}}" class="aui-btn_border">{{thirdItem.name}}</router-link>
                        </template>
                    </div>
                </div>
            </template>
            <error-page v-if="isError"></error-page>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import errorPage from '../common/error-tips.vue'
import { getProductGroup } from 'store/modules/shop/index'

export default {
    name: 'groupList',
    data() {
        return {
            barConfig: {
                reset: ''
            },
            groupList: [],
            isError: false
        }
    },
    computed: {
        shopId() {
            return this.$route.params.shopId
        }
    },
    activated() {
        this.barConfig.reset += '1'
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            let params = {
                shopId: this.shopId
            }
            getProductGroup(params).then((res) => {
                if (res.success && res.result) {
                    this.groupList = res.result
                } else {
                    this.isError = true
                }
            })
        },
        goGroupUrl(id, name) {
            this.$router.push({
                name: 'groupProducts',
                params: {
                    groupId: id
                },
                query: {
                    name,
                    key: 'all'
                }
            })
        }
    },
    components: {
        hybridHeader,
        errorPage
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.group_first .aui-cell:before {
    display: block;
    top: initial;
    bottom: 0;
}

.group_second {
    margin-top: 0;
    .aui-cell:before {
        display: none;
    }
    .aui-cell__bd {
        color: $auiTextColorAssistant;
    }
}

.group_third {
    padding: 0 px2rem(2);
    a {
        width: auto;
        margin: px2rem(15) 0 px2rem(15) px2rem(30);
        padding: 0 px2rem(38);
        border-color: $auiLineColorLight;
        color: $auiTextColorGeneral;
    }
}
</style>
