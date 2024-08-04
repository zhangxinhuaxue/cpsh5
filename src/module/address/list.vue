<!--
    Created by Doris on 05/09/17
-->
<template>
    <div class="aui-page">
        <!-- 底部按钮 -->
        <div v-show="!loading">
            <div class="aui-fixedbottom" v-if="isAddBtnShow">
                <a href="javascript:;" class="aui-btn_full" @click="jumpPage('add')">添加地址</a>
            </div>
            <!-- 主体部分 -->
            <div class="aui-content addr-content">
                <div class="page-nomap" v-if="isnomap">
                    <axd-image :src="nomap" :lazy="false"></axd-image>
                    <p>你还没收货地址</p>
                </div>
                <div v-else class="aui-cells" v-for="(item, i) in addrList" :key="item.id" :class="{ 'address-selected': item.id == selectId}">
                    <div class="cell_bg">
                        <div class="aui-cell_auto list__info" @click="select(i)">
                            <div class="aui-cell__hd">
                                <p>{{ item.name }}</p>
                                <p>
                                    <span v-if="item.status === 'y'" class="aui-tag_border">默认</span>
                                </p>
                            </div>
                            <div class="aui-cell__bd">
                                <p>{{ item.mobilephone | formatPhone }}</p>
                                <p>{{ item.province + item.city + item.district + (item.street ? item.street : '') + item.address }}</p>
                            </div>
                        </div>
                        <div class="aui-cell list__sub">
                            <div class="aui-cell__bd">
                                <p v-if="item.isAuth === 'y'">授信地址</p>
                            </div>
                            <div class="aui-cell__ft">
                                <p @click="jumpPage('edit', i)">编辑</p>
                                <p v-if="!isFromTrade" @click="deleteItem(item.id)">删除</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <modal :show='showDialog'>
                <div slot="title">提示</div>
                <div slot="content">确定要删除该收货地址吗？</div>
                <div slot="buttons" class="aui-dialog__ft">
                    <span class="aui-dialog__btn aui-dialog__btn_default" @click="subClick()">取消</span>
                    <span class="aui-dialog__btn aui-dialog__btn_primary" @click="mainClick()">确认</span>
                </div>
            </modal>
        </div>
    </div>
