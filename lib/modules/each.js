var Q        = require('q');
var toptions = require('../tools/options');

var pattern = {
    chain: 'boolean',
    delay: '^[0-9]+$'
};

var defaultOptions = {
    chain: false,
    delay: 0
};

/**
 * Iterate in a collection of elements
 *
 * Available options:
 * - chain: false (By default)
 * - delay: 0     (By default. In ms, only if chain is true)
 *
 * @param  {Object} model   Model
 * @param  {Object} context Context
 * @return {Array}
 */
module.exports = function(model) {

    var that       = this
        , options  = toptions(pattern).merge(defaultOptions, model.__options)
        , promises = []
        , promise  = Q()

    // Options mustn't be parsed
    delete model.__options;

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