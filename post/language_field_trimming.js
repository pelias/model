/**
 * Language field post-processing script ensures that language tokens
 * present in the 'default' language are not duplicated in other languages.
 *
 * By default Pelias searches on the `name.default` field, and in some cases
 * it additionally searches on the language of the browser agent.
 *
 * This means that any name which exists in `name.default` need not additionally
 * exist in any of the other language fields.
 *
 * The benefits of this are that we can reduce the index size and any TF/IDF penalties.
 *
 * Example: the term 'Berlin' is indexed in *both* `name.default` and `name.de`.
 * In this case the `de` copy of the string 'Berlin' can be removed as it offers no value.
 */

const _ = require('lodash');
const prefixes = ['name', 'phrase'];

function deduplication(doc) {
  prefixes.forEach(prefix => {

    // load the field data
    // ie: an object keyed by language codes, each value is an array of names
    let field = doc[prefix];
    if (!_.isPlainObject(field)) { return; }

    // fetch the 'default' language
    var defaults = _.get(field, 'default');
    if (!_.isArray(defaults) || _.isEmpty(defaults)) { return; }

    // iterate over other languages in the field
    _.each(field, (names, lang) => {

      // skip the 'default' language
      if (lang === 'default'){ return; }

      // filter entries from this language which appear in the 'default' lang
      if (_.isArray(names) || !_.isEmpty(names)) {
        field[lang] = _.difference(names, defaults);
      }

      // clean up empty language arrays
      if (_.isEmpty(field[lang])) {
        delete field[lang];
      }
    });
  });
}

module.exports = deduplication;
