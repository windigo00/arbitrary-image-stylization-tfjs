<template>
    <div class="container bg-white">
        <div class="card-columns">
            <lazy-image
                :class="'card img-cnt'+ (selected == k ? ' selected' : '')"
                v-for="(i, k) in options.items"
                :key="k"
                :src="getImage(k)"
                :title="getName(k)"
                @click="setSelected(k, $event)"></lazy-image>
            <slot name="add"></slot>
        </div>
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
        methods: {
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
        margin-bottom: 0.1rem;

    }

    .card-columns {
        column-gap: 0.1rem;
        -webkit-column-gap: 0.1rem;
        column-count: 6;
    }
    .container {
        height: 10em;
        overflow: auto;
        margin: 0.1rem 0;
    }
    .img-cnt.selected {
        border: 1px solid red;
    }
</style>



