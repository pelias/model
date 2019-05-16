/**
 * Deduplication post-processing script ensures that array
 * values only contain unique entries.
 */

const _ = require('lodash');
const prefixes = [ 'name', 'address_parts' ];

function deduplication( doc ){
  prefixes.forEach(prefix => {
    let index = doc[prefix];
    if ( _.isPlainObject( index ) ){
      for( let field in index ){
        let values = index[field];
        if( _.isArray( values ) && values.length > 1 ){
          index[field] = _.uniq(values);
        }
      }
    }
  });
}

module.exports = deduplication;