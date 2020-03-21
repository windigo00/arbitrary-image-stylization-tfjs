<script>
    import Selector from '../selector.vue';

    export default {
        extends: Selector,
        name: 'stored_image_select',
//        data() {
//            return {
//
//            };
//        },
        methods: {
            getImage(idx) {
                return `images/${this.options.items[idx]}.jpg`;
            }
        },

        created() {
        },

        mounted() {
        }

    }
</script>




