>This repository is part of the [Pelias](https://github.com/pelias/pelias)
>project. Pelias is an open-source, open-data geocoder originally sponsored by
>[Mapzen](https://www.mapzen.com/). Our official user documentation is
>[here](https://github.com/pelias/documentation).

# Pelias Model

This package stores a definition of our standard data model. It allows for a common format for geographic records across multiple databases and other packages.

## Installation

```bash
$ npm install pelias-model
```

[![NPM](https://nodei.co/npm/pelias-model.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-model)

## Document

The `Document` model is a convenient way of modelling POI and admin records so that they are compatible with the Pelias import pipeline.

Using this model ensures that your import script will continue to work even when the underlying schema changes.

```javascript
var Document = require('pelias-model').Document;

var poi = new Document( 'geoname', 'venue', 1003 )
  .setMeta( 'author', 'peter' )
  .setName( 'default', 'Hackney City Farm' )
  .setName( 'alt', 'Haggerston City Farm' )
  .setNameAlias( 'alt', 'Haggerston Farm' )
  .addParent( 'country', 'Great Britain', '1001', 'GreatB' )
  .addParent( 'neighbourhood', 'Shoreditch', '2002' )
  .setAddress( 'number', '10' )
  .setAddress( 'street', 'pelias place' )
  .setAddressAlias( 'street', 'pelias pl' )
  .addCategory( 'foo' )
  .addCategory( 'bar' )
  .removeCategory( 'foo' )
  .setPopulation(10)
  .setPopularity(3)
  .setAddendum('wikipedia', { slug: 'HackneyCityFarm' })
  .setAddendum('geonames', { foreignkey: 1 })
  .setCentroid({ lon: 0.5, lat: 50.1 })
  .setPolygon( geojsonObject /* any valid geojson object */ )
  .setBoundingBox( bboxObject /* see tests for bbox syntax */ );

console.log( poi );
```

**Note** the `_meta` property is unenumerable, so you won't see it when you `console.log` or `JSON.stringify` the object, don't worry it's still there:

```javascript
var poi = new Document( 'geoname', 'venue', 1003 );
poi.setMeta( 'author', 'mapzen' );

console.log( poi, poi.getMeta( 'author' ), poi._meta );
```

## NPM Module

The `pelias-model` npm module can be found here:

[https://npmjs.org/package/pelias-model](https://npmjs.org/package/pelias-model)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every release against all supported Node.js versions.

[![Build Status](https://travis-ci.org/pelias/model.png?branch=master)](https://travis-ci.org/pelias/model)


### Versioning

We rely on semantic-release and Greenkeeper to maintain our module and dependency versions.

[![Greenkeeper badge](https://badges.greenkeeper.io/pelias/model.svg)](https://greenkeeper.io/)
