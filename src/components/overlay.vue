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
            {{ hasError ? 'Error' : 'Please wait' }}
          </h5>
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
        <div class="modal-body">
          <ul class="list-group">
            <li
              v-for="(message, k) in messages"
              :key="k"
              :class="messageClass(message.type)"
            >
              <span
                v-if="k == (messages.length-1) && message.type != 'error'"
                class="float-right"
              >
                <i class="fas fa-cog fa-spin" />
              </span>
              {{ message.content }}
            </li>
          </ul>
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
                transiting: false,
                modal: null,
                dismissable: false,
                actionQueue: []
            }
        },

        computed: {
            hasError() {
                for(var i = 0, max = this.messages.length; i < max; i++) {
                    if (this.messages[i].type === 'error') {
                        return true;
                    }
                }
                return false;
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

            messageClass(type) {
                return {
                    'list-group-item'       : true,
                    'list-group-item-danger': type == 'error',
//                    'alert-info'  : type == 'info'
                };
            },

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
