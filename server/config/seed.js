'use strict';

var Schema = require('../api/schema/schema.model');

Schema.find({}).remove(function() {
  Schema.create({
    symmetry: 'none',
    type: '9x9',
    values: '600092000100300400008004050080600040009170000000040905090000300850036000000001092',
    score: 185
  }, function() {
      console.log('finished populating schemas');
  })
});
