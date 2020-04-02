<template>
  <div :class="attrClass">
    <div class="input-group">
      <div class="input-group-prepend">
        <slot name="prepend" />
        <span
          v-if="hint"
          class="input-group-text"
        >
          <i
            class="fa fa-question-circle"
            data-toggle="tooltip"
            data-placement="top"
            :data-original-title="hint"
          />
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
        @input="$emit('change', $event.target.value*1 )"
        @change="$emit('change', $event.target.value*1 )"
      >
      <div class="input-group-append">
        <span
          class="input-group-text"
          data-toggle="tooltip"
          data-placement="top"
          :data-original-title="title"
        >
          {{ size | formatInteger }}
        </span>
        <slot name="append" />
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'ImageAttribute',
        props: {
          size    : { type: Number, default: 42 },
          sizeMin : { type: Number, default: 32 },
          sizeMax : { type: Number, default: 800 },
          title   : { type: String, default: null },
          hint    : { type: String, default: null },
          disabled: { type: Boolean, default: false }
        },

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
