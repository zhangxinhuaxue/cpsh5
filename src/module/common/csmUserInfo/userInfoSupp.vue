<template>
<div class="container">
    <div class="aui-page" style="z-index: 90;">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <div class="userInfo">
                <div v-if="baseField.length">
                    <sub-title title="为了继续提现， 请补充一下基本信息"></sub-title>
                    <div class="aui-cells" style="margin-top:0;">
                        <a class="aui-cell aui-cell_access select" href="javascript:;" v-if="baseInfo.socialIdentity.show"
                        :class="{'selected':baseInfo.socialIdentity.text!=='去选择'}"
                        @click="showPopSelectList(baseInfo.socialIdentity, 'socialIdentity', socialIdentityList,  baseInfo.socialIdentity.key)">
                          <div class="aui-cell__bd">
                            <p>社会身份</p>
                          </div>
                          <div class="aui-cell__ft">{{baseInfo.socialIdentity.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;" v-if="baseInfo.qualification.show"
                        :class="{'selected':baseInfo.qualification.text!=='去选择'}"
                        @click="showPopSelectList(baseInfo.qualification, 'qualification', qualificationList, baseInfo.qualification.key)">
                          <div class="aui-cell__bd">
                            <p>最高学历</p>
                          </div>
                          <div class="aui-cell__ft">{{baseInfo.qualification.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;"
                        @click="showPopSelectList(baseInfo.income, 'income', moneyList, baseInfo.income.key)"
                        v-if="baseInfo.income.show"
                        :class="{'selected':baseInfo.income.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>月收入</p>
                          </div>
                          <div class="aui-cell__ft">{{baseInfo.income.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;"
                        @click="showPopSelectList(baseInfo.debtState, 'debtState', moneyList, baseInfo.debtState.key)"
                        v-if="baseInfo.debtState.show"
                        :class="{'selected':baseInfo.debtState.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>负债情况</p>
                          </div>
                          <div class="aui-cell__ft">{{baseInfo.debtState.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;" @click="showPopSelectList(
                        baseInfo.huKou, 'huKou', huKouList, baseInfo.huKou.key)" v-if="baseInfo.huKou.show"
                        :class="{'selected':baseInfo.huKou.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>借款人户口</p>
                          </div>
                          <div class="aui-cell__ft">{{baseInfo.huKou.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;" @click="showPopSelectList(
                        baseInfo.marrStatus, 'marrStatus', marrStatusList, baseInfo.marrStatus.key)" v-if="baseInfo.marrStatus.show"
                        :class="{'selected':baseInfo.marrStatus.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>婚姻状况</p>
                          </div>
                          <div class="aui-cell__ft">{{baseInfo.marrStatus.text}}</div>
                        </a>
                    </div>
                </div>
                <div v-if="schoolField.length">
                    <sub-title title="教育信息"></sub-title>
                    <div class="aui-cells" style="margin-top:0;">
                        <a class="aui-cell aui-cell_access select" href="javascript:;"
                        :class="{'selected':schoolInfo.schoolStandFrom.text!=='去选择'}"
                        v-if="schoolInfo.schoolStandFrom.show"
                        @click="showDatePicker('入学时间', 'schoolStandFrom', schoolInfo.schoolStandFrom)">
                          <div class="aui-cell__bd">
                            <p>入学时间</p>
                          </div>
                          <div class="aui-cell__ft">{{schoolInfo.schoolStandFrom.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;"
                        @click="showDatePicker('毕业时间', 'schoolgraduationYear', schoolInfo.schoolgraduationYear)"
                        v-if="schoolInfo.schoolgraduationYear.show"
                        :class="{'selected':schoolInfo.schoolgraduationYear.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>毕业时间</p>
                          </div>
                          <div class="aui-cell__ft">{{schoolInfo.schoolgraduationYear.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;" @click="selectSchool"
                        v-if="schoolInfo.schoolName.show"
                        :class="{'selected':schoolInfo.schoolName.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>学校名称</p>
                          </div>
                          <div class="aui-cell__ft">{{schoolInfo.schoolName.text}}</div>
                        </a>
                        <a class="aui-cell aui-cell_access select" href="javascript:;"
                        @click="showAreaSelect('schoolArea', schoolInfo.schoolArea)"
                        v-if="schoolInfo.schoolArea.show"
                        :class="{'selected':schoolArea!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>学校所在省/市/地区</p>
                          </div>
                          <div class="aui-cell__ft">{{schoolArea}}</div>
                        </a>
                        <div class="aui-cell" v-if="schoolInfo.schoolAdd.show">
                            <div class="aui-cell__hd">
                                <label class="aui-label">详细地址</label>
                            </div>
                            <div class="aui-cell__bd">
                                <input class="aui-input" type="text" maxlength="30"
                                @input="inputChange($event, 'schoolAdd')" v-model="schoolInfo.schoolAdd.text" />
                            </div>
                        </div>
                        <a class="aui-cell aui-cell_access select" href="javascript:;"
                        v-if="schoolInfo.schoollengthOfSchooling.show"
                        @click="showPopSelectList(
                        schoolInfo.schoollengthOfSchooling, 'schoollengthOfSchooling',schoollengthOfSchoolingList, schoolInfo.schoollengthOfSchooling.key)"
                        :class="{'selected':schoolInfo.schoollengthOfSchooling.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>学制</p>
                          </div>
                          <div class="aui-cell__ft">{{schoolInfo.schoollengthOfSchooling.text}}</div>
                        </a>
                    </div>
                </div>
                <div v-if="isShowEmpInfo && empField.length">
                    <sub-title title="工作信息"></sub-title>
                    <div class="aui-cells" style="margin-top:0;">
                        <a class="aui-cell aui-cell_access select"  href="javascript:;"
                        v-if="empInfo.empStandFrom.show"
                        @click="showDatePicker('入职日期', 'empStandFrom', empInfo.empStandFrom)"
                        :class="{'selected':empInfo.empStandFrom.text!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>入职日期</p>
                          </div>
                          <div class="aui-cell__ft">{{empInfo.empStandFrom.text}}</div>
                        </a>
                        <div class="aui-cell" v-if="empInfo.empcompanyName.show">
                            <div class="aui-cell__hd">
                                <label class="aui-label">单位名称</label>
                            </div>
                            <div class="aui-cell__bd">
                                <input class="aui-input" type="text" maxlength="30" placeholder="例：爱财科技有限公司"
                                @input="inputChange($event, 'empcompanyName')"
                                v-model="empInfo.empcompanyName.text" />
                            </div>
                        </div>
                        <a class="aui-cell aui-cell_access select" href="javascript:;"
                        v-if="empInfo.empCompanyArea.show"
                        @click="showAreaSelect('empCompanyArea', empInfo.empCompanyArea)"
                        :class="{'selected':empCompanyArea!=='去选择'}">
                          <div class="aui-cell__bd">
                            <p>单位所在省/市/区</p>
                          </div>
                          <div class="aui-cell__ft">{{empCompanyArea}}</div>
                        </a>
                        <div class="aui-cell" v-if="empInfo.empAdd.show">
                            <div class="aui-cell__hd">
                                <label class="aui-label">详细地址</label>
                            </div>
                            <div class="aui-cell__bd">
                                <input class="aui-input" type="text" minlength="12" placeholder="例：文二西路黄龙国际中心2楼203室"
                                @input="inputChange($event, 'empAdd')"
                                v-model="empInfo.empAdd.text" />
                            </div>
                        </div>
                        <div class="aui-cell" v-if="empInfo.empcompanyTelephone.show">
                            <div class="aui-cell__hd">
                                <label class="aui-label">单位电话</label>
                            </div>
                            <div class="aui-cell__bd">
                                <input class="aui-input" maxlength="30" type="text"
                                @input="inputChange($event, 'empcompanyTelephone')"
                                placeholder="例：0795-2009300" v-model="empInfo.empcompanyTelephone.text" />
                            </div>
                        </div>
                        <div class="aui-cell" v-if="empInfo.empjobTitle.show">
                            <div class="aui-cell__hd">
                                <label class="aui-label">职位</label>
                            </div>
                            <div class="aui-cell__bd">
                                <input class="aui-input" type="text" maxlength="30" placeholder="例：高级测试工程师"
                                @input="inputChange($event, 'empjobTitle')"
                                v-model="empInfo.empjobTitle.text" />
                            </div>
                        </div>
                        <div class="aui-cell aui-cell_access select" href="javascript:;"
                            @click="showPopSelectList(empInfo.empincome, 'empincome', moneyList, empInfo.empincome.key)"
                            v-if="empInfo.empincome.show"
                            :class="{'selected':empInfo.empincome.text!=='去选择'}">
                            <div class="aui-cell__bd">
                                <p>月收入</p>
                            </div>
                            <div class="aui-cell__ft">{{empInfo.empincome.text}}</div>
                        </div>
                        <div class="aui-cell aui-cell_access select" href="javascript:;"
                            @click="showPopSelectList(empInfo.empAddrNature, 'empAddrNature', empAddrNatureList, empInfo.empAddrNature.key)"
                            v-if="empInfo.empincome.show"
                            :class="{'selected':empInfo.empAddrNature.text!=='去选择'}">
                            <div class="aui-cell__bd">
                                <p>居住状况</p>
                            </div>
                            <div class="aui-cell__ft">{{empInfo.empAddrNature.text}}</div>
                        </div>
                    </div>
                </div>
                <div class="submit" :class="{submit__disabled:!isAllowSubmit}" @click="submit">完成</div>
                <popup-select :isShow="isShowPopSelectList" :itemList="popSelectDataList" :chosedItem="chosedItem" @chooseItem="choosePopSelectItem(userInfoItem, $event)"
                @popupSelectClose="closePopSelectList"></popup-select>
                <area-picker :areaPopShow="isShowAreaSelectList" @confirm="areaSelectConfirm(userInfoItem, $event)" @close="areaSelectClose"></area-picker>
                <date-picker
                    :isShow="isShowDatePicker"
                    :title="datePickerTitle"
                    scope="day"
                    @close="closeDatePicker"
                    @confirm="confirmDate(userInfoItem, $event)"
                ></date-picker>
            </div>
        </div>
    </div>
    <router-view @complete="chooseSchool"></router-view>
</div>
</template>
<script>
import subTitle from './title.vue'
import popupSelect from './popupSelect.vue'
import datePicker from './datePicker.vue'
import areaPicker from 'src/module/common/components/area.vue'
import { addUserSupplement } from 'store/modules/userInfo'
export default {
    data() {
        let userInfo = this.$store.state.userInfo
        if (!(userInfo && (userInfo.baseField.length || userInfo.schoolField.length || userInfo.empField.length))) {
            userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || userInfo
        }
        return {
            // 判断用户是否已经毕业
            isGraduate: userInfo.isGraduate,
            // 需要用户完善的基本信息
            baseField: userInfo.baseField.slice(),
            // 需要用户完善的学校信息
            schoolField: userInfo.schoolField.slice(),
            // 需要用户完善的工作信息
            empField: userInfo.empField.slice(),
            // 用户基本信息
            baseInfo: {
                // 社会身份
                socialIdentity: {
                    show: false,
                    key: '',
                    text: '去选择'
                },
                // 教育情况学历信息
                qualification: {
                    show: false,
                    key: '',
                    text: '去选择'
                },
                // 月收入
                income: {
                    show: false,
                    key: '',
                    text: '去选择'
                },
                // 负债情况
                debtState: {
                    show: false,
                    key: '',
                    text: '去选择'
                },
                // 户口
                huKou: {
                    show: false,
                    key: '',
                    text: '去选择'
                },
                // 婚姻状况
                marrStatus: {
                    show: false,
                    key: '',
                    text: '去选择'
                }
            },
            // 用户学校信息
            schoolInfo: {
                // 入学时间
                schoolStandFrom: {
                    show: false,
                    text: '去选择'
                },
                // 毕业时间
                schoolgraduationYear: {
                    show: false,
                    text: '去选择'
                },
                // 大学学制
                schoollengthOfSchooling: {
                    show: false,
                    key: '',
                    text: '去选择'
                },
                // 学校区域
                schoolArea: {
                    show: false,
                    provinceCode: '',
                    province: '',
                    cityCode: '',
                    city: '',
                    zoneCode: '',
                    zone: ''
                },
                schoolAdd: {
                    show: false,
                    text: ''
                },
                schoolName: {
                    show: false,
                    text: '去选择'
                }
            },
            // 用户工作信息
            empInfo: {
                // 入职日期
                empStandFrom: {
                    show: false,
                    text: '去选择'
                },
                // 单位名称
                empcompanyName: {
                    show: false,
                    text: ''
                },
                // 单位所在区域
                empCompanyArea: {
                    show: false,
                    provinceCode: '',
                    province: '',
                    cityCode: '',
                    city: '',
                    zoneCode: '',
                    zone: ''
                },
                // 单位详细地址
                empAdd: {
                    show: false,
                    text: ''
                },
                // 单位电话
                empcompanyTelephone: {
                    show: false,
                    text: ''
                },
                // 职位
                empjobTitle: {
                    show: false,
                    text: ''
                },
                // 收入
                empincome: {
                    show: false,
                    key: '',
                    text: '去选择'
                },
                // 居住状况
                empAddrNature: {
                    show: false,
                    key: '',
                    text: '去选择'
                }
            },
            isShowUserInfo: true,
            isShowPopSelectList: false,
            popSelectDataList: [],
            userInfoItem: null,
            userInfoField: '',
            chosedItem: '',
            isShowAreaSelectList: false,
            isShowDatePicker: false,
            isShowEmpInfo: false,
            datePickerTitle: '',
            // 社会省份列表数据
            socialIdentityList: [{
                key: '1',
                value: '学生'
            }, {
                key: '2',
                value: '在职人员'
            }, {
                key: '3',
                value: '企业负责人'
            }, {
                key: '4',
                value: '自由职业'
            }, {
                key: '5',
                value: '无业'
            }, {
                key: '6',
                value: '退休'
            }],
            // 学历列表数据
            qualificationList: [{
                key: '1',
                value: '博士及以上',
                code: 'doctor'
            }, {
                key: '2',
                value: '硕士',
                code: 'master'
            }, {
                key: '3',
                value: '大学本科',
                code: 'bachelor'
            }, {
                key: '4',
                value: '大学专科\\专科学校',
                code: 'junior'
            }, {
                key: '5',
                value: '高中\\中专\\技校',
                code: 'junior'
            }, {
                key: '6',
                value: '初中',
                code: 'junior'
            }, {
                key: '7',
                value: '初中以下',
                code: 'junior'
            }],
            // 财务情况列表数据
            moneyList: [{
                key: '1',
                value: '1000-3000'
            }, {
                key: '2',
                value: '3000-5000'
            }, {
                key: '3',
                value: '5000-10000'
            }, {
                key: '4',
                value: '10000-20000'
            }, {
                key: '5',
                value: '20000-100000'
            }],
            // 户口列表数据
            huKouList: [{
                key: '1',
                value: '城市户口'
            }, {
                key: '2',
                value: '农村户口'
            }],
            // 婚姻状况列表数据
            marrStatusList: [{
                key: '01',
                value: '未婚'
            }, {
                key: '02',
                value: '已婚'
            }, {
                key: '03',
                value: '丧偶'
            }, {
                key: '04',
                value: '离婚'
            }],
            // 学制列表数据
            schoollengthOfSchoolingList: [{
                key: '01',
                value: '1'
            }, {
                key: '02',
                value: '2'
            }, {
                key: '03',
                value: '3'
            }, {
                key: '04',
                value: '4'
            }, {
                key: '05',
                value: '5'
            }],
            empAddrNatureList: [{
                key: '00',
                value: '自置商品房'
            }, {
                key: '50',
                value: '租房'
            }, {
                key: '80',
                value: '集体宿舍'
            }, {
                key: '99',
                value: '其他'
            }],
            // 使用允许提交
            isAllowSubmit: false,
            // 提交的数据
            submitData: {},
            barConfig: {
                action: '', // 右侧按钮点击事件， 必须是window变量
                h5: {},
                app: {
                    rightBtnShow: true,
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#000000', // #ff00000颜色 showType=TEXT
                        text: '' // 展示文字内容 showType=TEXT
                    }
                }
            }
        }
    },
    created() {
        if (this.isGraduate) {
            // 已毕业， 需要填写工作信息
            this.isShowEmpInfo = true
            this.submitData['extField'] = 'schoolField-true,empField-true'
        } else {
            // 学生不要填写工作信息
            this.isShowEmpInfo = false
            this.submitData['extField'] = 'schoolField-true,empField-false'
        }
        let baseField = []
        // 剔除基本信息的多余字段
        this.baseField.forEach((item, i) => {
            switch (item) {
                case 'huKou':
                case 'debtState':
                    break
                default:
                    baseField.push(item)
                    break
            }
        })
        this.baseField = baseField
        let empField = []
        // 剔除工作信息中的多余字段
        this.empField.forEach((item, i) => {
            switch (item) {
                case 'empjobNature':
                case 'empindustry':
                    break
                default:
                    empField.push(item)
                    break
            }
        })
        this.empField = empField
        // 展示需要完善的基本信息
        this.baseField.map(item => {
            if (item !== 'extField') {
                this.baseInfo[item].show = true
            }
        })
        // 展示需要完善的教育信息， 不需要补录入学时间和学制
        this.schoolField.map(item => {
            if (item === 'schoolProvince' || item === 'schoolCity' || item === 'schoolZone' ||
                item === 'schoolCodeProvince' || item === 'schoolCodeCity' || item === 'schoolCodeZone') {
                this.schoolInfo.schoolArea.show = true
            } else if (item !== 'schoolStandFrom' && item !== 'schoollengthOfSchooling') {
                this.schoolInfo[item].show = true
            }
        })
        // 展示需要完善的工作信息
        this.empField.map(item => {
            if (item === 'empProvince' || item === 'empCity' || item === 'empZone' || item === 'empCodeProvince' || item === 'empCodeCity' || item === 'empCodeZone') {
                this.empInfo.empCompanyArea.show = true
            } else if (item !== 'empworkingYears') {
                this.empInfo[item].show = true
            }
        })
    },
    components: {
        subTitle,
        popupSelect,
        datePicker,
        areaPicker
    },
    computed: {
        schoolArea() {
            let schoolArea = this.schoolInfo.schoolArea
            return schoolArea.province ? schoolArea.province + schoolArea.city + schoolArea.zone : '去选择'
        },
        empCompanyArea() {
            let empCompanyArea = this.empInfo.empCompanyArea
            return empCompanyArea.province ? empCompanyArea.province + empCompanyArea.city + empCompanyArea.zone : '去选择'
        },
        empworkingYears() {
            let empStandFrom = this.empInfo.empStandFrom.text
            if (empStandFrom === '去选择') {
                return ''
            } else {
                let curYear = new Date().getFullYear()
                return curYear - parseInt(empStandFrom.split('-')[0])
            }
        },
        oidBiz() {
            let fromTypeReg = /(\/rrh\/)|(\/haihua\/newRepayOld\/)|(\/haihua\/)|(\/prime\/)|(\/succ\/)/
            let fromTypeArr = this.$route.path.match(fromTypeReg)
            let oidBiz = fromTypeArr.length ? fromTypeArr[0].replace(/\//g, '') : 'null'

            return oidBiz
        }
    },
    methods: {
        /**
         * 显示 社会身份、最高学历、负债情况、借款人户口、婚姻状况、学制列表选项
         * @param  {[type]} userInfoItem 用户信息选项
         * @param  {[type]} field        用户信息field
         * @param  {[type]} data         用户信息data数据，用于初始化对应的列表选项
         * @param  {[type]} chosedItem   用户已选择的item
         * @return {[type]}
         */
        showPopSelectList(userInfoItem, field, data, chosedItem) {
            this.popSelectDataList = data
            this.chosedItem = chosedItem
            this.userInfoItem = userInfoItem
            this.userInfoField = field
            this.isShowPopSelectList = true
        },
        /**
         * 选择社会身份、最高学历、负债情况、借款人户口、婚姻状况、学制
         * @param  {[type]} obj   用户信息选项
         * @param  {[type]} item  选中的item
         * @return {[type]}      [description]
         */
        choosePopSelectItem(obj, item) {
            obj.key = item.key
            obj.text = item.value
            this.isShowPopSelectList = false
            // 最高学历需特殊处理，博士及以上：doctor  硕士：master 本科/专科：bachelor  高中及以下：junior
            this.submitData[this.userInfoField] = this.userInfoField === 'qualification' ? item.code : item.value
            this.isAllowSubmit = this.allowSubmitCheck()
        },
        /**
         * 关闭社会身份、最高学历、负债情况、借款人户口、婚姻状况、学制列表选项
         * @return {[type]} [description]
         */
        closePopSelectList() {
            this.isShowPopSelectList = false
        },
        /**
         * 显示学校、工作单位省市区列表
         * @param  {[type]} field        [description]
         * @param  {[type]} userInfoItem [description]
         * @return {[type]}              [description]
         */
        showAreaSelect(field, userInfoItem) {
            this.userInfoField = field
            this.userInfoItem = userInfoItem
            this.isShowAreaSelectList = true
        },
        /**
         * 选择学校、工作单位的省市区
         * @param  {[type]} obj  [description]
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        areaSelectConfirm(obj, item) {
            obj.provinceCode = item.provinceCode
            obj.province = item.province
            obj.cityCode = item.cityCode
            obj.city = item.city
            obj.zoneCode = item.districtCode
            obj.zone = item.district
            this.isShowAreaSelectList = false
            if (this.userInfoField === 'schoolArea') {
                this.submitData['schoolProvince'] = item.province
                this.submitData['schoolCity'] = item.city
                this.submitData['schoolZone'] = item.district
                this.submitData['schoolCodeProvince'] = item.provinceCode
                this.submitData['schoolCodeCity'] = item.cityCode
                this.submitData['schoolCodeZone'] = item.districtCode
            } else if (this.userInfoField === 'empCompanyArea') {
                this.submitData['empProvince'] = item.province
                this.submitData['empCodeProvince'] = item.provinceCode
                this.submitData['empCity'] = item.city
                this.submitData['empCodeCity'] = item.cityCode
                this.submitData['empZone'] = item.district
                this.submitData['empCodeZone'] = item.districtCode
            }
            this.isAllowSubmit = this.allowSubmitCheck()
        },
        /**
         * 关闭学校、工作单位所属省市区列表
         * @return {[type]} [description]
         */
        areaSelectClose() {
            this.isShowAreaSelectList = false
        },
        /**
         * 跳转到选择学校页面
         * @return {[type]} [description]
         */
        selectSchool() {
            this.$router.push({
                path: this.$route.path + '/selectSchool'
            })
        },
        /**
         * 显示入学时间、入职时间列表
         * @param  {[type]} title [description]
         * @param  {[type]} field [description]
         * @param  {[type]} item  [description]
         * @return {[type]}       [description]
         */
        showDatePicker(title, field, item) {
            this.datePickerTitle = title
            this.userInfoItem = item
            this.isShowDatePicker = true
            this.userInfoField = field
        },
        /**
         * 关闭入学时间、入职时间列表
         * @return {[type]} [description]
         */
        closeDatePicker() {
            this.isShowDatePicker = false
        },
        /**
         * 确认入学时间、入职时间
         * @param  {[type]} item [description]
         * @param  {[type]} date [description]
         * @return {[type]}      [description]
         */
        confirmDate(item, date) {
            item.text = date[0] + '-' + (date[1] >= 10 ? date[1] : ('0' + date[1])) + '-' +
                (date[2] >= 10 ? date[2] : ('0' + date[2]))
            this.submitData[this.userInfoField] = item.text
            this.isShowDatePicker = false
            this.isAllowSubmit = this.allowSubmitCheck()
        },
        /**
         * 选择学校
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        chooseSchool(data) {
            this.schoolInfo.schoolName.text = data
            this.submitData['schoolName'] = data
            this.isAllowSubmit = this.allowSubmitCheck()
        },
        inputChange(e, field) {
            this.submitData[field] = e.target.value
            this.isAllowSubmit = this.allowSubmitCheck()
        },
        /**
         * 用户补充信息是否填写完整校验
         * @return {[type]} [description]
         */
        allowSubmitCheck() {
            for (let field of this.baseField) {
                if (!this.submitData[field]) {
                    return false
                }
            }
            for (let field of this.schoolField) {
                if ((field !== 'schoolStandFrom' && field !== 'schoollengthOfSchooling') && !this.submitData[field]) {
                    return false
                }
            }
            if (this.isGraduate) {
                for (let field of this.empField) {
                    if ((field !== 'empworkingYears') && !this.submitData[field]) {
                        return false
                    }
                }
            }
            return true
        },
        /**
         * 用户补充信息校验
         * @return {[type]} [description]
         */
        submitDataVaild() {
            let schoolAdd = this.submitData.schoolAdd
            let empAdd = this.submitData.empAdd
            // 校验学校详细地址， 长度不小于12， 不能包含空格， 至少包含5个汉字
            if (schoolAdd) {
                if (schoolAdd.length < 12 || schoolAdd.indexOf(' ') >= 0 || (schoolAdd.length - schoolAdd.replace(/[\u4e00-\u9fa5]/g, '').length < 5)) {
                    this.$_toast('学校详细地址格式不正确')
                    return false
                }
            }
            // 校验工作单位详细地址， 长度不小于12， 不能包含空格， 至少包含5个汉字
            if (empAdd) {
                if (empAdd.length < 12 || empAdd.indexOf(' ') >= 0 || (empAdd.length - empAdd.replace(/[\u4e00-\u9fa5]/g, '').length < 5)) {
                    this.$_toast('工作地详细地址格式不正确')
                    return false
                }
            }
            return true
        },
        /**
         * 提交用户补充信息
         * @return {[type]} [description]
         */
        submit() {
            if (this.isAllowSubmit && this.submitDataVaild()) {
                let schoolStandFrom = this.submitData.schoolStandFrom
                let schoollengthOfSchooling = parseInt(this.submitData.schoollengthOfSchooling)
                let empStandFrom = this.submitData.empStandFrom
                // // 毕业时间， 根据入学时间和学制计算
                // if (schoolStandFrom && schoollengthOfSchooling) {
                //     this.submitData.schoolgraduationYear = parseInt(schoolStandFrom.split('-')[0]) + schoollengthOfSchooling + '-06-30'
                // }
                // 工作年限信息， 根据入职时间计算
                if (empStandFrom && this.empField.indexOf('empworkingYears') >= 0) {
                    this.submitData['empworkingYears'] = this.empworkingYears
                }
                // 提交用户信息
                addUserSupplement({
                    'fieldValue': JSON.stringify(this.submitData)
                }).then(res => {
                    if (res.success) {
                        this.$router.go(-1)
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.userInfo{
    padding-bottom: px2rem(50);
}
.submit{
    width:px2rem(686);
    height: px2rem(96);
    border-radius: px2rem(4);
    margin: px2rem(50) auto 0;
    line-height: px2rem(96);
    font-size: px2rem(36);
    text-align: center;
    background: #ffe352;
    color: #474747;
    &__disabled{
        background: #f2f2f2;
        color: #cccccc;
    }
}
.aui-cell_access.select .aui-cell__ft{
    color:#cccccc;
}
.aui-cell_access.select.selected .aui-cell__ft{
    color:#999999;
}
.aui-cell .aui-cell__bd input{
    color:#999999;
}
</style>
