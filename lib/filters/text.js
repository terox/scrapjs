var _ = require('lodash');

/**
 * Returns text of element node (without HTML tags).
 *
 * @returns {{type: string, transform: transform}}
 */
module.exports = function() {
    return {
        type: "element",
        transform: function(input, args) {

            if(_.isString(input)) return input;

            return input.text();
        }
    }
}