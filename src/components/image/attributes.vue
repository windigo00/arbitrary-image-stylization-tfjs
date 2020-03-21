<template>
    <div :class="'input-group'+ (disabled ? ' disabled' : '')">
        <div class="input-group-prepend">
            <div class="input-group-text">
                <i class="far fa-question-circle"
                   data-toggle="tooltip"
                   data-placement="top"
                   data-original-title="Changing the size of a style image usually affects the texture "></i>
            </div>
        </div>
        <input
            type="range"
            :min="sizeMin"
            :max="sizeMax"
            :value="size"
            data-toggle="tooltip"
            data-placement="top"
            :data-original-title="title"
            class="custom-range"
            @input="$emit('change', { size: $event.target.value })"
            @change="$emit('change', { size: $event.target.value })">

        <div class="input-group-append">
            <span class="number">{{ size }}</span>
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
            <div class="dropdown-menu">
                <a class="dropdown-item"
                   data-toggle="tooltip"
                   data-placement="top"
                   data-original-title="Force image to square"
                   @click="$emit('change', { square: !square})">
                    <i :class="'fa'+(square ? 's' : 'r')+' fa-square'"></i>

                    Force image to square
                </a>
                <a class="dropdown-item"
                   data-toggle="tooltip"
                   data-placement="top"
                   data-original-title="Smooth image resample"
                   @click="$emit('change', { smooth: !smooth})">
                    <i :class="'fa'+(smooth ? 's' : 'r')+' fa-square'"></i>
                    Smooth image resample
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'image_attributes',
        props: ['size', 'smooth', 'square', 'size-min', 'size-max', 'title', 'disabled'],

        data() {
            return {
            };
        },
        watch: {
            size(newValue) {
                this.currentValue = newValue;
            }
        },
        methods: {
        }

    }
</script>

<style scoped>

</style>
