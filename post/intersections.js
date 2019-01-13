const _ = require('lodash');

const INTERSECTION_LAYER_NAME = 'intersection';
const ADDRESS_STREET_PROP = 'street';
const ADDRESS_CROSS_STREET_PROP = 'cross_street';

function intersections( doc ){

  // only apply to docs from the intersection layer
  if( doc.getLayer() !== INTERSECTION_LAYER_NAME ){ return; }

  // ensure both street & cross street props are set
  let street = doc.getAddress(ADDRESS_STREET_PROP);
  if( !_.isString(street) || _.isEmpty(street) ){ return; }
  
  let cross_street = doc.getAddress(ADDRESS_CROSS_STREET_PROP);
  if( !_.isString(cross_street) || _.isEmpty(cross_street) ){ return; }

  // generate name aliases for the intersection based on common syntactic variations.
  // note: currently only english is supported, PRs for additional languages welcome.

  // corner of A & B
  doc.setNameAlias('default', `${street} & ${cross_street}`);
  doc.setNameAlias('default', `${street} @ ${cross_street}`);
  doc.setNameAlias('default', `${street} at ${cross_street}`);
  doc.setNameAlias('default', `Corner of ${street} & ${cross_street}`);
  
  // corner of B & A
  doc.setNameAlias('default', `${cross_street} & ${street}`);
  doc.setNameAlias('default', `${cross_street} @ ${street}`);
  doc.setNameAlias('default', `${cross_street} at ${street}`);
  doc.setNameAlias('default', `Corner of ${cross_street} & ${street}`);
}

module.exports = intersections;