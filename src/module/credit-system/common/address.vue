<!--
 * @Author: dongyusi
 * @Date: 07/2018
 * @LastEditTime: 2019-09-10 16:59:32
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 -->
<template>
    <div>
        <m-page>
            <p class="cell-sub">请填写你真实的居住地址</p>
            <m-cell-group class="mt0">
                <m-cell title="所在地区"
                    class="text-ellipsis"
                    :value="areaName"
                    :placeholder="defaultText"
                    is-link
                    @click="getAreaInfo"></m-cell>
                <m-input type="textarea"
                placeholder="街道、小区门牌号等详细地址"
                maxlength="200"
                v-model.trim="formData.addrDetail"></m-input>
            </m-cell-group>
            <m-cell-group>
                 <m-input title="常用QQ号"
                    type="tel"
                    placeholder="必填"
                    v-model.trim="formData.qq"></m-input>
            </m-cell-group>
            <m-button @click="submit" :disabled="disabled">{{btnText}}</m-button>
            <div class="privacy-tip">
                收集您的居住地信息，是基于<strong>《中华人民共和国民事诉讼法》</strong>第二十二条、<strong>《金融机构客户身份识别和客户身份资料及交易记录保存管理办法》</strong>第三十三条规定，因贷款类APP产品未来会可能出现和逾期客户的法律诉讼，需收集客户的居住地信息。收集您的QQ号，是为了确定您存在基本社交关系，以确定您是具备有一定社会关系的个人。
            </div>
        </m-page>
        <credit-area :isShow="isShow" :dataList="areaData" title="选择省份地区" @areaClose="hideArea" @areaSelect="areaSelect">
        </credit-area>
        <credit-back-dialog v-if="isFlow"></credit-back-dialog>
    </div>
</template>
<script>
import * as request from 'src/store/modules/credit-system/area'
import { getLocation, submitLocation } from 'src/store/modules/credit-system'

import { AXD, testQQ } from 'src/libs/util'
import creditArea from '../components/area.vue'
import creditBackDialog from '../components/back-dialog.vue'
export default {
    name: 'credit-address',
    data() {
        let { backUrl, platform = 'aiyoumi', style = 'card', reset } = this.$route.query
        return {
            backUrl: decodeURIComponent(backUrl),
            platform,
            reset,
            isFlow: style === 'flow',
            text: '',
            // isApp: aixuedai.isUavoApp === 'y',
            isShow: false,
            formData: {
                provinceName: '',
                provinceCode: '',
                cityName: '',
                cityCode: '',
                districtName: '',
                districtCode: '',
                addrDetail: '',
                baiduMac: '{}',
                qq: ''
            },
            areaData: [{
                name: 'province',
                list: []
            }, {
                name: 'city',
                list: []
            }, {
                name: 'district',
                list: []
            }],
            submitting: false,
            areaSelected: [],
            locationStatus: false,
            defaultText: this.isApp ? '请授权获取你的位置' : '请选择'
        }
    },
    components: {
        creditArea,
        creditBackDialog
    },
    computed: {
        disabled() {
            return !this.formData.districtName || !this.formData.addrDetail || !this.formData.qq || this.submitting
        },
        areaName() {
            return this.formData.provinceName ? `${this.formData.provinceName} ${this.formData.cityName} ${this.formData.districtName}` : ''
        },
        btnText() {
            let text = this.isFlow ? '下一步' : '完成'
            return this.submitting ? '提交中' : text
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            getLocation().then((res) => {
                if (res.success) {
                    !this.reset && Object.assign(this.formData, res.result)
                } else {
                    this.$_toast(res.resultDes)
                }
            })
            this.getAreaDate('getProvinces', 0)
        },
        getAreaDate(url, index, params = null) {
            let param = params ? [params] : []
            request[url](...param, (res) => {
                if (res.success) {
                    this.areaData[index].list = res.result
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        submit() {
            if (!this.check()) {
                return
            }
            this.submitting = true
            this.log({ type: 'button-logic', name: 'creditAddressSubmit', desc: '基础授信地址提交按钮', extendData: {type: typeof this.formData.baiduMac, value: this.formData.baiduMac} })
            if (this.isApp && this.formData.baiduMac === '{}') { 
                AXD.util.getLocationInfo('基础授信地址提交').then(locationData => {
                    this.formData.baiduMac = locationData
                    this.handleSubmit()
                }, err => {
                    // this.submitting = false
                    // this.defaultText = err
                    this.handleSubmit()
                })
            } else {
                this.handleSubmit()
            }
        },
        handleSubmit() {
            submitLocation(this.formData).then((res) => {
                this.submitting = false
                // let that = this
                if (res.success) {
                    this.$_toast({
                        time: 1000,
                        txt: '保存成功',
                        callback: () => {
                            if (this.isFlow) {
                                window.location.href = this.backUrl
                            } else {
                                this.$router.go(-1)
                            }
                        }
                    })
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        getAreaInfo() {
            // 在app中用户未授权位置信息
            if (this.isApp && !this.locationStatus && !this.formData.provinceName) {
                this.defaultText = '定位中'
                AXD.util.getLocationInfo('基础授信地址自动填充').then(locationData => {
                    // 标识已授权
                    this.locationStatus = true

                    const baiduMac = locationData
                    if (baiduMac === '{}') {
                        this.defaultText = '定位失败，点击选择'
                        return
                    }
                    let obj  = {}
                    try{
                        obj = JSON.parse(locationData)
                    }catch(e){}
                    
                    let {province = '', city = '', district = ''} = obj
                    // 首次授权，自动填充省市区
                    // 移动端不返回省市区code
                    Object.assign(this.formData, {
                        baiduMac,
                        provinceName: province,
                        cityName: city,
                        districtName: district,
                        provinceCode: '',
                        cityCode: '',
                        districtCode: ''
                    })
                }, err => {
                    // this.defaultText = '授权失败，点击重试'
                    this.showArea()
                })
                return
            }
            this.showArea()
        },
        showArea() {
            this.isShow = true
        },
        hideArea() {
            this.isShow = false
        },
        areaSelect(item, index) {
            let type = this.areaData[index].name
            let typeCode = `${type}Code`
            if (index === 2) {
                this.formData.provinceCode = item.provinceCode
                this.formData.provinceName = item.province
                this.formData.cityCode = item.cityCode
                this.formData.cityName = item.city
                this.formData.districtCode = item.districtCode
                this.formData.districtName = item.district
                return
            }
            if (item[typeCode] !== this.areaSelected[index]) {
                let func = {
                    0: 'getCitys',
                    1: 'getDistricts'
                }[index]
                let params = {
                    [typeCode]: item[typeCode]
                }
                this.getAreaDate(func, index + 1, params)
            }
        },
        check() {
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5\-]+$/
            if (!reg.test(this.formData.addrDetail)) {
                this.$_toast('详细地址包含特殊字符，格式错误')
                return
            }
            if (!testQQ(this.formData.qq)) {
                this.$_toast('请输入5-15位QQ号码')
                return
            }
            return true
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mui-btn {
    margin-top: px2rem(50);
}

.mt0 {
    margin-top: 0;
}

.cell-detail {
    display: block;
}

.address-detail {
    display: block;
    width: 100%;
    border: 0;
    font-size: $auiFontSizeLevel6;
    min-height: px2rem(132);
}
.privacy-tip {
    color: #aaa;
    font-size: px2rem(24);
    padding: px2rem(48) px2rem(36);
}
</style>
