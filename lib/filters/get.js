/**
 * Returns one element of list
 *
 * @returns {{type: string, transform: transform}}
 */
module.exports = function() {
    return {
        type: "element",
        transform: function(input, index) {
           return input.eq(index);
        }
    }
}