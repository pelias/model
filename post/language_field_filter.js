const _ = require('lodash');
const prefixes = ['name', 'phrase'];

function normalizeConfig(config) {
  const keep = config.get('imports.langs.keep') || config.get('imports.langs');
  if (_.isString(keep)) {
    return new Set([keep]);
  }
  if (_.isArray(keep)) {
    return new Set(keep);
  }
}

module.exports = (config) => {
  const keep = normalizeConfig(config);
  return function filter (doc) {
    if (!keep) { return; }
  
    prefixes.forEach((prefix) => {
      let field = doc[prefix];
  
      if (!_.isPlainObject(field)) {
        return;
      }
  
      _.each(field, (_names, lang) => {
        if (lang !== 'default' && !keep.has(lang)) {
          delete field[lang];
        }
      });
    });
  };
};
