<template>
  <div class="container-fluid app-content">
    <div
      v-if="!mobileCheck"
      class="alert alert-warning"
      role="alert"
    >
      This site may have problems functioning on mobile devices.
    </div>
    <div
      v-if="!workerCheck"
      class="alert alert-warning"
      role="alert"
    >
      Your browser doesn't support web workers.
    </div>
    <div
      v-if="!offscreenCanvasCheck"
      class="alert alert-warning"
      role="alert"
    >
      Your browser doesn't support OffscreenCanvas.
    </div>
    <div class="row">
      <image-control
        ref="MySource"
        :class="columnsSource"
        :options="source.options"
        :value="source.values[0]"
        title="Source Image"
        hint="A bigger content image results in a more detailed output, but increases the processing time significantly."
        :size-min="32"
        :size-max="800"
        :is-last="false"
        :removable="false"
        @error="showError('source', $event)"
        @change="changeImage('source', $event)"
        @update-items="updateImages('source', $event)"
      >
        <image-attributes
          v-show="source.values[0].image"
          class="control item"
          title="Stylization Ratio"
          hint="This parameter affects the stylization strength. The further to the right, the stronger the stylization. This is done via interpolation between the style vectors of the content and style images."
          :size-min="0"
          :size-max="100"
          :size="source.values[0].ratio * 100"
          @change="source.values[0].ratio = $event/100.0"
        />
      </image-control>
      <image-control
        v-for="(s, k) in style.values"
        ref="MyStyle"
        :key="k"
        :class="columnsStyle"
        :title="'Style Image #' + k"
        hint="Changing the size of a style image usually affects the texture"
        :size-min="32"
        :size-max="800"
        :options="style.options"
        :value="s"
        :is-last="k == style.values.length-1"
        :removable="style.values.length > 1"
        @change="changeImage('style', $event, k)"
        @update-items="updateImages('style', $event, k)"
        @remove="removeImage(k)"
        @add="addImage()"
        @error="showError('style_'+k, $event)"
      >
        <image-attributes
          v-show="s.image"
          class="control item"
          title="Stylization Strength"
          hint="This parameter affects the strength of the two styles relative to each other. This is done via interpolation between the style vectors of the two style images."
          :size-min="0"
          :size-max="100"
          :size="s.ratio * 100"
          @change="s.ratio = $event/100.0"
        />
      </image-control>
    </div>
    <div class="row bg-light">
      <model-control
        class="col-4"
        title="Dnn backend"
        :models="backends"
        :model="backend"
        @change="changeBackend($event)"
      />
      <model-control
        class="col-4"
        title="Style model"
        :models="models.style"
        :model="model.style"
        :disabled="false"
        @change="changeModel('style', $event)"
      />
      <model-control
        class="col-4"
        title="Transformer model"
        :models="models.transformer"
        :model="model.transformer"
        :disabled="false"
        @change="changeModel('transformer', $event)"
      />
    </div>
    <div class="row">
      <div class="col-12">
        <button
          :class="stylingReady"
          :disabled="!isStylingReady"
          @click="doStyling"
        >
          {{ stateMessage }}
        </button>
      </div>
    </div>
    <result-gallery
      v-show="galleryItems.length"
      :items="galleryItems"
      @remove-item="removeResultItem($event)"
    >
      <result-control
        v-show="1 || resultData"
        ref="output"
        :source-data="resultOptions.sourceData"
        :style-data="resultOptions.styleData"
        :style-model="resultOptions.styleModel"
        :transformer-model="resultOptions.transformerModel"
        :backend="backend"
        class="col-12 center"
        @change="updateResultData($event)"
        @message="setMessage"
        @error="showError('result', $event)"
      />
    </result-gallery>
    <info-overlay
      id="info"
      ref="info"
      :messages="messages"
    />
  </div>
</template>

