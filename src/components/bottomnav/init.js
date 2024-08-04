/*
    created by hity 10/11/2017
 */
import {renderData} from 'src/store/api'
import {formatRet} from 'src/store/base'
import Vue from 'vue'
import _BottomNav from './index.vue'
import { isApp } from 'src/libs/util/env'

let initNav = function(router) {
    let cmsName = 'bottomNav'
    let navInfo = null

    if (!isApp) {
        renderData({
            alias: cmsName,
            type: '/cms'
        }, (data) => {
            let {
                success,
                result
            } = formatRet(data, '/cms/renderData')
            if (success && result.blocks && result.blocks.length) {
                let block = result.blocks.filter((block) => {
                    return block.blockType == 'extend'
                })[0]
                if (block) {
                    if (block.title == 'bottomNav') {
                        let bottomNav = JSON.parse(block.objList)
                        _loadBottomNav(bottomNav, router)
                    }
                }
            } else {
                console.log('cms api error.')
            }
        })
    }
}

function _loadBottomNav(bottomNavData, router) {
    let BottomNav = Vue.extend(_BottomNav)
    let bottomNav = new BottomNav({
        el: document.createElement('div'),
        propsData: {
            bottomNavData
        },
        router
    })
    let pElem = document.querySelector('body')
    pElem.appendChild(bottomNav.$el)
}

export { initNav }
