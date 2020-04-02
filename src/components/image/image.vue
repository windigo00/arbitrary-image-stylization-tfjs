<template>
  <div>
    <img
      v-show="loaded"
      ref="imgEl"
      class="image"
      crossorigin="anonymous"
      :title="title"
      @click="updateImage"
    >
    <div
      v-if="!loaded"
      class="image"
    >
      <i class="fas fa-spinner fa-spin" />
    </div>
  </div>
</template>

<script>

    export default {
        name: 'LazyIimage',
        props: {
            src  : {
                type: [String, File],
                default: null },
            title: {
                type: String,
                default: null
            }
        },
        data () {
            return {
                loaded: false
            }
        },

        created() {
        },

        mounted() {
            if (!this.loaded) {
                var that = this;
                this.loadImage(this.src)
                    .then(() => {
                        that.loaded = true;
                    });
            }
        },
        methods: {
            async loadImage(url) {
                var image = this.$refs['imgEl'];
                return new Promise((resolve, reject) => {
                    if (typeof url != 'string') {// source is file
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            image.src = e.target.result;
                        };
                        reader.readAsDataURL(url);
                    } else {
                        image.src = url;
//                        image.crossOrigin = "Anonymous";
                    }
                    image.onload = () => resolve(image)
                    image.onerror = () => reject(new Error('could not load image'))
                });
            },

            updateImage() {
                this.$emit('click', this.$refs['imgEl']);

            }
        }
    }
</script>
