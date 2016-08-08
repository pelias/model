
var Document = require('../../Document'),
    fixtures = require('./fixtures');

module.exports.tests = {};

// simulate the effect of sending the data to easticsearch.
// the result should map correctly to the schema.
function serializeDeserialize( model ){
  return JSON.parse( JSON.stringify( model ) );
}

// test the document serializes as expected
module.exports.tests.minimal = function(test) {
  test('minimal', function(t) {

    // create a new doc and serialize it
    var doc = new Document('mysource','mylayer','myid');
    var s = serializeDeserialize( doc );

    // document meta data
    t.equal(doc.getMeta('type'), 'mylayer', 'correct _meta');
    t.equal(doc.getMeta('id'), 'myid', 'correct _id');

    // document body
    t.deepEqual(s, {
      'source': 'mysource',
      'layer': 'mylayer',
      'source_id': 'myid',
      'name': {},
      'phrase': {},
      'parent': {
        'borough': [],
        'borough_a': [],
        'borough_id': [],
        'country': [],
        'country_a': [],
        'country_id': [],
        'county': [],
        'county_a': [],
        'county_id': [],
        'dependency': [],
        'dependency_a': [],
        'dependency_id': [],
        'localadmin': [],
        'localadmin_a': [],
        'localadmin_id': [],
        'locality': [],
        'locality_a': [],
        'locality_id': [],
        'macrocounty': [],
        'macrocounty_a': [],
        'macrocounty_id': [],
        'macroregion': [],
        'macroregion_a': [],
        'macroregion_id': [],
        'neighbourhood': [],
        'neighbourhood_a': [],
        'neighbourhood_id': [],
        'region': [],
        'region_a': [],
        'region_id': []
      },
      'address_parts': {},
      'category': [],
      'center_point': {}
    }, 'valid document body');

    t.end();
  });
};

// test the document serializes as expected
module.exports.tests.complete = function(test) {
  test('complete', function(t) {

    // create a new doc and serialize it
    var doc = new Document( 'geoname', 'venue', 1003 )
      .setAlpha3( 'GBR' )
      .setMeta( 'author', 'peter' )
      .setName( 'default', 'Hackney City Farm' )
      .setName( 'alt', 'Haggerston City Farm' )
      .addParent( 'country', 'Great Britain', '1001', 'GreatB' )
      .addParent( 'neighbourhood', 'Shoreditch', '2002' )
      .setAddress( 'number', '10' )
      .setAddress( 'street', 'pelias place' )
      .addCategory( 'foo' )
      .addCategory( 'bar' )
      .removeCategory( 'foo' )
      .setPopulation(10)
      .setPopularity(3)
      .setCentroid({ lon: 0.5, lat: 50.1 })
      .setPolygon(fixtures.new_zealand)
      .setBoundingBox(fixtures.new_zealand_bbox);

    var s = serializeDeserialize( doc );

    // document meta data
    t.equal(doc.getMeta('type'), 'venue', 'correct _meta');
    t.equal(doc.getMeta('id'), '1003', 'correct _id');

    // document body
    t.deepEqual(s, {

      // data partitioning
      'source': 'geoname',
      'layer': 'venue',
      'alpha3': 'GBR',

      // place name (ngram analysis)
      'name':{
        'default': 'Hackney City Farm',
        'alt': 'Haggerston City Farm'
      },

      // place name (phrase analysis)
      'phrase':{
        'default': 'Hackney City Farm',
        'alt': 'Haggerston City Farm'
      },

      // address data
      'address_parts':{
        'number': '10',
        'street': 'pelias place'
      },

      // WOF fields
      'parent': {
        'borough': [],
        'borough_a': [],
        'borough_id': [],
        'country': ['Great Britain'],
        'country_a': ['GreatB'],
        'country_id': ['1001'],
        'county': [],
        'county_a': [],
        'county_id': [],
        'dependency': [],
        'dependency_a': [],
        'dependency_id': [],
        'localadmin': [],
        'localadmin_a': [],
        'localadmin_id': [],
        'locality': [],
        'locality_a': [],
        'locality_id': [],
        'macrocounty': [],
        'macrocounty_a': [],
        'macrocounty_id': [],
        'macroregion': [],
        'macroregion_a': [],
        'macroregion_id': [],
        'neighbourhood': ['Shoreditch'],
        'neighbourhood_a': [null],
        'neighbourhood_id': ['2002'],
        'region': [],
        'region_a': [],
        'region_id': []
      },

      // geography
      'center_point':{
        'lon': 0.5,
        'lat': 50.1
      },

      // shape
      'shape':{
        'type': 'FeatureCollection',
        'features':[{
          'type': 'Feature',
          'properties': {},
          'geometry':{
            'type': 'Polygon',
            'coordinates': [[[163.82,-47.75],[163.82,-33.9],[179.42,-33.9],[179.42,-47.75],[163.82,-47.75]]]
          }
        }]
      },

      // bbox
      'bounding_box': '{"min_lat":-47.75,"max_lat":-33.9,"min_lon":163.82,"max_lon":179.42}',

      // meta info
      'source_id': '1003',
      'category':['bar'],
      'population': 10,
      'popularity': 3

    }, 'valid document body');

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('serialize: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
