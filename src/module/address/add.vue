<!--
    Created by Doris on 05/09/17
-->
<template>
    <div class="aui-page">
        <div class="aui-fixedbottom">
            <a href="javascript:;" class="aui-btn_full" @click="save" :class="{'aui-btn_disabled': disable}">确定</a>
        </div>
        <div class="aui-content">
            <div class="aui-cells">
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">收货人</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input class="aui-input" type="text" placeholder="请填写收货姓名" v-model="addr.name" maxlength="30" />
                    </div>
                </div>
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">手机号</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input class="aui-input" type="tel" placeholder="请填写收货人手机号码" v-model="addr.mobilephone" maxlength="11" />
                    </div>
                    <div v-if="isApp" class="aui-cell__ft phone_icon" @click="pickContacts">
                        <axd-image :src="phoneLink" :lazy="false"></axd-image>
                    </div>
                </div>
                <a :class="['aui-cell', 'aui-cell_access', isAreaDefault]" href="javascript:;" @click="selectArea()">
                    <div class="aui-cell__bd">
                        <p>省市区</p>
                    </div>
                    <div class="aui-cell__ft"><span class="cell_length">{{areaSelected}}</span></div>
                </a>
                <!-- 省市区picker -->
                <area-picker :areaPopShow="areaPopShow" @confirm="areaSelectBack" @close="areaSelectClose"></area-picker>

                <a :class="['aui-cell', 'aui-cell_access', isStreetDefault]" href="javascript:;" @click="selectStreet()">
                    <div class="aui-cell__bd">
                        <p>街道</p>
                    </div>
                    <div class="aui-cell__ft" :class="{'no-arrow': noStreet}"><span class="cell_length">{{streetSelected}}</span></div>
                </a>
                <!-- 街道选择picker -->
                <pop-picker :labels="streetLabels" :objArr="streetObjArr" @back="streetSelectBack" :popshow="streetPopShow"></pop-picker>

                <!-- <a :class="['aui-cell', 'aui-cell_access', isSchoolDefault]" href="javascript:;" @click="selectSchool()">
                    <div class="aui-cell__bd">
                        <p>学校</p>
                    </div>
                    <div class="aui-cell__ft"><span class="cell_length">{{schoolSelected}}</span></div>
                </a> -->
                <!-- 学校选择picker -->
                <!-- <pop-picker :labels="schoolLabels" :objArr="schoolObjArr" @back="schoolSelectBack" :popshow="schoolPopShow"></pop-picker> -->

                <div class="aui-cell aui-detail__textarea">
                    <textarea placeholder="请填写详细地址，越精确越有助于快速收到快递。" v-model="addr.address" maxlength="200"></textarea>
                </div>
            </div>
            <div class="aui-cells aui-cells_form">
                <div class="aui-cell aui-cell_switch">
                    <div class="aui-cell__bd">设为默认地址</div>
                    <div class="aui-cell__ft">
                        <input class="aui-switch" type="checkbox" v-model="checked">
                    </div>
                </div>
            </div>
        </div>
        <axd-dialog v-if="showAlert" :showDialog="showAlert" :dialogInfo="dialogInfo" @mainClick="manageList"></axd-dialog>
    </div>
