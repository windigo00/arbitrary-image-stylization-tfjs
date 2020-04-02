<template>
  <div>
    <h3>{{ title }}</h3>
    <select
      :disabled="disabled"
      class="centered custom-select"
      @change="$emit('change', $event.target.value)"
    >
      <option
        v-for="(m,k) in models"
        :key="k"
        :value="k"
        :selected="k == model"
      >
        {{ m.title }}
      </option>
    </select>
  </div>
</template>
<script>
    import Component from '../component.vue';

    export default {
        name: 'ModelControl',
        extends: Component,
        props: {
            models: {
                type: Object,
                default: null
            },
            model: {
                type: String,
                default: null
            },
            disabled: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            }
        },
        data() {
            return {

            }
        }
    }
</script>