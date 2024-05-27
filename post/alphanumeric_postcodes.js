const _ = require('lodash');
const ADDRESS_LAYER_NAME = 'address';
const ALPHANUMERIC_POSTCODE = /^([0-9]{4})(\s*)([A-Za-z]{2})$/;

/**
 * Alphanumeric postcodes post-processing script ensures that both the expanded
 * and contracted version of alphanumeric postcodes are indexed.
 *
 * Without this script a postcode such as '1383GN' would not be matched to the
 * query '1383'.
 * 
 * The script is intended to detect these alphanumeric postcodes and index both
 * permutations, ie. '1383GN' = ['1383GN', '1383 GN'].
 * 
 * The inverse case should also be covered. ie. '1383 GN' = ['1383 GN', '1383GN'].
 * 
 * Note: the regex is currently restrictive by design, the UK for instance uses
 * alphanumeric postcodes in the format 'E81DN' which could cause error when splitting
 * with this method, they are currently ignored. Future work should consider global
 * postcode formats.
 * 
 * Note: this script is intended to run *before* the 'deduplication' post processing
 * script so that prior aliases don't generate duplicate terms.
 */

function postcodes( doc ){

  // only apply to docs from the address layer
  if( doc.getLayer() !== ADDRESS_LAYER_NAME ){ return; }

  // ensure postcode is set
  let postcode = doc.getAddress('zip');
  if( !_.isString(postcode) || _.isEmpty(postcode) ){ return; }

  // ensure postcode is alphanumeric
  let matches = postcode.match(ALPHANUMERIC_POSTCODE);
  if( !Array.isArray( matches ) || matches.length !== 4 ){ return; }

  // generate postcode aliases for the postcode.
  let [ , numeric, spaces, alpha ] = matches;

  // detect if the existing postcode is expanded or not
  if ( spaces.length ) {
    doc.setAddressAlias('zip', `${numeric}${alpha}`); // add contracted form as alias
  } else {
    doc.setAddressAlias('zip', `${numeric} ${alpha}`); // add expanded form as alias
  }
}

module.exports = postcodes;