var through = require('through2');

function createDocumentMapperStream() {
  return through.obj( function( model, enc, next ){
    next(null, model.toESDocument());
  });
}

module.exports = createDocumentMapperStream;
