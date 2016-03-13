'use strict';

var Schema = require('../api/schema/schema.model');
Schema.find({}).remove(function() {
  Schema.create({
    symmetry: 'none',
    dimension: '9',
    x: false,
    values: '000080000049600010002010409306700020000000000020008304601020700090001250000070000'
  },{
    symmetry: 'none',
    dimension: '9',
    x: false,
    values: '030000040900150800000039000790800520560000087028007014000980000007013008010000050'
  },{
    symmetry: 'none',
    dimension: '9',
    x: false,
    values: '000002000040500700516000240000026000890000072000840000069000183003007020000100000'
  },{
    symmetry: 'none',
    dimension: '9',
    x: false,
    values: '005030170073016000400900000300000060004000900020000003000009002000650390037020500'
  },{
    symmetry: 'none',
    dimension: '9',
    x: false,
    values: '000070008007200003630850090060000005200643001900000060050068012100002700700030000'
  },{
    symmetry: 'none',
    dimension: '9',
    x: false,
    values: '000000000000096020007080035201068700003000500009450103830040200040910000000000000'
  }, function() {
      console.log('finished populating schemas');
  })
});
