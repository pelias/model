
// test geojson fixture
module.exports.new_zealand = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [ 163.82, -47.75 ],
            [ 163.82, -33.90 ],
            [ 179.42, -33.90 ],
            [ 179.42, -47.75 ],
            [ 163.82, -47.75 ]
          ]
        ]
      }
    }
  ]
};

// test geojson fixture bbox
module.exports.new_zealand_bbox = {
  upperLeft: {
    lat: -33.90,
    lon: 163.82
  },
  lowerRight: {
    lat: -47.75,
    lon: 179.42
  }
};
