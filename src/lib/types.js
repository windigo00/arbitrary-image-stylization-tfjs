export default {
    getImageData(options) {
        if (!options) {
            options = {};
        }
        return Object.assign(this.ImageData, options);
    },
    get ImageData() {
        return new ImageData;
    },
    getMessageData(type, content) {
        return new MessageData(type, content);
    },

    get ImageSourceData() {
        return {
            items: [],
            names: []
        };
    }
}

class ImageData {
    constructor() {
        this.size     = 42;
        this.smooth   = false;
        this.square   = true;
        this.source   = 'stored';
        this.image    = null;
        this.resampled= null;//resampled image
        this.imageIdx = null; //selection index
        this.ratio    = 0.5;
    }

    setData(value) {
        for(var i in value) {
            this[i] = value[i];
        }
    }
    getData(exclude) {
//        console.log(arguments);
        let ret = {};
        for(var i in this) {
            if (exclude && exclude.includes(i)) continue;
            ret[i] = this[i];
        }
        return ret;
    }
}

class MessageData {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}