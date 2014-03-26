/**
 * Cleans string deleting whitespaces in sides.
 *
 * @returns {{type: string, transform: transform}}
 */
module.exports = function() {
    return {
        type: "string",
        transform: function(input, args) {
            return input.trim();
        }
    }
}