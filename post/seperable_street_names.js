const _ = require('lodash');
const TARGET_LAYERS = [ 'street', 'address', 'intersection' ];
const expansions = require('./_expansions.json');
const contractions = require('./_contractions.json');

function expand(str, mapping) {
  let tokens = str.split(' ');
  for( let i=0; i<tokens.length; i++ ){
    let token = tokens[i].toLowerCase();
    for( let suffix in mapping ){
      if( token.length > suffix.length && token.endsWith( suffix ) ){
        tokens[i] = tokens[i].slice(0, -suffix.length); // remove chars from current token
        tokens.splice(i + 1, 0, _.upperFirst(mapping[suffix])); // add street token
        i++;
        break;
      }
    }
  }
  return tokens.join(' ');
}

function contract(str, mapping) {
  let tokens = str.split(' ');
  for( let i=0; i<tokens.length; i++ ){
    let token = tokens[i].toLowerCase();
    for( let match in mapping ){
      if( token === match ){
        tokens.splice(i, 1); // remove current token
        tokens[i-1] += mapping[match]; // add chars to previous token
        i--;
        break;
      }
    }
  }
  return tokens.join(' ');
}

function expandAllFields(doc, mapping){

  // index expanded version of default name
  const name = doc.getName('default');
  if (_.isString(name) && !_.isEmpty(name)) {
    const expanded = expand(name, mapping);
    if (_.isString(expanded) && !_.isEmpty(expanded) && (name !== expanded)) {
      doc.setNameAlias('default', expanded);
    }
  }

  // index expanded version of street name
  const street = doc.getAddress('street');
  if (_.isString(street) && !_.isEmpty(street)) {
    const expanded = expand(street, mapping);
    if (_.isString(expanded) && !_.isEmpty(expanded) && (street !== expanded)) {
      doc.setAddressAlias('street', expanded);
    }
  }

  // index expanded version of cross_street name
  const cross_street = doc.getAddress('cross_street');
  if (_.isString(cross_street) && !_.isEmpty(cross_street)) {
    const expanded = expand(cross_street, mapping);
    if (_.isString(expanded) && !_.isEmpty(expanded) && (cross_street !== expanded)) {
      doc.setAddressAlias('cross_street', expanded);
    }
  }
}

function contractAllFields(doc, mapping) {

  // index expanded version of default name
  const name = doc.getName('default');
  if (_.isString(name) && !_.isEmpty(name)) {
    const contracted = contract(name, mapping);
    if (_.isString(contracted) && !_.isEmpty(contracted) && (name !== contracted)) {
      doc.setNameAlias('default', contracted);
    }
  }

  // index contracted version of street name
  const street = doc.getAddress('street');
  if (_.isString(street) && !_.isEmpty(street)) {
    const contracted = contract(street, mapping);
    if (_.isString(contracted) && !_.isEmpty(contracted) && (street !== contracted)) {
      doc.setAddressAlias('street', contracted);
    }
  }

  // index contracted version of cross_street name
  const cross_street = doc.getAddress('cross_street');
  if (_.isString(cross_street) && !_.isEmpty(cross_street)) {
    const contracted = contract(cross_street, mapping);
    if (_.isString(contracted) && !_.isEmpty(contracted) && (cross_street !== contracted)) {
      doc.setAddressAlias('cross_street', contracted);
    }
  }
}

function post(doc) {

  // only apply to docs from the street & address layers
  if( !TARGET_LAYERS.includes( doc.getLayer() ) ) { return; }

  // detect document country code
  let docCountryCode = _.get(doc, 'parent.country_a[0]');
  if( !_.isString(docCountryCode) || docCountryCode.length !== 3 ) { return; }

  // expansions
  let mapping_expansions = expansions[docCountryCode.toUpperCase()];
  if( _.isObject( mapping_expansions ) ) {
    expandAllFields(doc, mapping_expansions);
  }

  // contractions
  let mapping_contractions = contractions[docCountryCode.toUpperCase()];
  if( _.isObject( mapping_contractions ) ) {
    contractAllFields(doc, mapping_contractions);
  }
}

module.exports = {
  post: post,
  expansions: expansions,
  expand: expand,
  expandAllFields: expandAllFields,
  contractions: contractions,
  contract: contract,
  contractAllFields: contractAllFields
};