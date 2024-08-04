<!--
 * @Author: dongyusi 07/2018
 * @LastEditors: sunxj
 * @Description: 新授信第一版 废弃
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-03-18 16:19:30
 -->

<template>
    <m-page>
        <p class="cell-sub">请填写你基本信息，有助于提高审核速度</p>
        <m-cell-group class="mt0">
            <m-cell v-for="(item, index) in dataList"
                :key="index"
                :title="item.title"
                :value="getActionsheetValue(item.value)"
                is-link
                :is-select="!!formData[item.value]"
                @click="showActionsheet(item.link)">
            </m-cell>
        </m-cell-group>
        <m-cell-group>
             <m-input title="常用QQ号"
                native-type="tel"
                placeholder="必填"
                v-model="formData.qq"></m-input>
        </m-cell-group>
        <m-button @click="submit" :disabled="disabled">保存</m-button>
    </m-page>
</template>
<script>
import {
    getInfo,
    submitInfo
} from 'src/store/modules/credit-system'
export default {
    name: 'credit-info',
    data() {
        return {
            dataList: [{
                title: '工作状态',
                value: 'jobCode',
                link: 'jobCode'
            }, {
                title: '学历水平',
                value: 'schoolType',
                link: 'schoolType'
            }, {
                title: '毕业时间',
                value: 'graduateTime',
                link: 'graduateTime'
            }],
            formData: {
                jobCode: '',
                schoolType: '',
                graduateTime: '',
                qq: ''
            },
            jobCode: {
                key: [],
                value: {}
            },
            schoolType: {
                key: [],
                value: {}
            },
            graduateTime: {
                key: [],
                value: {}
            }
        }
    },
    computed: {
        disabled() {
            return Object.values(this.formData).some(v => !v)
        }
    },
    created() {},
    mounted() {
        this.init()
    },
    methods: {
        init() {
            getInfo().then((res) => {
                if (res.success) {
                    let result = res.result
                    this.copy(this.formData, result)
                    // 工作状态
                    this.jobCode.value = result.jobMap
                    this.jobCode.key = Object.keys(this.jobCode.value)
                    // 学历水平
                    this.schoolType.value = result.schoolTypeMap
                    this.schoolType.key = Object.keys(this.schoolType.value)
                    // 毕业时间
                    let graduateTimeStart = parseInt(result.graduateTimeStart)
                    let graduateTimeEnd = parseInt(result.graduateTimeEnd)
                    let len = graduateTimeEnd - graduateTimeStart + 1
                    this.graduateTime.key = Array.from({length: len}, (x, i) => i + graduateTimeStart)
                    this.graduateTime.key.forEach(k => {
                        this.graduateTime.value[k] = `${k}年`
                    })
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        copy(target, source) {
            Object.keys(target)
                .filter(k => source[k])
                .map(key => (target[key] = source[key]))
        },
        getActionsheetValue(value) {
            return this.formData[value] ? '已选择' : '请选择'
        },
        showActionsheet(target) {
            if (target === 'schoolType' && !this.formData.jobCode) {
                this.$_toast('请先选择工作状态')
                return
            }
            let list = this.getList(target)
            let selectItem = {
                isSelect: !!this.formData[target],
                index: this[target].key.indexOf(this.formData[target])
            }
            this.actionsheet = this.$createActionSheet({
                data: list,
                isBottomBtn: false,
                selectItem: selectItem,
                onSelect: (item, index) => {
                    this.formData[target] = this[target].key[index]
                }
            })
            this.actionsheet.show()
        },
        getList(target) {
            let sub = target === 'schoolType' && this.formData.jobCode === 'notwork' ? '在读' : ''
            return this[target].key.map(x => this[target].value[x] + sub)
        },
        submit() {
            let that = this
            submitInfo(this.formData).then((res) => {
                if (res.success) {
                    this.$_toast({
                        time: 1000,
                        txt: '保存成功',
                        callback: () => {
                            that.$router.go(-1)
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
.mui-btn {
    margin-top: px2rem(50);
}
</style>
