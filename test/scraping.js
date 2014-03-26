var http     = require('http')
    , fs     = require('fs')
    , Scrap  = require('../lib/scrap').Scrap
    , assert = require('assert')

http.createServer(function (req, res) {

    try {

        res.writeHead(200, {'Content-Type': 'text/html'});

        var body = fs.readFileSync('./test/html' + req.url, {
            encoding: 'utf-8',
            flag: 'r'
        });

        res.end(body);

    } catch(e) {

        res.writeHead(404, {'Content-Type': 'text/html'});

        res.end('<h1>404</h1>');
    }

}).listen(1338, '127.0.0.1');



var manifest1 = {
    url: 'http://127.0.0.1:1338/example1.html',
    model: {
        browsers: {
            $query: '#browsers li',
            $each: {
                name     : 'this | text',
                company  : 'this | attr data-company | uppercase',
                company  : 'this | attr data-company | uppercase',
                website  : 'a | attr href',
                features : {
                    $follow: {
                        url   : 'a | attr href',
                        model : {
                            $query    : '#features',
                            feature_1 : ':nth-child(1) | text',
                            feature_2 : ':nth-child(2) | text',
                            feature_3 : ':nth-child(3) | text',
                            feature_4 : ':nth-child(4) | text',
                            feature_5 : 'Powerful engines!',
                            comments: {
                                $context : 'reset',
                                comment1 : '#comments p:nth-child(2) | text'
                            }
                        }
                    }
                }
            }
        }
    }
}

describe('Scrapjs', function(done) {

    var r;

    beforeEach(function(done){
        var scrap = new Scrap(manifest1);
        scrap.done(function(results) {
            r = results;
            done();
        });
    })

    describe('#Connection', function() {


    });

    describe('#Manifests', function() {

        it('should list browsers', function() {

            // Chrome
            assert.equal(r.browsers[0].name, 'Chrome');
            assert.equal(r.browsers[0].company, 'GOOGLE');
            assert.equal(r.browsers[0].website, 'http://127.0.0.1:1338/example2.html');

            // Mozilla
            assert.equal(r.browsers[1].name, 'Firefox');
            assert.equal(r.browsers[1].company, 'MOZILLA');
            assert.equal(r.browsers[1].website, 'http://127.0.0.1:1338/example2.html');

            // Safari
            assert.equal(r.browsers[2].name, 'Safari');
            assert.equal(r.browsers[2].company, 'APPLE');
            assert.equal(r.browsers[2].website, 'http://127.0.0.1:1338/example2.html');

            // Opera
            assert.equal(r.browsers[3].name, 'Opera');
            assert.equal(r.browsers[3].company, 'OPERA SOFTWARE');
            assert.equal(r.browsers[3].website, 'http://127.0.0.1:1338/example2.html');

        });

        it('should follow the links', function(){

            assert.equal(r.browsers[0].features.feature_1, 'Modern');
            assert.equal(r.browsers[0].features.feature_2, 'Fast');
            assert.equal(r.browsers[0].features.feature_3, 'HTML5');
            assert.equal(r.browsers[0].features.feature_4, 'CSS3');
            assert.equal(r.browsers[0].features.feature_5, 'Powerful engines!');

        })

        it('should reset the context', function(){

            assert.equal(r.browsers[0].features.comments.comment1, 'Download one today!');

        })

    })
})

// Custom modules

// Custome filters*/