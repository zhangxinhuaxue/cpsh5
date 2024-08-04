<!--
    Created by Doris on 05/09/17
-->
<template>
    <div class="aui-cells">
        <a class="aui-cell_auto aui-cell_access address-confirm" href="javascript:;" v-if="item.address" @click="jumpPage('list')">
            <div class="aui-cell__hd">
                <p>{{ item.name }}</p>
                <div class="tag__box">
                    <span v-show="item.status === 'y'" class="aui-tag_border">默认</span>
                </div>
            </div>
            <div class="aui-cell__bd">
                <p>{{ item.mobilephone | formatPhone }}</p>
                <p>{{ item.province + item.city + item.district + (item.street ? item.street : '') + item.address }}</p>
            </div>
            <div class="aui-cell__ft"></div>
        </a>
        <a class="aui-cell aui-cell_access address-add" href="javascript:;" v-else @click="jumpPage('add')">
            <div class="aui-cell__bd">
                请添加收货地址
            </div>
            <div class="aui-cell__ft"></div>
        </a>
    </div>
</template>
<script>
import add from './add.vue'
import list from './list.vue'
import {
    getdeliverList,
    deleteDeliver
} from 'src/store/modules/address'
import {
    formatPhone
} from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('address')

export default {
    name: 'mallAddress',
    mounted() {
        this.init()
    },
    data() {
        return {}
    },
    filters: {
        formatPhone
    },
    computed: {
        ...mapState({
            item: state => state.addrSelected
        })
    },
    methods: {
        ...mapMutations([
            'saveAddress'
        ]),
        init() {

            if (this.item.address) {
                return
            }

            // 跳转自商品详情页
            this.getDefault()
        },

        // 获取默认地址
        getDefault() {
            let defaultItem = {}
            getdeliverList().then((res) => {
                if (res.success) {
                    // 无收货地址
                    if (res.result.deliverList.length == 0) {
                        Object.assign(defaultItem, {
                            name: res.result.name,
                            mobilephone: res.result.mobilephone
                        })
                        this.saveAddress(defaultItem)
                        return
                    }
                    let addressList = res.result.deliverList
                    // 显示默认收货地址
                    for (let item of addressList) {
                        if (item.status == 'y') {
                            defaultItem = item
                            break
                        }
                    }
                    // 无默认收货地址，显示第一个地址
                    if (!defaultItem.name) {
                        defaultItem = addressList[0]
                    }
                    this.saveAddress(defaultItem)
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },

        // 页面跳转
        jumpPage(path) {
            let query = {
                id: this.item.id,
                isFromTrade: 'true'
            }
            if (path == 'add') {
                query.id = -1
            }
            this.$router.push({
                path: this.$route.path + '/address/' + path,
                query: query
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-cells {
    border-top: 0;
    background-image: repeating-linear-gradient(-45deg, #2CB5FC, #2CB5FC px2rem(18), #fff 0, #fff px2rem(26), #F66045 0, #F66045 px2rem(44), #fff 0, #fff px2rem(52));
    background-size: px2rem(750) px2rem(750);
    padding-bottom: px2rem(4);
}

.aui-cell_access {
    background-color: #fff;
}

.address-confirm {
    padding: px2rem(32);
    font-size: px2rem(28);
    line-height: px2rem(34);
    -webkit-align-items: flex-start;
    align-items: flex-start;
    .aui-cell__hd {
        margin-right: px2rem(15);
        width: px2rem(150);
        p:first-child {
            max-height: px2rem(64);
            margin-bottom: px2rem(30);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }
    .aui-cell__hd,
    .aui-cell__bd {
        p:first-child {
            margin-bottom: px2rem(30);
        }
    }
    .aui-cell__bd {
        p:last-child {
            width: px2rem(480);
            max-height: px2rem(98);
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
    .aui-cell__ft {
        position: static;
        &:after {
            right: px2rem(32);
        }
    }
}

.address-add {
    height: px2rem(150);
    .aui-cell__bd {
        background: url(./img/add.png) no-repeat center left;
        background-size: px2rem(30);
        font-size: px2rem(30);
        padding-left: px2rem(45);
    }
}

body.aym {
    .address-add {
        .aui-cell__bd {
                background: url(./img_old/add.png) no-repeat center left;
        }
    }
}
.aui-cells:after {
    content: none;
}
.tag__box{
  height: px2rem(46);
  overflow: hidden;
}
</style>
