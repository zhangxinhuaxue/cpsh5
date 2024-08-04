/**
 *
 * @author:      Doris
 * @dateTime:    2017-11-13 16:15:36
 * @description:
 */
// initial state
const state = {
    addrSelected: {
        address: '',
        city: '',
        cityCode: '',
        district: '',
        districtCode: '',
        id: '',
        isAuth: '',
        mobilephone: '',
        name: '',
        province: '',
        provinceCode: '',
        schoolId: '',
        schoolName: '',
        status: '',
        userId: '',
        street: '',
        streetCode: ''
    }, // 选中地址
    list: [] // 地址列表
}

const getters = {
}

const mutations = {
    saveAddress(state, obj) {
        for (let key in state.addrSelected) {
            state.addrSelected[key] = ''
        }
        for (let key in obj) {
            state.addrSelected[key] = obj[key]
        }
    },
    saveAddressItem(state, obj) {
        Object.assign(state.addrSelected, obj)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
