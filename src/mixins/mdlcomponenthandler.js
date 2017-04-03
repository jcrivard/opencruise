/*************************************************** */
/** methods in this file are used by components via   */
/** ths mixins[] property                             */
/**************************************************** */
var MDLComponentHandler = {
    created: function() {
        this.componentHandler = Object.assign({}, window.componentHandler);
    }
}

export { MDLComponentHandler };
