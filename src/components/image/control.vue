<template>
    <div class="flex">
        <div class="btn-group float-right" role="group" >
            <button v-if="removable"
                    title="Remove style"
                    type="button"
                    @click="$emit('remove')"
                    class="btn btn-sm btn-warning">
                <i class="fas fa-times"></i>
            </button>
            <button v-if="isLast"
                    title="Add new style"
                    type="button"
                    @click="$emit('add')"
                    class="btn btn-sm btn-success">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <h4 class="item">
            {{ title }}
        </h4>
        <select class="centered custom-select item"
                :value="value.source"
                @change="$emit('change', {source: $event.target.value, imageIdx: 0})">
            <option value="" disabled="">Select a style</option>
            <option value="stored">Stored images</option>
            <option value="file">Select from file</option>
            <option value="camera">Snaps from camera</option>
            <option value="random">Random image from wikiart.org</option>
        </select>
        <component class="control item"
                   :is="'selector-' + value.source"
                   :selected="value.imageIdx"
                   :options="options.images[value.source]"
                   @change="$emit('change',$event)"
                   @update-items="$emit('update-items', $event)"></component>
        <image-attributes
                   class="control item"
                   v-show="value.image"
                   :title="title + ' Size'"
                   :size-min="sizeMin"
                   :size-max="sizeMax"
                   :size="value.size"
                   :smooth="value.smooth"
                   :square="value.square"
                   @change="$emit('change',$event)"></image-attributes>
        <slot class="control item"></slot>
        <image-sampler
                   class="item"
                   :size="value.size"
                   :smooth="value.smooth"
                   :square="value.square"
                   :image="value.image"></image-sampler>

    </div>
</template>

<script>
    import SelectorRandom  from './selector/random.vue';
    import SelectorFile    from './selector/file.vue';
    import SelectorStored  from './selector/stored.vue';

    import ImageAttributes from  './attributes.vue';
    import ImageSampler    from  './sampler.vue';

    export default {
        name: 'image_control',
        props: ['options', 'value', 'size-min', 'size-max', 'title', 'name', 'is-last', 'removable'],

        components: {
            SelectorRandom,
            SelectorFile,
            SelectorStored,
            ImageAttributes,
            ImageSampler
        },

        data() {
            return {

            }
        },
        mounted() {
        }

    }
</script>


<style>

    .image {
        width: 100%;
        height: auto;
    }

    .pixelated,
    .pixelated
    {
        -ms-interpolation-mode: nearest-neighbor;
        image-rendering: pixelated;
    }

    .control {
        border: 1px solid #ced4da;
        border-radius: .25rem;
    }

    .flex {
        align-items: stretch;
    }
    .item {
        flex: flex-grow;
    }

    .number {
        display: inline-block;
        text-align: center;
        width: 100%;
        min-width: 2em;
        padding-left: 0.3em;
        padding-right: 0.3em;
        padding-top: 0.3em;
        border-width: 0px 0px 1px 0px;
        border-color: #ced4da;
        vertical-align: middle;
    }

    .custom-range {
        padding-left: 0.75rem;
        padding-right: 0;
    }
/*    .form-control {
        border-width: 0px 0px 1px 0px;
    }*/

</style>