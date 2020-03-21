export default {
    get ImageData() {
        return {
            size: 420,
            smooth: true,
            square: false,
            source: 'stored',
            image: null,
            imageIdx: null, //selection index
            ratio: 0.5,
            setData(value) {
                if (value.size     !== undefined) this.size     = value.size;
                if (value.smooth   !== undefined) this.smooth   = value.smooth;
                if (value.square   !== undefined) this.square   = value.square;
                if (value.source   !== undefined) this.source   = value.source;
                if (value.image    !== undefined) this.image    = value.image;
                if (value.imageIdx !== undefined) this.imageIdx = value.imageIdx;
            }
        };
    },

    get ImageSourceData() {
        return {
            items: [],
            names: []
        };
    }
}