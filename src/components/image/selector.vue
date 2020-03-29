<template>
    <div class="container bg-white selector">
        <div class="card-container">
            <div class="card-columns">
                <lazy-image
                    :class="imageClass(k)"
                    v-for="(i, k) in options.items"
                    :key="k"
                    :src="getImage(k)"
                    :title="getName(k)"
                    @click="setSelected(k, $event)"></lazy-image>
                <slot name="add"></slot>
            </div>
        </div>
        <slot name="after"></slot>
    </div>
</template>

<script>
    import LazyImage from './image.vue';

    export default {
        props: ['options', 'selected'],
        name: 'image_select',
        components: {
            LazyImage
        },
        data() {
            return {
            }
        },
        computed: {
        },
        methods: {
            imageClass(key) {
                return {
                    card: true,
                    'img-cnt': true,
                    selected: this.selected == key
                };
            },
            getImage(idx) {
                return this.options.items[idx];
            },
            getName(idx) {
                return this.options.names[idx];
            },
            setSelected(idx, image) {
                this.$emit('change', { imageIdx: idx, image: image});
            }
        },

        created() {
        },

        mounted() {
        }

    }
</script>
<style scoped>
    .img-cnt {
        border: 0px;
        border-radius: 0;
        margin-bottom: 0.1em;

    }

    .card-columns {
        column-gap: 1px;
        -webkit-column-gap: 0.1em;
        column-count: 6;
    }
    .container {
        margin: 0.1em 0;
    }
    .card-container {
        min-height: 1em;
        max-height: 10em;
        overflow: auto;
    }
    .img-cnt.selected {
        border: 1px solid red;
    }
</style>



