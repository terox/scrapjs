var assert      = require('assert')
    cheerio     = require('cheerio')
    , uppercase = require('../lib/filters/uppercase')()
    , lowercase = require('../lib/filters/lowercase')()
    , trim      = require('../lib/filters/trim')()
    , attr      = require('../lib/filters/attr')()
    , text      = require('../lib/filters/text')()


describe('Filters', function() {

    var string   = '  My Small String  ';
    var aElement = '<a href="http://www.wikipedia.org/" title="The Wikipedia!"></a>'
    var pElement = '<p>My <b>small</b> <i>string</i></p>'

    describe('#uppercase()', function() {

        it('the filter type should be "string"', function() {
            assert.equal(uppercase.type, 'string', 'Ok');
        });

        it('should return an uppercase string', function() {
            assert.equal(uppercase.transform(string), '  MY SMALL STRING  ', 'Ok');
        });

    });

    describe('#lowercase()', function() {

        it('the filter type should be "string"', function() {
            assert.equal(lowercase.type, 'string', 'Ok');
        });

        it('should return a lowercase string', function() {
            assert.equal(lowercase.transform(string), '  my small string  ', 'Ok');
        });

    });

    describe('#trim()', function() {

        it('the filter type should be "string"', function() {
            assert.equal(trim.type, 'string', 'Ok');
        });

        it('should return string without whitespaces in sides', function() {
            assert.equal(trim.transform(string), 'My Small String', 'Ok');
        });

    });

    describe('#attr()', function() {

        var element = cheerio(aElement);

        it('the filter type should be "element"', function() {
            assert.equal(attr.type, 'element', 'Ok');
        });

        it('should return correct attribute value in DOM element', function() {
            assert.equal(attr.transform(element, 'href'), 'http://www.wikipedia.org/', 'Ok');
            assert.equal(attr.transform(element, 'title'), 'The Wikipedia!', 'Ok');
        });

    });

    describe('#text()', function() {

        var element = cheerio(pElement);

        it('the filter type should be "element"', function() {
            assert.equal(text.type, 'element', 'Ok');
        });

        it('should return only a text without HTML tags', function() {
            assert.equal(text.transform(element), 'My small string', 'Ok');
        });
    });
})
