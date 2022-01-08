const _ = require('lodash');
const Document = require('../../Document');
const ssn = require('../../post/seperable_street_names');
const dedupe = require('../../post/deduplication');

module.exports.tests = {};

module.exports.tests.expand = function (test) {
  test('expand DEU', function (t) {
    t.equals('Example Weg', ssn.expand('Examplew.', ssn.expansions.DEU) );
    t.equals('Example Weg', ssn.expand('Exampleweg', ssn.expansions.DEU) );
    t.equals('Example Quelle', ssn.expand('Exampleq.', ssn.expansions.DEU) );
    t.equals('Example Quelle', ssn.expand('Examplequelle', ssn.expansions.DEU) );
    t.equals('Example Platz', ssn.expand('Examplepl.', ssn.expansions.DEU) );
    t.equals('Example Platz', ssn.expand('Exampleplatz', ssn.expansions.DEU) );
    t.equals('Example Markt', ssn.expand('Examplemkt.', ssn.expansions.DEU) );
    t.equals('Example Markt', ssn.expand('Examplemarkt', ssn.expansions.DEU) );
    t.equals('Example Brücke', ssn.expand('Examplebr.', ssn.expansions.DEU) );
    t.equals('Example Brücke', ssn.expand('Examplebrücke', ssn.expansions.DEU) );
    t.equals('Example Brucke', ssn.expand('Examplebrucke', ssn.expansions.DEU) );
    t.equals('Example Bruecke', ssn.expand('Examplebruecke', ssn.expansions.DEU) );
    t.equals('Example Straße', ssn.expand('Examplestr', ssn.expansions.DEU) );
    t.equals('Example Straße', ssn.expand('Examplestr.', ssn.expansions.DEU) );
    t.equals('Example Straße', ssn.expand('Examplestraße', ssn.expansions.DEU) );
    t.equals('Example Strasse', ssn.expand('Examplestrasse', ssn.expansions.DEU) );
    t.equals('Example Stiege', ssn.expand('Examplestg.', ssn.expansions.DEU) );
    t.equals('Example Stiege', ssn.expand('Examplestiege', ssn.expansions.DEU) );

    t.equals('Example Straße', ssn.expand('Example Straße', ssn.expansions.DEU));
    t.equals('Example Straße & Cross Platz', ssn.expand('Examplestr & Crosspl.', ssn.expansions.DEU));
    t.end();
  });
  test('expand CHE', function (t) {
    t.equals('Example Weg', ssn.expand('Examplew.', ssn.expansions.CHE) );
    t.equals('Example Weg', ssn.expand('Exampleweg', ssn.expansions.CHE) );
    t.equals('Example Quelle', ssn.expand('Exampleq.', ssn.expansions.CHE) );
    t.equals('Example Quelle', ssn.expand('Examplequelle', ssn.expansions.CHE) );
    t.equals('Example Platz', ssn.expand('Examplepl.', ssn.expansions.CHE) );
    t.equals('Example Platz', ssn.expand('Exampleplatz', ssn.expansions.CHE) );
    t.equals('Example Markt', ssn.expand('Examplemkt.', ssn.expansions.CHE) );
    t.equals('Example Markt', ssn.expand('Examplemarkt', ssn.expansions.CHE) );
    t.equals('Example Brücke', ssn.expand('Examplebr.', ssn.expansions.CHE) );
    t.equals('Example Brücke', ssn.expand('Examplebrücke', ssn.expansions.CHE) );
    t.equals('Example Brucke', ssn.expand('Examplebrucke', ssn.expansions.CHE) );
    t.equals('Example Bruecke', ssn.expand('Examplebruecke', ssn.expansions.CHE) );
    t.equals('Example Straße', ssn.expand('Examplestr', ssn.expansions.CHE) );
    t.equals('Example Straße', ssn.expand('Examplestr.', ssn.expansions.CHE) );
    t.equals('Example Straße', ssn.expand('Examplestraße', ssn.expansions.CHE) );
    t.equals('Example Strasse', ssn.expand('Examplestrasse', ssn.expansions.CHE) );
    t.equals('Example Stiege', ssn.expand('Examplestg.', ssn.expansions.CHE) );
    t.equals('Example Stiege', ssn.expand('Examplestiege', ssn.expansions.CHE) );

    t.equals('Example Straße', ssn.expand('Example Straße', ssn.expansions.CHE));
    t.equals('Example Straße & Cross Platz', ssn.expand('Examplestr & Crosspl.', ssn.expansions.CHE));
    t.end();
  });
  test('expand AUT', function (t) {
    t.equals('Example Weg', ssn.expand('Examplew.', ssn.expansions.AUT) );
    t.equals('Example Weg', ssn.expand('Exampleweg', ssn.expansions.AUT) );
    t.equals('Example Quelle', ssn.expand('Exampleq.', ssn.expansions.AUT) );
    t.equals('Example Quelle', ssn.expand('Examplequelle', ssn.expansions.AUT) );
    t.equals('Example Platz', ssn.expand('Examplepl.', ssn.expansions.AUT) );
    t.equals('Example Platz', ssn.expand('Exampleplatz', ssn.expansions.AUT) );
    t.equals('Example Markt', ssn.expand('Examplemkt.', ssn.expansions.AUT) );
    t.equals('Example Markt', ssn.expand('Examplemarkt', ssn.expansions.AUT) );
    t.equals('Example Brücke', ssn.expand('Examplebr.', ssn.expansions.AUT) );
    t.equals('Example Brücke', ssn.expand('Examplebrücke', ssn.expansions.AUT) );
    t.equals('Example Brucke', ssn.expand('Examplebrucke', ssn.expansions.AUT) );
    t.equals('Example Bruecke', ssn.expand('Examplebruecke', ssn.expansions.AUT) );
    t.equals('Example Straße', ssn.expand('Examplestr', ssn.expansions.AUT) );
    t.equals('Example Straße', ssn.expand('Examplestr.', ssn.expansions.AUT) );
    t.equals('Example Straße', ssn.expand('Examplestraße', ssn.expansions.AUT) );
    t.equals('Example Strasse', ssn.expand('Examplestrasse', ssn.expansions.AUT) );
    t.equals('Example Stiege', ssn.expand('Examplestg.', ssn.expansions.AUT) );
    t.equals('Example Stiege', ssn.expand('Examplestiege', ssn.expansions.AUT) );

    t.equals('Example Straße', ssn.expand('Example Straße', ssn.expansions.AUT));
    t.equals('Example Straße & Cross Platz', ssn.expand('Examplestr & Crosspl.', ssn.expansions.AUT));
    t.end();
  });
  test('expand NLD', function (t) {
    t.equals('Example Gracht', ssn.expand('Examplegr.', ssn.expansions.NLD) );
    t.equals('Example Gracht', ssn.expand('Examplegracht', ssn.expansions.NLD) );
    t.equals('Example Hof', ssn.expand('Exampleh.', ssn.expansions.NLD) );
    t.equals('Example Hof', ssn.expand('Examplehof', ssn.expansions.NLD) );
    t.equals('Example Laan', ssn.expand('Examplel.', ssn.expansions.NLD) );
    t.equals('Example Laan', ssn.expand('Examplelaan', ssn.expansions.NLD) );
    t.equals('Example Lang', ssn.expand('Examplelang', ssn.expansions.NLD) );
    t.equals('Example Markt', ssn.expand('Examplemkt.', ssn.expansions.NLD) );
    t.equals('Example Markt', ssn.expand('Examplemarkt', ssn.expansions.NLD) );
    t.equals('Example Plain', ssn.expand('Examplepln.', ssn.expansions.NLD) );
    t.equals('Example Plain', ssn.expand('Exampleplain', ssn.expansions.NLD) );
    t.equals('Example Singel', ssn.expand('Examplesngl.', ssn.expansions.NLD) );
    t.equals('Example Singel', ssn.expand('Examplesingel', ssn.expansions.NLD) );
    t.equals('Example Straat', ssn.expand('Examplestr.', ssn.expansions.NLD) );
    t.equals('Example Straat', ssn.expand('Examplestraat', ssn.expansions.NLD) );
    t.equals('Example Steenweg', ssn.expand('Examplestwg.', ssn.expansions.NLD) );
    t.equals('Example Steenweg', ssn.expand('Examplesteenweg', ssn.expansions.NLD) );
    t.equals('Example Verlengde', ssn.expand('Exampleverl.', ssn.expansions.NLD) );
    t.equals('Example Verlengde', ssn.expand('Exampleverlengde', ssn.expansions.NLD) );
    t.equals('Example Vliet', ssn.expand('Examplevlt.', ssn.expansions.NLD) );
    t.equals('Example Vliet', ssn.expand('Examplevliet', ssn.expansions.NLD) );
    t.equals('Example Weg', ssn.expand('Examplewg.', ssn.expansions.NLD) );
    t.equals('Example Weg', ssn.expand('Exampleweg', ssn.expansions.NLD) );

    t.equals('Example Straat', ssn.expand('Example Straat', ssn.expansions.NLD));
    t.equals('Example Straat & Cross Laan', ssn.expand('Examplestr & Crosslaan', ssn.expansions.NLD));
    t.end();
  });
};

