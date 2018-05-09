
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const protobuf = require('protocol-buffers');
const json = require('json-protobuf-encoding');
const wkx = require('wkx');
const Document = require('../Document');

// example codec
module.exports.example = load('example.proto');

// // AFAIK protobuf cannot encode a map of arrays of strings without
// // adding an additional property (which here is named '_')
// const StringList = {
//   encode: (l) => { return { _: l.map(v => null === v ? '' : v) }; },
//   decode: (l) => l._.map(v => '' === v ? null : v)
// };

// this codec 'flattens' (ie casts) single element arrays to a scalar string
// const StringListFlatten = {
//   encode: (l) => StringList.encode( Array.isArray(l) ? l : [ l ] ),
//   decode: function(l){
//     let d = StringList.decode(l);
//     return d.length > 1 ? d : d[0];
//   }
// };

// convenience function for operating on maps
// const Map = function(valueCodec){
//   return {
//     encode: (m) => _.mapValues(m, valueCodec.encode),
//     decode: (m) => _.mapValues(m, valueCodec.decode)
//   };
// };

// model codec v1
// module.exports.v1 = load('model.v1.proto');
module.exports.v1 = (function(){
  let c = load('model.v1.proto');
  return {
    Location: {
      encode: (doc) => {

        let geom = { Point: {}, Polygon: {} };
        if(!_.isEmpty(doc.center_point)){
          geom.Point.Centroid = new wkx.Point(doc.center_point.lon, doc.center_point.lat).toWkb();
        }
        if(!_.isEmpty(doc.getPolygon())){
          geom.Polygon.Shape = wkx.Geometry.parseGeoJSON( doc.getPolygon() ).toWkb();
        }
        if(!_.isEmpty(doc.getBoundingBox())){
          let parsed = JSON.parse( doc.getBoundingBox() );
          geom.Polygon.BoundingBox = wkx.Geometry.parseGeoJSON({
            'type': 'Polygon',
            'coordinates': [[
              [ parsed.min_lon, parsed.min_lat ],
              [ parsed.min_lon, parsed.max_lat ],
              [ parsed.max_lon, parsed.max_lat ],
              [ parsed.max_lon, parsed.min_lat ],
              [ parsed.min_lon, parsed.min_lat ]
            ]]
          }).toWkb();
        }

        let names = {};
        for( var attr in doc.name ){
          names[attr] = {
            Variants: Array.isArray(doc.name[attr]) ? doc.name[attr] : [doc.name[attr]]
          };
        }

        let hierarchy = { Levels: {} };
        for( attr in doc.parent ){
          if( !attr.includes('_') ){
            if( !hierarchy.Levels.hasOwnProperty( attr ) ){
              hierarchy.Levels[ attr ] = { Names: {} };
            }
            hierarchy.Levels[ attr ].Names.und = {
              Variants: doc.parent[attr]
            };
          }
          else if( /^(.*)_id$/.test(attr) ){
            let idMatch = attr.match(/^(.*)_id$/);
            if( !hierarchy.Levels.hasOwnProperty( idMatch[1] ) ){
              hierarchy.Levels[ idMatch[1] ] = { Names: {} };
            }
            hierarchy.Levels[ idMatch[1] ].Id = doc.parent[attr][0];
          }
          else if( /^(.*)_a$/.test(attr) ){
            let idMatch = attr.match(/^(.*)_a$/);
            if( !hierarchy.Levels.hasOwnProperty( idMatch[1] ) ){
              hierarchy.Levels[ idMatch[1] ] = { Names: {} };
            }
            hierarchy.Levels[ idMatch[1] ].Names.abbr = {
              Variants: doc.parent[attr].map(v => null === v ? '' : v)
            };
          }
        }

        // console.error(JSON.stringify(hierarchy, null, 2))

        return c.Location.encode({
          Identity: {
            Source: doc.getSource(),
            Layer: doc.getLayer(),
            SourceId: doc.getSourceId()
          },
          Tags: doc._meta || {},
          Names: names,
          Hierarchies: {
            'WOF': hierarchy
          },
          Address: doc.address_parts,
          Categories: doc.category || [],
          Stats: {
            Population: doc.getPopulation(),
            Popularity: doc.getPopularity()
          },
          Geometry: geom
        });
      },
      decode: (buf) => {
        let raw = c.Location.decode(buf);
        let doc = new Document(raw.Identity.Source, raw.Identity.Layer, raw.Identity.SourceId);
        doc._meta = raw.Tags;
        if(!_.isEmpty(raw.Names)){
          doc.name = {};
          doc.phrase = {};
          for( var attr in raw.Names ){
            let n = raw.Names[ attr ];
            doc.name[ attr ] = ( n.Variants.length > 1 ) ? n.Variants : n.Variants[0];
            doc.phrase[ attr ] = ( n.Variants.length > 1 ) ? n.Variants : n.Variants[0];
          }
        }
        if(!_.isEmpty(raw.Hierarchies)){
          doc.parent = {};
          let hierarchy = raw.Hierarchies.WOF;
          for( var level in hierarchy.Levels ){
            doc.parent[ level ] = hierarchy.Levels[level].Names.und.Variants;
            doc.parent[ level + '_id' ] = [ hierarchy.Levels[level].Id ];
            doc.parent[ level + '_a' ] = hierarchy.Levels[level].Names.abbr.Variants.map(v => '' === v ? null : v);
          }
        }
        // doc.parent = Map(StringList).decode(raw.Hierarchy);
        doc.address_parts = raw.Address;
        doc.category = raw.Categories || [];
        if(!_.isEmpty(raw.Stats)){
          if(raw.Stats.Population>0){ doc.population = raw.Stats.Population; }
          if(raw.Stats.Popularity>0){ doc.popularity = raw.Stats.Popularity; } 
        }
        if(!_.isEmpty(raw.Geometry)){
          if(!_.isEmpty(raw.Geometry.Point.Centroid)){
            let parsed = wkx.Geometry.parse(raw.Geometry.Point.Centroid);
            doc.center_point = { lon: parsed.x, lat: parsed.y };
          }
          if(!_.isEmpty(raw.Geometry.Polygon.Shape)){
            doc.shape = wkx.Geometry.parse(raw.Geometry.Polygon.Shape).toGeoJSON();
          }
          if(!_.isEmpty(raw.Geometry.Polygon.BoundingBox)){
            let parsed = wkx.Geometry.parse( raw.Geometry.Polygon.BoundingBox );
            doc.bounding_box = JSON.stringify({
              min_lat: parsed.exteriorRing[0].y,
              max_lat: parsed.exteriorRing[2].y,
              min_lon: parsed.exteriorRing[0].x,
              max_lon: parsed.exteriorRing[2].x
            });
          }
        }
        return doc;
      }
    }
  };
})();

// generic protobuf loader
function load(protofile){
  return protobuf(
    fs.readFileSync(path.join(__dirname, 'proto', protofile)),
    { encodings: { json: json() }}
  );
}