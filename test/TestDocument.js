const proxyquire = require('proxyquire').noCallThru();

const defaultConfig = {
  schema: {
    indexName: 'example_index',
    typeName: 'example_type',
  },
  addendum_namespaces: {}
};

const makePeliasConfig = (config) => {
  const peliasConfig = Object.assign({}, defaultConfig, config);

  return {
    generate: () => Object.assign({}, peliasConfig, { get: (name) => peliasConfig[name] })
  };
};

const testDocument = (config) => proxyquire('../Document', {
  'pelias-config': makePeliasConfig(config ? config : {})
});

module.exports = testDocument;
