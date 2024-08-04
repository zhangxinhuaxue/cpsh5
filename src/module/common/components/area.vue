<template>
    <transition name="wait">
        <div v-show="areaPopShow">
            <axd-loading :show="loading"></axd-loading>
            <picker v-if="slots.length" :groups="slots" :title="title" :isShow="isShow" @close="close" @confirm="confirm" @update="updateData"></picker>
        </div>
    </transition>
</template>
<script type="text/javascript">
import picker from 'src/components/picker1/picker.vue'
import {
    getProvinces,
    getCitys,
    getDistricts
} from 'src/store/api'
import axdLoading from 'components/loading/index.vue'
export default {
    name: 'area',
    props: {
        areaPopShow: {
            type: Boolean,
            default: false,
            required: true
        },
        initCompleteCb: {
            type: Function,
            default: () => {
                return () => {}
            }
        }
    },
    data() {
        return {
            title: '省市区',
            slots: [],
            loading: true
        }
    },
    components: {
        axdLoading,
        picker
    },
    computed: {
        isShow() {
            return this.areaPopShow && !this.loading
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let provinces = []
            let citys = []
            let districts = []
            getProvinces((res) => {
                if (res.success) {
                    provinces = res.result
                    getCitys({
                        provinceCode: res.result[0].provinceCode
                    }, (res) => {
                        if (res.success) {
                            citys = res.result
                            getDistricts({
                                cityCode: res.result[0].cityCode
                            }, (res) => {
                                if (res.success) {
                                    districts = res.result
                                    this.slots = [{
                                        name: 'province',
                                        code: 'provinceCode',
                                        dataList: provinces
                                    }, {
                                        name: 'city',
                                        code: 'cityCode',
                                        dataList: citys
                                    }, {
                                        name: 'district',
                                        code: 'districtCode',
                                        dataList: districts
                                    }]
                                    this.initCompleteCb()
                                    // 等待数据传入
                                    setTimeout(() => {
                                        this.loading = false
                                    }, 0)
                                }
                            })
                        }
                    })
                }
            })
        },
        close(parm) {
            this.$emit('close')
        },
        confirm(parm) {
            this.$emit('confirm', parm[2])
        },
        updateData(data) {
            let proCode = ''
            let cityCode = ''
            let distCode = ''
            if (data.groupIndex == 0) {
                console.log('1')
                proCode = data.selectData.provinceCode
                getCitys({
                    provinceCode: proCode
                }, (res) => {
                    this.slots[1].dataList = res.result
                    getDistricts({
                        cityCode: res.result[0].cityCode
                    }, (res) => {
                        this.slots[2].dataList = res.result
                    })
                })
            } else if (data.groupIndex == 1) {
                console.log('2')
                cityCode = data.selectData.cityCode
                getDistricts({
                    cityCode: cityCode
                }, (res) => {
                    this.slots[2].dataList = res.result
                })
            }
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/transition.scss';
.wait-leave-active {
    transition: all .3s ease;
}
</style>
