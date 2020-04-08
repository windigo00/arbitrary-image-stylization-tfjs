<template>
  <div>
    <div class="list">
      <div
        v-for="(item, k) in items"
        :key="k"
        class="item"
        @click="showDetail(k)"
      >
        <canvas
          :ref="'canvas_'+k"
          class="h-100"
        />

        <div
          class="utils btn-group"
          role="group"
        >
          <button
            title="Save Image"
            type="button"
            class="btn btn-sm btn-primary"
            @click.stop="$emit('save', k)"
          >
            <i class="fas fa-save" />
          </button>
          <button
            title="Remove Image"
            type="button"
            class="btn btn-sm btn-danger"
            @click.stop="$emit('remove', k)"
          >
            <i class="fas fa-times" />
          </button>
        </div>
      </div>

      <div
        v-if="items.length"
        class="utils btn-group"
        role="group"
      >
        <button
          title="Save All"
          type="button"
          class="btn btn-sm btn-primary"
          @click.stop="$emit('save-all')"
        >
          <i class="fas fa-3x fa-file-download" />
        </button>
        <button
          title="Remove Image"
          type="button"
          class="btn btn-sm btn-danger"
          @click.stop="$emit('remove-all')"
        >
          <i class="fas fa-3x fa-trash-alt" />
        </button>
      </div>
    </div>
    <div class="row">
      <slot />
    </div>
    <info-overlay
      id="view"
      ref="view"
      size="lg"
      :center="true"
    >
      <template #content>
        <canvas
          ref="view_canvas"
          class="center h-100"
        />
      </template>
    </info-overlay>
  </div>
</template>
<script>
    import InfoOverlay from  './overlay.vue';

    export default {
        components: {
            InfoOverlay
        },
        props: {
            items: { type: Array, default: null }
        },
        data() {
            return {
            }
        },
        mounted(){
            this.updateImages();
        },
        updated(){
            this.updateImages();

        },
        methods: {

            updateImages() {
                for(var i = 0, max = this.items.length; i < max; i++) {
                    var canvas = this.$refs['canvas_'+i][0];
                    var image = this.items[i];
                    canvas.width = image.width;
                    canvas.height = image.height;
                    canvas.getContext('2d').putImageData(image, 0, 0);
                }
            },

            showDetail(k) {
                var canvas = this.$refs['view_canvas'];
                var image = this.items[k];
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').putImageData(image, 0, 0);
                this.$refs.view.dismissable = true;
                this.$refs.view.show();
            }
        }
    }
</script>

<style scoped>

  .list {
      clear: both;
  }
  .item {
      height: 5em;
      display: inline-block;
      margin-right: 0.2em;
      flex: none;
      position: relative;
  }
  .item canvas {
      width: auto;
  }

  .utils {
      vertical-align: top;
  }
  .item .utils {
      position: absolute;
      display: none;
      z-index: 10;
      top: 2px;
      left: 2px;
  }
  .item:hover .utils {
      display: block;
  }

</style>