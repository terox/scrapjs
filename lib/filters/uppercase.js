/**
 * Convert a string to uppercase.
 *
 * @returns {{type: string, transform: transform}}
 */
module.exports = function() {
    return {
        type: "string",
        transform: function(input, args) {
            return input.toUpperCase();
        }
    }
}