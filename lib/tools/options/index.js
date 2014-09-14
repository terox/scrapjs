var _         = require('lodash')
    , tlogger = require('../logger')

/**
 * Process the model custom options
 *
 * @param  {Object} pattern  Custom options
 * @param  {Object} current Current options
 * @return {Object}         New options object
 * @private
 */
module.exports = function(pattern) {

    var options = {}
        , integrity

    /**
     * Check integrity
     *
     * @param options
     * @private
     */
    var _check = function(options) {

        _.forEach(options, function(value, key) {

            integrity = _.isUndefined(pattern[key]) ? false : true;

            if(integrity) {

                switch(pattern[key]) {

                    // Boolean validator
                    case 'boolean':
                        if(true !== value && false !== value) {
                            throw 'The option "' + key + '" must be a boolean value';
                        }
                        break;

                    // RegEx validator
                    default:
                        if(!(new RegExp(pattern[key])).test(value)) {
                            throw 'The option "' + key + '" with value "' + value + '" has not a correct format.';
                        }
                }

            } else {
                tlogger.log('Ignored ' + key);
            }
        });
    }

    /**
     * Merge options with integrity check
     *
     * @param arg1, arg2,... argn
     * @private
     */
    var _merge = function() {

        _.forEach(arguments, function(object) {

            _check(object);
            options = _.extend(options, object);

        });

        return options;
    }

    return {
        merge : _merge
    }
};