/**
 * Explode name fields such that no field contains more than a
 * single value.
 */

const _ = require('lodash');
const prefix = 'name';

function explode(doc) {
  let field = doc[prefix];
  if (!_.isPlainObject(field)) { return; }

  _.each(field, (values, subfield) => {
    if (_.isArray(values) && _.size(values) > 1) {
      _.each(values, (value, i) => {
        if (i === 0) {
          doc[prefix][subfield] = value;
        } else {
          doc[prefix][`${subfield}_${i}`] = value;
        }
      });
    }
  });
}

module.exports = explode;
