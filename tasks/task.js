'use strict';

var fs = require('fs');
var path = require('path');

var sortVersions = require('../lib/sort_versions');


module.exports = function(output, target, scrape) {
    return function(cb) {
        console.log('Starting to update ' + target + ' data');

        scrape(function(err, libraries) {
            if(err) {
                console.error('Failed to update ' + target + ' data!', err);

                return cb(err);
            }

            var p = path.join(output, target + '.json');

            libraries = libraries.map(function(library) {
                library.versions = sortVersions(library.versions);
                library.lastversion = library.versions[0];

                return library;
            });

            fs.writeFile(
                p,
                JSON.stringify(libraries),
                function(err) {
                    if(err) {
                        console.error('Failed to write', p);

                        return cb(err);
                    }

                    console.log('Updated', target, 'data');

                    cb();
                }
            );
        });
    };
};
