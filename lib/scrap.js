var request    = require('request')
    , cheerio  = require('cheerio')
    , _        = require('lodash')
    , Q        = require('q')
    , fs       = require('fs')
    , path     = require('path')
    , _filters = {}
    , _modules = {}

/**
 * Creates a new instance
 *
 * @param {Object}  manifest Manifest Object
 * @return {Object}          Q promise
 * @constructor
 */
function Scrap(manifest) {

    var url        = manifest.url
        , model    = manifest.model
        , that     = this
        , filters  = _filters
        , modules  = _modules
        , current  = undefined
        , ch       = undefined
        , deferred = Q.defer()

    /**
     * Process the model options
     *
     * @private
     */
    var _options = function(def, model) {
        var finalOptions = _.extend(def, model.options);
        delete model.options;

        return finalOptions;
    };

    /**
     * Set or get a new context
     *
     * @param {Object}         newContext
     * @returns {Object|void}
     * @private
     */
    var _context = function(newContext) {
        // Getter
        if(0 === arguments.length) return current;
        // Setter
        current = newContext;
    };

    /**
     * Parses a model in a context
     *
     * @param  {Object} model   Model
     * @param  {Object} context Context
     * @return {Object}         Q promise
     * @private
     */
    var _parse = function(model, currentContext) {

        var promises  = []
            , promise = undefined;

        // Analyse model
        _.forEach(model, function(submodel, attr) {

            // Create new scope for promises
            promise = (function(attr, model, context) {

                var fn, cb

                // Set up working context
                //_context(context);

                // It's a module
                if(attr.substring(0, 1) == '$') {
                    fn   = _module(attr);
                    cb   = function(object) { return object };

                // It's a submodel container, or    (fn parse)
                // It's a string, integer, float... (fn pipe)
                } else {
                    fn = (typeof(model) == 'object') ? _parse : _pipe;
                    cb = function(mixed) { var result = {}; result[attr] = mixed; return result; };
                }

                // Return the promise
                return Q.fcall(function(fn, model, c){

                    return fn.call({
                        context : _context,
                        options : _options,
                        parse   : _parse,
                        pipe    : _pipe,
                        filter  : _filter,
                        cheerio : ch,
                        ch      : ch
                    }, model, c);

                }, fn, model, context).then(cb);

            })(attr, submodel, currentContext);

            // Add promises to execution stack
            promises.push(promise);
        })

        // Return a chain of promises
        return Q.all(promises).spread(function() {

            var result = {};

            for(var i = 0; i < arguments.length; i++) {
                //
                if(arguments[i] instanceof Array) return arguments[i];
                _.extend(result, arguments[i]);
            }

            return result;
        });
    }

    /**
     * Transform a result passing filters
     *
     * @param string
     * @param context
     * @returns {*}
     * @private
     */
    var _pipe = function(string, context) {

        var pattern
            , commands
            , parts
            , query
            , pipe
            , filter
            , args
            , result = undefined
            , input

        // There isn't pipes
        if(-1 === string.indexOf('|')) return string;

        if(undefined === context) {
            context = _context();
        }

        // Extract pipes and query
        commands = string.split('|');
        query    = commands[0].trim();

        // Check if a current context query
        if(/^(this)$/i.test(query)) {

            input = this.cheerio(context);

        }
        // Check if is a DOM query
        else if(/^([.#_><:\-\(\) a-z0-9]+)$/i.test(query)) {

            if(!_.isUndefined(context)) {
                context = this.cheerio(context)
            }

            input = this.cheerio(query, context);
        }
        // Check is a global variable query
//      else if (/^(time)$/i.test(query)) {

            //input = '';

//      }
        else {

            return string;
        }

        result = input;
        pipe   = new RegExp('^ ?([a-z]+) ?([a-z0-9-]+)? ?$', 'i');

        for(var i = 1; i < commands.length; i++) {

            // The pipe is broken, return all as string
            if(!pipe.test(commands[i])) return string;

            // Divide pipe in small parts
            parts  = pipe.exec(commands[i]);
            filter = this.filter(parts[1]);
            args   = parts[2]; // TODO array of args, pass with apply

            result = filter.transform(result, args);
        }

        return result;
    }

    /**
     * Get a filter
     *
     * @param name
     * @returns {*}
     * @private
     */
    var _filter = function(name) {

        if(_.isUndefined(filters[name])) {
            throw 'The filter "' + name +'" does not exists or is not loaded';
        }

        if(!_.isFunction(filters[name].transform)) {
            throw 'The filter is no valid';
        }

        return filters[name];
    }

    /**
     * Get a module
     *
     * @param name     Module
     * @returns {*}
     * @private
     */
    var _module = function(name) {

        if(_.isUndefined(modules[name])) {
            throw 'The module "' + name +'" does not exists or is not loaded';
        }

        return modules[name];
    }

    var _log = function(log, type) {
        console.log(log);
    }

    // Get page and parse with model
    request(url, function(err, resp, body) {

        // Handle request errors
        if (err) return callback(err, null);
        if (!resp) return callback(new Error('No error and no response.'), null);
        if (resp.statusCode !== 200) return callback(new Error('HTTP response code is ' + resp.statusCode), null);

        // Handle server response
        ch = cheerio.load(body);

        // Parse the model and submodels
        _parse(model, undefined).done(function(result) {
            deferred.resolve(result);
        });
    });

    return deferred.promise;
};

exports.Scrap = Scrap;


exports.filter = function(filter, name) {
    _filters[name] = filter;
}

exports.module = function(module, name) {
    _modules['$' + name] = module;
}

// Load default filters
_.forEach(fs.readdirSync(__dirname + '/filters/'), function(filterName) {

    filterName = path.basename(filterName, '.js');
    var f = require('./filters/' + filterName)();

    // Add module
    exports.filter(f, filterName)
})

// Load default modules
_.forEach(fs.readdirSync(__dirname + '/modules/'), function(moduleName) {

    moduleName = path.basename(moduleName, '.js');
    var m = require('./modules/' + moduleName);

    // Add module
    exports.module(m, moduleName)
})