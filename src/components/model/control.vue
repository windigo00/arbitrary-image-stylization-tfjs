<template>
    <div>
        <h3>{{ title }}</h3>
        <select :disabled="disabled" class="centered custom-select" @change="$emit('change', $event.target.value)">
            <option v-for="(m,k) in models" :key="k" :value="k" :selected="k == model">{{ m.title }}</option>
        </select>
    </div>
</template>
<script>
    import Component       from '../component.vue';

    export default {
        extends: Component,
        name: 'model_control',
        props: ['models', 'model', 'disabled', 'title'],
        data() {
            return {

            }
        }
    }
</script>