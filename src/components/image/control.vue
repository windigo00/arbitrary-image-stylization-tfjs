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
        <div class="control item">

            <select class="custom-select"
                    :value="value.source"
                    @change="$emit('change', {source: $event.target.value, imageIdx: 0})">
                <option value="" disabled="">Select a style</option>
                <option value="stored">Stored images</option>
                <option value="random">Random from wikiart</option>
                <option value="file">Select from file</option>
                <!-- #TODO: add camera images -->
                <option value="camera" v-if="false">Snaps from camera</option>
            </select>
        </div>
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
                   :hint="hint"
                   :size-min="sizeMin"
                   :size-max="sizeMax"
                   :size="value.size"
            @change="$emit('change', { size: $event })">
            <template v-slot:prepend>

                <button class="btn btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        ></button>
                <div class="dropdown-menu">
                    <a class="dropdown-item"
                       data-toggle="tooltip"
                       data-placement="top"
                       data-original-title="Force image to square"
                       @click="$emit('change', { square: !value.square})">
                        <i :class="'fa'+(value.square ? 's' : 'r')+' fa-square'"></i>

                        Force image to square
                    </a>
                    <a class="dropdown-item"
                       data-toggle="tooltip"
                       data-placement="top"
                       data-original-title="Smooth image resample"
                       @click="$emit('change', { smooth: !value.smooth})">
                        <i :class="'fa'+(value.smooth ? 's' : 'r')+' fa-square'"></i>
                        Smooth image resample
                    </a>
                </div>
            </template>
        </image-attributes>
        <slot class="control item"></slot>
        <image-sampler
                   class="item"
                   :size="value.size"
                   :smooth="value.smooth"
                   :square="value.square"
                   :image="value.image"
                   @change="$emit('change', { resampled: $event })"></image-sampler>

    </div>
</template>

<script>
    import Component       from '../component.vue';

    import SelectorRandom  from './selector/random.vue';
    import SelectorFile    from './selector/file.vue';
    import SelectorCamera  from './selector/camera.vue';
    import SelectorStored  from './selector/stored.vue';

    import ImageAttributes from  './attribute.vue';
    import ImageSampler    from  './sampler.vue';

    export default {
        extends: Component,
        name: 'image_control',
        props: ['options', 'value', 'size-min', 'size-max', 'title', 'hint', 'name', 'is-last', 'removable'],

        components: {
            SelectorRandom,
            SelectorFile,
            SelectorStored,
            SelectorCamera,
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

/*    .flex {
        align-items: stretch;
    }
    .item {
        flex: flex-grow;
    }*/

/*    .number {
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
    }*/

    .custom-range {
        padding-left: 0.2em;
        padding-right: 0.2em;
    }
/*    .form-control {
        border-width: 0px 0px 1px 0px;
    }*/

</style>