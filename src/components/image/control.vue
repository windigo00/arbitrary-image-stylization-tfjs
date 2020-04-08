<template>
  <div class="flex">
    <div
      class="btn-group float-right"
      role="group"
    >
      <button
        v-if="removable"
        title="Remove style"
        type="button"
        class="btn btn-sm btn-warning"
        @click="$emit('remove')"
      >
        <i class="fas fa-times" />
      </button>

      <slot name="buttons"></slot>
      
      <button
        v-if="isLast"
        title="Add new style"
        type="button"
        class="btn btn-sm btn-success"
        @click="$emit('add')"
      >
        <i class="fas fa-plus" />
      </button>
    </div>
    <h5 class="item">
      {{ title }}
    </h5>
    <div class="control item">
      <select-component
        :values="[value.source]"
        :items="imageSource"
        class="custom-select"
        @change="$emit('change', {source: $event, imageIdx: 0})"
      />
    </div>
    <component
      :is="'selector-' + value.source"
      :selected="value.imageIdx"
      :options="options.images[value.source]"
      class="control item"
      @change="$emit('change',$event)"
      @update-items="$emit('update-items', $event)"
    />
    <image-attributes
      v-show="value.image"
      :title="title + ' Size'"
      :hint="hint"
      :size-min="sizeMin"
      :size-max="sizeMax"
      :size="value.size"
      class="control item"
      @change="$emit('change', { size: $event })"
    />
    <slot class="control item" />
    <div
      v-show="value.image"
      class="item"
    >
      <a
        data-toggle="tooltip"
        data-placement="top"
        data-original-title="Force image to square"
        @click="$emit('change', { square: !value.square})"
      >
        <i :class="'fa'+(value.square ? 's' : 'r')+' fa-square'" />
        Force image to square
      </a>
    </div>
    <div
      v-show="value.image"
      class="item"
    >
      <a
        data-toggle="tooltip"
        data-placement="top"
        data-original-title="Smooth image resample"
        @click="$emit('change', { smooth: !value.smooth})"
      >
        <i :class="'fa'+(value.smooth ? 's' : 'r')+' fa-square'" />
        Smooth image resample
      </a>
    </div>
    <image-sampler
      :size="value.size"
      :smooth="value.smooth"
      :square="value.square"
      :image="value.image"
      class="item"
      @change="$emit('change', { resampled: $event })"
    />
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
    import SelectComponent from  '../select.vue';

    export default {
        name: 'ImageControl',
        components: {
            SelectorRandom,
            SelectorFile,
            SelectorStored,
            SelectorCamera,
            ImageAttributes,
            ImageSampler,
            SelectComponent
        },
        extends: Component,
        props: {
          options : { type: Object, default: null },
          value   : { type: Object, default: null },
          sizeMin : { type: Number, default: 32 },
          sizeMax : { type: Number, default: 800 },
          title   : { type: String, default: null },
          hint    : { type: String, default: null },
          name    : { type: String, default: null },
          isLast  : { type: Boolean, default: false },
          removable: { type: Boolean, default: false }
        },


        data() {
            return {
                imageSource: [{
                    value: '',
                    disabled: true,
                    title: 'Select a style'
                },{
                    value: 'stored',
                    title: 'Stored images'
                },{
                    value: 'random',
                    title: 'Random from wikiart'
                },{
                    value: 'file',
                    title: 'Select from file'
                },{
                    value: 'camera',
                    hidden: true,
                    title: 'Snaps from camera'
                }]
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