module.exports.tests.contract = function (test) {
  test('contract DEU', function (t) {
    t.equals('Exampleplatz', ssn.contract('Example Platz', ssn.contractions.DEU));
    t.equals('Examplemarkt', ssn.contract('Example Markt', ssn.contractions.DEU));
    t.equals('Examplebrücke', ssn.contract('Example Brücke', ssn.contractions.DEU));
    t.equals('Examplebrucke', ssn.contract('Example Brucke', ssn.contractions.DEU));
    t.equals('Examplebruecke', ssn.contract('Example Bruecke', ssn.contractions.DEU));
    t.equals('Examplestraße', ssn.contract('Example Straße', ssn.contractions.DEU));
    t.equals('Examplestrasse', ssn.contract('Example Strasse', ssn.contractions.DEU));
    t.equals('Examplestiege', ssn.contract('Example Stiege', ssn.contractions.DEU));

    t.equals('Examplestraße & Crossplatz', ssn.contract('Example Straße & Cross Platz', ssn.contractions.DEU));
    t.end();
  });
  test('contract CHE', function (t) {
    t.equals('Exampleplatz', ssn.contract('Example Platz', ssn.contractions.CHE));
    t.equals('Examplemarkt', ssn.contract('Example Markt', ssn.contractions.CHE));
    t.equals('Examplebrücke', ssn.contract('Example Brücke', ssn.contractions.CHE));
    t.equals('Examplebrucke', ssn.contract('Example Brucke', ssn.contractions.CHE));
    t.equals('Examplebruecke', ssn.contract('Example Bruecke', ssn.contractions.CHE));
    t.equals('Examplestraße', ssn.contract('Example Straße', ssn.contractions.CHE));
    t.equals('Examplestrasse', ssn.contract('Example Strasse', ssn.contractions.CHE));
    t.equals('Examplestiege', ssn.contract('Example Stiege', ssn.contractions.CHE));

    t.equals('Examplestraße & Crossplatz', ssn.contract('Example Straße & Cross Platz', ssn.contractions.CHE));
    t.end();
  });
  test('contract AUT', function (t) {
    t.equals('Exampleplatz', ssn.contract('Example Platz', ssn.contractions.AUT));
    t.equals('Examplemarkt', ssn.contract('Example Markt', ssn.contractions.AUT));
    t.equals('Examplebrücke', ssn.contract('Example Brücke', ssn.contractions.AUT));
    t.equals('Examplebrucke', ssn.contract('Example Brucke', ssn.contractions.AUT));
    t.equals('Examplebruecke', ssn.contract('Example Bruecke', ssn.contractions.AUT));
    t.equals('Examplestraße', ssn.contract('Example Straße', ssn.contractions.AUT));
    t.equals('Examplestrasse', ssn.contract('Example Strasse', ssn.contractions.AUT));
    t.equals('Examplestiege', ssn.contract('Example Stiege', ssn.contractions.AUT));

    t.equals('Examplestraße & Crossplatz', ssn.contract('Example Straße & Cross Platz', ssn.contractions.AUT));
    t.end();
  });
  test('contract NLD', function (t) {
    t.equals('Examplegracht', ssn.contract('Example Gracht', ssn.contractions.NLD));
    t.equals('Examplehof', ssn.contract('Example Hof', ssn.contractions.NLD));
    t.equals('Examplelaan', ssn.contract('Example Laan', ssn.contractions.NLD));
    t.equals('Examplelang', ssn.contract('Example Lang', ssn.contractions.NLD));
    t.equals('Examplemarkt', ssn.contract('Example Markt', ssn.contractions.NLD));
    t.equals('Examplesingel', ssn.contract('Example Singel', ssn.contractions.NLD));
    t.equals('Examplestraat', ssn.contract('Example Straat', ssn.contractions.NLD));
    t.equals('Examplesteenweg', ssn.contract('Example Steenweg', ssn.contractions.NLD));
    t.equals('Exampleverlengde', ssn.contract('Example Verlengde', ssn.contractions.NLD));
    t.equals('Examplevliet', ssn.contract('Example Vliet', ssn.contractions.NLD));
    t.equals('Exampleweg', ssn.contract('Example Weg', ssn.contractions.NLD));

    t.equals('Examplestraat & Crossmarkt', ssn.contract('Example Straat & Cross Markt', ssn.contractions.NLD));
    t.end();
  });
};

