<template>
    <div>
        <picker
            :isShow="isShow"
            :title="title"
            :groups="pickerData"
            :indexList="indexList"
            @close="close"
            @confirm="confirm"
            @update="updateData"
            ></picker>
    </div>
</template>
<script>
import picker from 'src/components/picker1/picker'
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        scope: {
            type: String,
            default: 'month'
        },
        beginYear: {
            type: Number,
            default: 1960
        },
        selectedYear: {
            type: Number,
            default: 2010
        }
    },
    data() {
        return {
            yearList: [],
            monthList: [],
            dayList: [],
            pickerData: [],
            indexList: [],
            curYear: 0,
            curMonth: 0,
            curDay: 0,
            tempYear: 0,
            tempMonth: 0
        }
    },
    components: {picker},
    created() {
        this.init()
    },
    methods: {
        init() {
            let date = new Date()
            this.curYear = date.getFullYear()
            this.curMonth = date.getMonth() + 1
            this.curDay = date.getDay()
            for (let i = this.beginYear; i <= this.curYear; i++) {
                this.yearList.push(i)
            }
            for (let i = 1; i <= 12; i++) {
                this.monthList.push(i)
            }
            if (this.selectedYear > this.curYear) {
                this.indexList[0] = this.yearList.length - 1
                this.tempYear = this.curYear
            } else {
                this.indexList[0] = this.yearList.length - 1 - (this.curYear - this.selectedYear)
                this.tempYear = this.selectedYear
            }
            this.tempMonth = 1
            this.dayList = this.getDayList(this.tempYear, this.tempMonth)
            this.pickerData = [{dataList: this.yearList}, {dataList: this.monthList}, {
                dataList: this.dayList
            }]
            this.indexList[1] = this.indexList[2] = 0
        },
        getDayList(year, month) {
            let list = []
            let beginDay = 1
            let endDay = 0
            switch (parseInt(month)) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    endDay = 31
                    break
                case 4:
                case 6:
                case 9:
                case 11:
                    endDay = 30
                    break
                case 2:
                    if (((year % 4 === 0) && (year % 100 !== 0)) ||
                        (year % 400 === 0)) {
                        endDay = 29
                    } else {
                        endDay = 28
                    }
                    break
                default:
                    break
            }
            for (let i = 1; i <= endDay; i++) {
                list.push(i)
            }
            return list.slice()
        },
        close() {
            this.$emit('close')
        },
        confirm(date) {
            this.$emit('confirm', date)
        },
        updateData(date) {
            if (date.groupIndex === 0) {
                this.tempYear = date.selectData
                this.dayList = this.getDayList(this.tempYear, this.tempMonth)
                this.pickerData[2].dateList = this.dayList
            } else if (date.groupIndex === 1) {
                this.tempMonth = date.selectData
                this.dayList = this.getDayList(this.tempYear, this.tempMonth)
                this.pickerData[2].dataList = this.dayList
            }
        }
    }
}
</script>
