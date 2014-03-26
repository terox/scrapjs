/**
 * Returns the content of element attribute
 *
 * @returns {{type: string, transform: transform}}
 */
module.exports = function() {
    return {
        type: "element",
        transform: function(input, arg) {
            return input.attr(arg);
        }
    }
}