module.exports.tests.functional = function (test) {
  test('functional: expansion', function (t) {
    var doc = new Document('mysource', 'intersection', 'myid');

    // set street
    doc.addParent('country', 'Germany', '1001', 'DEU');
    doc.setName('default', 'Examplestr & Crosspl.');
    doc.setAddress('street', 'Examplestr');
    doc.setAddress('cross_street', 'Crosspl.');

    ssn.post(doc);

    // name aliases defined
    t.deepEqual(doc.getNameAliases('default'), [
      'Example Straße & Cross Platz',
      'Examplestraße & Crossplatz',
      'Examplestr & Crosspl'
    ]);

    // street aliases defined
    t.deepEqual(doc.getAddressAliases('street'), [
      'Example Straße',
      'Examplestraße',
      'Examplestr'
    ]);

    // cross_street aliases defined
    t.deepEqual(doc.getAddressAliases('cross_street'), [
      'Cross Platz',
      'Crossplatz',
      'Crosspl'
    ]);

    t.end();
  });
  test('functional: contraction - intersection', function (t) {
    var doc = new Document('mysource', 'intersection', 'myid');

    // set street
    doc.addParent('country', 'Germany', '1001', 'DEU');
    doc.setName('default', 'Example Straße & Cross Platz');
    doc.setAddress('street', 'Example Straße');
    doc.setAddress('cross_street', 'Cross Platz');

    ssn.post(doc);

    // name aliases defined
    t.deepEqual(doc.getNameAliases('default'), [
      'Examplestraße & Crossplatz',
      'Examplestr & Crosspl'
    ]);

    // street aliases defined
    t.deepEqual(doc.getAddressAliases('street'), [
      'Examplestraße',
      'Examplestr'
    ]);

    // cross_street aliases defined
    t.deepEqual(doc.getAddressAliases('cross_street'), [
      'Crossplatz',
      'Crosspl'
    ]);

    t.end();
  });
  test('functional: contraction - street', function (t) {
    var doc = new Document('mysource', 'street', 'myid');

    // set street
    doc.addParent('country', 'Germany', '1001', 'DEU');
    doc.setName('default', 'Eberswalder Straße');
    doc.setAddress('street', 'Eberswalder Straße');

    ssn.post(doc);

    // name aliases defined
    t.deepEqual(doc.getNameAliases('default'), [
      'Eberswalderstraße',
      'Eberswalderstr'
    ]);

    // street aliases defined
    t.deepEqual(doc.getAddressAliases('street'), [
      'Eberswalderstraße',
      'Eberswalderstr'
    ]);

    t.end();
  });
  test('functional: both', function (t) {
    var doc = new Document('mysource', 'intersection', 'myid');

    // set street
    doc.addParent('country', 'Germany', '1001', 'DEU');
    doc.setName('default', 'Example Straße & Crossplatz');
    doc.setAddress('street', 'Example Straße');
    doc.setAddress('cross_street', 'Crossplatz');

    ssn.post(doc);

    // name aliases defined
    t.deepEqual(doc.getNameAliases('default'), [
      'Example Straße & Cross Platz',
      'Examplestraße & Crossplatz',
      'Examplestraße & Crossplatz',
      'Examplestr & Crossplatz',
      'Examplestr & Crosspl'
    ]);

    // street aliases defined
    t.deepEqual(doc.getAddressAliases('street'), [
      'Examplestraße',
      'Examplestr'
    ]);

    // cross_street aliases defined
    t.deepEqual(doc.getAddressAliases('cross_street'), [
      'Cross Platz',
      'Crossplatz',
      'Crosspl'
    ]);

    t.end();
  });
  test('erroneous data: no default name', function (t) {
    var doc = new Document('mysource', 'intersection', 'myid');
    t.doesNotThrow(() => ssn.post(doc));
    t.end();
  });
  test('erroneous data: empty street name', function (t) {
    var doc = new Document('mysource', 'intersection', 'myid');
    doc.setName('default', 'example');
    t.doesNotThrow(() => ssn.post(doc));
    t.end();
  });
  test('erroneous data: empty cross_street name', function (t) {
    var doc = new Document('mysource', 'intersection', 'myid');
    doc.setName('default', 'example');
    doc.setAddress('street', 'example');
    t.doesNotThrow(() => ssn.post(doc));
    t.end();
  });

  test('germanic separable street names', function (t) {

    let generate = (input) => {
      var doc = new Document('mysource', 'street', 'myid');
      doc.addParent('country', 'Germany', '1001', 'DEU');
      doc.setName('default', input);
      doc.setAddress('street', input);
      doc.setAddress('cross_street', input);
      ssn.post(doc);
      dedupe(doc);

      return doc;
    };

    // test all permutations expand to all forms
    // Separated / Compounded + Abbreviated / Compounded Non-Abbreviated
    // note: Separated tokens are easily handled by elasticsearch synonyms
    // and so do not require explicit substiution here.
    t.deepEqual(_.castArray(generate('Foostrasse').name.default), ['Foostrasse', 'Foo Strasse', 'Foostr']);
    t.deepEqual(_.castArray(generate('Foostraße').name.default), ['Foostraße', 'Foo Straße', 'Foostr']);
    t.deepEqual(_.castArray(generate('Foostr.').name.default), ['Foostr.', 'Foo Straße', 'Foostraße']);
    t.deepEqual(_.castArray(generate('Foostr').name.default), ['Foostr', 'Foo Straße', 'Foostraße']);
    t.deepEqual(_.castArray(generate('Foo Strasse').name.default), ['Foo Strasse', 'Foostrasse', 'Foostr']);
    t.deepEqual(_.castArray(generate('Foo Straße').name.default), ['Foo Straße', 'Foostraße', 'Foostr']);

    // note: these forms with the abbreviated generic are not handled within this script.
    // I considered adding synonym substitution functionality but it's complex and better
    // handled by https://github.com/pelias/openaddresses/pull/477
    // note: as a general rule, names at index-time should be provided un-abbreviated but may
    // be in either abbreviated on un-abbreviated at search time.
    // t.deepEqual(_.castArray(generate('Foo Str.').name.default), ['Foo Str.', 'Foostraße', 'Foostr']);
    // t.deepEqual(_.castArray(generate('Foo Str').name.default), ['Foo Str', 'Foostraße', 'Foostr']);

    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('post/seperable_street_names: ' + name, testFunction);
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common);
  }
};
