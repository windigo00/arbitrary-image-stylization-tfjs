<template>
  <!-- Modal -->
  <div
    :id="id"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    :aria-labelledby="id+'ModalLabel'"
    aria-hidden="true"
  >
    <div
      :class="modalSize"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <slot name="header" />
          <button
            v-if="dismissable"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">
              &times;
            </span>
          </button>
        </div>
        <div :class="modalContent">
          <slot name="content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

    export default {
        props: {
            id: { type: String, default: null },
            size: { type: String, default: null },
            center: { type: Boolean, default: null }
        },
        data() {
            return {
                transiting: false,
                modal: null,
                dismissable: false,
                actionQueue: []
            }
        },

        computed: {
            modalSize() {
                return {
                    'modal-dialog': true,
                    'modal-lg'    : this.size === 'lg',
                    'modal-sm'    : this.size === 'sm',
                };
            },
            modalContent() {
                return {
                    'modal-body'  : true,
                    'text-center' : this.center,
                };
            }
        },

        mounted() {
            this.modal = $('#' + this.id).modal({//eslint-disable-line
                show: false,
                keyboard: false,
                backdrop: 'static'
            });
            this.modal
            .on('hide.bs.modal', function () { this.transiting = true; }.bind(this))
            .on('hidden.bs.modal', function () { this.transiting = false; this.runQueue();}.bind(this))
            .on('show.bs.modal', function () { this.transiting = true; }.bind(this))
            .on('shown.bs.modal', function () { this.transiting = false; this.runQueue(); }.bind(this));
        },

        destroyed() {
            this.modal.modal('dispose');
        },

        methods: {

            runQueue() {
                if (this.actionQueue.length) {
                    (this.actionQueue.shift())();
                }
            },

            show(options) {
//              console.log('showing');
//              console.log(options);
                if (!options) {
                    options = {
                        show: true,
                        keyboard: false,
                        backdrop: 'static'
                    };
                }
                this.modal.modal(options);

                if (this.transiting) {
                    this.actionQueue.push(function () { this.modal.modal('show'); }.bind(this));
                } else {
                    this.modal.modal('show');
                }
            },
            hide() {
//              console.log('hiding');
                if (this.transiting) {
                    this.actionQueue.push(function () { this.modal.modal('hide'); }.bind(this));
                } else {
                    this.modal.modal('hide');
                }
            },
            showError() {
//                console.log('error')
                if (this.transiting) {
                    this.actionQueue.push(function () {
                        this.show({
                            show: true,
                            keyboard: true,
                            backdrop: 'true'
                        });
                    }.bind(this));
                } else {
                    this.show({
                        show: true,
                        keyboard: true,
                        backdrop: 'true'
                    });
                }
            }
        }
    }

</script>
