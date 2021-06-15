<p align="center">
  <img height="100" src="https://raw.githubusercontent.com/pelias/design/master/logo/pelias_github/Github_markdown_hero.png">
</p>
<h3 align="center">A modular, open-source search engine for our world.</h3>
<p align="center">Pelias is a geocoder powered completely by open data, available freely to everyone.</p>
<p align="center">
<a href="https://en.wikipedia.org/wiki/MIT_License"><img src="https://img.shields.io/github/license/pelias/api?style=flat&color=orange" /></a>
<a href="https://hub.docker.com/u/pelias"><img src="https://img.shields.io/docker/pulls/pelias/api?style=flat&color=informational" /></a>
<a href="https://gitter.im/pelias/pelias"><img src="https://img.shields.io/gitter/room/pelias/pelias?style=flat&color=yellow" /></a>
</p>
<p align="center">
	<a href="https://github.com/pelias/docker">Local Installation</a> ·
        <a href="https://geocode.earth">Cloud Webservice</a> ·
	<a href="https://github.com/pelias/documentation">Documentation</a> ·
	<a href="https://gitter.im/pelias/pelias">Community Chat</a>
</p>
<details open>
<summary>What is Pelias?</summary>
<br />
Pelias is a search engine for places worldwide, powered by open data. It turns addresses and place names into geographic coordinates, and turns geographic coordinates into places and addresses. With Pelias, you’re able to turn your users’ place searches into actionable geodata and transform your geodata into real places.
<br /><br />
We think open data, open source, and open strategy win over proprietary solutions at any part of the stack and we want to ensure the services we offer are in line with that vision. We believe that an open geocoder improves over the long-term only if the community can incorporate truly representative local knowledge.
</details>

# Pelias Model

This package stores a definition of our standard data model. It allows for a common format for geographic records across multiple databases and other packages.

## Installation

```bash
$ npm install pelias-model
```

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
  .setShape( geojsonObject /* any valid geojson object */ )
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
