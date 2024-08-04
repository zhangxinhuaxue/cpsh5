import Vue from 'vue'
import _Popup from './popup.vue'

export default {
    data() {
        return {
            popupInstance: {}
        }
    },
    methods: {
        popup() {
            this.popupInstance = this.loadPopupComponent(this.popupInstance, this.config, this.$store, this.exObj)
            this.popupInstance.isPopup = true
        },
        closePopup() {
            this.popupInstance.isPopup = false
        },
        loadPopupComponent(popupInstance, config, store, exObj) {
            if (!(popupInstance.$el && popupInstance.$el.id == config.type + '-popup')) {
                // 加载popup组件
                let Popup = Vue.extend(_Popup)
                popupInstance = new Popup({
                    el: document.createElement('div'),
                    store,
                    propsData: {
                        config,
                        exObj
                    }
                })
                popupInstance.$el.id = config.type + '-popup'
                document.querySelector('.aui-page').appendChild(popupInstance.$el)
            }
            return popupInstance
        }
    }
}
