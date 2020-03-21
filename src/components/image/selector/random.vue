<template>
    <parent :options="options" :selected="selected" @change="$emit('change', $event)">
        <template v-slot:add>
            <div class="card img-cnt">
                <button class="btn btn-primary"
                        @click="addImages(5)"
                        title="Add new random image">
                    <i class="fas fa-random"></i>
                </button>
            </div>
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
            this.addImages(6);
        }
    }
</script>




