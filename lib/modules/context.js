/**
 * Do tasks with working context
 *
 * @param {string} level
 * @return null
 */
module.exports = function(level, context) {

    switch(level) {
        case 'reset': this.context(undefined); break;
    }

    return null;
}
