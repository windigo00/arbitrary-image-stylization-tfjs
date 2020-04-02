<template>
  <parent
    :options="options"
    :selected="selected"
    @change="$emit('change', $event)"
  >
    <template v-slot:after>
      <button
        class="btn btn-block btn-primary"
        data-toggle="tooltip"
        data-placement="top"
        data-original-title="Add new image from file"
        @click="addFromFile"
      >
        <i class="fas fa-plus" />
      </button>
      <input
        ref="fileInput"
        type="file"
        style="display:none;"
        multiple
        @change="storeFiles"
      >
    </template>
  </parent>
</template>


<script>
    import Selector from '../selector.vue';
    export default {
        name: 'FileImageSelect',
        components: {
            parent: Selector
        },
        extends: Selector,

        mounted() {
            if (this.options.items.length == 0) {
                this.addFromFile();
            }
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
        }
    }
</script>




