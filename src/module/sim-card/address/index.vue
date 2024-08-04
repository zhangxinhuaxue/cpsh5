<template>
    <m-page>
        <hybrid-header slot="header" :config="barConfig" class="mui-bar_nav"></hybrid-header>
        <div class="page__content">
            <m-cell-group>
                <m-input
                    v-model.trim="newForm.receiveUserName"
                    title="收货人"
                    size="middle"
                    maxlength="10"
                    placeholder="请填写收货人姓名"
                    @focus="handleFocus"
                />
                <m-input
                    v-model="newForm.receiveUserPhone"
                    title="手机号码"
                    size="middle"
                    maxlength="11"
                    type="tel"
                    placeholder="请填写收货人手机号"
                    @focus="handleFocus"
                />
                <m-input
                    size="middle"
                    title="所在地区"
                    placeholder='省、市、区/县'
                    :value="newForm.provinceCityArea"
                    readonly
                    @mousedown.prevent
                    @click="pickerShow"
                   >
                    <span slot="ft" class="icon-array">
                    </span>
                </m-input>
                <m-input
                    class="valign-top"
                    v-model.trim="newForm.receiveAddress"
                    title="详细地址"
                    size="middle"
                    maxlength="30"
                    placeholder="街道、楼牌号等"
                    type="textarea"
                    @focus="handleFocus"
                />
            </m-cell-group>

            <m-button class="mt100 mui-btn_primary" :disabled="btnDisabled" :round="false" @click="handleConfirm">确认</m-button>
        </div>
    </m-page>
</template>
<script>
import { getAreaPhoneZone } from 'src/store/modules/sim-card'
import {AXD, setSessionStorage} from 'src/libs/util'
const formatTree = function (arr=[], level=0) {
    level += 1
    return arr.reduce((acc, cur) => {
        if(level === 3){
            return acc.concat(cur)
        }
        if (cur.children && cur.children.length) {
            return acc.concat({
                ...cur,
                children: formatTree(cur.children,level)
            })
        }
        return acc
    }, [])
}
export default {
    name: 'SIMCardAddress',
    props: {
        form: {
            type: Object,
            default() {
                return {
                }
            }
        }
    },
    data() {
        return {
            picker: null,
            treeData: [],
            pickerIndex: [0, 0, 0],
            focusInput: null,
            newForm: {
                receiveUserName: '',
                receiveUserPhone: '',
                receiveZoneCode: '',
                provinceCityArea:'',
                receiveAddress: ''
            },
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            }
        }
    },
    computed:{
        btnDisabled(){
            const {receiveUserName, receiveUserPhone, receiveZoneCode, receiveAddress} = this.newForm
            const testUserName = /^.{1,10}$/.test(receiveUserName)
            const testUserPhone = /^1\d{10}$/.test(receiveUserPhone)
            const testZoneCode = !!receiveZoneCode
            const testAddress = /^.{1,30}$/.test(receiveAddress)
            return !(testUserName &&  testUserPhone &&  testZoneCode &&  testAddress)
        },
        linkageData() {
            if (this.treeData.length === 0) {
                return []
            }
            const provinces = this.treeData
            const cities = provinces[this.pickerIndex[0]] && provinces[this.pickerIndex[0]].children || []
            const areas = cities[this.pickerIndex[1]] && cities[this.pickerIndex[1]].children ||[]
            return [provinces, cities, areas]
        }
    },
    created() {
        this.newForm = Object.assign({},this.form)
        this.getList()
    },
    methods: {
        getList() {
            const {taskId, channelId} = this.$route.query
            getAreaPhoneZone({
                channelId,
                taskId
            }).then(res => {
                if (res.success) {
                    this.treeData = formatTree(res.result.zoneList)
                    this.$nextTick(() => {
                        this.createPicker()
                    })
                    return
                }
                this.treeData = []
                this.$_toast(res.resultDes)
                if (res.code === '-1999' || res.code ==='-1997') {
                    AXD.util.login()
                }
            })
        },
        handleFocus(e){
            this.focusInput = e.target
        },
        pickerShow() {
            this.picker && this.picker.show()
            try{
                this.focusInput  && this.focusInput.blur()
            }catch (e){}
        },
        createPicker() {
            this.picker = this.$createPicker({
                title: '请选择地区',
                data: this.linkageData,
                selectedIndex: this.pickerIndex,
                onChange: (col, newIndex) => {
                    if (newIndex !== this.pickerIndex[col]) {
                        for (let j = 2; j > col; j--) {
                            this.pickerIndex.splice(j, 1, 0)
                            this.picker.scrollTo(j, 0)
                        }
                        this.pickerIndex.splice(col, 1, newIndex)
                        this.picker.setData(
                            this.linkageData,
                            this.pickerIndex
                        )
                    }
                },
                onSelect: (selectedItem, selectedIndex) => {
                    const [province,city,area] =  selectedItem
                    this.$set(this.newForm,'provinceCityArea', this.showText(selectedItem))
                    this.$set(this.newForm,'receiveZoneCode',area.value)
                    this.log({ type: 'button-logic', name: 'sim_address_select', desc:'sim卡地址选中' ,extendData:this.newForm.provinceCityArea })
                }
            })
        },
        showText(arr) {
            return arr.reduce((accumulator, cur) => {
                let curText = typeof cur !== 'object' ? cur : cur.text
                return accumulator + curText
            }, '')
        },
        handleConfirm() {
            setSessionStorage('addressObj', JSON.stringify(this.newForm))
            this.$emit('updateAddress', this.newForm)
            this.$router.back()
        }
    }
}
</script>
<!--<style lang="scss">-->
<!--$colorPrimary: #4286ff;-->

<!--.mui-picker__ft{-->
<!--    .mui-btn_primary,-->
<!--    .mui-btn_primary:active {-->
<!--        background-color: $colorPrimary ;-->
<!--        color: #fff;-->
<!--        border-color: $colorPrimary;-->
<!--        border-radius:  0.08rem;-->
<!--    }-->
<!--}-->
<!--</style>-->
<style lang="scss" scoped>
//@import 'src/style.scss';

$colorPrimary: #4286ff;

.mt100{
  margin-top: px2rem(100);
}

.valign-top{
  align-items: flex-start;
}
  .mui-btn_primary,
  .mui-btn_primary:active {
    background-color: $colorPrimary;
    color: #fff;
    border-color: $colorPrimary;
    &.mui-btn.disabled {
      color: #999;
      background-color: #e6e6e6;
      border-color: #e6e6e6;
    }
  }
.icon-array {
  display: inline-block;
  width: px2rem(14);
  height: px2rem(24);
  margin-right: px2rem(16);
  background:center / 100% no-repeat  url('data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDE0IDI0Ij48c3R5bGU+LnN0MHtmaWxsOiNjY2N9PC9zdHlsZT48cGF0aCBpZD0iWE1MSURfNF8iIGNsYXNzPSJzdDAiIGQ9Ik0uNi43Yy0uOC44LS44IDIgMCAyLjhMOS4xIDEyIC42IDIwLjVjLS44LjgtLjggMiAwIDIuOC44LjggMiAuOCAyLjggMGw5LjktOS45Yy40LS40LjYtLjkuNi0xLjRzLS4yLTEtLjYtMS40TDMuNS43QzIuNy0uMSAxLjQtLjEuNi43eiIvPjwvc3ZnPg==');
}

</style>
