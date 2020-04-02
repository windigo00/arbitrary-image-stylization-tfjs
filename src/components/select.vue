<template>
  <select
    :multi="multi"
    class="custom-select"
    @change="$emit('change', $event.target.value)"
  >
    <option
      v-for="(item, k) in visibleItems"
      :key="k"
      :value="item.value"
      :selected="values.includes(item.value)"
      :disabled="item.disabled === true"
    >
      {{ item.title }}
    </option>
  </select>
</template>

<script>
    export default {
        name: 'SelectComponent',
        props: {
            items  : { type: Array, default: null },
            values : { type: Array, default: null },
            multi  : { type: Boolean, default: false }
        },

        computed: {
            visibleItems() {
                return this.items.filter(e => e.hidden !== true);
            }
        }
    }
</script>