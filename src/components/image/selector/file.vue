<template>
    <parent :options="options" :selected="selected" @change="$emit('change', $event)">
        <template v-slot:after>
            <button class="btn btn-block btn-primary"
                    data-toggle="tooltip"
                    data-placement="top"
                    data-original-title="Add new image from file"
                    @click="addFromFile">
                <i class="fas fa-plus"></i>
            </button>
            <input type="file"
                   ref="fileInput"
                   style="display:none;"
                   multiple
                   @change="storeFiles"/>

        </template>
    </parent>
</template>


<script>
    import Selector from '../selector.vue';
    export default {
        extends: Selector,
        name: 'file_image_select',
        components: {
            parent: Selector
        },

        methods: {
            storeFiles(event) {
                event.preventDefault();
                let files = event.target.files;
                if(files && files.length) {
                    let newItems = {
                        items: [],
                        names: [],
                    };
                    for(var i = 0, max = files.length; i < max; i++){
                        newItems.items.push(files.item(i))
                    }
                    this.$emit('update-items', newItems);
                }
            },
            addFromFile() {
                this.$refs.fileInput.click();
            }
        },

        mounted() {
            if (this.options.items.length == 0) {
                this.addFromFile();
            }
        }
    }
</script>




