<template>
    <div class="card"
        @click="handleClick">
        <div class="card-hd">
            <slot name="icon"></slot>
        </div>
        <div class="card-bd">
            <slot name="title">{{ title }}</slot>
        </div>
        <div class="card-ft">
            <slot name="value"></slot>
            <!-- <m-icon v-if="linkState" type="checkbox_checked" class="card-sign_success"></m-icon>
            <img v-else :src="arrow" alt="" class="card-sign_arrow"> -->
            <!-- <slot name="value">{{value}}</slot> -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'credit-card',
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: String,
            default: ''
        },
        linkState: {
            type: Boolean,
            default: false
        },
        link: {
            type: [String, Object],
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            // arrow: require('../images/arrow-right.png')
        }
    },
    computed: {
        valueClass() {
            return {}
        }
    },
    methods: {
        handleClick(event) {
            if (this.link) {
                if (!this.disabled) {
                    this.$router.push({
                        name: this.link
                    })
                }
            } else {
                this.$emit('click', event)
            }
        }
    }
}
</script>
