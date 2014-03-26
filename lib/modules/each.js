var Q = require('q');

var defaultOptions = {
    chain: false,
    delay: "0"
}

/**
 * Iterate in a collection of elements
 *
 * Avaible options:
 * - chain: false (By default)
 * - delay: 0     (By default. In ms, only if chain is true)
 *
 * @param  {Object} model   Model
 * @param  {Object} context Context
 * @return {Array}
 */
module.exports = function(model) {

    var that       = this
        , options  = this.options(defaultOptions, model)
        , promises = []
        , promise  = Q()

    this.cheerio(this.context()).each(function(i, element) {

        promise = (function(that, options, model, e){

            if(options.chain) {
                return promise.then(function() {
                    return that.parse(model, e);
                }).delay(options.delay);

            } else {
                return that.parse(model, e);
            }

        })(that, options, model, element)

        // Add to execution stack
        promises.push(promise);
    });

    return Q.all(promises).spread(function(){
        var result = [];

        for(var i = 0; i < arguments.length; i++) {
            result.push(arguments[i]);
        }

        return result;
    });
}