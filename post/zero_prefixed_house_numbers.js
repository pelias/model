/**
 * Zero prefixed house number post-processing script strips leading zeros from
 * house numbers. eg. house number `001` -> `1`.
 *
 * This functionality was previously handled in elasticsearch
 * using a `removeAllZeroNumericPrefix` filter, see:
 * - https://github.com/pelias/schema/issues/503
 */

const _ = require('lodash');

function housenumber(doc) {
  
  // ensure housenumber is set
  let houseno = doc.getAddress('number');
  if( !_.isString(houseno) || _.isEmpty(houseno) ){ return; }

  // trim leading/trailing whitespace
  houseno = houseno.trim();

  // only applies to housenumbers prefixed with a zero
  if ( houseno.length < 2 || !houseno.startsWith('0') ) { return; }

  // trim leading zeros
  doc.setAddress('number', houseno.replace(/^0+/, ''));
}

module.exports = housenumber;
