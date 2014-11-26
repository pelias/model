## Installation

```bash
$ npm install pelias-document
```

[![NPM](https://nodei.co/npm/pelias-document.png?downloads=true&stars=true)](https://nodei.co/npm/pelias-document)

## Usage

```javascript
var Document = require('pelias-document');

var poi = new Document( 'geoname', 1003 )
  .setAlpha3( 'GBR' )
  .setMeta( 'author', 'peter' )
  .setMeta( 'date', new Date().getTime() )
  .setName( 'default', 'Hackney City Farm' )
  .setName( 'alt', 'Haggerston City Farm' )
  .setAdmin( 'admin0', 'Great Britain' )
  .setAdmin( 'neighborhood', 'Shoreditch' )
  .setCentroid( 0.5, 50.1 );

console.log( poi );
```

## NPM Module

The `pelias-document` npm module can be found here:

[https://npmjs.org/package/pelias-document](https://npmjs.org/package/pelias-document)

## Contributing

Please fork and pull request against upstream master on a feature branch.

Pretty please; provide unit tests and script fixtures in the `test` directory.

### Running Unit Tests

```bash
$ npm test
```

### Continuous Integration

Travis tests every release against node version `0.10`

[![Build Status](https://travis-ci.org/pelias/document.png?branch=master)](https://travis-ci.org/pelias/document)