</template>
<script>
import {
    saveDeliver,
    getEdit,
    getdeliverList
} from 'src/store/modules/address'
import {
    getStreets
} from 'src/store/api'
import {
    testTelphone
} from 'module/user/common/common'
import popPicker from 'components/picker/poppicker.vue'
import areaPicker from 'src/module/common/components/area.vue'
import axdImage from 'components/image/index.vue'
import axdDialog from 'module/trade/common/item_dialog/dialog.vue'
import eventBus from './event_bus.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('address')
export default {
    name: 'addaddress',
    data() {
        return {
            // info
            isApp: aixuedai.isUavoApp === 'y',
            phoneLink: require('./img/phone.png'),
            id: 0, // 操作的地址对象id
            addr: {
                name: '',
                mobilephone: '',
                id: '',
                province: '',
                provinceCode: '',
                city: '',
                cityCode: '',
                district: '',
                districtCode: '',
                street: '',
                streetCode: '',
                schoolName: '',
                schoolId: '',
                address: '',
                status: 'y'
            },
            checked: true, // 是否标为默认
            areaPopShow: false, // 省市区选择picker是否显示
            streetPopShow: false, // 街道选择picker是否显示
            areaNow: '', // 列表现展示为省／市／区哪一项
            // 学校 picker
            // schoolLabels: {
            //     title: '选择学校',
            //     name: '选择学校'
            //     // content: '同学可以直接选择学校，免输入哦'
            // },
            streetLabels: {
                title: '选择街道',
                name: '选择街道',
                content: '无街道地址'
            },
            // schoolPopShow: false, // 省市区选择picker是否显示
            // schoolOriArr: [], // 原始对象数组
            // schoolObjArr: [], // 传入列表
            // 地址提交中按钮disable状态
            disable: false,
            streetOriArr: [], // 原始对象数组
            streetObjArr: [], // 传入列表
            showAlert: false,
            noStreet: true
        }
    },
    computed: {
        ...mapState({
            tradeAddrId: state => state.addrSelected.id
        }),
        areaSelected() {
            return this.addr.province ? this.addr.province + this.addr.city + this.addr.district : '请选择'
        },
        isAreaDefault() {
            return this.addr.province ? 'select' : ''
        },
        isStreetDefault() {
            return this.addr.street ? 'select' : ''
        },
        streetSelected() {
            return this.noStreet ? '无街道地址' : (this.addr.street ? this.addr.street : '请选择')
        }
        // schoolSelected() {
        //     return this.addr.schoolName ? this.addr.schoolName : '请选择'
        // },
        // isSchoolDefault() {
        //     return this.addr.schoolName ? 'select' : ''
        // }
    },
    components: {
        popPicker,
        axdImage,
        areaPicker,
        axdDialog
    },
    activated() {
        if (this.$route.query.id && this.$route.query.id != this.id) {
            this.getEditInit()
        }
        // 如果地址列表超过10个地址，则提示
        if (Number(this.$route.query.id) === -1) {
            this.checkAddressList()
        }
    },
    methods: {
        ...mapMutations([
            'saveAddress'
        ]),
        checkAddressList() {
            let me = this
            getdeliverList().then(function(data) {
                if (data.success && data.result && data.result.deliverList) {
                    if (data.result.deliverList.length >= 10) {
                        me.dialogInfo = {
                            title: '',
                            content: '您的收货地址已达10个上限，请修改一个收货地址',
                            btn: '管理地址',
                            singleBtn: true
                        }
                        me.showAlert = true
                    }
                }
            })
        },
        getEditInit() {
            this.reset(this.addr)
            this.id = this.$route.query.id
            getEdit({
                id: this.id
            }).then(res => {
                Object.assign(this.addr, res.result)
                this.checked = (this.addr.status == 'y' || this.addr.status == '')

                // 初始化
                // this.renderSchool(this.addr.cityCode)
                this.renderStreet(this.addr.districtCode, 'init')
            })
        },
        // renderSchool(cityCode) {
        //     if (!cityCode) {
        //         return
        //     }
        //     getSchools({
        //         cityId: cityCode
        //     }, (res) => {
        //         this.schoolOriArr = res.result
        //         this.schoolObjArr = ['请选择']
        //         this.schoolOriArr.forEach((item) => {
        //             this.schoolObjArr.push(item.schoolName)
        //         })
        //     })
        // },
        renderStreet(districtCode, oprDuringType) {
            let me = this
            if (!districtCode) {
                return
            }
            getStreets({
                districtCode: districtCode
            }, (res) => {
                if (res.success) {
                    if (res.result && res.result.length) {
                        me.streetOriArr = res.result
                        me.streetObjArr = []
                        me.streetOriArr.forEach((item) => {
                            me.streetObjArr.push(item.street)
                        })
                        this.noStreet = false
                    } else {
                        if (oprDuringType != 'init') {
                            Object.assign(me.addr, {
                                street: '',
                                streetCode: ''
                            })
                            this.noStreet = true
                        }
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        selectArea() {
            this.areaPopShow = true
        },
        selectStreet() {
            if (this.streetObjArr.length < 1 || this.noStreet) {
                return
            }
            this.streetPopShow = true
        },
        areaSelectClose() {
            this.areaPopShow = false
        },
        // 省市区回传
        areaSelectBack(data) {
            if (data.cityCode != this.addr.cityCode) {
                Object.assign(this.addr, {
                    schoolName: '',
                    schoolId: ''
                })
                // this.renderSchool(data.cityCode) // 学校
            }
            // 如果区发生变化，请求街道列表
            if (data.districtCode != this.addr.districtCode) {
                Object.assign(this.addr, {
                    street: '',
                    streetCode: ''
                })
                this.renderStreet(data.districtCode, 'change') // 街道
            }
            [
                this.addr.province,
                this.addr.provinceCode,
                this.addr.city,
                this.addr.cityCode,
                this.addr.district,
                this.addr.districtCode
            ] = [
                data.province,
                data.provinceCode,
                data.city,
                data.cityCode,
                data.district,
                data.districtCode
            ]
            this.areaPopShow = false
        },
        // 学校回传
        // schoolSelectBack(data) {
        //     if (!data) {
        //         this.schoolPopShow = false
        //         return
        //     }
        //     if (data.index == 0) {
        //         Object.assign(this.addr, {
        //             schoolName: '',
        //             schoolId: ''
        //         })
        //     } else {
        //         Object.assign(this.addr, this.schoolOriArr[data.index - 1])
        //     }
        //     this.schoolPopShow = false
        // },
        // 街道回传
        streetSelectBack(data) {
            if (!data) {
                this.streetPopShow = false
                return
            }
            Object.assign(this.addr, this.streetOriArr[data.index])
            this.streetPopShow = false
        },
        // 校验
        validate() {
            let requires = [{
                name: 'name',
                sub: '请输入收货人姓名'
            }, {
                name: 'mobilephone',
                sub: '请输入手机号码'
            }, {
                name: 'province',
                sub: '请选择省市区'
            }, {
                name: 'address',
                sub: '请输入详细地址'
            }, {
                name: 'streetCode',
                sub: '请输入街道地址'
            }]
            for (let item of requires) {
                let value = this.addr[item.name]
                if (!(item.name == 'streetCode' && this.noStreet)) {
                    if (value == undefined || value == '') {
                        this.$_toast(item.sub)
                        return
                    }
                }
            }

            // 格式校验
            if (!testTelphone(this.addr.mobilephone)) {
                this.$_toast('手机号格式输入不正确')
                return
            }
            return true
        },
        // 表单提交
        save() {
            if (this.disable || !this.validate()) {
                return
            }
            this.disable = true
            this.addr.status = this.checked ? 'y' : 'n'
            saveDeliver(this.addr).then(res => {
                if (res.success) {
                    // 地址改变，刷新地址列表
                    eventBus.$emit('updateList')
                    // 若为修改地址
                    let text = '地址修改成功'
                    this.id = res.result.id
                    // 若为添加地址
                    if (this.$route.query.id == -1) {
                        text = '地址添加成功'
                        this.id = 0
                    }
                    // let text = this.$route.query.id == -1 ? '地址添加成功' : '地址修改成功'
                    // this.id = 0
                    this.$_toast({
                        txt: text,
                        callback: () => {
                            //  确认订单页直接添加
                            if (this.$route.query.isFromTrade || this.tradeAddrId == this.id) {
                                this.addr.id = res.result.id
                                let addaddr = this.addr
                                addaddr.address = addaddr.schoolName + addaddr.address
                                this.saveAddress(addaddr)
                            }
                            this.$router.go(-1)
                        }
                    })
                } else {
                    this.$_toast(res.resultDes)
                }
                this.disable = false
            })
        },
        reset(obj) {
            for (let key of Object.keys(obj)) {
                obj[key] = ''
            }
        },
        // 原生访问通讯录
        pickContacts() {
            if (this.isApp) {
                axdApp.send({
                    module: 'tools',
                    method: 'pickContacts',
                    callback: (ret) => {
                        if(ret.code === -994) {
                            this.$_toast('当前未获取到应用通讯录权限，请在设置中打开')
                            return
                        }
                        if (ret.data.phone) {
                            this.addr.mobilephone = ret.data.phone.replace(/-/g, '')
                        }
                    }
                })
            }
        },
        manageList() {
            this.showAlert = false
            this.$router.replace({
                path: 'list',
                query: {id: -1}
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-detail__textarea {
    height: px2rem(300);
    -webkit-align-items: flex-start;
    align-items: flex-start;
    textarea {
        width: 100%;
        height: 100%;
        resize: none;
        display: block;
        font-size: px2rem(28);
        border: 0;
    }
}

.phone_icon {
    width: px2rem(44);
    height: px2rem(44);
}

.cell_length {
    display: inline-block;
    vertical-align: middle;
    max-width: px2rem(475);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.aui-cell .no-arrow {
    &::after {
        display: none;
    }
    .cell_length {
        position: relative;
        left: px2rem(50);
    }
}
</style>
