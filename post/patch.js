/**
 * Document patch post-processing script applies targeted modifications to
 * documents based on their GID (global identifier).
 *
 * Loads JSON patch definition files containing 'set' operations that modify
 * specific document properties using lodash's _.set() method.
 *
 * Example patch file format:
 * {
 *   "geonames:county:3333219": {
 *     "set": {
 *       "name.default": ["Los Angeles County"]
 *     }
 *   }
 * }
 */
const _ = require('lodash');
const fs = require('fs');
const { globSync } = require('glob');

const setOperations = new Map();

function patch( doc ){
  // nothing to do
  if( setOperations.size === 0 ){ return; }

  // load any 'set' replacements
  const replacements = setOperations.get(doc.getGid());
  if (!_.isPlainObject(replacements)) { return; }

  // apply replacements using _.set()
  _.forEach(replacements, (value, key) => _.set(doc, key, value));
}

function load() {
  setOperations.clear();

  const config = require('pelias-config').generate();
  if (!_.isPlainObject(config)) { return; }

  const patterns = _.get(config, 'imports.patch.files', []);
  if (!_.isArray(patterns)) { return; }

  patterns.forEach(pattern => {
    const files = globSync(pattern, { nodir: true, absolute: true });
    if (!_.isArray(files)) {
      return console.error(`patch: pattern '${pattern}': matched zero files`);
    }

    files.forEach(filename => {
      if (!_.isString(filename) || !filename.endsWith('.json')) {
        return console.error(`patch: file ${filename}: invalid filename`);
      }

      let json = {};
      try {
        json = JSON.parse(fs.readFileSync(filename, 'utf8'));
      } catch (e) {
        return console.error(`patch: failed to load or parse JSON file ${filename}:`, e.message);
      }

      if (!_.isPlainObject(json)) {
        return console.error(`patch: file ${filename}: invalid definition`);
      }
      _.forEach(json, (ops, gid) => {
        if (_.has(ops, 'set')) {
          const setOps = _.get(ops, 'set');
          if (!_.isPlainObject(setOps)) {
            return console.error(`patch: file ${filename}: invalid set ops definition`);
          }
          setOperations.set(gid, setOps);
        }
      });
    });
  });
}

// load patch definition files
try {
  load();
} catch (e) {
  console.error('patch: failed to load patch definition files');
}

patch.load = load; // export load() for testing
module.exports = patch;