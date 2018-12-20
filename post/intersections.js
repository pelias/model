const _ = require('lodash');

const INTERSECTION_LAYER_NAME = 'intersection';
const ADDRESS_STREET_PROP = 'street';
const ADDRESS_CROSS_STREET_PROP = 'cross_street';

function intersections(){

  // only apply to docs from the intersection layer
  if( this.getLayer() !== INTERSECTION_LAYER_NAME ){ return; }

  // ensure both street & cross street props are set
  let street = this.getAddress(ADDRESS_STREET_PROP);
  if( !_.isString(street) || _.isEmpty(street) ){ return; }
  
  let cross_street = this.getAddress(ADDRESS_CROSS_STREET_PROP);
  if( !_.isString(cross_street) || _.isEmpty(cross_street) ){ return; }

  // generate name aliases for the intersection based on common syntactic variations.
  // note: currently only english is supported, PRs for additional languages welcome.

  // corner of A & B
  this.setNameAlias('default', `${street} & ${cross_street}`);
  this.setNameAlias('default', `${street} @ ${cross_street}`);
  this.setNameAlias('default', `${street} at ${cross_street}`);
  this.setNameAlias('default', `Corner of ${street} & ${cross_street}`);
  
  // corner of B & A
  this.setNameAlias('default', `${cross_street} & ${street}`);
  this.setNameAlias('default', `${cross_street} @ ${street}`);
  this.setNameAlias('default', `${cross_street} at ${street}`);
  this.setNameAlias('default', `Corner of ${cross_street} & ${street}`);
}

module.exports = intersections;