const _ = require('lodash');
const prefixes = ['name', 'phrase'];

module.exports = config => {
  return function defaultLang(doc) {
    const defaultLang = config.get('imports.langs.default');
    if (!_.isString(defaultLang)) { return; }
  
    prefixes.forEach((prefix) => {
      let field = doc[prefix];
  
      if (!_.isPlainObject(field)) { return; }
  
      if (!_.isEmpty(field[defaultLang])) {
        field['default'] = _.concat(field[defaultLang], field['default']).filter((e) => _.isString(e));
      }
    });
  };
};
