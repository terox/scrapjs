/**
 * Makes DOM query into current context
 *
 * @param {String} query Query
 * @return null
 */
module.exports = function(query, context) {

    var current = this.cheerio(query, this.context())
    this.context(current);

    return null;
}