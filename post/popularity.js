/**
 * Minimum popularity post-processing script ensures that every document
 * meets a minimum popularity value based on the layer to which it belongs.
 *
 * For more info see:
 * - https://github.com/pelias/openstreetmap/pull/493#issuecomment-503019975
 * - https://github.com/pelias/openstreetmap/blob/master/stream/popularity_mapper.js
 */

const _ = require('lodash');

const MIN_POPULARITY_MAP = {
  postalcode: 9000
};

function popularity(doc) {
  let minValue = _.get(MIN_POPULARITY_MAP, doc.getLayer());

  // only apply to layers listed in the mapping above
  if (!_.isFinite(minValue)) { return; }

  // avoid setting a popularity of 0 (or less)
  if (minValue <= 0) { return; }

  // skip updating records where the current popularity exceeds the minimum
  let currentValue = doc.getPopularity();
  if (_.isFinite(currentValue) && currentValue >= minValue) { return; }

  // set the minimum popularity for this layer
  doc.setPopularity(minValue);
}

module.exports = popularity;
