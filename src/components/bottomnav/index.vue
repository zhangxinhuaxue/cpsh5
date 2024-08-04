<template>
    <nav id="bottom-nav">
        <ul>
            <li v-for="(item, index) in navList"><span @click="filterHref(item, index)" :style="background(item, index)"></span></li>
        </ul>
    </nav>
</template>
<script type="text/javascript">
import { mapState } from 'vuex'
import { myAll } from 'src/store/modules/user'
import { AXD } from 'src/libs/util'

export default {
    name: 'bottomnav',
    props: ['bottomNavData'],
    computed: {
        activeId() {
            return this.$route.query.activeId ? this.$route.query.activeId : 0
        },
        navList() {
            let bottomNav = this.bottomNavData
            return bottomNav ? ((bottomNav.navList instanceof Array) ? bottomNav.navList : []) : []
        },
        linkType() {
            let bottomNav = this.bottomNavData
            return bottomNav ? bottomNav.linkType : ''
        }
    },
    methods: {
        background(item, index) {
            let imgUrl = index == this.activeId ? item.activeImg : item.defaultImg
            return 'backgroundImage: url(' + imgUrl + ')'
        },
        filterHref(item, index) {
            if (index == this.activeId) {
                return
            }
            if (item.isLoginNeeded) {
                myAll().then(({success, result, resultDes}) => {
                    if (success) {
                        if (result.loginStatus) {
                            this.goUrl(item, index)
                        } else {
                            AXD.util.login()
                        }
                    } else {
                        this.$_toast(resultDes)
                    }
                })
            } else {
                this.goUrl(item, index)
            }
        },
        goUrl(item, index) {
            let url = item.url
            url += url.indexOf('?') == -1 ? '?' : '&'
            url += 'activeId=' + index + '&from=bottomnav'
            window.location.href = url
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
#bottom-nav {
    z-index: 1000;
    width: 100%;
    height: px2rem(100);
    position: fixed;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background-color: #fff;
    ul {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        li {
            flex: none;
            span {
                display: block;
                width: px2rem(148);
                height: px2rem(100);
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center center;
            }
        }
    }
}
</style>
