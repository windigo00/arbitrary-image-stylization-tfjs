<template>
    <parent :options="options" :selected="selected" @change="$emit('change', $event)">
        <template v-slot:after>
                <button class="btn btn-block btn-primary"
                        @click="addImages(5)"
                        data-toggle="tooltip"
                        data-placement="top"
                        data-original-title="Add new random image">
                    <i class="fas fa-random"></i>
                </button>
        </template>
    </parent>
</template>

<script>
    import Selector from '../selector.vue';

    export default {
        extends: Selector,
        name: 'random_image_select',
        components: {
            parent: Selector
        },
        data() {

            return {
            }
        },
        methods: {
            /**
             * Add COUNT random images
             * @param {int} count
             * @returns {undefined}
             */
            addImages(count) {
                let newItems = {
                    items: [],
                    names: [],
                };
                for (var i = 0; i < count; i++) {
                    let newItem = this.addImage();
                    newItems.items.push(newItem.item);
                    newItems.names.push(newItem.name);
                }
                this.$emit('update-items', newItems);
            },
            /**
             * Add new random image
             * @returns {undefined}
             */
            addImage() {
                var that = this;
                var unselectedNames = [];
                var unselectedItems = this.options.itemsSrc.filter((item, idx) => {
                    if (!that.options.items.includes(item)) {
                        unselectedNames.push(that.options.namesSrc[idx]);
                        return true;
                    }
                    return false;
                });
                let idx = Math.round(Math.random() * unselectedItems.length);
                return {
                    name: unselectedNames[idx],
                    item: unselectedItems[idx],
                };
            }
        },
        created() {
            if (this.options.items.length == 0) {
                this.addImages(6);
            }
        }
    }
</script>

<style >
    .selector {
       padding-left: 0;
       padding-right: 0;
    }
</style>




