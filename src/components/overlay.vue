<template>

    <!-- Modal -->
    <div class="modal fade" :id="id" tabindex="-1" role="dialog" :aria-labelledby="id+'ModalLabel'" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" :id="id+'ModalLabel'">Please wait</h5>
                </div>
                <div class="modal-body">
                    <div v-for="(message, k) in messages" :key="k">{{ message }}</div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>

    export default {
        props: ['id', 'messages'],
        data() {
            return {
                showing: false,
                modal: null
            }
        },

        methods: {
            show() {
                console.log(this.modal);
//                $('#' + this.id).modal('show')
            },
            hide() {
                console.log(this.modal);
//                $('#' + this.id).modal('hide')
            }
        },

        mounted() {
//            this.modal = $('#' + this.id).modal({
//                keyboard: false,
//                backdrop: 'static',
//                show: false
//            });
        }
    }

</script>
