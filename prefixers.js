/* Results on io.js 2.4, Fedora 21, Intel 5Y70, 8 GB RAM and SSD:

Autoprefixer: 74 ms
Stylecow:     92 ms   (1.2 times slower)
nib:          392 ms  (5.3 times slower)
Compass:      2467 ms (33.2 times slower)
*/

var exec = require('child_process').exec;
var path = require('path');
var fs   = require('fs');

var example = path.join(__dirname, 'cache', 'bootstrap.css');
var css     = fs.readFileSync(example).toString();

// Autoprefixer
var autoprefixer = require('autoprefixer-core');
var postcss      = require('postcss');

css = postcss([ autoprefixer({ browsers: [] }) ]).process(css).css;
var processor = postcss([ autoprefixer ]);

// Stylecow
var stylecow = require('stylecow-core');
stylecow.loadNpmModule('stylecow-plugin-prefixes');

// nib
var stylus = require('stylus');
var styl = "@import 'nib';\n" + css
    .replace('@charset "UTF-8";', '')
    .replace(/\}/g, '}\n').replace(/(\w)\[[^\]]+\]/g, '$1')
    .replace(/filter:[^;}]+;?/ig, '')
    .replace(/(@keyframes[^\{]+)\{/ig, '$1 {')
    .replace(/url\([^\)]+\)/ig, 'white');

// Compass
var scss = "@import 'compass/css3';\n" + css
    .replace(/([^-])transform:([^;}]+)(;|})/g, '$1@include transform($2)$3')
    .replace(/transition:([^;}]+)(;|})/g, '@include transition($1)$2')
    .replace(/background(-image)?:((linear|radial)([^;}]+))(;|})/g,
            '@include background($2)$5')
    .replace(/box-sizing:([^;}]+)(;|})/g, '@include box-sizing($1)$2');
var scssFile = path.join(__dirname, 'cache/bootstrap.prefixers.scss');
fs.writeFileSync(scssFile, scss);

module.exports = {
    name: 'Bootstrap',
    maxTime: 15,
    tests: [
        {
            name: 'Autoprefixer',
            defer: true,
            fn: function (done) {
                processor.process(css, { map: false }).then(function () {
                    done.resolve();
                });
            }
        },
        {
            name: 'Stylecow',
            defer: true,
            fn: function (done) {
                var code = stylecow.parse(css);
                stylecow.run(code);
                done.resolve();
            }
        },
        {
            name: 'nib',
            defer: true,
            fn: function (done) {
                stylus(styl)
                    .include(require('nib').path)
                    .render(function (err) {
                        if ( err ) throw err;
                        done.resolve();
                    });
            }
        },
        {
            name: 'Compass',
            defer: true,
            fn: function (done) {
                var command = 'sass -C --compass --sourcemap=none ' + scssFile;
                var dir = __dirname;
                exec('cd ' + dir + '; bundle exec ' + command,
                    function (error, stdout, stderr) {
                        if ( error ) throw stderr;
                        done.resolve();
                    });
            }
        }
    ]
};
