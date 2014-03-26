var Q    = require('q')
 , Scrap = require('../scrap').Scrap

/**
 * Follows and load a link content.
 *
 * The manifest.url is procesed like a pipe (you can do querys to current context)
 *
 * @param {Object} manifest Manifest Object
 * @param {Object} context  Context Object
 * @returns {Q.promise}
 */
module.exports = function(manifest, context, other) {

    manifest.url = this.pipe(manifest.url, context);

    var deferred = Q.defer();

    (new Scrap(manifest)).done(function(result) {
        deferred.resolve(result)
    })

    return deferred.promise;
}