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
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5
            :id="id+'ModalLabel'"
            class="modal-title"
          >
            Please wait
          </h5>
        </div>
        <div class="modal-body">
          <div
            v-for="(message, k) in messages"
            :key="k"
          >
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

    export default {
        props: {
          id: { type: String, default: null },
          messages: { type: Array, default: null }
        },
        data() {
            return {
                showing: false,
                modal: null,
                actionQueue: []
            }
        },

        mounted() {
            this.modal = $('#' + this.id).modal({//eslint-disable-line
                show: false,
                keyboard: false,
                backdrop: 'static'
            });
            this.modal
            .on('hidden.bs.modal', function () {
                this.showing = false;
                if (this.actionQueue.length) {
                    (this.actionQueue.pop())();
                }
            }.bind(this))
            .on('shown.bs.modal', function () {
                this.showing = true;
                if (this.actionQueue.length) {
                    (this.actionQueue.pop())();
                }
            }.bind(this));
        },

        destroyed() {
            this.modal.modal('dispose');
        },

        methods: {
            show() {
                this.modal.modal({
                    keyboard: false,
                    backdrop: 'static'
                });
                if (!this.showing) {
                  this.modal.modal('show');
                } else {
                    this.actionQueue.push(function () { this.modal.modal('show'); }.bind(this));
                }
            },
            hide() {
                if (this.showing) {
                    this.modal.modal('hide');
                } else {
                    this.actionQueue.push(function () { this.modal.modal('hide'); }.bind(this));
                }
            },
            showError() {
                console.log('error')
                this.hide();
                this.modal.modal({
                    keyboard: true,
                    backdrop: 'true'
                });
                this.show();
            }
        }
    }

</script>
