/**
 * Convert a string to lowercase.
 *
 * @returns {{type: string, transform: transform}}
 */
module.exports = function() {
    return {
        type: "string",
        transform: function(input, args) {
            return input.toLowerCase();
        }
    }
}