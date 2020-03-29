<template>
    <div :class="attrClass">
        <div class="input-group">
            <div class="input-group-prepend">
                <slot name="prepend"></slot>
                <span class="input-group-text" v-if="hint">
                    <i class="fa fa-question-circle"
                       data-toggle="tooltip"
                       data-placement="top"
                       :data-original-title="hint"></i>
                </span>
            </div>
            <input
                type="range"
                :min="sizeMin"
                :max="sizeMax"
                :value="size"
                data-toggle="tooltip"
                data-placement="top"
                :data-original-title="title"
                class="form-control custom-range"
                @input="$emit('change', $event.target.value )"
                @change="$emit('change', $event.target.value )">

            <div class="input-group-append">
                <span class="input-group-text"
                      data-toggle="tooltip"
                      data-placement="top"
                      :data-original-title="title">{{ size | formatInteger }}</span>

                <slot name="append"></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'image_attribute',
        props: ['size', 'size-min', 'size-max', 'title', 'hint', 'disabled'],

        data() {
            return {
            };
        },
        computed: {
            attrClass() {
                return {
                    disabled: this.disabled
                };
            }
        }

    }
</script>

<style scoped>

</style>
