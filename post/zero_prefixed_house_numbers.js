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
  const replacement = houseno.replace(/^0+/, '') || '0';

  // update housenumber
  doc.setAddress('number', replacement);

  //  update address 'name' fields
  names(doc, houseno, replacement);
}

function names(doc, houseno, replacement) {
  // only records on the address layer have the housenumber in the name.
  if( doc.getLayer() !== 'address' ){ return; }

  // ensure street is set
  let street = doc.getAddress('street');
  if( !_.isString(street) || _.isEmpty(street) ){ return; }

  // load name data. ie: an object keyed by language codes, each value is an array of names
  if (!_.isPlainObject(doc.name)) { return; }

  // $houseno must be surrounded by whitespace or start/end of text
  const regexp = new RegExp('\\b' + _.escapeRegExp(houseno) + '\\b');

  // iterate over all languages
  _.each(doc.name, (names, lang) => {
    if (_.isEmpty(names)) { return; }

    // replace house number in name fields
    const replaced = _.castArray(names).map(name => name.replace(regexp, replacement));

    // update lang
    doc.name[lang] = _.size(replaced) === 1 ? _.first(replaced) : replaced;
  });
}

module.exports = housenumber;