<script>
    /*eslint no-useless-escape: "off"*/

    import ModelControl from './components/model/control.vue';
    import ImageControl from './components/image/control.vue';
    import ImageAttributes from  './components/image/attribute.vue';
    import InfoOverlay from  './components/overlay.vue';
    import ResultControl from  './components/result.vue';
    import ResultGallery from  './components/gallery.vue';

    import DataTypes from './lib/types.js';

    import AppData from './data/app.js';

    export default {
        name: 'App',

        components: {
            ImageControl,
            ModelControl,
            ImageAttributes,
            InfoOverlay,
            ResultControl,
            ResultGallery
        },

        data() {
            return Object.assign({
                modelReady      : false,// result model is loaded
                mobileCheck     : true,// ability check
                workerCheck     : true,// ability check
                offscreenCanvasCheck : true,// ability check
//                stylingIsReady  : false,//overall state

                resultData      : null,
                resultOptions   : {
                    styleModel      : null,
                    transformerModel: null,
                    styleData       : [],
                    sourceData      : null
                },
                galleryItems: [],
                messages: [],
                stateValues: []// expected actions from user
            }, AppData);
        },

        computed: {
            /**
             * column divider
             */
            columnsStyle() {
                return {
                    'col-md-3': true,
                    'col-xl-2': true,
                };
            },
            columnsSource() {
                return Object.assign({
                    'bg-light': true
                }, this.columnsStyle);
            },

            stylingReady() {
                return {
                    btn: true,
                    'btn-block': true,
                    'btn-success': this.isStylingReady,
                    'btn-secondary': !this.isStylingReady,
                }
            },

            stateMessage() {
                if (this.stateValues.length == 0) {
                    return 'Start Styling';
                } else {
                    return 'Select ' + this.stateValues.join(' and ') + ' before you can continue';
                }
            },

            isStylingReady() {
                var result = true,
                    msgs = [];
                if (!this.source.values[0].image) {
                    msgs.push('Source image');
                    result = false;
                }
                for (var i = 0; i < this.style.values.length; i++) {
                    if (!this.style.values[i].image) {
                        msgs.push(`"Style image #${i}"`);
                        result = false;
                    }
                }
                this.setStateValues(msgs);
                return result;
            }
        },

        created() {
            var that;
            this.workerCheck = window.Worker ? true : false;
            //check for mobile browser which is most likely not supporting this
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
                    that.mobileCheck = false;
                }
            })(navigator.userAgent || navigator.vendor || window.opera);
        },

        mounted() {
            this.offscreenCanvasCheck = ('transferControlToOffscreen' in this.$refs['output'].$refs['out']);
            this.changeModel('style', this.model.style);
            this.changeModel('transformer', this.model.transformer);
            this.resultOptions.styleData = this.style.values.map(e => e.getData(['image']));
            this.resultOptions.sourceData = this.source.values.map(e => e.getData(['image']));
        },

        methods: {
            /**
             * set state messages
             *
             * @param {array} msgs
             * @returns {undefined}
             */
            setStateValues(msgs) {
                this.stateValues = msgs;
            },

            /**
             * changin image and/or its attributes
             *
             * @param {string} type
             * @param {object} values
             * @param {int} styleNr
             * @returns {void}
             */
            changeImage(type, values, styleNr) {
                this._checkType(type);
                styleNr = this._getTypeNumber(styleNr);

                this[type].values[styleNr].setData(values);
                this._updateResultOptionsData(type);
            },
            /**
             * Update options for result from active data
             *
             * @param {string} type
             * @returns {undefined}
             */
            _updateResultOptionsData(type) {
                this.resultOptions[type+'Data'] = this[type].values.map(e => e.getData(['image']));
            },
            /**
             * Removes styling image
             *
             * @param {int} styleNr
             * @returns {void}
             */
            removeImage(styleNr) {
                this.style.values.splice(styleNr, 1);
                this._updateResultOptionsData('style');
            },
            /**
             * Adds styling image
             *
             * @returns {undefined}
             */
            addImage() {
                this.style.values.push(DataTypes.ImageData);
            },

            _getTypeNumber(styleNr) {
                return styleNr === undefined ? 0 : styleNr;
            },

            _checkType(type) {
                if (!['source', 'style'].includes(type)) {
                    new Error(`selection source "${type}" is not defined!`);
                }
            },

            _getModelData(type) {
                let m = this.models[type];
                let v = this.model[type];
                return m[v];
            },

            /**
             * Updates image list
             *
             * @param {array} newImages
             * @param {string} type
             * @returns {undefined}
             */
            updateImages(type, newImages, styleNr) {

                this._checkType(type);
                styleNr = this._getTypeNumber(styleNr);
                type = this[type];
                let images = type.options.images[type.values[styleNr].source];
                images.items = images.items.concat(newImages.items);
                images.names = images.names.concat(newImages.names);
            },

            changeModel(type, modelName) {
                if (modelName == '') {
                    return;
                }
                if (!['style', 'transformer'].includes(type)) {
                    new Error(`model "${type}" is not defined!`);
                }
                this.model[type] = modelName;
                this.resultOptions[type+'Model'] = this._getModelData(type);
            },

            doStyling() {
                this.messages.splice(0, this.messages.length);
                this.resultData = null;
                this.$refs.output.predict();
            },

            showError(src, event) {
//                console.log('error!!!!!!!!!');
//                console.log(src, event)
                this.messages.push(DataTypes.getMessageData('error', event));
                this.$refs.info.dismissable = true;
                this.$refs.info.showError();
            },

            setMessage(message) {
                switch (message) {
                    case 'start':
                        this.$refs.info.dismissable = false;
                        this.$refs.info.show();
                        break;
                    case 'done':
                        if (!this.$refs.info.hasError) {
                            this.$refs.info.hide();
                        }
                        break;
                    default:
                        this.messages.push(DataTypes.getMessageData('info', message));
                        break;
                }
            },
            /**
             *
             * @param {ImageData} image
             * @returns {undefined}
             */
            updateResultData(image) {
                this.galleryItems.push(image);
            },

            /**
             *
             * @param {int} idx
             * @returns {undefined}
             */
            removeResultItem(idx) {
                this.galleryItems.splice(idx,1);
            },
            /**
             *
             * @param {String} type
             * @returns {void}
             */
            changeBackend(type) {
                this.backend = type;
//                this.resultOptions.backend = type;
            }
        }
    }
</script>

<style>
  .app-content > .row {
      padding-top: 1em;
      padding-bottom: 1em;
  }
</style>