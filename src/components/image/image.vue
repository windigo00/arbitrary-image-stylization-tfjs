<template>
    <div>
        <img v-show="loaded"
             class="image"
             crossorigin="anonymous"
             ref="imgEl"
             :title="title"
             @click="updateImage">
        <div v-if="!loaded" class="image">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'lazy_image',
        props: ['src', 'title'],
        data () {
            return {
                loaded: false
            }
        },
        methods: {
            async loadImage(url) {
                var image = this.$refs['imgEl'];
                return new Promise( (resolve, reject) => {
//                    var image = new Image()
                    image.src = url
//                    image.crossOrigin = "Anonymous";
                    image.onload = () => resolve(image)
                    image.onerror = () => reject(new Error('could not load image'))
                })
            },

            updateImage() {
                this.$emit('click', this.$refs['imgEl']);

            }
        },

        created() {
        },

        mounted() {
            if (!this.loaded) {
                var that = this;
                this.loadImage(this.src)
                    .then((image) => {
                        that.loaded = true;
                    });
            }
        }
    }
</script>
