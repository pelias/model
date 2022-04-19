/**
 * Deduplication post-processing script ensures that array
 * values only contain unique entries.
 */

const _ = require('lodash');
const prefixes = ['name', 'address_parts'];
const punctuation = /[\.]+/g;
const normalize = (v) => _.isString(v) ? _.replace(v.toLowerCase(), punctuation, '') : v;

// if values are strings then apply a string
// normalization function to both strings.
const comparitor = (value, other) => {
  return _.isEqual(normalize(value), normalize(other));
};

function deduplication(doc) {
  prefixes.forEach(prefix => {
    let index = doc[prefix];
    if (_.isPlainObject(index)) {
      for (let field in index) {
        let values = index[field];
        if (_.isArray(values) && values.length > 1) {
          index[field] = _.uniqWith(values, comparitor);
        }
      }
    }
  });
}

module.exports = deduplication;
