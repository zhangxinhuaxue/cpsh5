<!--
    created by zhaozhisheng on 05/10/2017
 -->
<template>
    <div>
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-fixedbottom">
                <a href="javascript:;" class="aui-btn_full" @click="showPicker">EXAMPLE</a>
            </div>
            <div class="aui-content">
            </div>
        </div>
        <m-picker :slots="slots" @closePicker="closePicker" :pickerTitle="pickerTitle" @back="getData" @change="resetData" :popshow="showflag"></m-picker>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import mPicker from 'components/picker/multipicker.vue'
import {
    getProvinces,
    getCitys,
    getDistricts
} from 'src/store/api'
export default {
    name: 'DEMO-PICKER',
    data() {
        return {
            /* header数据 */
            barConfig: {
                action: '', // 右侧按钮点击事件
                h5: {
                    text: '关闭'
                },
                app: {
                    rightBtn: 'close' // 右侧按钮类型
                }
            },
            showflag: false,
            slots: [],
            pickerTitle: '省市区'
        }
    },
    watch: {},
    computed: {},
    components: {
        hybridHeader,
        mPicker
    },
    mounted() {
        let provinces = [{
            'provinceId': '110000',
            'provinceName': '北京市'
        }, {
            'provinceId': '120000',
            'provinceName': '天津市'
        }, {
            'provinceId': '130000',
            'provinceName': '河北省'
        }, {
            'provinceId': '140000',
            'provinceName': '山西省'
        }, {
            'provinceId': '150000',
            'provinceName': '内蒙古自治区'
        }, {
            'provinceId': '210000',
            'provinceName': '辽宁省'
        }, {
            'provinceId': '220000',
            'provinceName': '吉林省'
        }, {
            'provinceId': '230000',
            'provinceName': '黑龙江省'
        }, {
            'provinceId': '310000',
            'provinceName': '上海市'
        }, {
            'provinceId': '320000',
            'provinceName': '江苏省'
        }, {
            'provinceId': '330000',
            'provinceName': '浙江省'
        }, {
            'provinceId': '340000',
            'provinceName': '安徽省'
        }, {
            'provinceId': '350000',
            'provinceName': '福建省'
        }, {
            'provinceId': '360000',
            'provinceName': '江西省'
        }, {
            'provinceId': '370000',
            'provinceName': '山东省'
        }, {
            'provinceId': '410000',
            'provinceName': '河南省'
        }, {
            'provinceId': '420000',
            'provinceName': '湖北省'
        }, {
            'provinceId': '430000',
            'provinceName': '湖南省'
        }, {
            'provinceId': '440000',
            'provinceName': '广东省'
        }, {
            'provinceId': '450000',
            'provinceName': '广西壮族自治区'
        }, {
            'provinceId': '460000',
            'provinceName': '海南省'
        }, {
            'provinceId': '500000',
            'provinceName': '重庆市'
        }, {
            'provinceId': '510000',
            'provinceName': '四川省'
        }, {
            'provinceId': '520000',
            'provinceName': '贵州省'
        }, {
            'provinceId': '530000',
            'provinceName': '云南省'
        }, {
            'provinceId': '540000',
            'provinceName': '西藏自治区'
        }, {
            'provinceId': '610000',
            'provinceName': '陕西省'
        }, {
            'provinceId': '620000',
            'provinceName': '甘肃省'
        }, {
            'provinceId': '630000',
            'provinceName': '青海省'
        }, {
            'provinceId': '640000',
            'provinceName': '宁夏回族自治区'
        }, {
            'provinceId': '650000',
            'provinceName': '新疆维吾尔自治区'
        }]
        let citys = [{
            'code': '110100',
            'level': 'city',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }]
        let districts = [{
            'code': '110101',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110101',
            'district': '东城区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }, {
            'code': '110102',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110102',
            'district': '西城区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }, {
            'code': '110105',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110105',
            'district': '朝阳区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }, {
            'code': '110106',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110106',
            'district': '丰台区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }, {
            'code': '110107',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110107',
            'district': '石景山区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }, {
            'code': '110108',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110108',
            'district': '海淀区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }, {
            'code': '110109',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110109',
            'district': '门头沟区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:17',
            'modifyTime': '2015-07-01 11:49:17'
        }, {
            'code': '110111',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110111',
            'district': '房山区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110112',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110112',
            'district': '通州区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110113',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110113',
            'district': '顺义区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110114',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110114',
            'district': '昌平区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110115',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110115',
            'district': '大兴区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110116',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110116',
            'district': '怀柔区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110117',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110117',
            'district': '平谷区',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110228',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110228',
            'district': '密云县',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }, {
            'code': '110229',
            'level': 'district',
            'provinceCode': '110000',
            'province': '北京市',
            'cityCode': '110100',
            'city': '北京市',
            'districtCode': '110229',
            'district': '延庆县',
            'del': 'n',
            'createTime': '2015-07-01 11:49:18',
            'modifyTime': '2015-07-01 11:49:18'
        }]
        this.slots = [{
            valueKey: 'provinceName',
            dataList: provinces
        }, {
            valueKey: 'city',
            dataList: citys
        }, {
            valueKey: 'district',
            dataList: districts
        }]
    },
    methods: {
        closePicker() {
            console.log('close')
            this.showflag = false
        },
        showPicker() {
            this.showflag = true
        },
        getData(data) {
            console.log('picked data', data)
            this.closePicker()
        },
        resetData(data) {
            console.log(data)
            let proCode = ''
            let cityCode = ''
            let distCode = ''
            if (data.slotIndex == 0) {
                proCode = data.content.provinceId
                getCitys({
                    provinceCode: proCode
                }, (res) => {
                    console.log('qq', res)
                    this.slots[1].dataList = res.result
                    getDistricts({
                        cityCode: res.result[0].cityCode
                    }, (res) => {
                        this.slots[2].dataList = res.result
                    })
                })
            } else if (data.slotIndex == 1) {
                cityCode = data.content.cityCode
                getDistricts({
                    cityCode: cityCode
                }, (res) => {
                    this.slots[2].dataList = res.result
                })
            } else {

            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