</template>
<script>
import {
    getdeliverList,
    deleteDeliver
} from 'src/store/modules/address'
import {
    formatPhone,
    AXD
} from 'src/libs/util'
import axdImage from 'components/image/index.vue'
import modal from 'components/modal/index.vue'
import {
    formatRet
} from 'src/store/base'
import eventBus from './event_bus.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('address')
export default {
    name: 'axd-address',
    mounted() {
        this.init()
        eventBus.$on('updateList', () => {
            this.init()
        })
    },
    data() {
        return {
            isFromAddr: false,
            nomap: require('./img/nomap.png'),
            showDialog: false,
            addrList: [], // 列表
            deleteId: -1, // 删除项
            moveDistance: 0,
            loading: true,
            isLogin: false, // 是否登录
            selected: {}
        }
    },
    filters: {
        formatPhone
    },
    computed: {
        ...mapState({
            storeDeliverId: state => state.addrSelected.id,
            storeDeliverName: state => state.addrSelected.name
        }),
        isFromTrade() {
            return this.$route.query.isFromTrade == 'true'
        },
        isnomap() {
            return this.addrList.length == 0
        },
        isAddBtnShow() {
            return this.addrList.length < 10
        },
        selectId() {
            return this.isFromTrade ? this.$route.query.id : ''
        }
    },
    components: {
        axdImage,
        modal
    },
    activated() {
        // this.init()
        if (this.isFromTrade) {
            if (this.selected.id === this.storeDeliverId && this.selected.name !== this.storeDeliverName) {
                this.init()
            }
            this.$nextTick(() => {
                setTimeout(() => {
                    this.scroll()
                }, 600)
            })
        }
    },
    methods: {
        ...mapMutations([
            'saveAddress'
        ]),
        // list列表刷新
        init() {
            this.loading = true
            getdeliverList().then((res) => {
                res = formatRet(res)
                if (res.success) {
                    this.addrList = res.result.deliverList
                    this.isLogin = true
                } else {
                    if (res.code == '-1999') {
                        this.isLogin = false
                        AXD.util.login()
                    } else {
                        this.isLogin = true
                        this.$_toast(res.resultDes)
                    }
                }
                this.loading = false
            })
        },

        // 滚动
        scroll() {
            if (!document.querySelector('.address-selected')) {
                return
            }
            let topTo = document.querySelector('.address-selected').offsetTop
            let topNow = 0
            let timer = setInterval(() => {
                if (document.querySelector('.addr-content')) {
                    document.querySelector('.addr-content').scrollTop = topNow
                }
                topNow += 15
                if (topNow >= topTo) {
                    clearInterval(timer)
                }
            }, 10)
        },

        // 选择列表中的某一个地址
        select(index) {
            if (this.isFromTrade) {
                this.selected = this.addrList[index]
                this.saveAddress(this.addrList[index])
                this.$router.go(-1)
            }
        },

        // 新增/修改地址
        jumpPage(path, index) {
            if (this.isLogin) {
                let id = path == 'add' ? -1 : this.addrList[index].id
                this.$router.push({
                    path: path,
                    query: {
                        id: id
                    }
                })
            } else {
                AXD.util.login()
            }
        },

        // 删除地址
        deleteItem(id) {
            this.showDialog = true
            this.deleteId = id
        },

        // dialog对话框操作
        subClick() {
            this.showDialog = false
        },
        mainClick() {
            this.showDialog = false
            deleteDeliver({
                id: this.deleteId
            }).then(res => {
                if (res.success) {
                    this.$_toast({
                        txt: '地址删除成功',
                        callback: () => {
                            this.init()
                        }
                    })
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.page-list {
    padding-bottom: px2rem(130);
}

.aui-cells {
    padding: px2rem(4) 0;
}

.address-selected {
    background-image: repeating-linear-gradient(-45deg, #2CB5FC, #2CB5FC px2rem(18), #fff 0, #fff px2rem(26), #F66045 0, #F66045 px2rem(44), #fff 0, #fff px2rem(52));
    background-size: px2rem(750) px2rem(750);
    &:before,
    &:after {
        content: none;
    }
}

.cell_bg {
    background-color: #fff
}

.aui-cell__ft {
    text-align: left;
    -webkit-box-flex: 1;
    flex: 1;
}

.list__info {
    align-items: stretch;
    padding-top: px2rem(46);
    padding-bottom: px2rem(50);
    p {
        line-height: px2rem(34);
    }
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
    .aui-cell__bd {
        p:first-child {
            margin-bottom: px2rem(30);
        }
        p:last-child {
            width: px2rem(520);
            max-height: px2rem(98);
            display: -webkit-box;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
}

.list__sub {
    padding-bottom: px2rem(28);
    p {
        color: $auiTextColorAssistant;
    }
    .aui-cell__bd {
        p {
            padding-left: px2rem(35);
            background: url(./img/auth.png) no-repeat center left;
            background-size: px2rem(30);
        }
    }
    .aui-cell__ft {
        text-align: right;
        p:first-child {
            padding-left: px2rem(35);
            background: url(./img/edit.png) no-repeat center left;
            background-size: px2rem(30);
            display: inline-block;
        }
        p:nth-child(2) {
            padding-left: px2rem(35);
            margin-left: px2rem(30);
            background: url(./img/delete.png) no-repeat center left;
            background-size: px2rem(30);
            display: inline-block;
        }
    }
}

.aui-content {
    padding-bottom: px2rem(25);
    z-index: 1000;
}

.page-nomap {
    margin: px2rem(300) auto 0;
    width: px2rem(240);
    text-align: center;
    p {
        margin-top: px2rem(25);
        color: $auiTextColorAssistant;
        font-size: $auiFontSizeLevel5;
    }
}
</style>
