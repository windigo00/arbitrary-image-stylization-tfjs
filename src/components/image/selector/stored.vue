<script>
    import Selector from '../selector.vue';

    export default {
        name: 'StoredImageSelect',
        extends: Selector,
//        data() {
//            return {
//
//            };
//        },
        created() {
        },

        mounted() {
        },
        methods: {
            getImage(idx) {
                return `images/${this.options.items[idx]}.jpg`;
            }
        }


    }
</script>




