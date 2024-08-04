<template>
    <component :is="type"></component>
</template>

<script>
import rrhIndex from './rrhIndex.vue'
import rrhApply from './rrhApply.vue'
export default {
    name: 'skeleton',
    components: {
        rrhIndex,
        rrhApply
    },
    data() {
        return {
            type: this.$parent.$options.name
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
::v-deep {
    @keyframes skeletonOpacity {
        0% {
            opacity: 1
        }
        50% {
            opacity: .5
        }
        100% {
            opacity: 1
        }
    }
    ._ {
        position: fixed;
        z-index: 999;
        background: #eee;
        animation: skeletonOpacity 1s linear infinite;
    }

    .__ {
        top: 0%;
        left: 0%;
        width: 100%;
    }
}
</style>
