<template>
    <swiper v-if="banners.length" :options="swiperOption" class="magnet-bottom banner-bottom_relative">
        <swiper-slide v-for="(banner, index) in banners" :key="index">
            <a :href="banner.url"><img :src="banner.img" alt="banner" :data-url="banner.url" /></a>
        </swiper-slide>
    </swiper>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    name: 'cms-banner',
    props: {
        banners: {
            type: Array,
            default: () => []
        },
        options: {
            type: Object,
            default: () => {}
        },
        eventId: {
            type: String,
            default: ''
        },
        bottom: {
            type: Number,
            default: 0
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    computed: {
        swiperOption() {
            console.log(this.banners.length)
            return Object.assign({
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                allowTouchMove: this.banners.length > 1,
                loop: true,
                autoplay: this.banners.length > 1 ? {
                    delay: 3000,
                    disableOnInteraction: false
                } : false,
                on:{
                    tap: (swiper) => {
                        const url = swiper.target.dataset.url
                        this.eventId && this.log({type: 'button', name: this.eventId, desc: '', extendData: url})
                        // window.location.href = url
                    }
                }
            },this.options)
        }
    },
    mounted () {
        this.calcuSwiper()
    },
    updated: function () {
        this.calcuSwiper()
    },
    methods: {
        calcuSwiper() {
            this.$nextTick(() => {
                const swiper = document.querySelector('.magnet-bottom')
                if(swiper){
                    swiper.style.position = ''
                    const bodyHeight = document.body.offsetHeight
                    // console.log(swiper.offsetTop + swiper.offsetHeight  + parseInt(getComputedStyle(swiper).marginTop) + this.bottom)
                    if(swiper.offsetTop + swiper.offsetHeight  + parseInt(getComputedStyle(swiper).marginTop) + this.bottom < bodyHeight) {
                        swiper.style.position = 'fixed'
                        swiper.style.bottom = (this.bottom + (this.bottom ? 10 : 0)) + 'px'
                        swiper.style.paddingBottom = 0
                    } else {
                        swiper.style.paddingBottom = (this.bottom + 10) + 'px'
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.banner-bottom_relative {
    width: 100%;
    overflow: hidden;
    margin-top: px2rem(80);
}
.banner-bottom_absolute {
    width: 100%;
    overflow: hidden;
    position: absolute;
    bottom: 0;
}
</style>
