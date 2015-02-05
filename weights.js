var weights = {
  'geoname': 0,
  'address': 4, // OSM addresses without a matching POI
  'osmnode': 6,
  'osmway': 6,
  'poi-address': 8, // OSM addresses with a matching POI
  'neighborhood': 10,
  'local_admin': 12,
  'locality': 12,
  'admin2': 12,
  'admin1': 14,
  'admin0': 2
};

// export
module.exports = weights;