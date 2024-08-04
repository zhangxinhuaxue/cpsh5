<template>
    <div v-if="renderData.length !== 0" class="vipcard-rights">
        <swiper
          class="swiper-icon"
          ref="swiperIcon"
          @tap="clickIcon"
          :options="swiperIconOption">
            <swiper-slide class="slide-icon" v-for="(icon, index) in rightsIcon" :key="icon.normalIcon">
                <img v-if="currentIconIndex === index" class="icon-image" :src="icon.activeIcon" alt="A+会员权益" />
                <img v-else class="icon-image" :src="icon.normalIcon" alt="A+会员权益" />
                <div :class="[ 'icon-text', {'icon-text_active': currentIconIndex === index} ]">{{icon.name}}</div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <swiper
          ref="swiperRight"
          @slideChangeTransitionEnd="slideChangeTransitionEnd"
          :options="swiperRightOption">
            <swiper-slide v-for="right in rightsImg" :key="right.bgImg">
                <img :src="right.bgImg" alt="A+会员权益" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="pay-button" @click="goPay">立即开通</div>
    </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { renderDataCms } from 'src/store/api'
export default {
    components: {
        swiper,
        swiperSlide
    },
    data() {
        return {
            currentRight: this.$route.query.right || 'vip-day',
            currentRightIndex: 0,
            currentIconIndex: 0,
            renderData: [],
            swiperIconOption: {
                // spaceBetween: 40,
                // centeredSlides: true,
                slidesPerView: 5,
                initialSlide: 0
                // loop: true
            },
            swiperRightOption: {
                // 切换效果
                effect: 'coverflow',
                // 设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                initialSlide: 0,
                // loop: true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: -35,
                    depth: 120,
                    slideShadows: false
                }
            }
        }
    },
    computed: {
        rightsIconActive() {
            let iconObj = this.renderData.find(data => data.title === 'rights-icon_active')
            return iconObj && JSON.parse(JSON.parse(iconObj.objList))
        },
        rightsIconNormal() {
            let iconObj = this.renderData.find(data => data.title === 'rights-icon_normal')
            return iconObj && JSON.parse(JSON.parse(iconObj.objList))
        },
        rightsIcon() {
            let arr = this.rightsIconActive.concat(this.rightsIconNormal)
            let result = []
            arr.map(data => {
                let obj = {}
                let findIndex = result.findIndex(item => item.name === data.hotArea[1].url)
                if (findIndex !== -1) {
                    result[findIndex].normalIcon = data.bgImg
                } else {
                    obj = {
                        value: data.hotArea[0].url,
                        name: data.hotArea[1].url,
                        activeIcon: data.bgImg,
                        normalIcon: ''
                    }
                }
                result.push(obj)
            })
            result = result.filter(data => JSON.stringify(data) !== '{}')
            return result
        },
        rightsImg() {
            let imgObj = this.renderData.find(data => data.title === 'rights-img')
            return imgObj && JSON.parse(JSON.parse(imgObj.objList))
        }
    },
    mounted() {
        renderDataCms({
            alias: 'vipcard',
            type: '/cms'
        }, { showLoading: true }).then(res => {
            if (res.success) {
                this.renderData = res.result.blocks
                this.$nextTick(() => {
                    this.currentRightIndex = this.rightsImg.findIndex(data => data.hotArea[0].url === this.currentRight)
                    this.currentIconIndex = this.rightsIcon.findIndex(data => data.value === this.currentRight)
                    this.$refs.swiperRight.swiper.slideTo(this.currentRightIndex, 1000, false)
                    this.$refs.swiperIcon.swiper.slideTo(this.currentIconIndex, 1000, false)
                })
            } else {
                this.$_toast('获取活动信息失败')
            }
        })
    },
    methods: {
        slideChangeTransitionEnd(event) {
            let activeIndex = this.$refs.swiperRight.swiper.activeIndex
            let activeRightName = this.rightsImg[activeIndex].hotArea[1].url
            this.currentIconIndex = this.rightsIcon.findIndex(data => data.name === activeRightName)
            this.$refs.swiperIcon.swiper.slideTo(this.currentIconIndex, 500, false)
        },
        clickIcon(event) {
            let activeIconName = event.target.innerText ? event.target.innerText : event.target.nextElementSibling.innerText
            this.currentRightIndex = this.rightsImg.findIndex(data => data.hotArea[1].url === activeIconName)
            this.currentIconIndex = this.rightsIcon.findIndex(data => data.name === activeIconName)
            this.$refs.swiperRight.swiper.slideTo(this.currentRightIndex, 800, false)
            this.$refs.swiperIcon.swiper.slideTo(this.currentIconIndex, 500, false)
        },
        goPay() {
            this.$router.push({
                name: 'vipcard'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.vipcard-rights {
    width: 100%;
    overflow: hidden;
    padding-top: px2rem(40);
}
.swiper-inner {
    width: 100%;
    height: 400px;
    padding-top: 50px;
    padding-bottom: 50px;
}
.swiper-icon {
    margin-bottom: px2rem(150);
}
.swiper-slide {
    background-position: center;
    background-size: cover;
    width: px2rem(498);
    height: px2rem(640);
    &.slide-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: px2rem(200);
    }
}
.icon-image {
    width: px2rem(80);
    height: px2rem(80);
    margin-bottom: px2rem(10);
}
.icon-text {
    font-size: px2rem(24);
    color: #D0D0D0;
    &_active {
        color: #9B7D46;
    }
}
.pay-button {
    width: 100%;
    height: px2rem(98);
    line-height: px2rem(98);
    background: linear-gradient(90deg,rgba(86,80,78,1) 0%,rgba(39,37,36,1) 100%);
    text-align: center;
    color: #F6E5C0;
    font-size: px2rem(36);
    font-weight:400;
    position: fixed;
    bottom: 0;
}
</style>